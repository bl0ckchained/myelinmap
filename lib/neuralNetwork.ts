// lib/neuralNetwork.ts
import { HabitRow, HabitProgress, DailyActivity } from "../types/habit";

export interface NeuralNetworkConfig {
  inputSize: number;
  hiddenLayers: number[];
  outputSize: number;
  learningRate: number;
  dropoutRate: number;
}

export interface TrainingData {
  inputs: number[];
  outputs: number[];
}

export class NeuralNetwork {
  private layers: number[];
  private weights: number[][][];
  private biases: number[][];
  private learningRate: number;
  private dropoutRate: number;

  constructor(config: NeuralNetworkConfig) {
    this.layers = [config.inputSize, ...config.hiddenLayers, config.outputSize];
    this.learningRate = config.learningRate;
    this.dropoutRate = config.dropoutRate;

    // Initialize weights and biases
    this.weights = [];
    this.biases = [];

    for (let i = 0; i < this.layers.length - 1; i++) {
      this.weights[i] = this.initializeWeights(this.layers[i], this.layers[i + 1]);
      this.biases[i] = new Array(this.layers[i + 1])
        .fill(0)
        .map(() => Math.random() * 0.1);
    }
  }

  private initializeWeights(inputSize: number, outputSize: number): number[][] {
    // He initialization for ReLU layers
    return Array(outputSize)
      .fill(0)
      .map(() =>
        Array(inputSize)
          .fill(0)
          .map(() => (Math.random() - 0.5) * Math.sqrt(2 / Math.max(1, inputSize))),
      );
  }

