import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectProducts } from "../features/product/productSelectors";
import { Search, X } from "lucide-react";
import { Product } from "../features/product/productTypes";
import { Link } from "react-router-dom";

interface ProductSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  placeholder = "Search products...",
}) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const allProducts = useSelector(selectProducts);

  // Debounced filtering
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const filtered = allProducts
        .filter((product) =>
          product.name.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, [input, allProducts]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setShowSuggestions(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        handleSearch(suggestions[highlightIndex].name);
        setInput(suggestions[highlightIndex].name);
      } else {
        handleSearch(input);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHighlightIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        {input && (
          <button
            onClick={() => {
              setInput("");
              setSuggestions([]);
              setShowSuggestions(false);
              setHighlightIndex(-1);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto animate-fadeIn">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((product, idx) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => {
                    setInput(product.name);
                    setShowSuggestions(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-50 ${
                    idx === highlightIndex ? "bg-gray-100" : ""
                  }`}
                >
                  <img
                    src={product.variants[0]?.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                  </div>
                </Link>
              ))}
              <button
                onClick={() => {
                  handleSearch(input);
                  inputRef.current?.focus();
                }}
                className="w-full px-4 py-2 text-sm text-indigo-600 hover:underline text-left"
              >
                View all results for "{input}"
              </button>
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
