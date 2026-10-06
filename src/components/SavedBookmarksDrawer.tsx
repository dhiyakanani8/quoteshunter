import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, Trash2, ExternalLink, Copy, Sparkles } from 'lucide-react';
import { SheetMessage } from '../types';
import { formatDateString } from '../utils/formatters';

interface SavedBookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: SheetMessage[];
  onRemoveBookmark: (rowNumber: number) => void;
  onClearAll: () => void;
  onOpenImage: (url: string, author?: string, caption?: string) => void;
  onOpenPosterGenerator?: (msg: SheetMessage) => void;
}

export default function SavedBookmarksDrawer({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onClearAll,
  onOpenImage,
  onOpenPosterGenerator,
}: SavedBookmarksDrawerProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 z-10 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white font-display">
                Saved Bookmarks ({bookmarks.length})
              </h2>
            </div>

            <div className="flex items-center gap-1">
              {bookmarks.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Clear all saved bookmarks"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {bookmarks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Bookmark className="w-12 h-12 stroke-1 mb-2 opacity-40 text-amber-500" />
                <p className="font-medium text-sm text-slate-600 dark:text-slate-300">
                  No saved bookmarks yet
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Click the bookmark icon on any message card in the feed to save it to this collection.
                </p>
              </div>
            ) : (
              bookmarks.map((item) => (
                <div
                  key={item._rowNumber}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-slate-300 transition-all text-left"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white">
                        {item.username || item.userID}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatDateString(item.datetime || item.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveBookmark(item._rowNumber)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line line-clamp-4 my-2">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400">
                    <span className="font-mono text-[10px]">#{item._rowNumber}</span>
                    <div className="flex items-center gap-3">
                      {onOpenPosterGenerator && (
                        <button
                          onClick={() => onOpenPosterGenerator(item)}
                          className="hover:text-amber-500 flex items-center gap-1 text-slate-500 dark:text-slate-400 cursor-pointer"
                          title="Generate poster for this quote"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Poster</span>
                        </button>
                      )}
                      {item.tweetURL && (
                        <a
                          href={item.tweetURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-500 flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
