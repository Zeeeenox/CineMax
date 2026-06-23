import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Movie } from '../types';
import { MovieCard } from '../components/cinema/MovieCard';
import { MovieCardSkeleton, Input } from '../components/ui';
import { Search, Filter, X } from 'lucide-react';

export function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchQuery, selectedGenre]);

  async function fetchMovies() {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('release_date', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }

  function filterMovies() {
    let filtered = [...movies];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        m =>
          m.title.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.genre.some(g => g.toLowerCase().includes(query))
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(m => m.genre.includes(selectedGenre));
    }

    setFilteredMovies(filtered);
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  }

  const allGenres = [...new Set(movies.flatMap(m => m.genre))];

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-100 mb-2">Movies</h1>
          <p className="text-secondary-400">Discover and book your next cinema experience</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search movies, genres..."
              className="w-full pl-12 pr-4 py-3 bg-secondary-800/50 border border-secondary-700 rounded-xl text-secondary-100 placeholder-secondary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary-700"
              >
                <X className="w-4 h-4 text-secondary-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
              showFilters
                ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                : 'bg-secondary-800/50 border-secondary-700 text-secondary-300 hover:border-primary-500/50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </motion.div>

        {/* Genre Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === null
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-800 text-secondary-300 hover:bg-secondary-700'
                }`}
              >
                All
              </button>
              {allGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedGenre === genre
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-800 text-secondary-300 hover:bg-secondary-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        {!loading && (
          <p className="text-secondary-400 mb-6">
            {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-secondary-500" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-200 mb-2">No movies found</h3>
            <p className="text-secondary-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MoviesPage;
