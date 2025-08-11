import React from 'react';
import { HabitRow } from '@/types/habit';

interface HabitAnalyticsProps {
  habits: HabitRow[];
  habitRepCount: number;
  streak: number;
  dailyCounts: number[];
}

export default function HabitAnalytics({ habits, habitRepCount, streak, dailyCounts }: HabitAnalyticsProps) {
  const activeHabit = habits[0]; // For now, use first habit
  
  // Calculate completion rate
  const completionRate = activeHabit ? Math.round((habitRepCount / activeHabit.goal_reps) * 100) : 0;
  
  // Calculate habit strength (based on streak and consistency)
  const habitStrength = Math.min(100, streak * 5 + completionRate);
  
  // Weekly progress data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Habit Analytics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Completion Rate Card */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Completion Rate</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{completionRate}%</div>
          <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
            {habitRepCount} / {activeHabit?.goal_reps || 0} reps
          </div>
        </div>

        {/* Habit Strength Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Habit Strength</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{habitStrength}%</div>
          <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
            Based on streak & consistency
          </div>
        </div>

        {/* Streak Card */}
        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Current Streak</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{streak}</div>
          <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
            {streak === 1 ? 'day' : 'days'} in a row
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Weekly Progress</h3>
        <div style={{ display: 'flex', alignItems: 'end', height: '100px', gap: '10px' }}>
          {dailyCounts.map((count, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1
            }}>
              <div style={{
                width: '100%',
                background: count > 0 ? '#10b981' : '#e5e7eb',
                height: `${Math.max(10, count * 40)}px`,
                borderRadius: '4px 4px 0 0',
                minHeight: '10px'
              }} />
              <div style={{ fontSize: '0.8em', marginTop: '5px', color: '#6b7280' }}>
                {weekDays[index]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Timeline */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Progress Timeline</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#10b981'
          }} />
          <span>Started habit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#fbbf24'
          }} />
          <span>First week completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ef4444'
          }} />
          <span>Current progress</span>
        </div>
      </div>
    </div>
  );
}
