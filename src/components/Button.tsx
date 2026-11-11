import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  href,
  target,
  rel,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 active:scale-95 cursor-pointer text-center text-sm md:text-base leading-none select-none';

  let variantStyles = '';

  if (variant === 'primary') {
    variantStyles =
      'bg-[#051A24] text-white px-7 py-3 shadow-btn-primary hover:bg-[#092634]';
  } else if (variant === 'secondary') {
    variantStyles =
      'bg-white text-[#051A24] border-0 px-7 py-3 shadow-btn-secondary hover:bg-slate-50';
  } else if (variant === 'tertiary') {
    variantStyles =
      'bg-white text-[#051A24] px-7 py-3 shadow-btn-tertiary hover:bg-slate-50';
  }

  const combinedClass = `${baseStyles} ${variantStyles} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        className={combinedClass}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
