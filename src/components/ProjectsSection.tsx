import React from 'react';
import { useInViewAnimation } from '../hooks/useInViewAnimation';

interface Project {
  name: string;
  description: string;
  image: string;
  alt: string;
}

const PROJECTS: Project[] = [
  {
    name: 'evr',
    description: 'From idea to millions raised for a web3 AI product',
    image: 'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
    alt: 'evr ventures web3 AI showcase',
  },
  {
    name: 'Automation Machines',
    description: 'Streamlining industrial automation processes',
    image: 'https://motionsites.ai/assets/hero-automation-machines-preview-DlTveRIN.gif',
    alt: 'Automation Machines platform showcase',
  },
  {
    name: 'xPortfolio',
    description: 'Modern portfolio management platform',
    image: 'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
    alt: 'xPortfolio platform interface showcase',
  },
];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const { ref, isInView } = useInViewAnimation<HTMLDivElement>(0.1, true);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${(index % 3) * 0.15}s` }}
      className={`w-full flex flex-col ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {/* Text block offset left (ml-20 md:ml-28) */}
      <div className="ml-12 sm:ml-20 md:ml-28 mb-6">
        <h3 className="font-mondwest text-2xl md:text-3xl font-semibold text-[#051A24]">
          {project.name}
        </h3>
        <p className="text-sm md:text-base text-[#051A24]/70 mt-1">
          {project.description}
        </p>
      </div>

      {/* Full-width image below */}
      <div className="w-full overflow-hidden rounded-2xl shadow-lg bg-slate-100 group transform-gpu">
        <img
          src={project.image}
          alt={project.alt}
          className="w-full h-auto max-h-[700px] object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.01] block"
          loading="lazy"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        />
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="w-full max-w-[1200px] px-6 py-12 mx-auto">
      <div className="flex flex-col gap-16 md:gap-20">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
