import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Booking } from '../types';
import { FullPageLoader, Button, Badge } from '../components/ui';
import { MoviePoster } from '../components/cinema/MoviePoster';
import { getGenreGradient } from '../lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Download,
  Share2,
  ArrowLeft,
  CheckCircle,
  Film,
} from 'lucide-react';

export function BookingDetailsPage() {
  const { bookingRef } = useParams<{ bookingRef: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingRef) fetchBooking();
  }, [bookingRef]);

  async function fetchBooking() {
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
        .eq('booking_reference', bookingRef)
        .single();

      if (error) throw error;
      setBooking(data as Booking);
    } catch (err) {
      console.error('Error fetching booking:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <FullPageLoader />;
  if (!booking) return null;

  const showtime = booking.showtime as any;
  const movie = showtime?.movie;
  const theater = showtime?.theater;

  const formattedDate = new Date(showtime.show_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(`2000-01-01T${showtime.show_time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-400 hover:text-secondary-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-success-500/20 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-success-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-secondary-100 mb-2">Booking Confirmed!</h1>
          <p className="text-secondary-400">
            Your tickets have been booked successfully. Check your email for confirmation.
          </p>
        </motion.div>

        {/* Movie Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card overflow-hidden mb-6"
        >
          <div className="flex flex-col md:flex-row">
            <MoviePoster genres={movie?.genre || []} title={movie?.title || ''} className="w-full md:w-48 h-64" />
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-100 mb-2">{movie?.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {movie?.genre.map(g => (
                      <Badge key={g} variant="primary">{g}</Badge>
                    ))}
                  </div>
                </div>
                <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                  {booking.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-secondary-300">
                  <Calendar className="w-5 h-5 text-primary-400" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-3 text-secondary-300">
                  <Clock className="w-5 h-5 text-primary-400" />
                  <span>{formattedTime}</span>
                </div>
                <div className="flex items-center gap-3 text-secondary-300">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <span>{theater?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ticket Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary-400" />
              <span className="text-lg font-semibold text-secondary-100">Ticket Details</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary-500">Booking Reference</p>
              <p className="font-mono font-bold text-primary-400">{booking.booking_reference}</p>
            </div>
          </div>

          <div className="border-t border-dashed border-secondary-700 pt-6">
            <div className="text-center mb-4">
              <p className="text-secondary-400 text-sm mb-2">Seats</p>
              <div className="flex justify-center gap-2">
                {booking.seats.map((seatId, index) => (
                  <div
                    key={seatId}
                    className="w-12 h-12 rounded-lg bg-primary-500/20 border border-primary-500/50 flex items-center justify-center"
                  >
                    <span className="font-bold text-primary-400">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-secondary-800">
              <span className="text-secondary-400">Total Paid</span>
              <span className="text-2xl font-bold text-cinema-gold">
                ${Number(booking.total_amount).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* QR Code Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 text-center mb-6"
        >
          <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 mb-4">
            <div className="w-full h-full bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-secondary-100' : 'bg-transparent'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-secondary-400">
            Show this QR code at the cinema entrance
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button variant="secondary" className="flex-1" leftIcon={<Download className="w-5 h-5" />}>
            Download Ticket
          </Button>
          <Button variant="secondary" className="flex-1" leftIcon={<Share2 className="w-5 h-5" />}>
            Share
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default BookingDetailsPage;
