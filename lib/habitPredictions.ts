// lib/habitPredictions.ts
import type { HabitRow, HabitProgress, DailyActivity } from "../types/habit";

/** Predictive summary for a single habit (all values are human-scale). */
export interface HabitPrediction {
  habitId: string;
  completionProbability: number; // 0–100
  optimalTime: string; // "HH:00"
  riskFactors: string[];
  suggestedModifications: string[];
  predictedStreak: number; // days
  confidence: number; // 0–100
}

export interface BehavioralInsight {
  habitId: string;
  triggerEffectiveness: number; // 0–100
  rewardImpact: number; // 0–100
  automaticityScore: number; // 0–100
  formationStage: "cue" | "routine" | "reward" | "automatic";
  psychologicalBarriers: string[];
}

export interface HabitCorrelation {
  habit1Id: string;
  habit2Id: string;
  correlationStrength: number; // 0–1
  relationshipType: "positive" | "negative" | "neutral";
  confidence: number; // 0–100
}

export class HabitPredictionEngine {
  private static instance: HabitPredictionEngine | null = null;

  /** Time constants (ms) */
  private static readonly DAY_MS = 86_400_000;
  private static readonly WEEK_MS = 7 * HabitPredictionEngine.DAY_MS;

  static getInstance(): HabitPredictionEngine {
    if (!HabitPredictionEngine.instance) {
      HabitPredictionEngine.instance = new HabitPredictionEngine();
    }
    return HabitPredictionEngine.instance;
  }

  // ---------- Public APIs ----------

  predictHabitSuccess(
    habit: HabitRow,
    progress: HabitProgress,
    historicalData: DailyActivity[],
  ): HabitPrediction {
    const completionRate = progress.completion_rate ?? 0;
    const currentStreak = progress.current_streak ?? 0;

    const baseProbability = this.calculateBaseProbability(completionRate, currentStreak);
    const { optimalTime } = this.analyzeOptimalTiming(historicalData);
    const riskFactors = this.identifyRiskFactors(habit, progress, historicalData);
    const suggestedModifications = this.suggestModifications(habit, progress);
    const predictedStreak = this.predictStreakLength(currentStreak, completionRate);
    const confidence = this.calculateConfidence(historicalData.length);

    return {
      habitId: habit.id,
      completionProbability: this.clamp(Math.round(baseProbability), 0, 100),
      optimalTime,
      riskFactors,
      suggestedModifications,
      predictedStreak,
      confidence,
    };
  }

  analyzeBehavioralPsychology(
    habit: HabitRow,
    progress: HabitProgress,
    historicalData: DailyActivity[],
  ): BehavioralInsight {
    const triggerEffectiveness = this.calculateTriggerEffectiveness(habit, historicalData);
    const rewardImpact = this.calculateRewardImpact(habit);
    const automaticityScore = this.calculateAutomaticity(habit, progress);
    const formationStage = this.determineFormationStage(automaticityScore);
    const psychologicalBarriers = this.identifyBarriers(habit, progress);

    return {
      habitId: habit.id,
      triggerEffectiveness,
      rewardImpact,
      automaticityScore,
      formationStage,
      psychologicalBarriers,
    };
  }

