import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export interface SolvedProblemRecord {
  id: string;
  problemText: string;
  answer: number;
  isCorrect: boolean;
  timeTakenSeconds?: number;
  pointsEarned?: number;
}

interface RecentProblemStreamProps {
  recentProblems: SolvedProblemRecord[];
}

export const RecentProblemStream: React.FC<RecentProblemStreamProps> = ({ recentProblems }) => {
  if (!recentProblems || recentProblems.length === 0) {
    return null;
  }

  // Display at most the last 3 items, newest at the bottom
  const visible = recentProblems.slice(-3);

  return (
    <div
      data-testid="recent-problem-stream"
      className="w-full max-w-md stream-mask flex flex-col items-center gap-1.5 py-1 select-none pointer-events-none"
    >
      {visible.map((item, index) => {
        // Oldest item is faded; newest is crisp
        const opacityClass =
          index === visible.length - 1
            ? 'opacity-90 font-semibold text-base sm:text-lg'
            : index === visible.length - 2
            ? 'opacity-60 text-sm sm:text-base'
            : 'opacity-30 text-xs sm:text-sm';

        return (
          <div
            key={item.id}
            className={`stream-item flex items-center gap-2.5 font-mono transition-all duration-300 ${
              item.isCorrect ? 'text-[#073642]' : 'text-[#cb4b16]'
            } ${opacityClass}`}
          >
            {item.isCorrect ? (
              <CheckCircle className="w-4 h-4 text-[#2aa198] shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-[#cb4b16] shrink-0" />
            )}
            <span>
              {item.problemText} = {item.answer}
            </span>
            {item.pointsEarned !== undefined && (
              <span className="text-xs font-sans font-medium text-[#2aa198]">
                +{item.pointsEarned}
              </span>
            )}
            {item.timeTakenSeconds !== undefined && (
              <span className="text-xs text-[#93a1a1]">
                {item.timeTakenSeconds.toFixed(1)}s
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
