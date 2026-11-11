import React from 'react';

export const CopyrightBar: React.FC = () => {
  return (
    <div className="w-full bg-white pb-24 md:pb-16 pt-3">
      <div className="max-w-[1240px] px-6 py-4 mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs md:text-sm text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Marhas LMS &middot; SMK Marhas Margahayu. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <span>Dibuat dengan dedikasi di Margahayu, Bandung &mdash; Indonesia</span>
          <span aria-label="Bendera Indonesia">🇮🇩</span>
        </div>
      </div>
    </div>
  );
};

export default CopyrightBar;