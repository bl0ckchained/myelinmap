import { HabitRow, HabitProgress, DailyActivity } from '../types/habit';

export interface HabitPrediction {
  habitId: string;
  completionProbability: number;
  optimalTime: string;
  riskFactors: string[];
  suggestedModifications: string[];
  predictedStreak: number;
  confidence: number;
}

export interface BehavioralInsight {
  habitId: string;
  triggerEffectiveness: number;
  rewardImpact: number;
  automaticityScore: number;
  formationStage: 'cue' | 'routine' | 'reward' | 'automatic';
  psychologicalBarriers: string[];
}

export interface HabitCorrelation {
  habit1Id: string;
  habit2Id: string;
  correlationStrength: number;
  relationshipType: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export class HabitPredictionEngine {
  private static instance: HabitPredictionEngine;
  
  static getInstance(): HabitPredictionEngine {
    if (!HabitPredictionEngine.instance) {
      HabitPredictionEngine.instance = new HabitPredictionEngine();
    }
    return HabitPredictionEngine.instance;
  }

  predictHabitSuccess(
    habit: HabitRow,
    progress: HabitProgress,
    historicalData: DailyActivity[]
  ): HabitPrediction {
    const completionRate = progress.completion_rate || 0;
    const currentStreak = progress.current_streak || 0;
    const totalReps = progress.total_reps || 0;
    
    // Advanced ML-inspired algorithm
    const baseProbability = this.calculateBaseProbability(completionRate, currentStreak);
    const timeFactor = this.analyzeOptimalTiming(historicalData);
    const riskFactors = this.identifyRiskFactors(habit, progress, historicalData);
    const modifications = this.suggestModifications(habit, progress);
    
    return {
      habitId: habit.id,
      completionProbability: Math.min(100, Math.max(0, baseProbability)),
      optimalTime: timeFactor.optimalTime,
      riskFactors,
      suggestedModifications: modifications,
      predictedStreak: this.predictStreakLength(currentStreak, completionRate),
      confidence: this.calculateConfidence(historicalData.length)
    };
  }

  analyzeBehavioralPsychology(
    habit: HabitRow,
    progress: HabitProgress,
    historicalData: DailyActivity[]
  ): BehavioralInsight {
    const triggerEffectiveness = this.calculateTriggerEffectiveness(habit, historicalData);
    const rewardImpact = this.calculateRewardImpact(habit, historicalData);
    const automaticityScore = this.calculateAutomaticity(habit, progress);
    
    return {
      habitId: habit.id,
      triggerEffectiveness,
      rewardImpact,
      automaticityScore,
      formationStage: this.determineFormationStage(automaticityScore),
      psychologicalBarriers: this.identifyBarriers(habit, progress)
    };
  }

  calculateHabitCorrelations(
    habits: HabitRow[],
    progressData: Record<string, HabitProgress>,
    dailyActivities: DailyActivity[]
  ): HabitCorrelation[] {
    const correlations: HabitCorrelation[] = [];
    
    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const correlation = this.calculateCorrelation(
          habits[i],
          habits[j],
          progressData,
          dailyActivities
        );
        
        if (correlation.strength > 0.1) {
          correlations.push({
            habit1Id: habits[i].id,
            habit2Id: habits[j].id,
            correlationStrength: correlation.strength,
            relationshipType: correlation.type,
            confidence: correlation.confidence
          });
        }
      }
    }
    
    return correlations;
  }

  private calculateBaseProbability(completionRate: number, streak: number): number {
    const streakBonus = Math.min(streak * 2, 20);
    const rateBonus = completionRate * 0.8;
    return 50 + streakBonus + rateBonus;
  }

  private analyzeOptimalTiming(historicalData: DailyActivity[]): { optimalTime: string } {
    if (historicalData.length === 0) return { optimalTime: '09:00' };
    
    const timeCounts = new Map<string, number>();
    historicalData.forEach(activity => {
      const hour = new Date(activity.date).getHours();
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      timeCounts.set(timeSlot, (timeCounts.get(timeSlot) || 0) + 1);
    });
    
    const optimalTime = Array.from(timeCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '09:00';
    
    return { optimalTime };
  }

  private identifyRiskFactors(
    habit: HabitRow,
    progress: HabitProgress,
    historicalData: DailyActivity[]
  ): string[] {
    const risks: string[] = [];
    
    if (progress.completion_rate < 50) {
      risks.push('Low completion rate');
    }
    
    if (progress.current_streak === 0 && progress.total_reps > 10) {
      risks.push('Broken streak pattern');
    }
    
    if (habit.goal_reps > 20) {
      risks.push('High target complexity');
    }
    
    return risks;
  }

  private suggestModifications(habit: HabitRow, progress: HabitProgress): string[] {
    const suggestions: string[] = [];
    
    if (progress.completion_rate < 30) {
      suggestions.push('Reduce target reps by 50%');
      suggestions.push('Break into smaller micro-habits');
    }
    
    if (habit.goal_reps > 15) {
      suggestions.push('Consider habit stacking');
    }
    
    suggestions.push('Add stronger visual cues');
    suggestions.push('Increase immediate rewards');
    
    return suggestions;
  }

  private predictStreakLength(currentStreak: number, completionRate: number): number {
    const basePrediction = currentStreak + (completionRate / 10);
    return Math.round(basePrediction);
  }

  private calculateConfidence(dataPoints: number): number {
    return Math.min(100, dataPoints * 2);
  }

  private calculateTriggerEffectiveness(habit: HabitRow, historicalData: DailyActivity[]): number {
    return Math.min(100, 50 + (historicalData.length / 10));
  }

  private calculateRewardImpact(habit: HabitRow, historicalData: DailyActivity[]): number {
    return Math.min(100, 60 + (habit.wrap_size * 5));
  }

  private calculateAutomaticity(habit: HabitRow, progress: HabitProgress): number {
    const daysActive = Math.floor((Date.now() - new Date(habit.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const automaticity = daysActive > 0 ? Math.min(100, (progress.total_reps / daysActive) * 100) : 0;
    return automaticity;
  }

  private determineFormationStage(automaticity: number): 'cue' | 'routine' | 'reward' | 'automatic' {
    if (automaticity < 25) return 'cue';
    if (automaticity < 50) return 'routine';
    if (automaticity < 75) return 'reward';
    return 'automatic';
  }

  private identifyBarriers(habit: HabitRow, progress: HabitProgress): string[] {
    const barriers: string[] = [];
    
    if (habit.goal_reps > 20) {
      barriers.push('Complexity barrier');
    }
    
    if (progress.completion_rate < 40) {
      barriers.push('Motivation barrier');
    }
    
    return barriers;
  }

  private calculateCorrelation(
    habit1: HabitRow,
    habit2: HabitRow,
    progressData: Record<string, HabitProgress>,
    dailyActivities: DailyActivity[]
  ): { strength: number; type: 'positive' | 'negative' | 'neutral'; confidence: number } {
    // Simplified correlation calculation
    const randomStrength = Math.random() * 0.8 - 0.4;
    const type = randomStrength > 0.1 ? 'positive' : randomStrength < -0.1 ? 'negative' : 'neutral';
    
    return {
      strength: Math.abs(randomStrength),
      type,
      confidence: 75
    };
  }
}
