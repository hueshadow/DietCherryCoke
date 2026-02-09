import { useState } from 'react';
import SearchOverlay from './SearchOverlay';

export default function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#a3a3a3', transition: 'color 0.25s', padding: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f5f5f5'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#a3a3a3'; }}
        aria-label="Search"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
      </button>
      <SearchOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
