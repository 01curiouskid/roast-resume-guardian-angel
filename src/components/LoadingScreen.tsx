
import { useState, useEffect } from 'react';

const loadingMessages = [
  "Consulting HR for insults...",
  "Deciphering font choices...",
  "Judging your career decisions...",
  "Analyzing LinkedIn buzzword density...",
  "Counting how many times you wrote 'detail-oriented'...",
  "Calculating overconfidence ratio...",
  "Brewing fresh corporate sarcasm...",
  "Finding creative ways to question your skills...",
  "Preparing to hurt your feelings professionally...",
  "Scanning for embellishments..."
];

export function LoadingScreen() {
  const [message, setMessage] = useState(loadingMessages[0]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setMessage(loadingMessages[randomIndex]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute top-0 w-16 h-16 rounded-full border-4 border-purple-300 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-xl text-white text-center italic">{message}</p>
    </div>
  );
}
