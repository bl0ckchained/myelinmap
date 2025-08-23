// lib/neuralNetwork.ts
import type { HabitRow, HabitProgress, DailyActivity } from "../types/habit";

/** Config for a small dense network. */
export interface NeuralNetworkConfig {
  inputSize: number;
  hiddenLayers: number[];
  outputSize: number;
  learningRate: number;
  dropoutRate: number;
  /** Optional seed for reproducible weight init. */
  seed?: number;
}

/** One training sample: inputs -> targets (both normalized [0..1] vectors). */
export interface TrainingData {
  inputs: number[];
  outputs: number[];
}

/** Tiny xorshift RNG so we can seed deterministically (no external deps). */
class RNG {
  private state: number;
  constructor(seed = 0x9e3779b9) {
    // ensure non-zero
    this.state = seed >>> 0 || 0x9e3779b9;
  }
  next(): number {
    // xorshift32
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    // map to [0,1)
    return (this.state & 0xffffffff) / 0x100000000;
  }
  // [-0.5, 0.5)
  nextCentered(): number {
    return this.next() - 0.5;
  }
}

/** Simple fully-connected MLP with ReLU hidden and sigmoid output. */
export class NeuralNetwork {
  protected layers: number[];
  protected weights: number[][][]; // [layer][neuronNext][neuronPrev]
  protected biases: number[][]; // [layer][neuronNext]
  protected learningRate: number;
  protected dropoutRate: number;
  private rng: RNG;

  constructor(config: NeuralNetworkConfig) {
    const { inputSize, hiddenLayers, outputSize, learningRate, dropoutRate, seed } = config;

    if (inputSize <= 0 || outputSize <= 0 || hiddenLayers.some((h) => h <= 0)) {
      throw new Error("NeuralNetwork: layer sizes must be positive integers.");
    }
    if (learningRate <= 0 || !Number.isFinite(learningRate)) {
      throw new Error("NeuralNetwork: learningRate must be > 0.");
    }
    if (dropoutRate < 0 || dropoutRate >= 1) {
      throw new Error("NeuralNetwork: dropoutRate must be in [0,1).");
    }

    this.layers = [inputSize, ...hiddenLayers, outputSize];
    this.learningRate = learningRate;
    this.dropoutRate = dropoutRate;
    this.rng = new RNG(seed);

    // Initialize weights (He init) and small random biases
    this.weights = [];
    this.biases = [];
    for (let i = 0; i < this.layers.length - 1; i++) {
      this.weights[i] = this.initializeWeights(this.layers[i], this.layers[i + 1]);
      this.biases[i] = Array(this.layers[i + 1])
        .fill(0)
        .map(() => this.rng.next() * 0.1);
    }
  }

  private initializeWeights(inputSize: number, outputSize: number): number[][] {
    const scale = Math.sqrt(2 / Math.max(1, inputSize)); // He init for ReLU
    const layer: number[][] = Array(outputSize);
    for (let j = 0; j < outputSize; j++) {
      const row: number[] = Array(inputSize);
      for (let k = 0; k < inputSize; k++) {
        row[k] = this.rng.nextCentered() * scale;
      }
      layer[j] = row;
    }
    return layer;
  }

  private sigmoid(x: number): number {
    // clamp input to avoid overflow
    const z = Math.max(-50, Math.min(50, x));
    return 1 / (1 + Math.exp(-z));
  }
  private relu(x: number): number {
    return x > 0 ? x : 0;
  }

  private forwardPass(inputs: number[], training = false): number[][] {
    if (inputs.length !== this.layers[0]) {
      throw new Error(`forwardPass: expected ${this.layers[0]} inputs, got ${inputs.length}`);
    }
    // Defensively replace NaNs/Infinities
    const safe = inputs.map((v) => (Number.isFinite(v) ? v : 0));
    const activations: number[][] = [safe];

    for (let i = 0; i < this.weights.length; i++) {
      const prev = activations[i];
      const W = this.weights[i];
      const b = this.biases[i];
      const isLast = i === this.weights.length - 1;
      const out: number[] = new Array(W.length);

      for (let j = 0; j < W.length; j++) {
        let sum = b[j];
        const wj = W[j];
        for (let k = 0; k < wj.length; k++) {
          sum += prev[k] * wj[k];
        }
        let a = isLast ? this.sigmoid(sum) : this.relu(sum);

        // naive dropout (zero-out at train time only)
        if (training && this.dropoutRate > 0 && this.rng.next() < this.dropoutRate && !isLast) {
          a = 0;
        }
        out[j] = a;
      }
      activations.push(out);
    }
    return activations;
  }

