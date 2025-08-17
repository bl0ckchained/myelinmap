import { HabitRow, HabitProgress, DailyActivity } from "../types/habit";

export interface HabitPrediction {
  habitId: string;
  completionProbability: number; // 0-100
  optimalTime: string; // "HH:00"
  riskFactors: string[];
  suggestedModifications: string[];
  predictedStreak: number; // days
  confidence: number; // 0-100
}

export interface BehavioralInsight {
  habitId: string;
  triggerEffectiveness: number; // 0-100
  rewardImpact: number; // 0-100
  automaticityScore: number; // 0-100
  formationStage: "cue" | "routine" | "reward" | "automatic";
  psychologicalBarriers: string[];
}

export interface HabitCorrelation {
  habit1Id: string;
  habit2Id: string;
  correlationStrength: number; // 0-1
  relationshipType: "positive" | "negative" | "neutral";
  confidence: number; // 0-100
}

export class HabitPredictionEngine {
  private static instance: HabitPredictionEngine;

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
    historicalData: DailyActivity[]
  ): HabitPrediction {
    const completionRate = progress.completion_rate ?? 0;
    const currentStreak = progress.current_streak ?? 0;

    const baseProbability = this.calculateBaseProbability(
      completionRate,
      currentStreak
    );
    const { optimalTime } = this.analyzeOptimalTiming(historicalData);
    const riskFactors = this.identifyRiskFactors(
      habit,
      progress,
      historicalData
    );
    const suggestedModifications = this.suggestModifications(habit, progress);
    const predictedStreak = this.predictStreakLength(
      currentStreak,
      completionRate
    );
    const confidence = this.calculateConfidence(historicalData.length);

    return {
      habitId: habit.id,
      completionProbability: Math.min(100, Math.max(0, baseProbability)),
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
    historicalData: DailyActivity[]
  ): BehavioralInsight {
    const triggerEffectiveness = this.calculateTriggerEffectiveness(
      habit,
      historicalData
    );
    const rewardImpact = this.calculateRewardImpact(habit, historicalData);
    const automaticityScore = this.calculateAutomaticity(habit, progress);
    const formationStage =
      this.determineFormationStage(automaticityScore);
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
    progressData: Record<string, HabitProgress>,
    dailyActivities: DailyActivity[]
  ): HabitCorrelation[] {
    const result: HabitCorrelation[] = [];
    // Build per-habit sets of YYYY-MM-DD where reps > 0
    const dayMap = new Map<string, Set<string>>();
    for (const h of habits) {
      const days = new Set<string>();
      for (const a of dailyActivities) {
        if (a.habit_id !== h.id) continue;
        if ((a.rep_count ?? 0) > 0) {
          const day = new Date(a.date).toISOString().slice(0, 10);
          days.add(day);
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

        // Confidence scales with amount of data
        const confidence = Math.max(
          10,
          Math.min(100, (set1.size + set2.size) * 3)
        );

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

  private calculateBaseProbability(
    completionRate: number,
    streak: number
  ): number {
    const streakBonus = Math.min(streak * 2, 20); // cap 20
    const rateBonus = completionRate * 0.8;
    return 50 + streakBonus + rateBonus; // center around 50
  }

  private analyzeOptimalTiming(
    historicalData: DailyActivity[]
  ): { optimalTime: string } {
    if (historicalData.length === 0) return { optimalTime: "09:00" };

    const counts = new Map<string, number>();
    for (const a of historicalData) {
      if ((a.rep_count ?? 0) <= 0) continue;
      const hour = new Date(a.date).getHours();
      const slot = `${hour.toString().padStart(2, "0")}:00`;
      counts.set(slot, (counts.get(slot) ?? 0) + 1);
    }
    const optimalTime =
      [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "09:00";
    return { optimalTime };
  }

  private identifyRiskFactors(
    habit: HabitRow,
    progress: HabitProgress,
    historicalData: DailyActivity[]
  ): string[] {
    const risks: string[] = [];
    const completion = progress.completion_rate ?? 0;

    if (completion < 50) risks.push("Low completion rate");
    if ((progress.current_streak ?? 0) === 0 && (progress.total_reps ?? 0) > 10) {
      risks.push("Broken streak pattern");
    }
    if (habit.goal_reps > 20) risks.push("High target complexity");

    // recent drop-off: fewer reps in last 7 days than prior 7 days
    const now = Date.now();
    const last7 = historicalData.filter(
      (a) => now - new Date(a.date).getTime() <= 7 * 86400000
    );
    const prev7 = historicalData.filter(
      (a) =>
        now - new Date(a.date).getTime() > 7 * 86400000 &&
        now - new Date(a.date).getTime() <= 14 * 86400000
    );
    const last7Reps = last7.reduce((s, a) => s + (a.rep_count ?? 0), 0);
    const prev7Reps = prev7.reduce((s, a) => s + (a.rep_count ?? 0), 0);
    if (prev7Reps > 0 && last7Reps < prev7Reps * 0.5) {
      risks.push("Recent consistency drop");
    }

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
    return Math.round(base);
  }

  private calculateConfidence(dataPoints: number): number {
    return Math.min(100, Math.max(10, dataPoints * 2));
  }

  private calculateTriggerEffectiveness(
    _habit: HabitRow,
    historicalData: DailyActivity[]
  ): number {
    // proxy: more consistent logged reps => higher trigger effectiveness
    const activeDays = new Set(
      historicalData
        .filter((a) => (a.rep_count ?? 0) > 0)
        .map((a) => new Date(a.date).toISOString().slice(0, 10))
    ).size;
    return Math.min(100, 40 + activeDays * 3);
  }

  private calculateRewardImpact(habit: HabitRow, _historicalData: DailyActivity[]): number {
    // proxy: slightly higher when wrap_size is small (more frequent “wins”)
    const wrapBonus = habit.wrap_size <= 5 ? 20 : habit.wrap_size <= 10 ? 10 : 0;
    return Math.min(100, 55 + wrapBonus);
  }

  private calculateAutomaticity(habit: HabitRow, progress: HabitProgress): number {
    const daysActive = Math.max(
      1,
      Math.floor(
        (Date.now() - new Date(habit.created_at).getTime()) / 86400000
      )
    );
    const repsPerDay = (progress.total_reps ?? 0) / daysActive;
    return Math.min(100, repsPerDay * 100);
  }

  private determineFormationStage(
    automaticity: number
  ): "cue" | "routine" | "reward" | "automatic" {
    if (automaticity < 25) return "cue";
    if (automaticity < 50) return "routine";
    if (automaticity < 75) return "reward";
    return "automatic";
  }

  // ✅ This is the method your error said “does not exist”
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
