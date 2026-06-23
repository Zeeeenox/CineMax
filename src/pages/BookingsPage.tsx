import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Booking } from '../types';
import { MovieCardSkeleton, Badge, Button } from '../components/ui';
import { MoviePoster } from '../components/cinema/MoviePoster';
import { Calendar, Clock, Ticket, ArrowRight } from 'lucide-react';

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          showtime:showtimes(
            *,
            movie:movies(*),
            theater:theaters(*)
          )
        `)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelBooking(bookingId: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-100 mb-2">My Bookings</h1>
          <p className="text-secondary-400">View and manage your movie bookings</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-6">
                <MovieCardSkeleton />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary-800 flex items-center justify-center">
              <Ticket className="w-8 h-8 text-secondary-500" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-200 mb-2">No bookings yet</h3>
            <p className="text-secondary-400 mb-6">
              Start by booking your first movie ticket!
            </p>
            <Link to="/movies">
              <Button variant="primary">
                Browse Movies
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => {
              const showtime = booking.showtime as any;
              const movie = showtime?.movie;
              const theater = showtime?.theater;

              const formattedDate = new Date(showtime?.show_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });

              const formattedTime = new Date(`2000-01-01T${showtime?.show_time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-4 md:p-6"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <MoviePoster genres={movie?.genre || []} title={movie?.title || ''} className="w-full md:w-28 h-40" />

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-100 mb-1">
                            {movie?.title}
                          </h3>
                          <p className="text-sm text-secondary-400 mb-3">{theater?.name}</p>
                        </div>
                        <Badge variant="success">Confirmed</Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-secondary-300 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-primary-400" />
                          {formattedDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-primary-400" />
                          {formattedTime}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-secondary-500">Booking Ref</p>
                          <p className="font-mono font-medium text-primary-400">
                            {booking.booking_reference}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/bookings/${booking.booking_reference}`}>
                            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingsPage;
