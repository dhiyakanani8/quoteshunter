import { useState } from 'react';
import {
  Table2,
  RefreshCw,
  Search,
  Bookmark,
  ImageIcon,
  LayoutGrid,
  List,
  Sparkles,
  Info,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ViewLayout } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterHasImageOnly: boolean;
  onToggleImageOnly: () => void;
  layout: ViewLayout;
  onLayoutChange: (layout: ViewLayout) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  bookmarksCount: number;
  onOpenBookmarks: () => void;
  onReplaySplash: () => void;
  activeCategory: string;
  totalCategories: number;
}

export default function Header({
  searchQuery,
  onSearchChange,
  filterHasImageOnly,
  onToggleImageOnly,
  layout,
  onLayoutChange,
  onRefresh,
  isRefreshing,
  bookmarksCount,
  onOpenBookmarks,
  onReplaySplash,
  activeCategory,
  totalCategories,
}: HeaderProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              onClick={onReplaySplash}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white shadow-md shadow-emerald-500/20 cursor-pointer hover:scale-105 transition-transform"
              title="Click to replay Splash Screen"
            >
              <Table2 className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                  Quotes<span className="text-emerald-600 dark:text-emerald-400">hunter</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Feeds
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Dynamic Google Sheets • {totalCategories} categories
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search messages in #${activeCategory}...`}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Filter by image only */}
            <button
              onClick={onToggleImageOnly}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                filterHasImageOnly
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={filterHasImageOnly ? 'Show all messages' : 'Show only posts with images'}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Photos</span>
            </button>

            {/* Layout Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => onLayoutChange('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Grid layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLayoutChange('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'list'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Compact list layout"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmarks Drawer Trigger */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Saved bookmarks"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Refresh Live Data */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh sheet data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            {/* Replay Splash screen */}
            <button
              onClick={onReplaySplash}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Replay Splash Screen"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </button>

            {/* Info modal */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="API Information"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="px-4 pb-2.5 pt-0.5 md:hidden">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search in #${activeCategory}...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfoModal && (
        <div
          onClick={() => setShowInfoModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                  About Quoteshunter
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Quoteshunter connects directly to Google Apps Script endpoints to dynamically fetch available sheets and stream paginated messages, tweets, quotes, and jokes in real time.
            </p>

            <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase">
                Categories Endpoint:
              </div>
              <div className="text-emerald-600 dark:text-emerald-400 break-all">
                .../exec?sheet=tweets&action=sheets
              </div>

              <div className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase pt-2">
                Messages Endpoint:
              </div>
              <div className="text-indigo-600 dark:text-indigo-400 break-all">
                .../exec?sheet={activeCategory}&page=1&limit=12
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <div>• <strong>Categories:</strong> Automatically detected sheets. First sheet selected by default.</div>
              <div>• <strong>Pagination:</strong> Full navigation with customizable per-page limits.</div>
              <div>• <strong>Media:</strong> High-resolution image preview lightbox with zoom.</div>
              <div>• <strong>Audio:</strong> Integrated speech synthesizer for reading quotes aloud.</div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
