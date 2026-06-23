import React from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import { getGenreColor, getGenreGradient } from '../../lib/utils';

interface MoviePosterProps {
  genres: string[];
  title: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showIcon?: boolean;
}

export function MoviePoster({ genres, title, className = '', size = 'md', showIcon = true }: MoviePosterProps) {
  const gradient = getGenreGradient(genres);
  const textColor = genres?.includes('Horror') || genres?.includes('Action') || genres?.includes('Sci-Fi') || genres?.includes('Thriller')
    ? 'text-white'
    : 'text-white';

  const sizeStyles = {
    sm: 'w-12 h-16',
    md: 'w-full aspect-[2/3]',
    lg: 'w-48 lg:w-64',
    full: 'w-full h-full',
  };

  return (
    <div
      className={`${sizeStyles[size]} rounded-lg overflow-hidden flex items-center justify-center ${className}`}
      style={{ background: gradient }}
    >
      <div className="text-center p-4">
        {showIcon && (
          <div className="flex justify-center mb-2">
            <Film className={`w-8 h-8 ${textColor} opacity-60`} />
          </div>
        )}
        <div className={`${textColor} font-medium text-sm opacity-80 line-clamp-2`}>
          {title}
        </div>
      </div>
    </div>
  );
}

interface MovieBackdropProps {
  genres: string[];
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export function MovieBackdrop({ genres, title, className = '', children }: MovieBackdropProps) {
  const gradient = getGenreGradient(genres);

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{ background: gradient }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-white/60 text-center">
          <Film className="w-16 h-16 mx-auto mb-3 opacity-80" />
          <p className="text-lg font-medium opacity-80">{title}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

interface PlaceholderImageProps {
  color: string;
  className?: string;
  title?: string;
}

export function PlaceholderImage({ color, className = '', title }: PlaceholderImageProps) {
  return (
    <div
      className={`${className} flex items-center justify-center`}
      style={{ background: `linear-gradient(135deg, ${color}, ${adjustBrightness(color, -30)})` }}
    >
      {title && (
        <div className="text-white/60 text-center p-4">
          <Film className="w-8 h-8 mx-auto opacity-70" />
        </div>
      )}
    </div>
  );
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}
