import React, { useState } from 'react';
import { HabitRow, HabitProgress } from '../../types/habit';
import styles from '../../styles/Dashboard.module.css';

interface HabitCardProps {
  habit: HabitRow;
  progress?: HabitProgress;
  onUpdate: (id: string, updates: Partial<HabitRow>) => void;
  onDelete: (id: string) => void;
  onComplete: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  progress, 
  onUpdate, 
  onDelete, 
  onComplete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);

  const handleSave = () => {
    onUpdate(habit.id, { name: editName });
    setIsEditing(false);
  };

  const isCompletedToday = progress?.last_rep_date === new Date().toISOString().split('T')[0];

  return (
    <div className={styles.habitCard}>
      <div className={styles.habitContent}>
        {isEditing ? (
          <input 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            className={styles.editInput}
          />
        ) : (
          <h3>{habit.name}</h3>
        )}
        
        <div className={styles.habitDetails}>
          <span>Goal: {habit.goal_reps} reps</span>
          <span>Wrap size: {habit.wrap_size}</span>
        </div>
        
        {progress && (
          <div className={styles.habitStats}>
            <span>Streak: {progress.current_streak} days</span>
            <span>Total: {progress.total_reps} reps</span>
            <span>Completion: {Math.round(progress.completion_rate * 100)}%</span>
          </div>
        )}
        
        <div className={styles.habitActions}>
          <button 
            onClick={() => onComplete(habit.id)}
            className={`${styles.completeBtn} ${isCompletedToday ? styles.completed : ''}`}
          >
            {isCompletedToday ? '✓' : 'Complete'}
          </button>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={styles.editBtn}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          
          <button 
            onClick={() => onDelete(habit.id)} 
            className={styles.deleteBtn}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
