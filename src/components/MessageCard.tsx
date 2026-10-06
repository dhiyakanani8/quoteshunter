import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Repeat2,
  Eye,
  Bookmark,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { SheetMessage } from '../types';
import {
  formatDateString,
  formatMetricNumber,
  getAvatarColor,
  isValidImageUrl,
} from '../utils/formatters';

interface MessageCardProps {
  key?: React.Key;
  message: SheetMessage;
  isBookmarked: boolean;
  onToggleBookmark: (msg: SheetMessage) => void;
  isLiked?: boolean;
  onToggleLike?: (msg: SheetMessage) => void;
  onOpenImage: (url: string, author?: string, caption?: string) => void;
  onOpenPosterGenerator?: (msg: SheetMessage) => void;
  layout?: 'grid' | 'list' | 'masonry';
}

export default function MessageCard({
  message,
  isBookmarked,
  onToggleBookmark,
  isLiked: isLikedProp,
  onToggleLike: onToggleLikeProp,
  onOpenImage,
  onOpenPosterGenerator,
  layout = 'grid',
}: MessageCardProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Likes state handling with local storage fallback
  const [internalLiked, setInternalLiked] = useState(() => {
    try {
      const saved = localStorage.getItem('sheetstream_likes');
      if (saved) {
        const list: number[] = JSON.parse(saved);
        return list.includes(message._rowNumber);
      }
    } catch {
      // ignore
    }
    return false;
  });

  const isLiked = isLikedProp !== undefined ? isLikedProp : internalLiked;

  const baseLikes = typeof message.likes === 'number'
    ? message.likes
    : parseInt(String(message.likes || '0').replace(/,/g, ''), 10) || 0;

  const displayLikes = isLiked ? baseLikes + 1 : baseLikes;

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleLikeProp) {
      onToggleLikeProp(message);
    } else {
      const nextLiked = !internalLiked;
      setInternalLiked(nextLiked);
      try {
        const saved = localStorage.getItem('sheetstream_likes');
        const list: number[] = saved ? JSON.parse(saved) : [];
        const updated = nextLiked
          ? Array.from(new Set([...list, message._rowNumber]))
          : list.filter((id) => id !== message._rowNumber);
        localStorage.setItem('sheetstream_likes', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update likes in storage', err);
      }
    }
  };

  const hasImage = isValidImageUrl(message.imageURL) && !imageError;
  const avatarTheme = getAvatarColor(message.username || message.userID || 'User');
  const userInitials = (message.username || message.userID || 'U')
    .slice(0, 2)
    .toUpperCase();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = message.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={`group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden ${
        layout === 'list' ? 'p-5 sm:flex-row sm:items-start gap-4' : 'p-5'
      }`}
    >
      <div className="flex-1 min-w-0">
        {/* Author Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div
              className={`w-10 h-10 rounded-xl ${avatarTheme.bg} ${avatarTheme.text} flex items-center justify-center font-bold text-sm shrink-0 shadow-xs border border-white/60 dark:border-slate-800`}
            >
              {userInitials}
            </div>

            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {message.username || 'Anonymous'}
                </span>
                {message.types && (
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                    {message.types}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {message.userID && <span>{message.userID}</span>}
                {(message.datetime || message.timestamp) && (
                  <>
                    <span>•</span>
                    <span>{formatDateString(message.datetime || message.timestamp)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Row Number Badge */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg shrink-0">
            <span>#{message._rowNumber}</span>
          </div>
        </div>

        {/* Message Content */}
        <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line break-words my-3 font-normal selection:bg-emerald-100 selection:text-emerald-900">
          {message.content}
        </div>

        {/* Attached Image Media (if present) */}
        {hasImage && (
          <div
            onClick={() =>
              onOpenImage(
                message.imageURL!,
                message.username || message.userID,
                message.content
              )
            }
            className="relative mt-3 mb-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 group/img cursor-pointer max-h-72 flex items-center justify-center"
          >
            <img
              src={message.imageURL}
              alt="Feed attachment"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full max-h-72 object-cover transition-transform duration-300 group-hover/img:scale-102"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-medium backdrop-blur-xs">
                <Maximize2 className="w-3.5 h-3.5" />
                View Fullscreen
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        {/* Engagement Stats */}
        <div className="flex items-center gap-3.5 sm:gap-4 flex-wrap">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer group/like ${
              isLiked
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'hover:text-rose-500 text-slate-500 dark:text-slate-400'
            }`}
            title={isLiked ? `${formatMetricNumber(displayLikes)} likes (Click to unlike)` : `${formatMetricNumber(displayLikes)} likes (Click to like)`}
            aria-label="Like message"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform group-hover/like:scale-110 active:scale-125 ${
                isLiked
                  ? 'text-rose-500 fill-rose-500'
                  : 'text-rose-500/80 fill-rose-500/20 group-hover/like:fill-rose-500/40'
              }`}
            />
            <span>{formatMetricNumber(displayLikes)}</span>
          </button>

          <span
            className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
            title={`${formatMetricNumber(message.reposts)} reposts`}
          >
            <Repeat2 className="w-3.5 h-3.5 text-emerald-500/80" />
            <span>{formatMetricNumber(message.reposts)}</span>
          </span>

          <span
            className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
            title={`${formatMetricNumber(message.views)} views`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-500/80" />
            <span>{formatMetricNumber(message.views)}</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Read aloud / Text to Speech */}
          <button
            onClick={handleSpeak}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={isSpeaking ? 'Stop reading' : 'Read aloud'}
            aria-label="Read quote aloud"
          >
            {isSpeaking ? (
              <VolumeX className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Copy Message Text */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title={copied ? 'Copied!' : 'Copy text'}
            aria-label="Copy text"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Bookmark message */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(message);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
            aria-label="Bookmark message"
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isBookmarked ? 'fill-amber-500 text-amber-500' : ''
              }`}
            />
          </button>

          {/* Quote-to-Image Poster Generator */}
          {onOpenPosterGenerator && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPosterGenerator(message);
              }}
              className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              title="Create aesthetic poster/card"
              aria-label="Generate quote poster"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Open original tweetURL */}
          {message.tweetURL && (
            <a
              href={message.tweetURL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Open source post"
              aria-label="Open source post"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
