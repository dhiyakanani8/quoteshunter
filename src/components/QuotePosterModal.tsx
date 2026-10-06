import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Copy,
  Check,
  Sparkles,
  Palette,
  Type,
  Layout as LayoutIcon,
  Sliders,
  Quote,
  Eye,
  Calendar,
  Smartphone,
  Square,
  Monitor,
  Hash,
  AtSign,
  User,
  RotateCcw,
  SlidersHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ZoomIn,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { SheetMessage } from '../types';
import { formatDateString, getAvatarColor } from '../utils/formatters';

interface QuotePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: SheetMessage | null;
  sheetCategory?: string;
}

export type AspectRatioType = '1:1' | '9:16' | '16:9';
export type FontFamilyType = 'sans' | 'serif' | 'mono' | 'cursive';
export type TextAlignType = 'left' | 'center' | 'right';
export type QuoteStyleType = 'large-quote' | 'left-bar' | 'clean';

export interface PosterTheme {
  id: string;
  name: string;
  category: 'dark' | 'light' | 'vibrant' | 'warm';
  bgClass: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
  borderClass: string;
  avatarRing: string;
  tagBg: string;
  tagText: string;
  previewGradient: string;
}

export const POSTER_THEMES: PosterTheme[] = [
  // 1. Obsidian Noir (Dark)
  {
    id: 'obsidian',
    name: 'Obsidian Noir',
    category: 'dark',
    bgClass: 'bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900',
    textColor: 'text-slate-50',
    subtextColor: 'text-slate-400',
    accentColor: 'text-amber-400',
    borderClass: 'border-amber-500/20 shadow-2xl shadow-black/80',
    avatarRing: 'ring-amber-400/40',
    tagBg: 'bg-amber-400/10 border-amber-400/30',
    tagText: 'text-amber-300',
    previewGradient: 'from-slate-950 via-slate-900 to-amber-950',
  },
  // 2. Tokyo Neon (NEW - Dark Synthwave)
  {
    id: 'tokyo-neon',
    name: 'Tokyo Neon',
    category: 'dark',
    bgClass: 'bg-gradient-to-br from-[#0b081e] via-[#160e33] to-[#28093d]',
    textColor: 'text-[#f5f3ff]',
    subtextColor: 'text-purple-300/75',
    accentColor: 'text-[#f43f5e]',
    borderClass: 'border-purple-500/40 shadow-2xl shadow-purple-950/80',
    avatarRing: 'ring-fuchsia-500/50',
    tagBg: 'bg-purple-500/20 border-purple-400/40',
    tagText: 'text-fuchsia-300',
    previewGradient: 'from-[#0b081e] via-[#160e33] to-[#f43f5e]',
  },
  // 3. Kyoto Matcha (NEW - Calming Organic Light)
  {
    id: 'zen-garden',
    name: 'Kyoto Matcha',
    category: 'light',
    bgClass: 'bg-gradient-to-br from-[#f4f8f2] via-[#e6f0e4] to-[#d8e8d5]',
    textColor: 'text-[#183a27]',
    subtextColor: 'text-[#38624a]',
    accentColor: 'text-[#2d6a4f]',
    borderClass: 'border-[#b5cdb2] shadow-xl shadow-[#183a27]/10',
    avatarRing: 'ring-[#2d6a4f]/30',
    tagBg: 'bg-[#2d6a4f]/15 border-[#2d6a4f]/30',
    tagText: 'text-[#183a27]',
    previewGradient: 'from-[#f4f8f2] via-[#e6f0e4] to-[#2d6a4f]',
  },
  // 4. Nordic Glacier (NEW - Crisp Frosted Icy Light)
  {
    id: 'nordic-frost',
    name: 'Nordic Glacier',
    category: 'light',
    bgClass: 'bg-gradient-to-br from-[#f0f8ff] via-[#dbeafe] to-[#bfdbfe]',
    textColor: 'text-[#0f172a]',
    subtextColor: 'text-[#334155]',
    accentColor: 'text-[#0284c7]',
    borderClass: 'border-[#93c5fd] shadow-xl shadow-blue-900/10',
    avatarRing: 'ring-[#0284c7]/40',
    tagBg: 'bg-sky-500/15 border-sky-400/40',
    tagText: 'text-sky-800',
    previewGradient: 'from-[#f0f8ff] via-[#dbeafe] to-[#0284c7]',
  },
  // 5. Crimson Velvet (NEW - Regal Luxury Dark)
  {
    id: 'crimson-velvet',
    name: 'Crimson Velvet',
    category: 'dark',
    bgClass: 'bg-gradient-to-br from-[#2a080c] via-[#450a12] to-[#1c0407]',
    textColor: 'text-[#fff1f2]',
    subtextColor: 'text-[#fecdd3]/80',
    accentColor: 'text-[#fde047]',
    borderClass: 'border-amber-500/30 shadow-2xl shadow-rose-950/80',
    avatarRing: 'ring-amber-400/40',
    tagBg: 'bg-amber-400/15 border-amber-400/30',
    tagText: 'text-amber-200',
    previewGradient: 'from-[#2a080c] via-[#450a12] to-[#fde047]',
  },
  // 6. Solar Flare (NEW - Electric Citrus Vibrant)
  {
    id: 'solar-citrus',
    name: 'Solar Flare',
    category: 'vibrant',
    bgClass: 'bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#eab308]',
    textColor: 'text-white',
    subtextColor: 'text-orange-100',
    accentColor: 'text-[#fef08a]',
    borderClass: 'border-amber-300/30 shadow-2xl shadow-orange-950/50',
    avatarRing: 'ring-white/40',
    tagBg: 'bg-white/20 border-white/40',
    tagText: 'text-white',
    previewGradient: 'from-[#ea580c] via-[#f97316] to-[#eab308]',
  },
  // 7. Espresso Roast (NEW - Warm Cafe & Caramel)
  {
    id: 'espresso-mocha',
    name: 'Espresso Roast',
    category: 'warm',
    bgClass: 'bg-gradient-to-br from-[#1c120c] via-[#2d1b10] to-[#150b06]',
    textColor: 'text-[#fef3c7]',
    subtextColor: 'text-[#d6c7b2]',
    accentColor: 'text-[#f59e0b]',
    borderClass: 'border-amber-700/30 shadow-2xl shadow-stone-950/80',
    avatarRing: 'ring-amber-600/40',
    tagBg: 'bg-amber-900/30 border-amber-600/30',
    tagText: 'text-amber-300',
    previewGradient: 'from-[#1c120c] via-[#2d1b10] to-[#f59e0b]',
  },
  // 8. Lavender Dream (NEW - Pastel Ethereal Lilac)
  {
    id: 'lavender-mist',
    name: 'Lavender Dream',
    category: 'light',
    bgClass: 'bg-gradient-to-br from-[#faf5ff] via-[#f3e8ff] to-[#e9d5ff]',
    textColor: 'text-[#3b0764]',
    subtextColor: 'text-[#6b21a8]',
    accentColor: 'text-[#7e22ce]',
    borderClass: 'border-purple-300 shadow-xl shadow-purple-900/10',
    avatarRing: 'ring-purple-400/40',
    tagBg: 'bg-purple-600/15 border-purple-400/40',
    tagText: 'text-purple-900',
    previewGradient: 'from-[#faf5ff] via-[#f3e8ff] to-[#7e22ce]',
  },
  // 9. Swiss Brutalist (NEW - Stark High-Contrast Monochrome)
  {
    id: 'swiss-brutalist',
    name: 'Swiss Brutalist',
    category: 'dark',
    bgClass: 'bg-[#09090b]',
    textColor: 'text-[#fafafa]',
    subtextColor: 'text-[#a1a1aa]',
    accentColor: 'text-[#facc15]',
    borderClass: 'border-2 border-white/80 shadow-2xl shadow-black',
    avatarRing: 'ring-white/80',
    tagBg: 'bg-[#facc15] border-[#facc15]',
    tagText: 'text-black font-mono font-bold',
    previewGradient: 'from-black via-[#18181b] to-[#facc15]',
  },
  // 10. Terracotta Dune (NEW - Baked Mediterranean Earth & Sand)
  {
    id: 'desert-dune',
    name: 'Terracotta Dune',
    category: 'warm',
    bgClass: 'bg-gradient-to-br from-[#7c2d12] via-[#9a3412] to-[#c2410c]',
    textColor: 'text-[#fff7ed]',
    subtextColor: 'text-[#fed7aa]',
    accentColor: 'text-[#fdba74]',
    borderClass: 'border-orange-400/30 shadow-2xl shadow-orange-950/60',
    avatarRing: 'ring-orange-300/40',
    tagBg: 'bg-orange-500/20 border-orange-300/40',
    tagText: 'text-orange-100',
    previewGradient: 'from-[#7c2d12] via-[#9a3412] to-[#fdba74]',
  },
  // 11. Cosmic Starlight (NEW - Deep Starfield Cyan Stardust)
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Starlight',
    category: 'dark',
    bgClass: 'bg-gradient-to-br from-[#060814] via-[#0f122c] to-[#1d0e33]',
    textColor: 'text-[#f0f9ff]',
    subtextColor: 'text-[#93c5fd]',
    accentColor: 'text-[#38bdf8]',
    borderClass: 'border-cyan-400/40 shadow-2xl shadow-indigo-950/90',
    avatarRing: 'ring-cyan-400/50',
    tagBg: 'bg-cyan-500/20 border-cyan-400/40',
    tagText: 'text-cyan-200',
    previewGradient: 'from-[#060814] via-[#0f122c] to-[#38bdf8]',
  },
  // 12. Sunset Glow (Vibrant Rose & Pink)
  {
    id: 'sunset',
    name: 'Sunset Glow',
    category: 'vibrant',
    bgClass: 'bg-gradient-to-br from-rose-600 via-pink-600 to-amber-500',
    textColor: 'text-white',
    subtextColor: 'text-rose-100',
    accentColor: 'text-amber-200',
    borderClass: 'border-white/20 shadow-2xl shadow-rose-950/40',
    avatarRing: 'ring-white/40',
    tagBg: 'bg-white/20 border-white/30 backdrop-blur-xs',
    tagText: 'text-white',
    previewGradient: 'from-rose-600 via-pink-600 to-amber-500',
  },
  // 13. Emerald Aurora (Dark Deep Green)
  {
    id: 'emerald',
    name: 'Emerald Aurora',
    category: 'dark',
    bgClass: 'bg-gradient-to-br from-teal-950 via-emerald-900 to-slate-950',
    textColor: 'text-emerald-50',
    subtextColor: 'text-emerald-300/80',
    accentColor: 'text-emerald-400',
    borderClass: 'border-emerald-500/30 shadow-2xl shadow-emerald-950/60',
    avatarRing: 'ring-emerald-400/40',
    tagBg: 'bg-emerald-400/10 border-emerald-400/30',
    tagText: 'text-emerald-300',
    previewGradient: 'from-teal-950 via-emerald-900 to-emerald-400',
  },
  // 14. Royal Indigo (Dark Indigo Violet)
  {
    id: 'royal',
    name: 'Royal Indigo',
    category: 'dark',
    bgClass: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950',
    textColor: 'text-slate-50',
    subtextColor: 'text-indigo-200/80',
    accentColor: 'text-violet-400',
    borderClass: 'border-indigo-500/30 shadow-2xl shadow-indigo-950/60',
    avatarRing: 'ring-violet-400/40',
    tagBg: 'bg-violet-400/15 border-violet-400/30',
    tagText: 'text-violet-300',
    previewGradient: 'from-indigo-950 via-slate-900 to-violet-400',
  },
  // 15. Studio Minimal (Editorial Crisp Light)
  {
    id: 'editorial-light',
    name: 'Studio Minimal',
    category: 'light',
    bgClass: 'bg-gradient-to-b from-white to-slate-100',
    textColor: 'text-slate-900',
    subtextColor: 'text-slate-600',
    accentColor: 'text-emerald-600',
    borderClass: 'border-slate-300 shadow-xl shadow-slate-200/60',
    avatarRing: 'ring-slate-300',
    tagBg: 'bg-slate-200/70 border-slate-300',
    tagText: 'text-slate-700',
    previewGradient: 'from-white via-slate-100 to-emerald-600',
  },
  // 16. Vintage Paper (Warm Antique Parchment)
  {
    id: 'parchment',
    name: 'Vintage Paper',
    category: 'warm',
    bgClass: 'bg-gradient-to-br from-[#fcf8f0] via-[#f7f0df] to-[#eee2c6]',
    textColor: 'text-[#2e261f]',
    subtextColor: 'text-[#6e5e4e]',
    accentColor: 'text-[#8b5a2b]',
    borderClass: 'border-[#dfd0b5] shadow-xl shadow-[#4a3b2c]/10',
    avatarRing: 'ring-[#8b5a2b]/30',
    tagBg: 'bg-[#8b5a2b]/10 border-[#8b5a2b]/30',
    tagText: 'text-[#5a3b1c]',
    previewGradient: 'from-[#fcf8f0] via-[#f7f0df] to-[#8b5a2b]',
  },
  // 17. Cyberpunk Neon (Vibrant Dark High-Tech)
  {
    id: 'cyber',
    name: 'Cyberpunk Neon',
    category: 'vibrant',
    bgClass: 'bg-gradient-to-br from-zinc-950 via-black to-slate-950',
    textColor: 'text-cyan-50',
    subtextColor: 'text-cyan-300/70',
    accentColor: 'text-pink-500',
    borderClass: 'border-cyan-500/40 shadow-2xl shadow-cyan-950/80',
    avatarRing: 'ring-pink-500/50',
    tagBg: 'bg-pink-500/15 border-pink-500/30',
    tagText: 'text-pink-300',
    previewGradient: 'from-zinc-950 via-black to-pink-500',
  },
  // 18. Deep Oceanic (Midnight Blue)
  {
    id: 'ocean',
    name: 'Deep Oceanic',
    category: 'dark',
    bgClass: 'bg-gradient-to-br from-blue-900 via-slate-900 to-sky-950',
    textColor: 'text-sky-50',
    subtextColor: 'text-sky-200/80',
    accentColor: 'text-cyan-300',
    borderClass: 'border-cyan-500/25 shadow-2xl shadow-blue-950/70',
    avatarRing: 'ring-cyan-300/40',
    tagBg: 'bg-sky-400/15 border-sky-400/30',
    tagText: 'text-sky-200',
    previewGradient: 'from-blue-900 via-slate-900 to-cyan-300',
  },
];

