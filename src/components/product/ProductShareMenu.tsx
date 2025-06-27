import { useState } from 'react';
import { Share2, Check, Twitter, Clipboard, MessageCircleMore } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductShareMenuProps {
  product: {
    id: string;
    name: string;
    description?: string;
    basePrice: number;
    variants?: { additionalPrice: number }[];
  };
}

const generateShareText = (product: ProductShareMenuProps['product']) => {
  const link = `${window.location.origin}/product/${product.id}`;
  const name = product.name || 'Amazing Product';
  const description = product.description?.slice(0, 100) || '';
  const price = (
    product.basePrice +
    (product.variants?.[0]?.additionalPrice || 0)
  ).toFixed(2);

  return `
 Check out this product on Picloopz!

 ${name}
 ${description}

 Price: ₹${price}
 ${link}
  `.trim();
};

const ProductShareMenu: React.FC<ProductShareMenuProps> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = generateShareText(product);
  const encodedText = encodeURIComponent(shareText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute right-0 z-20 mt-2 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 w-56"
          >
            <button
              onClick={() =>
                window.open(`https://wa.me/?text=${encodedText}`, '_blank')
              }
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-green-50 text-green-700"
            >
              <MessageCircleMore size={16} />Whatsapp
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodedText}`,
                  '_blank'
                )
              }
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-blue-50 text-blue-700"
            >
               <Twitter size={15}/> Twitter
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-600" /> Copied to Clipboard!
                </>
              ) : (
                <div className='flex items-center gap-2'><Clipboard size={16}/>Copy to clipboard</div>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductShareMenu;
