import React, { useState } from 'react';
import { Link2, Check } from 'lucide-react';

export const CopyLinkButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
      title="Copy app link"
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : (
        <Link2 className="w-4 h-4" />
      )}
    </button>
  );
};
