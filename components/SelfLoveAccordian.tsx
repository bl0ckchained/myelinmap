import React, { useState } from 'react';

const selfLoveContent = [
  { title: "Forgive Yourself", description: "Acknowledge past behaviors as an outgrowth of illness, not a moral failing. Focus on staying well and moving forward without dwelling on past mistakes." },
  { title: "Develop Self-Compassion", description: "Practice treating oneself as a best friend—with gentler language and objective self-assessment. Challenge negative self-talk by asking how one would advise a loved one in the same situation." },
  { title: "Set Humble Goals", description: "Begin with achievable, narrow recovery goals (e.g., one day sober). Break larger goals into small, manageable action steps to build a sense of accomplishment and positive momentum." },
  { title: "Engage in Daily Reflection/Introspection", description: "Prioritize activities like meditating, taking walks, journaling, or writing daily gratitude lists. These practices focus thoughts, foster positive self-regard, process emotions, and help identify and replace negative self-talk." },
  { title: "Embrace Self-Care", description: "Prioritize physical health (healthy eating, regular exercise, adequate sleep) and mental well-being (engaging in enjoyable activities, relaxation). Self-care can include simple pleasures like sharing meals with friends or engaging in creative arts." },
  { title: "Be Mindful of Thoughts and Emotions", description: "Practice mindfulness to pay attention to the present moment without judgment, observing thoughts and feelings with kindness and understanding." },
  { title: "Focus on Strengths", description: "Consciously shift focus from past mistakes and shortcomings to current achievements and inherent strengths." },
  { title: "Practice Gratitude", description: "Regularly identify and appreciate the positive aspects of one's life, fostering a more positive mindset and self-compassionate outlook." },
  { title: "Connect with Others", description: "Actively combat isolation by connecting with supportive individuals through group therapy, discussions with a therapist or counselor, or spending time with friends and family." },
  { title: "Spend Time in Nature", description: "Engage with natural environments (e.g., walking in the woods, watching a sunset) to promote a sense of connection, calmness, and self-compassion during recovery." },
];

export default function SelfLoveAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-4 text-left font-bold text-white transition-colors duration-200 hover:bg-gray-700 rounded-xl"
      >
        <span>Actionable Self-Love & Self-Compassion Practices</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 p-6' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        <div className="space-y-4">
          {selfLoveContent.map((item, index) => (
            <div key={index}>
              <h3 className="font-semibold text-emerald-300">{item.title}</h3>
              <p className="text-gray-300 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