  calculateHabitCorrelations(
    habits: HabitRow[],
    _progressData: Record<string, HabitProgress>, // kept for API parity; underscore avoids "unused" warnings
    dailyActivities: DailyActivity[],
  ): HabitCorrelation[] {
    const result: HabitCorrelation[] = [];

    // Per-habit set of local YYYY-MM-DD strings for days with reps > 0
    const dayMap = new Map<string, Set<string>>();
    for (const h of habits) {
      const days = new Set<string>();
      for (const a of dailyActivities) {
        if (a.habit_id !== h.id) continue;
        if ((a.rep_count ?? 0) > 0) {
          days.add(this.localDayKey(a.date));
        }
      }
      dayMap.set(h.id, days);
    }

    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const h1 = habits[i];
        const h2 = habits[j];

        const set1 = dayMap.get(h1.id) ?? new Set<string>();
        const set2 = dayMap.get(h2.id) ?? new Set<string>();

        // Jaccard similarity on active days
        const intersectionSize = this.intersectionSize(set1, set2);
        const unionSize = this.unionSize(set1, set2);
        const strength = unionSize > 0 ? intersectionSize / unionSize : 0;

        let relationshipType: HabitCorrelation["relationshipType"] = "neutral";
        if (strength >= 0.35) relationshipType = "positive";
        else if (unionSize > 0 && intersectionSize === 0) relationshipType = "negative";

        const confidence = this.clamp(Math.round((set1.size + set2.size) * 3), 10, 100);

        if (unionSize > 0) {
          result.push({
            habit1Id: h1.id,
            habit2Id: h2.id,
            correlationStrength: strength,
            relationshipType,
            confidence,
          });
        }
      }
    }

    return result;
  }

  // ---------- Private helpers ----------

  /** Keep values in a safe range. */
  private clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
  }

  /** Local day key (avoids timezone jumps that ISO can cause). */
  private localDayKey(dateLike: string | number | Date): string {
    const d = new Date(dateLike);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  private calculateBaseProbability(completionRate: number, streak: number): number {
    const streakBonus = Math.min(streak * 2, 20); // cap 20
    const rateBonus = completionRate * 0.8;
    return 50 + streakBonus + rateBonus; // centered near 50
  }

  private analyzeOptimalTiming(historicalData: DailyActivity[]): { optimalTime: string } {
    if (historicalData.length === 0) return { optimalTime: "09:00" };

    const counts = new Map<string, number>();
    for (const a of historicalData) {
      if ((a.rep_count ?? 0) <= 0) continue;
      const hour = new Date(a.date).getHours();
      const slot = `${hour.toString().padStart(2, "0")}:00`;
      counts.set(slot, (counts.get(slot) ?? 0) + 1);
    }
    const optimalTime = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "09:00";
    return { optimalTime };
  }

  private identifyRiskFactors(
    habit: HabitRow,
    progress: HabitProgress,
    historicalData: DailyActivity[],
  ): string[] {
    const risks: string[] = [];
    const completion = progress.completion_rate ?? 0;

    if (completion < 50) risks.push("Low completion rate");
    if ((progress.current_streak ?? 0) === 0 && (progress.total_reps ?? 0) > 10) {
      risks.push("Broken streak pattern");
    }
    if (habit.goal_reps > 20) risks.push("High target complexity");

    // Recent drop-off: last 7 days vs prior 7 days
    const now = Date.now();
    const last7 = historicalData.filter(
      (a) => now - new Date(a.date).getTime() <= HabitPredictionEngine.WEEK_MS,
    );
    const prev7 = historicalData.filter((a) => {
      const age = now - new Date(a.date).getTime();
      return age > HabitPredictionEngine.WEEK_MS && age <= 2 * HabitPredictionEngine.WEEK_MS;
    });

    const last7Reps = last7.reduce((s, a) => s + (a.rep_count ?? 0), 0);
    const prev7Reps = prev7.reduce((s, a) => s + (a.rep_count ?? 0), 0);
    if (prev7Reps > 0 && last7Reps < prev7Reps * 0.5) risks.push("Recent consistency drop");

    return risks;
  }

  private suggestModifications(habit: HabitRow, progress: HabitProgress): string[] {
    const suggestions: string[] = [];
    const completion = progress.completion_rate ?? 0;

    if (completion < 30) {
      suggestions.push("Reduce target reps by ~50%");
      suggestions.push("Split into smaller micro-habits");
    }
    if (habit.goal_reps > 15) suggestions.push("Use habit stacking");
    suggestions.push("Add stronger visual cues");
    suggestions.push("Increase immediate rewards");

    return suggestions;
  }

  private predictStreakLength(currentStreak: number, completionRate: number): number {
    const base = currentStreak + completionRate / 10;
    return Math.max(0, Math.round(base));
  }

  private calculateConfidence(dataPoints: number): number {
    // Simple heuristic: more observations → higher confidence
    return this.clamp(Math.round(dataPoints * 2), 10, 100);
  }

  private calculateTriggerEffectiveness(
    _habit: HabitRow, // kept for future tuning
    historicalData: DailyActivity[],
  ): number {
    const activeDays = new Set(
      historicalData
        .filter((a) => (a.rep_count ?? 0) > 0)
        .map((a) => this.localDayKey(a.date)),
    ).size;
    return this.clamp(40 + activeDays * 3, 0, 100);
  }

  // `historicalData` intentionally omitted to keep this independent of logging density
  private calculateRewardImpact(habit: HabitRow): number {
    const wrapBonus = habit.wrap_size <= 5 ? 20 : habit.wrap_size <= 10 ? 10 : 0;
    return this.clamp(55 + wrapBonus, 0, 100);
  }

  private calculateAutomaticity(habit: HabitRow, progress: HabitProgress): number {
    const daysActive = Math.max(
      1,
      Math.floor((Date.now() - new Date(habit.created_at).getTime()) / HabitPredictionEngine.DAY_MS),
    );
    const repsPerDay = (progress.total_reps ?? 0) / daysActive;
    return this.clamp(Math.round(repsPerDay * 100), 0, 100);
  }

  private determineFormationStage(automaticity: number): "cue" | "routine" | "reward" | "automatic" {
    if (automaticity < 25) return "cue";
    if (automaticity < 50) return "routine";
    if (automaticity < 75) return "reward";
    return "automatic";
  }

  private identifyBarriers(habit: HabitRow, progress: HabitProgress): string[] {
    const barriers: string[] = [];
    if (habit.goal_reps > 20) barriers.push("Complexity barrier");
    if ((progress.completion_rate ?? 0) < 40) barriers.push("Motivation barrier");
    if ((progress.current_streak ?? 0) === 0) barriers.push("Inconsistent routine");
    return barriers;
  }

  private intersectionSize(a: Set<string>, b: Set<string>): number {
    let count = 0;
    for (const v of a) if (b.has(v)) count++;
    return count;
  }

  private unionSize(a: Set<string>, b: Set<string>): number {
    return new Set<string>([...a, ...b]).size;
  }
}
// It uses various heuristics to analyze habit data and predict success probabilities,
// optimal times, risk factors, and suggested modifications. It also provides insights