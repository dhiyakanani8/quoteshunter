import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Download } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  authorName?: string;
  caption?: string;
  onClose: () => void;
}

export default function ImageLightbox({
  isOpen,
  imageUrl,
  authorName,
  caption,
  onClose,
}: ImageLightboxProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
        >
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">
                {authorName ? `Photo by ${authorName}` : 'Media Preview'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Open original image"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950 flex items-center justify-center max-h-[78vh]">
            <img
              src={imageUrl}
              alt={caption || 'Preview'}
              referrerPolicy="no-referrer"
              className="max-h-[78vh] w-auto max-w-full object-contain"
            />
          </div>

          {/* Caption footer if available */}
          {caption && (
            <div className="w-full mt-2.5 px-2 py-1.5 text-xs text-slate-300 text-center truncate">
              {caption}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
