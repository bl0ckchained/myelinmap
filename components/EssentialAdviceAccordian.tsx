import React from "react";
import { Accordion } from "@/components/ui/accordion";

export default function EssentialAdviceAccordion() {
  const items = [
    {
      title: "Seeking and Accepting Help",
      description:
        "Open and honest communication with loved ones is vital. Asking for support isn't weakness; it's wisdom. Avoid lectures and threats — these increase shame and isolation. Recovery is a team effort."
    },
    {
      title: "Developing a Personalized Recovery Plan",
      description:
        "Set realistic goals like a start date or daily habits. Write down your reasons for change. Reflect on past attempts and use what worked. Recovery is personal — your plan should be too."
    },
    {
      title: "Practicing Self-Care and Healthy Habits",
      description:
        "Eat well. Move your body. Sleep. Replace old habits with new joys like music, volunteering, or walks. Self-care is not selfish — it's foundational."
    },
    {
      title: "Managing Triggers and Cravings",
      description:
        "Know your triggers and have a plan. Use tools like Urge Surfing, deep breathing, or the DENTS method. Keep a craving journal to spot patterns and track wins."
    },
    {
      title: "Building a Strong Support System",
      description:
        "Lean on friends and family. Attend meetings like SMART or 12-step groups. Build a sober circle that lifts you up. Connection is protection."
    },
    {
      title: "Coping with Stress",
      description:
        "Stress is part of life — but so is healing. Use exercise, meditation, journaling, pets, and nature to process and recharge. Create joy on purpose."
    },
    {
      title: "Navigating Relapse",
      description:
        "Relapse isn’t failure — it’s feedback. Learn from it. Use it. Then recommit. The path is never perfect, but your progress is real."
    }
  ];

  return (
    <div className="space-y-2">
      <Accordion type="single" collapsible>
        {items.map((item, index) => (
          <Accordion.Item key={index} value={`item-${index}`}>
            <Accordion.Trigger className="text-lg font-semibold text-amber-400 hover:text-amber-300">
              {item.title}
            </Accordion.Trigger>
            <Accordion.Content className="text-gray-200 text-md pt-1">
              {item.description}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
