import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Ticket, Play, Film } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Movie } from '../types';
import { MovieCard } from '../components/cinema/MovieCard';
import { MovieCardSkeleton } from '../components/ui/Skeleton';
import { getGenreGradient } from '../lib/utils';

export function HomePage() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [nowShowingMovies, setNowShowingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFeatured, setCurrentFeatured] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentFeatured(prev => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  async function fetchMovies() {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('release_date', { ascending: false });

      if (error) throw error;

      const featured = (data || []).filter(m => m.is_featured);
      setFeaturedMovies(featured);
      setNowShowingMovies(data || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 bg-secondary-900 animate-pulse" />
        ) : featuredMovies.length > 0 ? (
          <>
            <motion.div
              key={currentFeatured}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
              style={{ background: getGenreGradient(featuredMovies[currentFeatured].genre) }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white/40">
                  <Film className="w-24 h-24" />
                </div>
              </div>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-cinema-dark/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="container-custom">
                <motion.div
                  key={currentFeatured}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-2xl"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-2 mb-4"
                  >
                    {featuredMovies[currentFeatured].genre.slice(0, 3).map(g => (
                      <span
                        key={g}
                        className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm font-medium border border-primary-500/30"
                      >
                        {g}
                      </span>
                    ))}
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl font-bold text-white mb-4"
                  >
                    {featuredMovies[currentFeatured].title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg text-secondary-300 mb-6 line-clamp-2"
                  >
                    {featuredMovies[currentFeatured].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-4 mb-8"
                  >
                    <span className="flex items-center gap-2 text-secondary-400">
                      <Clock className="w-5 h-5" />
                      {featuredMovies[currentFeatured].duration_minutes} min
                    </span>
                    <span className="px-2 py-1 rounded bg-cinema-gold/20 text-cinema-gold text-sm font-bold">
                      {featuredMovies[currentFeatured].rating}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-4"
                  >
                    <Link
                      to={`/movie/${featuredMovies[currentFeatured].id}`}
                      className="flex items-center gap-2 px-8 py-4 bg-cinema-gold hover:bg-warning-400 rounded-xl text-cinema-dark font-bold text-lg transition-colors shadow-lg shadow-warning-500/25"
                    >
                      <Ticket className="w-6 h-6" />
                      Book Now
                    </Link>
                    <button className="flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white font-semibold transition-colors">
                      <Play className="w-6 h-6" fill="currentColor" />
                      Watch Trailer
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Featured Movie Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeatured(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentFeatured
                      ? 'w-8 bg-cinema-gold'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </section>

      {/* Now Showing Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary-100">Now Showing</h2>
              <p className="text-secondary-400 mt-1">Discover the latest movies in theaters</p>
            </div>
            <Link to="/movies" className="text-primary-400 hover:text-primary-300 font-medium">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {nowShowingMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
