import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectProducts } from '../features/product/productSelectors';
import { Search } from 'lucide-react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  isMobile?: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  placeholder = 'Search products...',
  initialValue = '',
  isMobile = false,
}) => {
  const [input, setInput] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const allProducts = useSelector(selectProducts);

  const productNames = useMemo(() => allProducts.map(p => p.name), [allProducts]);

  // Debounce input
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      const filtered = productNames
        .filter(name => name.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 5);

      setSuggestions(filtered);
      setShowSuggestions(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, [input, productNames]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setShowSuggestions(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setHighlightIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightIndex >= 0) {
        handleSearch(suggestions[highlightIndex]);
        setInput(suggestions[highlightIndex]);
      } else {
        handleSearch(input);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'w-full max-w-md'}`} ref={wrapperRef}>
      <div className={`flex ${isMobile ? 'gap-2' : 'gap-1'}`}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-terracotta-600 ${
            isMobile 
              ? 'px-4 py-2 text-base placeholder-gray-400'
              : 'px-4 py-1.5 text-sm'
          }`}
          aria-autocomplete="list"
          aria-controls="product-suggestions"
          aria-activedescendant={
            highlightIndex >= 0 ? `suggestion-${highlightIndex}` : undefined
          }
        />
        <button
          aria-label="Search"
          className={`flex items-center justify-center rounded-lg bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors ${
            isMobile ? 'px-4 py-2' : 'px-3 py-1.5'
          }`}
          onClick={() => handleSearch(input)}
        >
          <Search size={isMobile ? 20 : 18} />
          {isMobile && <span className="ml-2">Search</span>}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="product-suggestions"
          className={`absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
            isMobile ? 'py-2' : 'py-1'
          }`}
        >
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              id={`suggestion-${idx}`}
              onClick={() => {
                setInput(s);
                handleSearch(s);
              }}
              className={`px-4 cursor-pointer ${
                isMobile ? 'py-3' : 'py-2'
              } ${
                idx === highlightIndex ? 'bg-terracotta-50' : 'hover:bg-gray-50'
              }`}
              role="option"
              aria-selected={highlightIndex === idx}
            >
              <div className="truncate">{s}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductSearch;