import React from 'react';

export const MARQUEE_IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif',
  'https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
];

export const InfiniteMarquee: React.FC = () => {
  // Duplicated images for infinite seamless loop (16 total)
  const duplicatedImages = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES];

  return (
    <section className="w-full mt-16 md:mt-20 mb-16 overflow-hidden select-none">
      <div className="flex w-max animate-marquee pause-on-hover">
        {duplicatedImages.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="shrink-0 mx-3 rounded-2xl overflow-hidden shadow-lg bg-slate-100 transform-gpu"
          >
            <img
              src={src}
              alt={`Studio showcase project ${(index % 8) + 1}`}
              className="h-[280px] md:h-[500px] w-auto max-w-none object-cover rounded-2xl block"
              decoding="async"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfiniteMarquee;
