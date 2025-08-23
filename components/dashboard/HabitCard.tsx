import React, { useState } from "react";
import { HabitRow, HabitProgress } from "../../types/habit";
import styles from "../../styles/Dashboard.module.css";

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
  onComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);

  const today = new Date().toISOString().slice(0, 10);
  const lastRepDate = progress?.last_rep_date?.slice(0, 10);
  const isCompletedToday = Boolean(lastRepDate && lastRepDate === today);

  const handleSave = () => {
    const name = editName.trim();
    if (name && name !== habit.name) {
      onUpdate(habit.id, { name });
    }
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className={styles.habitCard}>
      <div className={styles.habitContent}>
        {isEditing ? (
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditName(habit.name);
                setIsEditing(false);
              }
            }}
            className={styles.editInput}
            aria-label="Edit habit name"
            autoFocus
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
            <span>Streak: {progress.current_streak ?? 0} days</span>
            <span>Total: {progress.total_reps ?? 0} reps</span>
            <span>
              Completion:{" "}
              {progress.completion_rate != null
                ? `${Math.round(progress.completion_rate)}%`
                : "—"}
            </span>
          </div>
        )}

        <div className={styles.habitActions}>
          <button
            type="button"
            onClick={() => onComplete(habit.id)}
            className={`${styles.completeBtn} ${
              isCompletedToday ? styles.completed : ""
            }`}
            title={isCompletedToday ? "Completed today" : "Mark a rep for today"}
          >
            {isCompletedToday ? "✓" : "Complete"}
          </button>

          <button
            type="button"
            onClick={handleEditToggle}
            className={styles.editBtn}
            title={isEditing ? "Save name" : "Edit name"}
          >
            {isEditing ? "Save" : "Edit"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(habit.id)}
            className={styles.deleteBtn}
            title="Delete habit"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
