import React, { useEffect, useRef } from 'react';
import { HabitRow, HabitProgress } from '../../types/habit';
import styles from '../../styles/Dashboard.module.css';

interface NeuralPathwayVizProps {
  habits: HabitRow[];
  progressData: Record<string, HabitProgress>;
  selectedHabit?: string;
}

export const NeuralPathwayViz: React.FC<NeuralPathwayVizProps> = ({
  habits,
  progressData,
  selectedHabit
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up visualization parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 50;

    // Draw neural pathways
    habits.forEach((habit, index) => {
      const progress = progressData[habit.id];
      if (!progress) return;

      const angle = (index / habits.length) * 2 * Math.PI;
      const strength = (progress.completion_rate / 100) * (progress.current_streak / 30);
      const radius = maxRadius * strength;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Draw pathway
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      
      // Color based on strength
      const intensity = Math.floor(strength * 255);
      ctx.strokeStyle = `rgb(${255 - intensity}, ${intensity}, 100)`;
      ctx.lineWidth = 2 + strength * 4;
      ctx.stroke();

      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, 8 + strength * 12, 0, 2 * Math.PI);
      ctx.fillStyle = selectedHabit === habit.id ? '#ff6b6b' : '#4ecdc4';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(habit.name, x, y - 20);
    });

    // Draw center node (brain)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#6c5ce7';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [habits, progressData, selectedHabit]);

  return (
    <div className={styles.neuralVizContainer}>
      <h3>Neural Pathway Visualization</h3>
      <p className={styles.vizDescription}>
        Each line represents a habit&apos;s neural pathway strength. 
        Thicker, greener lines indicate stronger myelin development.
      </p>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className={styles.neuralCanvas}
      />
      <div className={styles.vizLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.strongPathway}`}></div>
          <span>Strong Pathway</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.weakPathway}`}></div>
          <span>Developing Pathway</span>
        </div>
      </div>
    </div>
  );
};
