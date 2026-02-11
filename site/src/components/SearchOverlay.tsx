import { useState, useEffect, useRef, useCallback } from 'react';
import type Fuse from 'fuse.js';

interface SearchItem {
  title: string;
  description: string;
  url: string;
  category: string;
  content: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  article: '#3b82f6',
  recipe: '#22c55e',
  comparison: '#a855f7',
  retailer: '#f59e0b',
};

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fuse.FuseResult<SearchItem>[]>([]);
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<SearchItem> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen && index.length === 0) {
      setLoading(true);
      Promise.all([
        fetch('/search-index.json').then((r) => r.json()),
        import('fuse.js').then((m) => m.default),
      ])
        .then(([data, FuseLib]: [SearchItem[], typeof Fuse]) => {
          setIndex(data);
          fuseRef.current = new FuseLib(data, {
            keys: [
              { name: 'title', weight: 3 },
              { name: 'description', weight: 2 },
              { name: 'content', weight: 1 },
            ],
            threshold: 0.3,
            includeMatches: true,
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, index.length]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3 || !fuseRef.current) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const res = fuseRef.current!.search(value, { limit: 8 });
      setResults(res);
    }, 300);
  }, []);

  const highlightText = (text: string, query: string) => {
    if (!query || query.length < 3) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ background: '#f2444433', color: '#f5f5f5', borderRadius: '2px', padding: '0 2px' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#1a1a1a', border: '1px solid #333',
        borderRadius: '12px', width: '100%', maxWidth: '600px',
        margin: '0 16px', maxHeight: '70vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Search input */}
        <div style={{ padding: '16px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles, recipes, comparisons..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#f5f5f5', fontSize: '16px',
            }}
          />
          <kbd style={{
            background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px',
            padding: '2px 8px', fontSize: '12px', color: '#888888',
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ overflowY: 'auto', padding: '8px' }}>
          {loading && (
            <p style={{ padding: '24px', textAlign: 'center', color: '#888888' }}>Loading search index...</p>
          )}
          {!loading && query.length >= 3 && results.length === 0 && (
            <p style={{ padding: '24px', textAlign: 'center', color: '#888888' }}>No results found for "{query}"</p>
          )}
          {!loading && query.length > 0 && query.length < 3 && (
            <p style={{ padding: '24px', textAlign: 'center', color: '#888888' }}>Type at least 3 characters to search</p>
          )}
          {results.map((result) => (
            <a
              key={result.item.url}
              href={result.item.url}
              onClick={onClose}
              style={{
                display: 'block', padding: '12px', borderRadius: '8px',
                textDecoration: 'none', color: '#f5f5f5',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#262626'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                  padding: '2px 6px', borderRadius: '4px',
                  background: (CATEGORY_COLORS[result.item.category] || '#888888') + '22',
                  color: CATEGORY_COLORS[result.item.category] || '#888888',
                }}>
                  {result.item.category}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  {highlightText(result.item.title, query)}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#a3a3a3', margin: 0, lineHeight: 1.4 }}>
                {highlightText(result.item.description, query)}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