  private backwardPass(activations: number[][], targets: number[]): void {
    const L = this.weights.length;
    const deltas: number[][] = [];

    // Output layer (sigmoid + MSE)
    const y = activations[L];
    if (targets.length !== y.length) {
      throw new Error(`backwardPass: expected ${y.length} targets, got ${targets.length}`);
    }
    const deltaOut = new Array(y.length);
    for (let i = 0; i < y.length; i++) {
      const yi = y[i];
      const ti = targets[i] ?? 0;
      deltaOut[i] = (yi - ti) * yi * (1 - yi); // dMSE/dz
    }
    deltas.unshift(deltaOut);

    // Hidden layers (ReLU derivative)
    for (let i = L - 2; i >= 0; i--) {
      const a = activations[i + 1];
      const nextDelta = deltas[0];
      const Wnext = this.weights[i + 1];

      const layerDelta = new Array(a.length);
      for (let j = 0; j < a.length; j++) {
        let sum = 0;
        for (let k = 0; k < nextDelta.length; k++) {
          sum += nextDelta[k] * Wnext[k][j];
        }
        // ReLU'
        layerDelta[j] = a[j] > 0 ? sum : 0;
      }
      deltas.unshift(layerDelta);
    }

    // Gradient step
    for (let i = 0; i < L; i++) {
      const prev = activations[i];
      const d = deltas[i];
      const W = this.weights[i];
      const b = this.biases[i];

      for (let j = 0; j < W.length; j++) {
        const dj = d[j];
        for (let k = 0; k < W[j].length; k++) {
          W[j][k] -= this.learningRate * dj * prev[k];
        }
        b[j] -= this.learningRate * dj;
      }
    }
  }

  /** Simple full-batch training. For more control, see fit(). */
  public train(trainingData: TrainingData[], epochs: number): void {
    this.fit(trainingData, { epochs });
  }

  /** Mini-batch training with shuffling + early stopping. */
public fit(
  trainingData: TrainingData[],
  opts: { epochs?: number; batchSize?: number; earlyStopMSE?: number } = {},
): void {
  const epochs = Math.max(1, Math.floor(opts.epochs ?? 20));

  // Avoid mixing ?? and || without parentheses
  const defaultBatchSize = trainingData.length || 1;
  const batchSize = Math.max(1, Math.floor(opts.batchSize ?? defaultBatchSize));

  const earlyStop = opts.earlyStopMSE ?? 1e-3;

  const shuffle = (arr: TrainingData[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };
  // Early stop if no training data

    for (let epoch = 0; epoch < epochs; epoch++) {
      if (trainingData.length === 0) break;
      shuffle(trainingData);

      let totalError = 0;
      for (let start = 0; start < trainingData.length; start += batchSize) {
        const batch = trainingData.slice(start, start + batchSize);
        for (const sample of batch) {
          const activations = this.forwardPass(sample.inputs, true); // dropout on
          const outputs = activations[activations.length - 1];
          for (let i = 0; i < outputs.length; i++) {
            const t = sample.outputs[i] ?? 0;
            const y = outputs[i];
            const e = y - t;
            totalError += e * e;
          }
          this.backwardPass(activations, sample.outputs);
        }
      }

      const mse = totalError / Math.max(1, trainingData.length);
      if (!Number.isFinite(mse)) break;
      if (mse < earlyStop) break;
    }
  }

  public predict(inputs: number[]): number[] {
    const activations = this.forwardPass(inputs, false);
    return activations[activations.length - 1];
  }

  public getModelState(): string {
    return JSON.stringify({
      weights: this.weights,
      biases: this.biases,
      layers: this.layers,
      learningRate: this.learningRate,
      dropoutRate: this.dropoutRate,
    });
  }

  public loadModelState(state: string): void {
    const parsed = JSON.parse(state);
    this.weights = parsed.weights;
    this.biases = parsed.biases;
    this.layers = parsed.layers;
    this.learningRate = parsed.learningRate ?? this.learningRate;
    this.dropoutRate = parsed.dropoutRate ?? this.dropoutRate;
  }
}

/** Domain-specific adapter for your habit objects. */
export class HabitNeuralNetwork extends NeuralNetwork {
  constructor() {
    super({
      inputSize: 15, // feature vector size (fixed)
      hiddenLayers: [64, 32, 16],
      outputSize: 5, // [completionProb, predictedStreak, risk, optimalTime, confidence]
      learningRate: 0.001,
      dropoutRate: 0.2,
      // seed: 1234, // uncomment for deterministic init in tests
    });
  }

