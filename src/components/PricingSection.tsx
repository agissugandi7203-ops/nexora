import React from 'react';
import { Button } from './Button';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

export const PricingSection: React.FC = () => {
  const { ref, isInView } = useInViewAnimation<HTMLElement>(0.1, true);

  return (
    <section
      ref={ref}
      id="pricing"
      className="w-full py-16 px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1 (Light - IDR): Paket Sekolah */}
          <div
            style={{ animationDelay: '0.1s' }}
            className={`bg-white rounded-[40px] pl-8 pr-8 sm:pl-10 sm:pr-10 pt-8 pb-10 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <div>
              <h3 className="text-[22px] font-medium text-[#0D212C]">
                Paket Sekolah
              </h3>
              <div className="mt-4 text-[#051A24]/70 text-sm md:text-base leading-relaxed">
                <p>Implementasi LMS mandiri untuk institusi.</p>
                <p>Termasuk pelatihan staf dan pendampingan penuh.</p>
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-6">
                <div className="text-2xl font-semibold text-[#0D212C]">Rp 15.000.000</div>
                <div className="text-xs font-normal text-[#051A24]/60 mt-1 uppercase tracking-wider">
                  Per Semester
                </div>
              </div>

              <div>
                <Button
                  variant="tertiary"
                  href="https://wa.me/6282240487638"
                  target="_blank"
                >
                  Start a chat
                </Button>
              </div>
            </div>
          </div>

          {/* Card 2 (Dark - USD): Monthly Partnership */}
          <div
            style={{ animationDelay: '0.2s' }}
            className={`bg-[#051A24] rounded-[40px] pl-8 pr-8 sm:pl-10 sm:pr-10 pt-8 pb-10 shadow-[inset_0_2px_12px_rgba(255,255,255,0.08)] flex flex-col justify-between ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <div>
              <h3 className="text-[22px] font-medium text-[#F6FCFF]">
                Monthly Partnership
              </h3>
              <div className="mt-4 text-[#E0EBF0] text-sm md:text-base leading-relaxed">
                <p>A dedicated creative digital team.</p>
                <p>You work directly with the dedicated Marhas team.</p>
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-6">
                <div className="text-2xl font-semibold text-[#F6FCFF]">$5,000</div>
                <div className="text-xs font-normal text-[#E0EBF0]/70 mt-1 uppercase tracking-wider">
                  Monthly
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  href="https://wa.me/6282240487638"
                  target="_blank"
                  className="!bg-white !text-[#051A24] !shadow-none hover:!bg-slate-100"
                >
                  Start a chat
                </Button>
                <Button
                  variant="secondary"
                  href="https://wa.me/6282240487638"
                  target="_blank"
                  className="!bg-transparent !text-[#F6FCFF] !border !border-white/20 !shadow-none hover:!bg-white/10"
                >
                  How it works
                </Button>
              </div>
            </div>
          </div>

          {/* Card 3 (Light - USD): Custom Project */}
          <div
            style={{ animationDelay: '0.3s' }}
            className={`bg-white rounded-[40px] pl-8 pr-8 sm:pl-10 sm:pr-10 pt-8 pb-10 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <div>
              <h3 className="text-[22px] font-medium text-[#0D212C]">
                Custom Project
              </h3>
              <div className="mt-4 text-[#051A24]/70 text-sm md:text-base leading-relaxed">
                <p>Fixed scope, fixed timeline.</p>
                <p>Same team, same standards.</p>
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-6">
                <div className="text-2xl font-semibold text-[#0D212C]">$5,000</div>
                <div className="text-xs font-normal text-[#051A24]/60 mt-1 uppercase tracking-wider">
                  Minimum
                </div>
              </div>

              <div>
                <Button
                  variant="tertiary"
                  href="https://wa.me/6282240487638"
                  target="_blank"
                >
                  Start a chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;