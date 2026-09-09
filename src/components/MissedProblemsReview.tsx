import React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import { MissedProblem } from '../engine/types';
import { formatProblem } from '../engine/math';

interface MissedProblemsReviewProps {
  missedProblems: MissedProblem[];
}

export const MissedProblemsReview: React.FC<MissedProblemsReviewProps> = ({ missedProblems }) => {
  if (missedProblems.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-left">
      <div className="flex items-center gap-2 mb-4 text-rose-400 font-bold text-base">
        <AlertCircle className="w-5 h-5" />
        <span>Missed Problems ({missedProblems.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
        {missedProblems.map((item, idx) => (
          <div
            key={`${item.problem.id}-${idx}`}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800"
          >
            <span className="font-mono font-bold text-lg text-white">
              {formatProblem(item.problem)}
            </span>

            <div className="flex items-center gap-3 text-sm font-mono">
              <span className="inline-flex items-center gap-1 text-rose-400 line-through">
                <X className="w-3.5 h-3.5" />
                {item.submittedAnswer || '—'}
              </span>

              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                <Check className="w-3.5 h-3.5" />
                {item.correctAnswer}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
