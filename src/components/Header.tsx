
import { useState, useEffect } from 'react';

const titles = [
  "Another Day, Another Delusion", 
  "Your Resume vs. Reality",
  "Career Expectations: Shattered",
  "Prepare for Emotional Damage",
  "Let's Critique Those Qualifications",
  "Corporate Fiction at Its Finest",
  "When AI Reads Your Life Choices",
  "Resume Humbling Service",
  "That's a Lot of Buzzwords"
];

export function Header() {
  const [title, setTitle] = useState(titles[0]);
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * titles.length);
    setTitle(titles[randomIndex]);
  }, []);
  
  return (
    <header className="w-full text-center py-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">RoastMyResume</h1>
      <p className="text-xl md:text-2xl text-purple-300 italic">{title}</p>
    </header>
  );
}