// Font scale presets with precise pixel metrics and descriptions
export const FONT_SCALE_PRESETS = [
  { id: 'xs', label: 'XS', px: 13, name: 'Micro', description: 'Dense & compact quotes' },
  { id: 'sm', label: 'SM', px: 15, name: 'Small', description: 'Subtle text, fits long paragraphs' },
  { id: 'md', label: 'MD', px: 18, name: 'Medium', description: 'Balanced everyday reading size' },
  { id: 'lg', label: 'LG', px: 22, name: 'Large', description: 'Prominent social feed size' },
  { id: 'xl', label: 'XL', px: 28, name: 'Display', description: 'Bold punchy aphorisms' },
  { id: '2xl', label: '2XL', px: 34, name: 'Hero', description: 'High-impact headline quote' },
];

export default function QuotePosterModal({
  isOpen,
  onClose,
  message,
  sheetCategory = 'tweets',
}: QuotePosterModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Studio Navigation Tabs
  const [activeTab, setActiveTab] = useState<'theme' | 'layout' | 'typography' | 'elements'>('theme');
  const [themeFilter, setThemeFilter] = useState<'all' | 'dark' | 'light' | 'vibrant' | 'warm'>('all');

  // Selected Style States
  const [selectedThemeId, setSelectedThemeId] = useState<string>('obsidian');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [fontFamily, setFontFamily] = useState<FontFamilyType>('sans');
  const [fontSizePx, setFontSizePx] = useState<number>(18);
  const [textAlign, setTextAlign] = useState<TextAlignType>('left');
  const [quoteStyle, setQuoteStyle] = useState<QuoteStyleType>('large-quote');

  // Content Customization (Direct text editing)
  const [editedContent, setEditedContent] = useState('');
  const [isEditingText, setIsEditingText] = useState(false);

  // Author & Metadata Custom / Static Controls
  const [isStaticOverrideMode, setIsStaticOverrideMode] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorHandle, setAuthorHandle] = useState('');
  const [customInitials, setCustomInitials] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customWatermark, setCustomWatermark] = useState('Quoteshunter • Curated');

  // Element Visibility Toggles
  const [showAvatar, setShowAvatar] = useState(true);
  const [showAuthorName, setShowAuthorName] = useState(true);
  const [showAuthorHandle, setShowAuthorHandle] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showSheetBadge, setShowSheetBadge] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);

  // Export States
  const [isExporting, setIsExporting] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Initialize and synchronize state when incoming message changes
  useEffect(() => {
    if (message) {
      setEditedContent(message.content || '');
      setIsEditingText(false);
      setCopiedSuccess(false);
      setExportMessage(null);

      // Populate author and meta defaults
      const originalName = message.username || message.userID || 'Author';
      const originalHandle = message.userID ? (message.userID.startsWith('@') ? message.userID : `@${message.userID}`) : '@user';
      setAuthorName(originalName);
      setAuthorHandle(originalHandle);
      setCustomInitials(originalName.slice(0, 2).toUpperCase());
      setCustomTag(`#${sheetCategory || 'quotes'}`);
      setCustomDate(formatDateString(message.datetime || message.timestamp));
      setCustomWatermark('Quoteshunter • Curated');
      setIsStaticOverrideMode(false);
    }
  }, [message, sheetCategory]);

  if (!isOpen || !message) return null;

  const currentTheme =
    POSTER_THEMES.find((t) => t.id === selectedThemeId) || POSTER_THEMES[0];

  const avatarTheme = getAvatarColor(authorName || message.username || 'Author');

  // Filtered themes list
  const filteredThemes = POSTER_THEMES.filter(
    (t) => themeFilter === 'all' || t.category === themeFilter
  );

  // Font family typography classes
  const getFontFamilyClass = (f: FontFamilyType) => {
    switch (f) {
      case 'serif':
        return 'font-serif tracking-normal leading-relaxed';
      case 'mono':
        return 'font-mono tracking-tight leading-relaxed';
      case 'cursive':
        return 'font-sans italic font-normal tracking-wide leading-relaxed';
      case 'sans':
      default:
        return 'font-sans font-medium tracking-tight leading-relaxed';
    }
  };

  // Aspect ratio wrapper styles
  const getAspectRatioClasses = (ratio: AspectRatioType) => {
    switch (ratio) {
      case '9:16':
        return 'w-full max-w-[340px] aspect-[9/16] min-h-[500px]';
      case '16:9':
        return 'w-full max-w-[540px] aspect-[16/9] min-h-[300px]';
      case '1:1':
      default:
        return 'w-full max-w-[420px] aspect-square min-h-[380px]';
    }
  };

  // Reset to original message defaults
  const handleResetToOriginal = () => {
    if (!message) return;
    const origName = message.username || message.userID || 'Author';
    const origHandle = message.userID ? (message.userID.startsWith('@') ? message.userID : `@${message.userID}`) : '@user';
    setAuthorName(origName);
    setAuthorHandle(origHandle);
    setCustomInitials(origName.slice(0, 2).toUpperCase());
    setCustomTag(`#${sheetCategory || 'quotes'}`);
    setCustomDate(formatDateString(message.datetime || message.timestamp));
    setEditedContent(message.content || '');
    setCustomWatermark('Quoteshunter • Curated');
    setIsStaticOverrideMode(false);
  };

  // High-Resolution PNG Export
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportMessage('Generating high-res graphic...');

    try {
      // 2.5x pixel ratio for retina-crisp typography and graphics
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        quality: 1,
      });

      const cleanAuthor = (authorName || 'quote')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      const fileName = `quoteshunter-${cleanAuthor}-${Date.now()}.png`;

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setExportMessage('Card downloaded in HD!');
      setTimeout(() => setExportMessage(null), 3500);
    } catch (err) {
      console.error('Download failed', err);
      setExportMessage('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportMessage('Preparing image for clipboard...');

    try {
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedSuccess(true);
        setExportMessage('Copied to clipboard! Ready to paste into WhatsApp, Slack, etc.');
        setTimeout(() => {
          setCopiedSuccess(false);
          setExportMessage(null);
        }, 4000);
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Clipboard copy failed, falling back to download', err);
      handleDownload();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Quoteshunter Poster Studio</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  18 Themes • HD Export
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design shareable quote posters with custom author details, font scales, and aesthetic layouts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close generator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Body: Split View (Canvas on Left, Customizer on Right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* LEFT: Live Interactive Preview Stage */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-100/70 dark:bg-slate-950/60 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
            <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 mb-3 px-2">
              <div className="flex items-center gap-1.5 uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Canvas ({aspectRatio})</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Scale: <span className="font-mono text-emerald-600 dark:text-emerald-400">{fontSizePx}px</span>
              </div>
            </div>

            {/* The Actual Capturable Card Element */}
            <div className="w-full flex items-center justify-center py-2">
              <div
                ref={cardRef}
                className={`relative rounded-3xl border ${currentTheme.borderClass} ${currentTheme.bgClass} p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${getAspectRatioClasses(
                  aspectRatio
                )}`}
              >
                {/* Subtle Decorative Background Aura */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-black/10 rounded-full blur-xl pointer-events-none" />

                {/* Top Bar of the Card: Author, Handle & Category Badge */}
                <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
                  {/* Author Block */}
                  {(showAuthorName || showAuthorHandle || showAvatar) && (
                    <div className="flex items-center gap-3 min-w-0">
                      {showAvatar && (
                        <div
                          className={`w-10 h-10 rounded-2xl ${avatarTheme.bg} ${avatarTheme.text} flex items-center justify-center font-bold text-xs ring-2 ${currentTheme.avatarRing} shadow-sm shrink-0`}
                        >
                          {customInitials || (authorName ? authorName.slice(0, 2).toUpperCase() : 'U')}
                        </div>
                      )}
                      <div className="min-w-0">
                        {showAuthorName && (
                          <div
                            className={`font-bold text-sm tracking-tight truncate ${currentTheme.textColor}`}
                          >
                            {authorName || 'Anonymous'}
                          </div>
                        )}
                        {showAuthorHandle && authorHandle && (
                          <div
                            className={`text-xs opacity-75 truncate ${currentTheme.subtextColor}`}
                          >
                            {authorHandle}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Category Tag */}
                  {showSheetBadge && customTag && (
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${currentTheme.tagBg} ${currentTheme.tagText}`}
                    >
                      {customTag.startsWith('#') ? customTag : `#${customTag}`}
                    </span>
                  )}
                </div>

                {/* Quote Content Section */}
                <div className="relative z-10 my-auto py-2">
                  {/* Decorative Quote Mark */}
                  {quoteStyle === 'large-quote' && (
                    <div
                      className={`text-4xl sm:text-5xl font-serif font-black leading-none mb-1 opacity-40 select-none ${currentTheme.accentColor}`}
                    >
                      “
                    </div>
                  )}

                  <div
                    className={`${
                      quoteStyle === 'left-bar'
                        ? 'pl-4 border-l-4 border-amber-400/80'
                        : ''
                    }`}
                  >
                    <p
                      style={{
                        textAlign,
                        fontSize: `${fontSizePx}px`,
                        lineHeight: 1.48,
                      }}
                      className={`whitespace-pre-line tracking-tight ${getFontFamilyClass(
                        fontFamily
                      )} ${currentTheme.textColor}`}
                    >
                      {editedContent || message.content}
                    </p>
                  </div>
                </div>

                {/* Bottom Meta & Watermark */}
                <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  {/* Timestamp */}
                  {showDate ? (
                    <span
                      className={`flex items-center gap-1.5 opacity-70 ${currentTheme.subtextColor}`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{customDate}</span>
                    </span>
                  ) : (
                    <span />
                  )}

                  {/* App Watermark / Signature */}
                  {showWatermark && (
                    <span
                      className={`font-medium tracking-wide opacity-80 ${currentTheme.accentColor}`}
                    >
                      {customWatermark}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Notification message */}
            {exportMessage && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md flex items-center gap-2"
              >
                {copiedSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                )}
                <span>{exportMessage}</span>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Studio Customization Controls */}
          <div className="lg:col-span-5 p-5 flex flex-col justify-between bg-white dark:bg-slate-900 space-y-4">
            {/* Control Navigation Tabs */}
            <div>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('theme')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'theme'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Themes ({POSTER_THEMES.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('layout')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'layout'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <LayoutIcon className="w-3.5 h-3.5" />
                  <span>Layout</span>
                </button>

                <button
                  onClick={() => setActiveTab('typography')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'typography'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Fonts & Scale</span>
                </button>

                <button
                  onClick={() => setActiveTab('elements')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'elements'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Elements</span>
                </button>
              </div>

              {/* TAB 1: 18 DISTINCT THEMES WITH FILTERING */}
              {activeTab === 'theme' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Select Aesthetic Theme ({POSTER_THEMES.length})
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      10 New Styles Added
                    </span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                    {[
                      { id: 'all', label: 'All (18)' },
                      { id: 'dark', label: 'Dark (8)' },
                      { id: 'light', label: 'Light (4)' },
                      { id: 'vibrant', label: 'Vibrant (3)' },
                      { id: 'warm', label: 'Warm (3)' },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => setThemeFilter(pill.id as any)}
                        className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                          themeFilter === pill.id
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  {/* Theme Grid */}
                  <div className="grid grid-cols-2 gap-2.5 max-h-[310px] overflow-y-auto pr-1">
                    {filteredThemes.map((th) => {
                      const isSelected = th.id === selectedThemeId;
                      return (
                        <button
                          key={th.id}
                          onClick={() => setSelectedThemeId(th.id)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md scale-[1.02]'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          } ${th.bgClass}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-xs font-bold ${th.textColor}`}>
                              {th.name}
                            </span>
                            {isSelected ? (
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            ) : (
                              <div
                                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${th.previewGradient} border border-white/20`}
                              />
                            )}
                          </div>

                          <div className="flex items-center justify-between w-full text-[10px]">
                            <span
                              className={`px-1.5 py-0.5 rounded-md border ${th.tagBg} ${th.tagText} truncate max-w-[80px]`}
                            >
                              Sample
                            </span>
                            <span className={`font-mono opacity-70 ${th.subtextColor}`}>
                              {th.category}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: LAYOUT & RATIO */}
              {activeTab === 'layout' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Aspect Ratio & Destination
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setAspectRatio('1:1')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          aspectRatio === '1:1'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <Square className="w-5 h-5" />
                        <span className="text-xs">1:1 Square</span>
                        <span className="text-[10px] text-slate-400">Instagram / Feed</span>
                      </button>

                      <button
                        onClick={() => setAspectRatio('9:16')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          aspectRatio === '9:16'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <Smartphone className="w-5 h-5" />
                        <span className="text-xs">9:16 Story</span>
                        <span className="text-[10px] text-slate-400">WhatsApp Status</span>
                      </button>

                      <button
                        onClick={() => setAspectRatio('16:9')}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          aspectRatio === '16:9'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <Monitor className="w-5 h-5" />
                        <span className="text-xs">16:9 Wide</span>
                        <span className="text-[10px] text-slate-400">Twitter / X Post</span>
                      </button>
                    </div>
                  </div>

                  {/* Decorative Quote Mark Style */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Quote Accent Decoration
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setQuoteStyle('large-quote')}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          quoteStyle === 'large-quote'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Large “ Marks
                      </button>

                      <button
                        onClick={() => setQuoteStyle('left-bar')}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          quoteStyle === 'left-bar'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Vertical Accent Bar
                      </button>

                      <button
                        onClick={() => setQuoteStyle('clean')}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          quoteStyle === 'clean'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Minimal Clean
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TYPOGRAPHY & FONT SCALE WITH DETAILED METRICS */}
              {activeTab === 'typography' && (
                <div className="space-y-4">
                  {/* Font Family Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Typography Family
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'sans', label: 'Modern Sans', preview: 'Clean & Contemporary' },
                        { id: 'serif', label: 'Editorial Serif', preview: 'Literary & Elegant' },
                        { id: 'mono', label: 'Code Monospace', preview: 'Minimalist Tech' },
                        { id: 'cursive', label: 'Italic Script', preview: 'Poetic & Expressive' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setFontFamily(item.id as FontFamilyType)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            fontFamily === item.id
                              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.preview}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FONT SCALE SHOW WITH PRECISE NUMBERS & SLIDER */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        <ZoomIn className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Font Scale (Real-Time Preview)</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-mono">
                        {fontSizePx}px • {Math.round((fontSizePx / 18) * 100)}%
                      </span>
                    </div>

                    {/* Interactive Range Slider */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min={12}
                        max={36}
                        step={1}
                        value={fontSizePx}
                        onChange={(e) => setFontSizePx(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
                        <span>12px</span>
                        <span>18px (Standard)</span>
                        <span>28px</span>
                        <span>36px</span>
                      </div>
                    </div>

                    {/* Stepped Scale Preset Buttons with Pixel Labels */}
                    <div className="grid grid-cols-6 gap-1.5 pt-1">
                      {FONT_SCALE_PRESETS.map((sz) => {
                        const isSelected = fontSizePx === sz.px;
                        return (
                          <button
                            key={sz.id}
                            onClick={() => setFontSizePx(sz.px)}
                            title={`${sz.name} (${sz.px}px): ${sz.description}`}
                            className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs scale-105 font-bold'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <span className="text-[11px] font-bold">{sz.label}</span>
                            <span className={`text-[9px] font-mono ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                              {sz.px}px
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Text Alignment
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                      {[
                        { id: 'left', label: 'Left', icon: AlignLeft },
                        { id: 'center', label: 'Center', icon: AlignCenter },
                        { id: 'right', label: 'Right', icon: AlignRight },
                      ].map((al) => {
                        const Icon = al.icon;
                        return (
                          <button
                            key={al.id}
                            onClick={() => setTextAlign(al.id as TextAlignType)}
                            className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              textAlign === al.id
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{al.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Edit Quote Content */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Quote Content
                      </label>
                      <button
                        onClick={() => setIsEditingText(!isEditingText)}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        {isEditingText ? 'Done Editing' : 'Customize Text'}
                      </button>
                    </div>
                    {isEditingText ? (
                      <textarea
                        rows={3}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Type custom quote..."
                      />
                    ) : (
                      <div
                        onClick={() => setIsEditingText(true)}
                        className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-500 truncate cursor-pointer hover:bg-slate-100"
                      >
                        "{editedContent || message.content}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ELEMENTS & STATIC AUTHOR / HANDLE OPTIONS */}
              {activeTab === 'elements' && (
                <div className="space-y-4">
                  {/* Header / Mode Banner */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Author & Element Controls
                    </div>
                    <button
                      onClick={handleResetToOriginal}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                      title="Reset author and metadata back to tweet source"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Message</span>
                    </button>
                  </div>

                  {/* STATIC / CUSTOM AUTHOR & HANDLE INPUT SECTION */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Author & Handle Settings</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full font-medium">
                        Customizable
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Author Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Author Name:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="e.g. Maya Angelou"
                            className="w-full text-xs pl-7 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Author Handle */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Author Handle:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={authorHandle}
                            onChange={(e) => setAuthorHandle(e.target.value)}
                            placeholder="e.g. @quoteshunter"
                            className="w-full text-xs pl-7 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <AtSign className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {/* Avatar Initials */}
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Avatar Initials:
                        </label>
                        <input
                          type="text"
                          maxLength={3}
                          value={customInitials}
                          onChange={(e) => setCustomInitials(e.target.value.toUpperCase())}
                          placeholder="MA"
                          className="w-full text-xs text-center font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Category Badge Tag */}
                      <div className="col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Category Badge Tag:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={customTag}
                            onChange={(e) => setCustomTag(e.target.value)}
                            placeholder="#quotes"
                            className="w-full text-xs pl-6 pr-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                          <Hash className="w-3 h-3 text-slate-400 absolute left-2 top-1.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Date / Timestamp */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Display Date / Timestamp:
                      </label>
                      <input
                        type="text"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        placeholder="e.g. September 2026 or Today"
                        className="w-full text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Watermark Branding Input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Watermark / Signature Text:
                    </label>
                    <input
                      type="text"
                      value={customWatermark}
                      onChange={(e) => setCustomWatermark(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Quoteshunter • Curated"
                    />
                  </div>

                  {/* INDEPENDENT VISIBILITY TOGGLES */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Visibility Switches
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Avatar Icon', checked: showAvatar, setter: setShowAvatar },
                        { label: 'Author Name', checked: showAuthorName, setter: setShowAuthorName },
                        { label: 'Author Handle', checked: showAuthorHandle, setter: setShowAuthorHandle },
                        { label: 'Category Tag', checked: showSheetBadge, setter: setShowSheetBadge },
                        { label: 'Date / Time', checked: showDate, setter: setShowDate },
                        { label: 'Watermark', checked: showWatermark, setter: setShowWatermark },
                      ].map((item, idx) => (
                        <label
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                          <span className="truncate pr-1">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(e) => item.setter(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer shrink-0"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar: Download & Copy Image */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Copy Image Button */}
                <button
                  onClick={handleCopyImage}
                  disabled={isExporting}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    copiedSuccess
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {copiedSuccess ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedSuccess ? 'Copied Image!' : 'Copy Image'}</span>
                </button>

                {/* Download High-Res PNG */}
                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  {isExporting ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>Download HD PNG</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <span>Quoteshunter 2.5x Retina Export</span>
                <span>•</span>
                <span>Ready for WhatsApp & Instagram</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
