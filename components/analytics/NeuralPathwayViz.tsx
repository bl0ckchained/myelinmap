// components/analytics/NeuralPathwayViz.tsx
import React, { useEffect, useRef } from "react";
import { HabitRow, HabitProgress } from "../../types/habit";
import styles from "../../styles/Dashboard.module.css";

interface NeuralPathwayVizProps {
  habits: HabitRow[];
  progressData: Record<string, HabitProgress>;
  selectedHabit?: string;
}

export const NeuralPathwayViz: React.FC<NeuralPathwayVizProps> = ({
  habits,
  progressData,
  selectedHabit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ASPECT = 600 / 400; // keep original feel (w:h = 3:2)

    const draw = () => {
      // Size canvas to wrapper width, maintain aspect, and scale for device pixel ratio
      const rect = wrapper.getBoundingClientRect();
      const cssWidth = Math.max(300, Math.floor(rect.width)); // min width for readability
      const cssHeight = Math.floor(cssWidth / ASPECT);
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);

      ctx.resetTransform();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Clear
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // If no habits, show a gentle placeholder
      if (!Array.isArray(habits) || habits.length === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "14px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Add a habit to see neural pathways grow 🌱", cssWidth / 2, cssHeight / 2);
        return;
      }

      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;
      const maxRadius = Math.min(centerX, centerY) - 32;

      // Draw center "brain" node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
      const brainGrad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, 18);
      brainGrad.addColorStop(0, "rgba(108,92,231,0.9)");
      brainGrad.addColorStop(1, "rgba(108,92,231,0.4)");
      ctx.fillStyle = brainGrad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.stroke();

      // Draw each habit "axon"
      habits.forEach((habit, index) => {
        const progress = progressData[habit.id];
        const completion = progress?.completion_rate ?? 0; // 0..100
        const streak = progress?.current_streak ?? 0;      // days
        const normCompletion = Math.max(0, Math.min(1, completion / 100));
        const normStreak = Math.max(0, Math.min(1, streak / 30));
        const strength = Math.max(0, Math.min(1, normCompletion * (0.6 + 0.4 * normStreak))); // weighted

        // Angle fan
        const angle = (index / habits.length) * Math.PI * 2;

        const radius = maxRadius * (0.2 + 0.8 * strength); // avoid tiny lines at center
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Dim others if a habit is selected
        const isSelected = selectedHabit === habit.id;
        const alpha = selectedHabit ? (isSelected ? 1 : 0.35) : 1;

        // Line color: greener when stronger
        const intensity = Math.floor(strength * 255);
        const stroke = `rgba(${255 - intensity}, ${Math.min(255, 140 + intensity / 2)}, 120, ${alpha})`;

        // Axon / pathway
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.lineWidth = 1.5 + strength * 4.5;
        ctx.strokeStyle = stroke;
        ctx.shadowColor = `rgba(0,255,170,${0.25 * strength})`;
        ctx.shadowBlur = 8 * strength;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Node at the end
        const nodeR = 6 + strength * 10;
        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? `rgba(255,107,107,${alpha})` : `rgba(78,205,196,${alpha})`;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(255,255,255,${0.9 * alpha})`;
        ctx.stroke();

        // Highlight ring when selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(x, y, nodeR + 5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,107,107,0.5)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Label (with subtle shadow for contrast)
        ctx.font = "12px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = `rgba(229,231,235,${alpha})`; // tailwind-ish zinc-200
        ctx.strokeStyle = "rgba(0,0,0,0.45)";
        ctx.lineWidth = 3;
        const labelX = centerX + Math.cos(angle) * (radius + nodeR + 8);
        const labelY = centerY + Math.sin(angle) * (radius + nodeR + 8);
        // shadow via stroke text
        ctx.strokeText(habit.name, labelX, labelY);
        ctx.fillText(habit.name, labelX, labelY);
      });
    };

    // Initial draw
    draw();

    // Redraw on resize
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => draw());
      ro.observe(wrapper);
    } else {
      // Fallback
      const onResize = () => draw();
      window.addEventListener("resize", onResize);
      // eslint-disable-next-line consistent-return
      return () => window.removeEventListener("resize", onResize);
    }

    // Cleanup
    return () => {
      if (ro) ro.disconnect();
    };
  }, [habits, progressData, selectedHabit]);

  return (
    <div className={styles.neuralVizContainer}>
      <h3>Neural Pathway Visualization</h3>
      <p className={styles.vizDescription}>
        Each line represents a habit’s pathway strength. Thicker, greener lines indicate stronger myelin development.
      </p>

      {/* Wrapper is what we observe for responsive sizing */}
      <div ref={wrapperRef}>
        <canvas ref={canvasRef} className={styles.neuralCanvas} />
      </div>

      <div className={styles.vizLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.strongPathway}`} />
          <span>Strong Pathway</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.weakPathway}`} />
          <span>Developing Pathway</span>
        </div>
      </div>
    </div>
  );
};
