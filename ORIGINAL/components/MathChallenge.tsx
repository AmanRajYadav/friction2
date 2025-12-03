import React, { useState, useEffect, useRef } from 'react';
import { MathProblem } from '../types';

interface MathChallengeProps {
  onSolved: () => void;
}

export const MathChallenge: React.FC<MathChallengeProps> = ({ onSolved }) => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate 3 digit multiplication (100-999)
    const n1 = Math.floor(Math.random() * 900) + 100;
    const n2 = Math.floor(Math.random() * 900) + 100;
    setProblem({
      num1: n1,
      num2: n2,
      answer: n1 * n2
    });
    setInput('');
    setError(false);
    // Focus input on mount
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [onSolved]); // Re-run when onSolved changes (effectively when parent advances step) but actually we want it when this component mounts for a new step.
  // Ideally parent mounts a new instance or we key it. We'll handle this by keying the component in the parent.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem) return;

    if (parseInt(input.trim(), 10) === problem.answer) {
      onSolved();
    } else {
      setError(true);
      setInput('');
      // Shake animation trigger
      setTimeout(() => setError(false), 500);
    }
  };

  if (!problem) return <div className="text-stone-500">Generating problem...</div>;

  return (
    <div className="mt-8 w-full max-w-md animate-fade-in">
      <div className="bg-stone-800 p-6 rounded-lg border border-stone-700 shadow-xl">
        <p className="text-stone-400 text-sm mb-4 uppercase tracking-widest font-bold text-center">
          Payment Required
        </p>
        <div className="flex justify-center items-center gap-4 text-2xl font-mono mb-6 text-stone-200">
          <span>{problem.num1}</span>
          <span className="text-stone-500">×</span>
          <span>{problem.num2}</span>
          <span className="text-stone-500">=</span>
          <span className="text-stone-500">?</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={inputRef}
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Result"
            className={`bg-stone-900 border ${
              error ? 'border-red-500 animate-shake' : 'border-stone-600 focus:border-white'
            } text-center text-white text-xl p-3 rounded outline-none transition-colors font-mono`}
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-stone-100 hover:bg-white text-black font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm"
          >
            Verify
          </button>
        </form>
        <p className="text-xs text-stone-500 mt-4 text-center">
          Do the math. Don't cheat yourself.
        </p>
      </div>
    </div>
  );
};