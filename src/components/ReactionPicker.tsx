import React from 'react';

const REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

interface ReactionPickerProps {
  onSelect: (reaction: string) => void;
  onClose: () => void;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect, onClose }) => {
  return (
    <div className="absolute -top-12 left-0 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-full p-2 flex gap-2 z-50 animate-in fade-in zoom-in duration-200">
      {REACTIONS.map(emoji => (
        <button
          key={emoji}
          onClick={() => { onSelect(emoji); onClose(); }}
          className="text-2xl hover:scale-125 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
