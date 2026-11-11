import React, { useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marcus Anderson',
    role: 'CEO',
    company: 'Data.storage',
    quote:
      'With very little guidance team delivered designs that were consistently spot on. Their attention to detail and ability to translate complex concepts into elegant interfaces is unmatched.',
    avatar:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'alexwu',
    role: 'Founder',
    company: 'Nexgate',
    quote:
      'Marhas LMS led the creation of our best interactive deck to date! The strategic framing and bespoke visual identity were instrumental in closing our round ahead of schedule.',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'James Mitchell',
    role: 'VP Product',
    company: 'LaunchPad',
    quote:
      'Working with Marhas LMS transformed our platform vision into reality with speed and unmatched precision. A rare partner who truly understands high-stakes digital experiences.',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Rachel Foster',
    role: 'Co-founder',
    company: 'Nexus Labs',
    quote:
      'The learning quality exceeded our expectations at every milestone. Marhas LMS brings world-class discipline and craft to modern education.',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'David Zhang',
    role: 'Head of Design',
    company: 'Paradigm Labs',
    quote:
      'Incredible work from start to finish. Fast, highly communicative, and deeply dedicated to elevating product craftsmanship to the highest standard.',
    avatar:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export const TestimonialCarousel: React.FC = () => {
  const { ref, isInView } = useInViewAnimation<HTMLElement>(0.1, true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicated list of testimonials so the loop is seamless and endless ("gahabis habis")
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  const handleScrollPrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const handleScrollNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={ref}
      id="clientele"
      className="w-full py-20 overflow-hidden bg-white select-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header row aligned to right on desktop */}
        <div className="w-full md:max-w-4xl md:ml-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight font-medium">
            What <span className="font-mondwest italic font-normal">builders</span> say
          </h2>

          <div className="flex items-center gap-6">
            {/* Stars & Clutch rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-black text-black" />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#0D212C]">Clutch 5/5</span>
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleScrollPrev}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-full border border-[#0D212C]/20 flex items-center justify-center text-[#0D212C] hover:bg-[#0D212C]/5 transition-colors active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleScrollNext}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-full border border-[#0D212C]/20 flex items-center justify-center text-[#0D212C] hover:bg-[#0D212C]/5 transition-colors active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Endless Never-Ending Sliding Track */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="w-full overflow-hidden px-6"
      >
        <div
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
          className={`flex gap-6 w-max animate-testimonial-endless ${
            isInView ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-700`}
        >
          {duplicatedTestimonials.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              style={{ width: 'min(427.5px, calc(100vw - 48px))' }}
              className="bg-white rounded-[32px] md:rounded-[40px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 px-6 md:pl-10 md:pr-16 py-8 flex flex-col justify-between shrink-0 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {/* Custom Quote SVG Icon */}
              <div>
                <svg
                  className="w-8 h-8 text-[#0D212C] fill-current mb-5 opacity-90"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.2m10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.2" />
                </svg>

                {/* Quote text */}
                <p className="text-base text-[#0D212C] leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author row */}
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-slate-100">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover bg-slate-100 shrink-0"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-semibold text-sm text-[#0D212C]">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#051A24]/70 mt-0.5">
                    &rarr; {item.role}, {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
