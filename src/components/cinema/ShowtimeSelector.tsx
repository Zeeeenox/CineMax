import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Showtime, Theater } from '../../types';
import { useBooking } from '../../context/BookingContext';

interface ShowtimeSelectorProps {
  movieId: string;
}

export function ShowtimeSelector({ movieId }: ShowtimeSelectorProps) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { setMovie, setShowtime, state } = useBooking();

  useEffect(() => {
    fetchShowtimes();
  }, [movieId]);

  async function fetchShowtimes() {
    try {
      const { data, error } = await supabase
        .from('showtimes')
        .select(`
          *,
          theater:theaters(*)
        `)
        .eq('movie_id', movieId)
        .gte('show_date', new Date().toISOString().split('T')[0])
        .order('show_date', { ascending: true })
        .order('show_time', { ascending: true });

      if (error) throw error;
      setShowtimes(data || []);
      if (data && data.length > 0) {
        setSelectedDate(data[0].show_date);
      }
    } catch (err) {
      console.error('Error fetching showtimes:', err);
    } finally {
      setLoading(false);
    }
  }

  const uniqueDates = [...new Set(showtimes.map(s => s.show_date))];

  const showtimesByDate = showtimes.reduce((acc, showtime) => {
    if (!acc[showtime.show_date]) acc[showtime.show_date] = [];
    acc[showtime.show_date].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);

  const showtimesByTheater = selectedDate
    ? (showtimesByDate[selectedDate] || []).reduce((acc, showtime) => {
        const theaterName = showtime.theater?.name || 'Unknown';
        if (!acc[theaterName]) acc[theaterName] = [];
        acc[theaterName].push(showtime);
        return acc;
      }, {} as Record<string, Showtime[]>)
    : {};

  function handleShowtimeSelect(showtime: Showtime) {
    if (state.movie?.id !== movieId) {
      const movie = showtimes.find(s => s.id === showtime.id);
    }
    setShowtime(showtime);
  }

  const selectedShowtimeId = state.showtime?.id;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-secondary-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-secondary-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (showtimes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-400">No showtimes available for this movie.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {uniqueDates.map(date => {
          const d = new Date(date);
          const isToday = date === new Date().toISOString().split('T')[0];
          const isSelected = date === selectedDate;

          return (
            <motion.button
              key={date}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-[80px] transition-all ${
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-800 text-secondary-300 hover:bg-secondary-700'
              }`}
            >
              <span className="text-xs font-medium uppercase">
                {d.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-lg font-bold">{d.getDate()}</span>
              <span className="text-xs">
                {isToday ? 'Today' : d.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Showtimes by Theater */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {Object.entries(showtimesByTheater).map(([theaterName, times]) => (
              <div key={theaterName} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-secondary-200">{theaterName}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-800 text-secondary-400">
                    {(times[0].theater as Theater)?.screen_type?.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {times.map(showtime => {
                    const isSelected = selectedShowtimeId === showtime.id;
                    const time = new Date(`2000-01-01T${showtime.show_time}`);
                    const formattedTime = time.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    });

                    return (
                      <motion.button
                        key={showtime.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleShowtimeSelect(showtime)}
                        className={`flex flex-col items-center px-4 py-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-500/20 shadow-glow'
                            : 'border-secondary-700 bg-secondary-800/50 hover:border-primary-500/50'
                        }`}
                      >
                        <span className={`font-bold ${isSelected ? 'text-primary-400' : 'text-secondary-100'}`}>
                          {formattedTime}
                        </span>
                        <span className="text-xs text-secondary-500 mt-1">
                          ${Number(showtime.price_regular).toFixed(0)}
                          {showtime.price_premium > showtime.price_regular && (
                            <span className="ml-1 text-cinema-gold">
                              Premium ${Number(showtime.price_premium).toFixed(0)}
                            </span>
                          )}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedShowtimeId && state.showtime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-lg bg-primary-500/10 border border-primary-500/30"
        >
          <div>
            <span className="text-sm text-secondary-300">Selected: </span>
            <span className="font-semibold text-primary-400">
              {(state.showtime.theater as Theater)?.name} at{' '}
              {new Date(`2000-01-01T${state.showtime.show_time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
