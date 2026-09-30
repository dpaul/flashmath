import React, { useMemo } from 'react';
import { computeSpellingDiff, AlignedChar, DiffErrorItem } from '../engine/spellingDiff';
import { ArrowRight, AlertCircle, PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';

export interface SpellingDiffViewProps {
  userInput: string;
  targetWord: string;
}

export const SpellingDiffView: React.FC<SpellingDiffViewProps> = ({
  userInput,
  targetWord,
}) => {
  const diffResult = useMemo(
    () => computeSpellingDiff(userInput, targetWord),
    [userInput, targetWord]
  );

  const { aligned, summary, errors } = diffResult;

  const renderUserTile = (charInfo: AlignedChar, idx: number) => {
    switch (charInfo.type) {
      case 'match':
        return (
          <div
            key={`user-${idx}`}
            title={`'${charInfo.userChar}': correct`}
            className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-[#eee8d5]/80 dark:bg-[#181b1e] border border-[#e4d9c7] dark:border-[#353c43] flex items-center justify-center font-mono font-bold text-lg sm:text-xl text-[#073642] dark:text-[#eceff1]"
          >
            {charInfo.userChar}
          </div>
        );

      case 'substitute':
        return (
          <div
            key={`user-${idx}`}
            title={`'${charInfo.userChar}': wrong letter (should be '${charInfo.targetChar}')`}
            className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-[#cb4b16]/15 dark:bg-[#eb937d]/20 border-2 border-[#cb4b16] dark:border-[#eb937d] text-[#cb4b16] dark:text-[#eb937d] flex items-center justify-center font-mono font-black text-lg sm:text-xl relative shadow-xs"
          >
            {charInfo.userChar}
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#cb4b16] dark:bg-[#eb937d] text-white dark:text-[#181b1e] text-[9px] flex items-center justify-center font-bold">
              ×
            </span>
          </div>
        );

      case 'insert':
        return (
          <div
            key={`user-${idx}`}
            title={`'${charInfo.userChar}': extra added letter`}
            className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-[#b58900]/15 dark:bg-[#eed082]/20 border-2 border-dashed border-[#b58900] dark:border-[#eed082] text-[#b58900] dark:text-[#eed082] flex items-center justify-center font-mono font-black text-lg sm:text-xl line-through relative shadow-xs"
          >
            {charInfo.userChar}
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#b58900] dark:bg-[#eed082] text-white dark:text-[#181b1e] text-[9px] flex items-center justify-center font-bold">
              +
            </span>
          </div>
        );

      case 'delete':
        return (
          <div
            key={`user-${idx}`}
            title={`Missing letter (should be '${charInfo.targetChar}')`}
            className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-[#cb4b16]/5 dark:bg-[#eb937d]/10 border-2 border-dashed border-[#cb4b16]/40 dark:border-[#eb937d]/40 flex items-center justify-center text-[#cb4b16]/60 dark:text-[#eb937d]/60 font-mono text-base font-bold"
          >
            ‸
          </div>
        );
    }
  };

  const renderTargetTile = (charInfo: AlignedChar, idx: number) => {
    switch (charInfo.type) {
      case 'match':
        return (
          <div
            key={`target-${idx}`}
            className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-[#2aa198]/10 dark:bg-[#7ec7b8]/15 border border-[#2aa198]/30 dark:border-[#7ec7b8]/30 flex items-center justify-center font-mono font-bold text-lg sm:text-xl text-[#2aa198] dark:text-[#7ec7b8]"
          >
            {charInfo.targetChar}
          </div>
        );

      case 'substitute':
        return (
          <div
            key={`target-${idx}`}
            title={`Correct letter '${charInfo.targetChar}'`}
            className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-[#2aa198]/25 dark:bg-[#7ec7b8]/25 border-2 border-[#2aa198] dark:border-[#7ec7b8] text-[#2aa198] dark:text-[#7ec7b8] flex items-center justify-center font-mono font-black text-lg sm:text-xl shadow-xs ring-2 ring-[#2aa198]/20 dark:ring-[#7ec7b8]/25"
          >
            {charInfo.targetChar}
          </div>
        );

      case 'insert':
        return (
          <div
            key={`target-${idx}`}
            className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-transparent border border-dashed border-[#93a1a1]/30 dark:border-[#718093]/30 flex items-center justify-center text-[#93a1a1]/50 dark:text-[#718093]/50 font-mono text-sm"
          >
            -
          </div>
        );

      case 'delete':
        return (
          <div
            key={`target-${idx}`}
            title={`Missing letter: '${charInfo.targetChar}'`}
            className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-[#2aa198]/25 dark:bg-[#7ec7b8]/25 border-2 border-dashed border-[#2aa198] dark:border-[#7ec7b8] text-[#2aa198] dark:text-[#7ec7b8] flex items-center justify-center font-mono font-black text-lg sm:text-xl shadow-xs"
          >
            {charInfo.targetChar}
          </div>
        );
    }
  };

  const renderErrorIcon = (type: DiffErrorItem['type']) => {
    switch (type) {
      case 'transformed':
        return <RefreshCw className="w-3.5 h-3.5 text-[#cb4b16] dark:text-[#eb937d]" />;
      case 'added':
        return <PlusCircle className="w-3.5 h-3.5 text-[#b58900] dark:text-[#eed082]" />;
      case 'removed':
        return <MinusCircle className="w-3.5 h-3.5 text-[#2aa198] dark:text-[#7ec7b8]" />;
    }
  };

  return (
    <div
      role="region"
      aria-label={`Spelling comparison for ${targetWord}`}
      className="w-full max-w-lg mx-auto flex flex-col items-center gap-4 p-4 sm:p-5 rounded-2xl bg-[#eee8d5]/40 dark:bg-[#181b1e]/90 border border-[#cb4b16]/25 dark:border-[#eb937d]/30 shadow-sm"
    >
      {/* Target Word Callout */}
      <div className="w-full flex flex-col items-center">
        <span className="text-xs uppercase font-bold tracking-wider text-[#cb4b16] dark:text-[#eb937d] mb-1">
          Correct Spelling:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-full overflow-x-auto py-1">
          {aligned.map((charInfo, idx) => renderTargetTile(charInfo, idx))}
        </div>
        <span className="text-xl sm:text-2xl font-mono font-bold text-[#073642] dark:text-[#eceff1] tracking-wider mt-1">
          {targetWord}
        </span>
      </div>

      <div className="w-full border-t border-[rgba(7,54,66,0.08)] dark:border-[#353c43]" />

      {/* User typed row */}
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#586e75] dark:text-[#94a3b8] mb-1">
          <AlertCircle className="w-3.5 h-3.5 text-[#cb4b16] dark:text-[#eb937d]" />
          <span>You typed:</span>
        </div>
        {userInput.length === 0 ? (
          <span className="italic text-sm text-[#93a1a1] dark:text-[#718093] py-2">
            (No answer typed)
          </span>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-full overflow-x-auto py-1">
            {aligned.map((charInfo, idx) => renderUserTile(charInfo, idx))}
          </div>
        )}
      </div>

      {/* Error Breakdown Badges */}
      {errors.length > 0 && (
        <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-1">
          {errors.map((err, i) => (
            <span
              key={`err-${i}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#24292e] border border-[#e4d9c7] dark:border-[#353c43] text-[#073642] dark:text-[#eceff1] shadow-2xs"
            >
              {renderErrorIcon(err.type)}
              {err.type === 'transformed' && (
                <span>
                  Changed <span className="font-mono font-bold text-[#cb4b16] dark:text-[#eb937d]">&lsquo;{err.userChar}&rsquo;</span>
                  {' '}<ArrowRight className="inline w-3 h-3 text-[#586e75] dark:text-[#94a3b8]" />{' '}
                  <span className="font-mono font-bold text-[#2aa198] dark:text-[#7ec7b8]">&lsquo;{err.targetChar}&rsquo;</span>
                </span>
              )}
              {err.type === 'added' && (
                <span>
                  Extra letter <span className="font-mono font-bold text-[#b58900] dark:text-[#eed082]">&lsquo;{err.userChar}&rsquo;</span>
                </span>
              )}
              {err.type === 'removed' && (
                <span>
                  Missing letter <span className="font-mono font-bold text-[#2aa198] dark:text-[#7ec7b8]">&lsquo;{err.targetChar}&rsquo;</span>
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#93a1a1] dark:text-[#718093] pt-1">
        {summary.substitutions > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#cb4b16] dark:bg-[#eb937d]" />
            Transformed
          </span>
        )}
        {summary.insertions > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#b58900] dark:bg-[#eed082]" />
            Added
          </span>
        )}
        {summary.deletions > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2aa198] dark:bg-[#7ec7b8]" />
            Missing
          </span>
        )}
      </div>
    </div>
  );
};
