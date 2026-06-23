import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket, CreditCard, Film } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../ui';
import { Link } from 'react-router-dom';
import { MoviePoster } from './MoviePoster';

interface BookingSummaryProps {
  showContinueButton?: boolean;
  continueTo?: string;
  onContinue?: () => void;
}

export function BookingSummary({ showContinueButton = true, continueTo, onContinue }: BookingSummaryProps) {
  const { state } = useBooking();

  if (!state.showtime) {
    return null;
  }

  const showtime = state.showtime;
  const movie = state.movie;
  const theater = showtime.theater;

  const formattedDate = new Date(showtime.show_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(`2000-01-01T${showtime.show_time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const regularSeats = state.selectedSeats.filter(s => !s.isPremium);
  const premiumSeats = state.selectedSeats.filter(s => s.isPremium);

  return (
    <div className="card p-6 space-y-6 sticky top-4">
      <h3 className="text-lg font-semibold text-secondary-100">Booking Summary</h3>

      {/* Movie Info */}
      {movie && (
        <div className="flex gap-4">
          <MoviePoster genres={movie.genre} title={movie.title} className="w-20 h-28 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-secondary-100 line-clamp-2">{movie.title}</h4>
            <div className="text-sm text-secondary-400 mt-1">{movie.duration_minutes} min</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genre.map(g => (
                <span key={g} className="text-xs text-secondary-500">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Showtime Details */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm text-secondary-400">Date</div>
            <div className="text-secondary-100">{formattedDate}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm text-secondary-400">Time</div>
            <div className="text-secondary-100">{formattedTime}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm text-secondary-400">Theater</div>
            <div className="text-secondary-100">{theater?.name || 'Selected Theater'}</div>
          </div>
        </div>
      </div>

      {/* Seats */}
      <div className="border-t border-secondary-800 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Ticket className="w-5 h-5 text-primary-400" />
          <span className="text-sm text-secondary-400">
            {state.selectedSeats.length} Seat{state.selectedSeats.length !== 1 ? 's' : ''} Selected
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {state.selectedSeats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4 text-secondary-500 text-sm"
            >
              No seats selected
            </motion.div>
          ) : (
            <motion.div layout className="space-y-2">
              {regularSeats.length > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-300">Regular:</span>
                    <span className="text-sm text-secondary-100">{regularSeats.map(s => s.label).join(', ')}</span>
                  </div>
                  <span className="text-sm text-secondary-300">
                    ${regularSeats.reduce((sum, s) => sum + s.price, 0).toFixed(2)}
                  </span>
                </div>
              )}

              {premiumSeats.length > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-cinema-gold">Premium:</span>
                    <span className="text-sm text-secondary-100">{premiumSeats.map(s => s.label).join(', ')}</span>
                  </div>
                  <span className="text-sm text-cinema-gold">
                    ${premiumSeats.reduce((sum, s) => sum + s.price, 0).toFixed(2)}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Total */}
      <div className="border-t border-secondary-800 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-secondary-300">Subtotal</span>
          <span className="text-secondary-100">${state.totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-secondary-300">Service Fee</span>
          <span className="text-secondary-100">${(state.selectedSeats.length * 1.5).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-secondary-700">
          <span className="text-secondary-100">Total</span>
          <span className="text-primary-400">
            ${(state.totalPrice + state.selectedSeats.length * 1.5).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Continue Button */}
      {showContinueButton && state.selectedSeats.length > 0 && (
        <Button
          variant="primary"
          className="w-full"
          onClick={onContinue}
          {...(continueTo ? { as: Link, to: continueTo } : {})}
        >
          <CreditCard className="w-5 h-5" />
          Continue to Payment
        </Button>
      )}
    </div>
  );
}
