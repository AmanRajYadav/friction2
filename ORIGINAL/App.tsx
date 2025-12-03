import React, { useState, useEffect } from 'react';
import { fetchHarshQuotes } from './services/geminiService';
import { Quote, AppState } from './types';
import { MathChallenge } from './components/MathChallenge';

const USER_QUOTES: Quote[] = [
  { text: "If your actions are not in the right direction, how can your life go in the right direction?" },
  { text: "Remember the marshmallow test, You are going to be the one who ate the first marshmallow." },
  { text: "Your mom didn't work that hard so you can waste your life like this." }
];

const TARGET_SECRET = "#2@1A76tgq23";
const TOTAL_STEPS = 10;

export default function App() {
  const [state, setState] = useState<AppState>(AppState.INTRO);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize Quotes
  useEffect(() => {
    if (state === AppState.LOADING) {
      const loadQuotes = async () => {
        // We have 3 user quotes. We need 7 more.
        const needed = TOTAL_STEPS - USER_QUOTES.length;
        const generated = await fetchHarshQuotes(needed);
        
        // Combine them. Let's intersperse them or put user quotes first/last/middle.
        // Strategy: User Quote 1 -> Gen -> Gen -> User Quote 2 -> Gen -> Gen -> User Quote 3 -> Gen...
        // Simple strategy for maximum impact: User quotes at 0, 4, 9.
        
        const combined = [...generated];
        combined.splice(0, 0, USER_QUOTES[0]); // First
        combined.splice(4, 0, USER_QUOTES[1]); // Middle-ish
        combined.splice(9, 0, USER_QUOTES[2]); // Last challenge

        setQuotes(combined.slice(0, TOTAL_STEPS));
        setState(AppState.CHALLENGE);
      };
      loadQuotes();
    }
  }, [state]);

  const handleStart = () => {
    setState(AppState.LOADING);
  };

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setState(AppState.REVEAL);
    }
  };

  const renderContent = () => {
    switch (state) {
      case AppState.INTRO:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-2xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 tracking-tighter text-white">
              STOP.
            </h1>
            <p className="text-xl text-stone-400 mb-12 leading-relaxed">
              You are about to access something you tried to hide from yourself.
              <br /><br />
              Are you sure you want to trade your focus, your dopamine, and your time for a momentary scroll?
            </p>
            <button
              onClick={handleStart}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-red-900 font-mono rounded-none hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900 ring-offset-stone-900"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative">I AM WEAK, PROCEED</span>
            </button>
            <p className="mt-6 text-xs text-stone-600 uppercase tracking-widest">
              High Friction Vault v1.0
            </p>
          </div>
        );

      case AppState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
            <div className="w-16 h-1 bg-stone-800 overflow-hidden mb-4">
               <div className="w-full h-full bg-stone-500 animate-[pulse_1s_ease-in-out_infinite]"></div>
            </div>
            <p className="text-stone-500 font-mono text-sm">Preparing Reality Check...</p>
          </div>
        );

      case AppState.CHALLENGE:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-3xl mx-auto w-full">
            <div className="w-full flex justify-between items-center mb-12 text-stone-600 font-mono text-xs uppercase tracking-widest border-b border-stone-800 pb-4">
              <span>Friction Protocol</span>
              <span>Step {currentStep + 1} / {TOTAL_STEPS}</span>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center w-full mb-12">
               {/* Quote Section */}
              <div key={`quote-${currentStep}`} className="animate-fade-in text-center mb-12">
                <h2 className="text-2xl md:text-4xl font-serif text-stone-200 leading-tight mb-6">
                  "{quotes[currentStep]?.text}"
                </h2>
                <div className="h-1 w-24 bg-red-900 mx-auto opacity-50"></div>
              </div>

              {/* Math Section - Key forces remount/reset on step change */}
              <MathChallenge key={`math-${currentStep}`} onSolved={handleNextStep} />
            </div>
          </div>
        );

      case AppState.REVEAL:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in text-center">
            <h1 className="text-6xl font-serif text-white mb-6">UnLocked.</h1>
            <p className="text-stone-400 mb-8 max-w-md">
              You fought through the friction. If you still want it, here it is. 
              But ask yourself one last time: Is it worth it?
            </p>
            
            <div className="bg-stone-800 p-8 rounded border border-stone-600 mb-12 relative overflow-hidden group">
               <p className="text-sm text-stone-500 uppercase tracking-widest mb-2 text-center">Instagram Password</p>
               <div className="text-4xl font-mono text-white select-all bg-black/30 p-4 rounded text-center tracking-widest">
                 {TARGET_SECRET}
               </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="text-stone-500 hover:text-white transition-colors underline decoration-stone-700 underline-offset-4"
            >
              Lock Vault & Reset
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-red-900 selection:text-white">
      {renderContent()}
    </div>
  );
}