  public prepareTrainingData(
    habits: HabitRow[],
    progressData: Record<string, HabitProgress>,
    dailyActivities: DailyActivity[],
  ): TrainingData[] {
    const trainingData: TrainingData[] = [];

    for (const habit of habits) {
      const progress = progressData[habit.id];
      if (!progress) continue;

      const habitActivities = dailyActivities.filter((a) => a.habit_id === habit.id);
      const features = this.extractFeatures(habit, progress, habitActivities);
      const targets = this.createTargets(habit, progress, habitActivities);

      trainingData.push({ inputs: features, outputs: targets });
    }

    return trainingData;
  }

  private extractFeatures(
    habit: HabitRow,
    progress: HabitProgress,
    activities: DailyActivity[],
  ): number[] {
    const features: number[] = [];

    // 1) Basic features (normalized)
    features.push(clamp01(progress.completion_rate / 100));
    features.push(clamp01(progress.current_streak / 30));
    features.push(clamp01((progress.total_reps ?? 0) / 100));
    features.push(clamp01(habit.goal_reps / 50));
    features.push(clamp01(habit.wrap_size / 10));

    // 2) Temporal
    const daysActive = Math.max(
      1,
      Math.floor((Date.now() - new Date(habit.created_at).getTime()) / 86_400_000),
    );
    features.push(clamp01(daysActive / 365));
    features.push(clamp01(activities.length / daysActive));

    // 3) Activity patterns
    const completionTimes = activities
      .filter((a) => a.rep_count > 0)
      .map((a) => new Date(a.date).getHours());
    const avgCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 12;
    features.push(clamp01(avgCompletionTime / 24));

    // 4) Consistency
    const uniqueDays = new Set(activities.map((a) => new Date(a.date).toDateString())).size;
    features.push(clamp01(uniqueDays / Math.max(daysActive, 1)));

    // 5) Difficulty heuristics
    features.push(habit.goal_reps > 20 ? 1 : 0);
    features.push(habit.wrap_size > 5 ? 1 : 0);

    // 6) Recent (last 7 days)
    const recent = activities.filter(
      (a) => (Date.now() - new Date(a.date).getTime()) / 86_400_000 <= 7,
    );
    features.push(
      clamp01(recent.filter((a) => a.rep_count > 0).length / Math.max(recent.length, 1)),
    );

    // Pad/trim to fixed input size
    while (features.length < 15) features.push(0);
    return features.slice(0, 15).map((v) => (Number.isFinite(v) ? v : 0));
  }

  private createTargets(
    _habit: HabitRow,
    progress: HabitProgress,
    activities: DailyActivity[],
  ): number[] {
    const targets: number[] = [];

    // 1) Completion probability
    targets.push(clamp01(progress.completion_rate / 100));

    // 2) Predicted streak (normalized to 30)
    const predictedStreak = Math.min(progress.current_streak + 7, 30) / 30;
    targets.push(clamp01(predictedStreak));

    // 3) Risk score (higher = more risk)
    const riskScore = (100 - progress.completion_rate) / 100;
    targets.push(clamp01(riskScore));

    // 4) Optimal time (normalized hour)
    const completionTimes = activities
      .filter((a) => a.rep_count > 0)
      .map((a) => new Date(a.date).getHours());
    const optimalTime =
      completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 9;
    targets.push(clamp01(optimalTime / 24));

    // 5) Confidence
    const confidence = Math.min(activities.length / 50, 1);
    targets.push(clamp01(confidence));

    return targets.map((v) => (Number.isFinite(v) ? v : 0));
  }

  public predictHabit(
    habit: HabitRow,
    progress: HabitProgress,
    activities: DailyActivity[],
  ): {
    completionProbability: number; // 0..100 %
    predictedStreak: number; // days
    riskScore: number; // 0..100
    optimalTime: string; // "HH:00"
    confidence: number; // 0..100
  } {
    const features = this.extractFeatures(habit, progress, activities);
    const out = this.predict(features);

    return {
      completionProbability: Math.round(clamp01(out[0]) * 100),
      predictedStreak: Math.round(clamp01(out[1]) * 30),
      riskScore: Math.round(clamp01(out[2]) * 100),
      optimalTime: `${Math.round(clamp01(out[3]) * 24).toString().padStart(2, "0")}:00`,
      confidence: Math.round(clamp01(out[4]) * 100),
    };
  }
}

/** Helpers */
function clamp01(v: number): number {
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
}
