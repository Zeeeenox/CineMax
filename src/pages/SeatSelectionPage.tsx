import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Showtime, Theater, Movie } from '../types';
import { useBooking } from '../context/BookingContext';
import { SeatSelection } from '../components/cinema/SeatSelection';
import { BookingSummary } from '../components/cinema/BookingSummary';
import { ProgressSteps, Button, FullPageLoader } from '../components/ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function SeatSelectionPage() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, setMovie: setBookingMovie, setShowtime: setBookingShowtime } = useBooking();

  useEffect(() => {
    if (showtimeId) fetchShowtime();
  }, [showtimeId]);

  async function fetchShowtime() {
    try {
      const { data, error } = await supabase
        .from('showtimes')
        .select(`
          *,
          theater:theaters(*),
          movie:movies(*)
        `)
        .eq('id', showtimeId)
        .single();

      if (error) throw error;

      setShowtime(data);
      if (data.movie) {
        setMovie(data.movie as Movie);
      }
      if (!state.movie && data.movie) {
        setBookingMovie(data.movie as Movie);
      }
      if (!state.showtime) {
        setBookingShowtime(data);
      }
    } catch (err) {
      console.error('Error fetching showtime:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  const steps = ['Select Movie', 'Choose Showtime', 'Pick Seats', 'Payment', 'Confirmation'];

  if (loading) return <FullPageLoader />;
  if (!showtime) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-400 hover:text-secondary-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ProgressSteps steps={steps.slice(2)} currentStep={state.selectedSeats.length > 0 ? 0 : 0} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold text-secondary-100 mb-6">
                Select Your Seats
              </h2>

              <div className="text-sm text-secondary-400 mb-6">
                <p>Tap on seats to select. Maximum 8 seats per booking.</p>
              </div>

              <SeatSelection showtime={showtime} maxSeats={8} />
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div>
            <BookingSummary showContinueButton={false} />
            {state.selectedSeats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <Button
                  variant="primary"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => navigate('/payment')}
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelectionPage;
