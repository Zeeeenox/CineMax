import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Star, Users, Film } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Movie } from '../types';
import { useBooking } from '../context/BookingContext';
import { ShowtimeSelector } from '../components/cinema/ShowtimeSelector';
import { FullPageLoader, Badge } from '../components/ui';
import { MoviePoster, MovieBackdrop } from '../components/cinema/MoviePoster';
import { getGenreGradient } from '../lib/utils';

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { setMovie: setBookingMovie, state } = useBooking();

  useEffect(() => {
    if (id) fetchMovie();
  }, [id]);

  async function fetchMovie() {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setMovie(data);

      if (data && (!state.movie || state.movie.id !== data.id)) {
        setBookingMovie(data);
      }
    } catch (err) {
      console.error('Error fetching movie:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <FullPageLoader />;
  if (!movie) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0" style={{ background: getGenreGradient(movie.genre) }}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/30">
              <Film className="w-20 h-20" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-cinema-dark/60 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container-custom">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-secondary-400 hover:text-secondary-200 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="flex gap-6 md:gap-8 pb-8">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden md:block flex-shrink-0"
              >
                <MoviePoster genres={movie.genre} title={movie.title} size="lg" />
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 pt-8"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genre.map(g => (
                    <Badge key={g} variant="primary">{g}</Badge>
                  ))}
                  <Badge variant="warning">{movie.rating}</Badge>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-secondary-300 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{movie.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Film className="w-5 h-5" />
                    <span>{movie.director}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-6 h-6 text-cinema-gold fill-current" />
                    <span className="text-2xl font-bold text-cinema-gold">8.5</span>
                    <span className="text-secondary-400">/10</span>
                  </div>
                  <span className="text-secondary-500">12.5K ratings</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div>
              <h2 className="text-xl font-bold text-secondary-100 mb-4">Synopsis</h2>
              <p className="text-secondary-300 leading-relaxed">{movie.description}</p>
            </div>

            {/* Cast */}
            {movie.starring && movie.starring.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-secondary-100 mb-4">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.starring.map(actor => (
                    <div
                      key={actor}
                      className="flex items-center gap-3 px-4 py-3 bg-secondary-800/50 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-secondary-700 flex items-center justify-center">
                        <Users className="w-5 h-5 text-secondary-400" />
                      </div>
                      <div>
                        <div className="font-medium text-secondary-100">{actor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Showtimes */}
            <div>
              <h2 className="text-xl font-bold text-secondary-100 mb-4">Select Showtime</h2>
              <ShowtimeSelector movieId={movie.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Movie Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6 space-y-4 md:hidden"
            >
              <MoviePoster genres={movie.genre} title={movie.title} size="md" />
            </motion.div>

            {/* Movie Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-400">Duration</span>
                  <span className="text-secondary-100">{movie.duration_minutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-400">Director</span>
                  <span className="text-secondary-100">{movie.director}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-400">Release</span>
                  <span className="text-secondary-100">
                    {new Date(movie.release_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-400">Genre</span>
                  <span className="text-secondary-100">{movie.genre.join(', ')}</span>
                </div>
              </div>
            </motion.div>

            {/* Price Info */}
            <div className="card p-6 space-y-3">
              <h3 className="font-semibold text-secondary-100">Ticket Prices</h3>
              <div className="flex justify-between">
                <span className="text-secondary-400">Regular</span>
                <span className="text-secondary-100 font-medium">$12.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cinema-gold">Premium</span>
                <span className="text-cinema-gold font-medium">$18.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
