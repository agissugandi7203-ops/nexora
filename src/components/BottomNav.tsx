import React from 'react';
import { Button } from './Button';

export const BottomNav: React.FC = () => {
  return (
    <aside
      aria-label="Quick actions"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <div className="bg-white rounded-full px-6 py-2 flex items-center gap-5 shadow-floating-nav border border-slate-100/80 backdrop-blur-md">
        {/* Geometric X Logo SVG */}
        <a
          href="#hero"
          className="w-8 h-8 rounded-xl bg-[#051A24] flex items-center justify-center hover:opacity-85 transition-opacity outline-none shadow-sm"
          aria-label="Back to top"
        >
          <svg
            className="w-4 h-4 fill-white"
            viewBox="0 0 256 256"
            aria-hidden="true"
          >
            <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
          </svg>
        </a>

        {/* "Start a chat" primary button */}
        <Button
          variant="primary"
          href="https://wa.me/6282240487638"
          target="_blank"
          className="!px-6 !py-2.5 !text-sm"
        >
          Start a chat
        </Button>
      </div>
    </aside>
  );
};

export default BottomNav;