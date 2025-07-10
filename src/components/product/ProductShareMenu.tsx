import { useState, useRef, useEffect } from 'react';
import {
  Share2, Check, Twitter, Clipboard, MessageCircleMore, Send, Facebook,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductShareMenuProps {
  product: {
    id: string;
    name: string;
    description?: string;
    variants?: { price: number }[];
  };
}

const getShareURL = (productId: string) => `${window.location.origin}/product/${productId}`;

const generateShareText = (
  product: ProductShareMenuProps['product'],
  platform: 'generic' | 'twitter' | 'whatsapp' = 'generic'
) => {
  const link = getShareURL(product.id);
  const name = product.name || 'Amazing Product';
  const description = product.description?.slice(0, 100) || '';
  const price = product.variants?.[0]?.price || 0;

  const message = `Check this out on Picloopz: ${name} - ₹${price.toFixed(2)} ${description ? `- ${description}` : ''} ${link}`;

  return platform === 'generic' ? message : encodeURIComponent(message);
};

const ProductShareMenu: React.FC<ProductShareMenuProps> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText(product));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const link = getShareURL(product.id);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="p-4 rounded-xl border-2 border-cream-300 text-gray-600 hover:bg-cream-50 hover:border-terracotta-300 transition-all"
        aria-label="Share product"
      >
        <Share2 size={20} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute right-0 z-20 mt-2 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 w-60"
            role="menu"
          >
            {/* Native share (if supported) */}
            {navigator.share && (
              <button
                onClick={() =>
                  navigator.share({
                    title: product.name,
                    text: product.description,
                    url: link,
                  }).catch((err) => console.error('Native share failed:', err))
                }
                role="menuitem"
                className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-100 text-gray-800 focus:outline-none focus:ring-2"
              >
                <Share2 size={16} /> Share via device
              </button>
            )}

            <button
              onClick={() =>
                window.open(`https://wa.me/?text=${generateShareText(product, 'whatsapp')}`, '_blank')
              }
              role="menuitem"
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-green-50 text-green-700 focus:outline-none focus:ring-2"
            >
              <MessageCircleMore size={16} /> WhatsApp
            </button>

            <button
              onClick={() =>
                window.open(`https://twitter.com/intent/tweet?text=${generateShareText(product, 'twitter')}`, '_blank')
              }
              role="menuitem"
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-blue-50 text-blue-700 focus:outline-none focus:ring-2"
            >
              <Twitter size={16} /> Twitter
            </button>

            <button
              onClick={() =>
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank')
              }
              role="menuitem"
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-blue-100 text-blue-800 focus:outline-none focus:ring-2"
            >
              <Facebook size={16} /> Facebook
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${generateShareText(product, 'twitter')}`,
                  '_blank'
                )
              }
              role="menuitem"
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-indigo-100 text-indigo-700 focus:outline-none focus:ring-2"
            >
              <Send size={16} /> Telegram
            </button>

            <button
              onClick={handleCopy}
              role="menuitem"
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-2"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-600" /> Copied!
                </>
              ) : (
                <>
                  <Clipboard size={16} /> Copy to clipboard
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductShareMenu;