  private sigmoid(x: number): number {
    // clamp to avoid overflow
    const z = Math.max(-500, Math.min(500, x));
    return 1 / (1 + Math.exp(-z));
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  private forwardPass(inputs: number[], training = false): number[][] {
    const activations: number[][] = [inputs];

    for (let i = 0; i < this.weights.length; i++) {
      const layerOutput: number[] = [];

      for (let j = 0; j < this.weights[i].length; j++) {
        let sum = this.biases[i][j];

        for (let k = 0; k < this.weights[i][j].length; k++) {
          sum += activations[i][k] * this.weights[i][j][k];
        }

        // Activation: ReLU for hidden, sigmoid for output
        const act = i === this.weights.length - 1 ? this.sigmoid(sum) : this.relu(sum);

        // Apply dropout **only during training**
        if (training && this.dropoutRate > 0 && Math.random() < this.dropoutRate) {
          layerOutput.push(0);
        } else {
          layerOutput.push(act);
        }
      }

      activations.push(layerOutput);
    }

    return activations;
  }

  private backwardPass(activations: number[][], targets: number[]): void {
    const deltas: number[][] = [];

    // Output layer deltas (sigmoid + MSE)
    const outputDelta: number[] = [];
    const outputs = activations[activations.length - 1];

    for (let i = 0; i < outputs.length; i++) {
      const y = outputs[i];
      const t = targets[i] ?? 0;
      // d(MSE)/dy * d(sigmoid)/dz = (y - t) * y * (1 - y)
      const delta = (y - t) * y * (1 - y);
      outputDelta.push(delta);
    }
    deltas.unshift(outputDelta);

    // Hidden layers deltas (ReLU derivative)
    for (let i = this.weights.length - 2; i >= 0; i--) {
      const layerDelta: number[] = [];

      for (let j = 0; j < activations[i + 1].length; j++) {
        let sum = 0;
        for (let k = 0; k < deltas[0].length; k++) {
          sum += deltas[0][k] * this.weights[i + 1][k][j];
        }
        const a = activations[i + 1][j];
        layerDelta.push(a > 0 ? sum : 0);
      }

      deltas.unshift(layerDelta);
    }

    // Gradient step
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          this.weights[i][j][k] -= this.learningRate * deltas[i][j] * activations[i][k];
        }
        this.biases[i][j] -= this.learningRate * deltas[i][j];
      }
    }
  }

  public train(trainingData: TrainingData[], epochs: number): void {
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalError = 0;

      for (const data of trainingData) {
        const activations = this.forwardPass(data.inputs, true); // dropout on
        const outputs = activations[activations.length - 1];

        for (let i = 0; i < outputs.length; i++) {
          const t = data.outputs[i] ?? 0;
          const y = outputs[i];
          totalError += (y - t) * (y - t);
        }

        this.backwardPass(activations, data.outputs);
      }

      // Early stopping
      if (trainingData.length > 0 && totalError / trainingData.length < 0.001) break;
    }
  }

  public predict(inputs: number[]): number[] {
    const activations = this.forwardPass(inputs, false); // dropout off
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

export class HabitNeuralNetwork extends NeuralNetwork {
  constructor() {
    super({
      inputSize: 15, // enhanced feature set
      hiddenLayers: [64, 32, 16],
      outputSize: 5, // completion prob, streak, risk, optimal time, confidence
      learningRate: 0.001,
      dropoutRate: 0.2,
    });
  }

  public prepareTrainingData(
    habits: HabitRow[],
    progressData: Record<string, HabitProgress>,
    dailyActivities: DailyActivity[],
  ): TrainingData[] {
    const trainingData: TrainingData[] = [];

    habits.forEach((habit) => {
      const progress = progressData[habit.id];
      if (!progress) return;

      const habitActivities = dailyActivities.filter((a) => a.habit_id === habit.id);

      const features = this.extractFeatures(habit, progress, habitActivities);
      const targets = this.createTargets(habit, progress, habitActivities);

      trainingData.push({ inputs: features, outputs: targets });
    });

    return trainingData;
  }

  private extractFeatures(
    habit: HabitRow,
    progress: HabitProgress,
    activities: DailyActivity[],
  ): number[] {
    const features: number[] = [];

    // Basic features
    features.push(progress.completion_rate / 100);
    features.push(progress.current_streak / 30);
    features.push((progress.total_reps ?? 0) / 100);
    features.push(habit.goal_reps / 50);
    features.push(habit.wrap_size / 10);

    // Temporal features
    const daysActive = Math.max(
      1,
      Math.floor((Date.now() - new Date(habit.created_at).getTime()) / 86_400_000),
    );
    features.push(daysActive / 365);
    features.push(activities.length / daysActive);

    // Activity patterns
    const completionTimes = activities
      .filter((a) => a.rep_count > 0)
      .map((a) => new Date(a.date).getHours());
    const avgCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 12;
    features.push(avgCompletionTime / 24);

    // Consistency
    const uniqueDays = new Set(
      activities.map((a) => new Date(a.date).toDateString()),
    ).size;
    features.push(uniqueDays / Math.max(daysActive, 1));

    // Difficulty heuristics
    features.push(habit.goal_reps > 20 ? 1 : 0);
    features.push(habit.wrap_size > 5 ? 1 : 0);

    // Recent behavior (last 7 days)
    const recentActivities = activities.filter((a) => {
      const daysAgo = (Date.now() - new Date(a.date).getTime()) / 86_400_000;
      return daysAgo <= 7;
    });
    features.push(
      recentActivities.filter((a) => a.rep_count > 0).length /
        Math.max(recentActivities.length, 1),
    );

    // Pad/trim to fixed input size
    while (features.length < 15) features.push(0);
    return features.slice(0, 15);
  }

  private createTargets(
    _habit: HabitRow,
    progress: HabitProgress,
    activities: DailyActivity[],
  ): number[] {
    const targets: number[] = [];

    // 1) Completion probability (0..1)
    targets.push(progress.completion_rate / 100);

    // 2) Predicted streak length (normalized 0..1)
    const predictedStreak = Math.min(progress.current_streak + 7, 30) / 30;
    targets.push(predictedStreak);

    // 3) Risk score (0..1; higher = more risk)
    const riskScore = (100 - progress.completion_rate) / 100;
    targets.push(riskScore);

    // 4) Optimal time (normalized hour 0..1)
    const completionTimes = activities
      .filter((a) => a.rep_count > 0)
      .map((a) => new Date(a.date).getHours());
    const optimalTime =
      completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 9;
    targets.push(optimalTime / 24);

    // 5) Confidence score (0..1)
    const confidence = Math.min(activities.length / 50, 1);
    targets.push(confidence);

    return targets;
  }

  public predictHabit(
    habit: HabitRow,
    progress: HabitProgress,
    activities: DailyActivity[],
  ): {
    completionProbability: number;
    predictedStreak: number;
    riskScore: number;
    optimalTime: string;
    confidence: number;
  } {
    const features = this.extractFeatures(habit, progress, activities);
    const predictions = this.predict(features);

    return {
      completionProbability: Math.round(predictions[0] * 100),
      predictedStreak: Math.round(predictions[1] * 30),
      riskScore: Math.round(predictions[2] * 100),
      optimalTime: `${Math.round(predictions[3] * 24)
        .toString()
        .padStart(2, "0")}:00`,
      confidence: Math.round(predictions[4] * 100),
    };
    }
}
