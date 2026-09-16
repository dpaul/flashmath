import React, { useEffect } from 'react';

interface ClearHistoryModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearHistoryModal: React.FC<ClearHistoryModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zen-base03/60 animate-fadeIn"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-history-title"
        className="bg-white tactile-card border border-[#ede5d0] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-zen-red mb-4">
          <div className="w-10 h-10 rounded-full bg-zen-red/10 border border-zen-red/20 flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-zen-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 id="clear-history-title" className="text-xl font-bold text-zen-base03">
            Clear sprint history?
          </h2>
        </div>

        <p className="text-sm text-zen-base00 mb-6 leading-relaxed">
          Are you sure you want to clear your sprint history? This cannot be undone and will
          permanently remove all past score trends and performance records.
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#ede5d0] bg-white hover:bg-zen-base2 text-zen-base02 font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zen-base1 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zen-red hover:bg-[#b02222] text-white font-semibold text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-zen-red cursor-pointer"
          >
            Clear All History
          </button>
        </div>
      </div>
    </div>
  );
};
