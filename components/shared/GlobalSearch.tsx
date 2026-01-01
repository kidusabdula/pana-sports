"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Users, User, Newspaper, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/lib/hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "team" | "player" | "news" | "match";
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  href: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search API call
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/public/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  const getIcon = (type: string) => {
    switch (type) {
      case "team":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "player":
        return <User className="w-4 h-4 text-green-400" />;
      case "news":
        return <Newspaper className="w-4 h-4 text-purple-400" />;
      case "match":
        return <Calendar className="w-4 h-4 text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 text-zinc-400 hover:text-white"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search</span>
        <kbd className="ml-2 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">⌘K</kbd>
      </Button>

      {/* Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 p-4"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
                  <Search className="w-5 h-5 text-zinc-400" />
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search teams, players, news, matches..."
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-lg placeholder:text-zinc-500"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                  {isLoading && (
                    <div className="p-8 text-center text-zinc-500">
                      Searching...
                    </div>
                  )}

                  {!isLoading && results.length === 0 && query.length >= 2 && (
                    <div className="p-8 text-center text-zinc-500">
                      No results found for &quot;{query}&quot;
                    </div>
                  )}

                  {!isLoading && results.length > 0 && (
                    <div className="divide-y divide-zinc-800">
                      {results.map((result) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          href={result.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors"
                        >
                          {result.image ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-zinc-800">
                              <Image
                                src={result.image}
                                alt={result.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                              {getIcon(result.type)}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-white">
                              {result.title}
                            </p>
                            {result.subtitle && (
                              <p className="text-sm text-zinc-400">
                                {result.subtitle}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-zinc-500 capitalize">
                            {result.type}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
                  <span>Type to search</span>
                  <span>Press ESC to close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
