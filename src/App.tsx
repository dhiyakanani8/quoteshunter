import { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  RefreshCw,
  Search,
  Sparkles,
  Inbox,
  Filter,
  CheckCircle2,
  BookmarkCheck,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { SheetMessage, ViewLayout } from './types';
import { fetchCategories, fetchMessages, clearSheetCache } from './services/sheetApi';
import { formatSheetTitle, isValidImageUrl } from './utils/formatters';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import MessageCard from './components/MessageCard';
import PaginationControls from './components/PaginationControls';
import ImageLightbox from './components/ImageLightbox';
import SavedBookmarksDrawer from './components/SavedBookmarksDrawer';
import QuotePosterModal from './components/QuotePosterModal';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Categories State
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Messages & Pagination State
  const [messages, setMessages] = useState<SheetMessage[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHasImageOnly, setFilterHasImageOnly] = useState(false);
  const [layout, setLayout] = useState<ViewLayout>('grid');

  // Bookmarks State (persisted locally)
  const [bookmarks, setBookmarks] = useState<SheetMessage[]>(() => {
    try {
      const saved = localStorage.getItem('sheetstream_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Lightbox State
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    url: string | null;
    author?: string;
    caption?: string;
  }>({
    isOpen: false,
    url: null,
  });

  // Quote Poster Generator Modal State
  const [posterMessage, setPosterMessage] = useState<SheetMessage | null>(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  const handleOpenPosterGenerator = (msg: SheetMessage) => {
    setPosterMessage(msg);
    setIsPosterModalOpen(true);
  };

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sheetstream_bookmarks', JSON.stringify(bookmarks));
    } catch (err) {
      console.error('Failed to persist bookmarks', err);
    }
  }, [bookmarks]);

  // 1. Initial Fetch: Dynamic Sheet Categories
  const loadCategories = useCallback(async (forceRefresh = false) => {
    setIsCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const sheets = await fetchCategories(forceRefresh);
      setCategories(sheets);

      // By default first selected
      if (sheets.length > 0) {
        setSelectedCategory((prev) => (prev && sheets.includes(prev) ? prev : sheets[0]));
      }
    } catch (err: any) {
      setCategoriesError(err.message || 'Failed to load sheet categories');
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 2. Fetch Messages for Selected Category & Pagination
  const loadMessages = useCallback(
    async (sheet: string, page: number, currentLimit: number, forceRefresh = false) => {
      if (!sheet) return;

      setIsMessagesLoading(true);
      setMessagesError(null);

      try {
        const response = await fetchMessages(sheet, page, currentLimit, forceRefresh);
        setMessages(response.data || []);
        setTotalItems(response.total || 0);
      } catch (err: any) {
        setMessagesError(err.message || 'Failed to fetch messages for sheet');
      } finally {
        setIsMessagesLoading(false);
      }
    },
    []
  );

  // Trigger messages fetch when selectedCategory, currentPage, or limit changes
  useEffect(() => {
    if (selectedCategory) {
      loadMessages(selectedCategory, currentPage, limit);
    }
  }, [selectedCategory, currentPage, limit, loadMessages]);

  // Category switch handler: resets page to 1
  const handleSelectCategory = (cat: string) => {
    if (cat === selectedCategory) return;
    setSelectedCategory(cat);
    setCurrentPage(1);
    setSearchQuery('');
  };

  // Limit change handler: resets to page 1
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  // Manual Refresh
  const handleRefresh = async () => {
    clearSheetCache();
    await loadCategories(true);
    if (selectedCategory) {
      await loadMessages(selectedCategory, currentPage, limit, true);
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = (msg: SheetMessage) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b._rowNumber === msg._rowNumber && b.content === msg.content);
      if (exists) {
        return prev.filter(
          (b) => !(b._rowNumber === msg._rowNumber && b.content === msg.content)
        );
      } else {
        return [msg, ...prev];
      }
    });
  };

  const handleRemoveBookmark = (rowNumber: number) => {
    setBookmarks((prev) => prev.filter((b) => b._rowNumber !== rowNumber));
  };

  const handleClearAllBookmarks = () => {
    setBookmarks([]);
  };

  // Filter messages based on search and photo filter
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Photo filter
      if (filterHasImageOnly && !isValidImageUrl(msg.imageURL)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inContent = (msg.content || '').toLowerCase().includes(query);
        const inUsername = (msg.username || '').toLowerCase().includes(query);
        const inUserId = (msg.userID || '').toLowerCase().includes(query);
        const inTypes = (msg.types || '').toLowerCase().includes(query);
        return inContent || inUsername || inUserId || inTypes;
      }
      return true;
    });
  }, [messages, filterHasImageOnly, searchQuery]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Lightbox openers
  const openLightbox = (url: string, author?: string, caption?: string) => {
    setLightboxData({
      isOpen: true,
      url,
      author,
      caption,
    });
  };

  const closeLightbox = () => {
    setLightboxData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onComplete={() => setShowSplash(false)}
            categoriesLoaded={!isCategoriesLoading && categories.length > 0}
            totalCategories={categories.length || 18}
          />
        )}
      </AnimatePresence>

      {/* Main App Bar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterHasImageOnly={filterHasImageOnly}
        onToggleImageOnly={() => setFilterHasImageOnly((prev) => !prev)}
        layout={layout}
        onLayoutChange={setLayout}
        onRefresh={handleRefresh}
        isRefreshing={isMessagesLoading || isCategoriesLoading}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onReplaySplash={() => setShowSplash(true)}
        activeCategory={selectedCategory}
        totalCategories={categories.length}
      />

      {/* Dynamic Sheets Category Navigation */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        isLoading={isCategoriesLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {/* Banner with Active Sheet Details & Quick Stats */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-white">
                {formatSheetTitle(selectedCategory) || 'Loading Feed...'}
              </h2>
              {selectedCategory && (
                <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  sheet={selectedCategory}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Curated messages, social tweets, and quotes automatically synced from Google Sheets.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-500 dark:text-slate-400">Total:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totalItems.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-slate-500 dark:text-slate-400">Page:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {currentPage} / {totalPages}
              </span>
            </div>
          </div>
        </div>

        {/* Categories Error Alert */}
        {categoriesError && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start justify-between gap-3 text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Categories Error:</strong> {categoriesError}
              </div>
            </div>
            <button
              onClick={() => loadCategories(true)}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Messages Loading Skeletons */}
        {isMessagesLoading && (
          <div
            className={`grid gap-4 ${
              layout === 'list'
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  </div>
                </div>
                <div className="space-y-2 py-2">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
                </div>
                <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Messages Error State */}
        {!isMessagesLoading && messagesError && (
          <div className="py-16 px-4 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              Failed to load feed messages
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
              {messagesError}
            </p>
            <button
              onClick={() => loadMessages(selectedCategory, currentPage, limit, true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Fetching</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isMessagesLoading && !messagesError && filteredMessages.length === 0 && (
          <div className="py-20 px-4 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              {searchQuery || filterHasImageOnly
                ? 'No matching messages found'
                : 'No messages in this sheet category'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
              {searchQuery || filterHasImageOnly
                ? 'Try adjusting your search keywords or clearing active filters.'
                : 'This sheet might currently be empty or data has not been populated yet.'}
            </p>
            {(searchQuery || filterHasImageOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterHasImageOnly(false);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        )}

        {/* Message Feed Grid / List */}
        {!isMessagesLoading && !messagesError && filteredMessages.length > 0 && (
          <div
            className={`grid gap-4 ${
              layout === 'list'
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredMessages.map((msg) => {
              const isBookmarked = bookmarks.some(
                (b) => b._rowNumber === msg._rowNumber && b.content === msg.content
              );

              return (
                <MessageCard
                  key={`${selectedCategory}-${msg._rowNumber}`}
                  message={msg}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenImage={openLightbox}
                  onOpenPosterGenerator={handleOpenPosterGenerator}
                  layout={layout}
                />
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!categoriesError && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLimitChange={handleLimitChange}
            isLoading={isMessagesLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-4 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Quoteshunter • Google Apps Script dynamic feed explorer</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Google Sheets API</span>
            <span>•</span>
            <button
              onClick={() => setShowSplash(true)}
              className="hover:text-emerald-500 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Splash Screen</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Image Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxData.isOpen}
        imageUrl={lightboxData.url}
        authorName={lightboxData.author}
        caption={lightboxData.caption}
        onClose={closeLightbox}
      />

      {/* Saved Bookmarks Drawer */}
      <SavedBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
        onOpenImage={openLightbox}
        onOpenPosterGenerator={handleOpenPosterGenerator}
      />

      {/* Quote-to-Image Poster Generator Modal */}
      <QuotePosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        message={posterMessage}
        sheetCategory={selectedCategory}
      />
    </div>
  );
}
