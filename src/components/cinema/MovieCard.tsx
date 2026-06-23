import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Calendar, Heart, Play } from 'lucide-react';
import { Movie } from '../../types';
import { Badge } from '../ui';
import { Link } from 'react-router-dom';
import { MoviePoster, MovieBackdrop } from './MoviePoster';
import { getGenreColor } from '../../lib/utils';

interface MovieCardProps {
  movie: Movie;
  variant?: 'default' | 'featured' | 'compact';
  onSelect?: (movie: Movie) => void;
}

export function MovieCard({ movie, variant = 'default', onSelect }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[500px] rounded-2xl overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Solid Color Backdrop */}
        <MovieBackdrop genres={movie.genre} title={movie.title} />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/60 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genre.slice(0, 3).map(g => (
                  <Badge key={g} variant="primary">{g}</Badge>
                ))}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
              <p className="text-secondary-300 line-clamp-2 mb-4">{movie.description}</p>
              <div className="flex items-center gap-4 text-sm text-secondary-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {movie.duration_minutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <Badge variant="warning">{movie.rating}</Badge>
              </div>
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-3"
                >
                  <Link
                    to={`/movie/${movie.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-semibold transition-colors"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Watch Trailer
                  </Link>
                  <Link
                    to={`/movie/${movie.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-cinema-gold hover:bg-warning-400 rounded-lg text-cinema-dark font-semibold transition-colors"
                  >
                    Book Now
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 p-3 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              isFavorite ? 'text-error-500 fill-current' : 'text-white'
            }`}
          />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        {/* Poster - Solid Color */}
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-4">
          <MoviePoster genres={movie.genre} title={movie.title} size="md" />

          {/* Gradient Overlay on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/40 to-transparent"
              />
            )}
          </AnimatePresence>

          {/* Rating Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="gold">{movie.rating}</Badge>
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            } ${isFavorite ? 'bg-error-500' : 'bg-black/40 backdrop-blur-sm'}`}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'text-white fill-current' : 'text-white'
              }`}
            />
          </motion.button>

          {/* Book Now Button - appears on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <div className="flex items-center justify-center gap-2 py-3 bg-cinema-gold hover:bg-warning-400 rounded-lg text-cinema-dark font-semibold transition-colors">
                  <Play className="w-4 h-4" fill="currentColor" />
                  Book Tickets
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Movie Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-secondary-100 group-hover:text-cinema-gold transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-secondary-400">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-cinema-gold fill-current" />
              <span>8.5</span>
            </div>
            <span>•</span>
            <span>{movie.duration_minutes} min</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {movie.genre.slice(0, 2).map(g => (
              <span key={g} className="text-xs text-secondary-500">
                {g}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function MovieCardCompact({ movie }: { movie: Movie }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary-800/50 transition-colors group"
    >
      <MoviePoster genres={movie.genre} title={movie.title} size="sm" />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-secondary-100 group-hover:text-cinema-gold transition-colors truncate">
          {movie.title}
        </h4>
        <div className="flex items-center gap-2 text-sm text-secondary-500">
          <span>{movie.duration_minutes} min</span>
          <span>•</span>
          <span>{movie.genre[0]}</span>
        </div>
      </div>
      <Badge variant="warning">{movie.rating}</Badge>
    </Link>
  );
}
