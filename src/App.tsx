import React from 'react';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
          <Sparkles className="w-4 h-4" />
          <span>3-Minute Challenge</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">FlashMath</h1>
        <p className="mt-2 text-slate-400">Master multiplication tables 2 through 12</p>
      </header>
    </div>
  );
};

export default App;
