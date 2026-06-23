import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Seat, Showtime } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { SeatMapSkeleton } from '../ui/Skeleton';
import { Monitor } from 'lucide-react';

interface SeatSelectionProps {
  showtime: Showtime;
  maxSeats?: number;
}

export function SeatSelection({ showtime, maxSeats = 8 }: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const { addSeat, removeSeat, state } = useBooking();

  const selectedSeatIds = useMemo(
    () => new Set(state.selectedSeats.map(s => s.seatId)),
    [state.selectedSeats]
  );

  useEffect(() => {
    fetchSeats();
  }, [showtime.id]);

  async function fetchSeats() {
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .eq('showtime_id', showtime.id)
        .order('row_number', { ascending: true })
        .order('seat_number', { ascending: true });

      if (error) throw error;
      setSeats(data || []);
    } catch (err) {
      console.error('Error fetching seats:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSeatClick(seat: Seat) {
    if (seat.status === 'occupied') return;

    const price = seat.is_premium ? showtime.price_premium : showtime.price_regular;

    if (selectedSeatIds.has(seat.id)) {
      removeSeat(seat.id);
    } else {
      if (state.selectedSeats.length >= maxSeats) {
        return;
      }
      addSeat({
        seatId: seat.id,
        label: seat.seat_label,
        isPremium: seat.is_premium,
        price: Number(price),
      });
    }
  }

  const seatsByRow = useMemo(() => {
    const rows: Record<number, Seat[]> = {};
    seats.forEach(seat => {
      if (!rows[seat.row_number]) rows[seat.row_number] = [];
      rows[seat.row_number].push(seat);
    });
    return rows;
  }, [seats]);

  if (loading) return <SeatMapSkeleton />;

  const rows = Object.keys(seatsByRow).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/20 to-transparent h-16 rounded-t-full" />
        <div className="flex justify-center pt-2">
          <div className="flex items-center gap-2 text-secondary-400 text-sm">
            <Monitor className="w-4 h-4" />
            <span>Screen</span>
          </div>
        </div>
        <div className="w-3/4 mx-auto h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full mt-2" />
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-secondary-700" />
          <span className="text-secondary-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary-500" />
          <span className="text-secondary-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-secondary-800 opacity-60" />
          <span className="text-secondary-400">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cinema-gold to-warning-600" />
          <span className="text-secondary-400">Premium</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="overflow-x-auto pb-4">
        <div className="flex flex-col items-center gap-2 min-w-max">
          {rows.map(rowIndex => (
            <div key={rowIndex} className="flex items-center gap-1">
              {/* Row Label */}
              <div className="w-8 text-center text-xs font-medium text-secondary-500">
                {String.fromCharCode(64 + rowIndex)}
              </div>

              {/* Seats */}
              <div className="flex gap-1">
                {seatsByRow[rowIndex].map(seat => {
                  const isSelected = selectedSeatIds.has(seat.id);
                  const isOccupied = seat.status === 'occupied';
                  const isHovered = hoveredSeat === seat.id;
                  const canSelect = !isOccupied && (isSelected || state.selectedSeats.length < maxSeats);

                  return (
                    <motion.button
                      key={seat.id}
                      whileHover={canSelect ? { scale: 1.1 } : undefined}
                      whileTap={canSelect ? { scale: 0.95 } : undefined}
                      onHoverStart={() => setHoveredSeat(seat.id)}
                      onHoverEnd={() => setHoveredSeat(null)}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isOccupied}
                      className={`
                        seat relative
                        ${isOccupied ? 'seat-occupied' : ''}
                        ${isSelected ? 'seat-selected' : ''}
                        ${!isOccupied && !isSelected ? 'seat-available' : ''}
                        ${seat.is_premium ? 'seat-premium' : ''}
                        ${isSelected && seat.is_premium ? 'seat-premium seat-selected' : ''}
                      `}
                      aria-label={`Seat ${seat.seat_label}${isOccupied ? ' - Occupied' : ''}${seat.is_premium ? ' - Premium' : ''}`}
                      aria-pressed={isSelected}
                      aria-disabled={isOccupied}
                    >
                      {isHovered && !isOccupied && !isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-secondary-800 rounded text-xs whitespace-nowrap border border-secondary-700 shadow-lg z-10"
                        >
                          <div className="font-medium">{seat.seat_label}</div>
                          <div className="text-primary-400">
                            ${seat.is_premium ? showtime.price_premium : showtime.price_regular}
                          </div>
                        </motion.div>
                      )}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <div className="w-8 text-center text-xs font-medium text-secondary-500">
                {String.fromCharCode(64 + rowIndex)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selection Info */}
      {state.selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-lg bg-primary-500/10 border border-primary-500/30"
        >
          <span className="text-sm text-secondary-300">Selected:</span>
          {state.selectedSeats.map(seat => (
            <span
              key={seat.seatId}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                seat.isPremium
                  ? 'bg-gradient-to-r from-cinema-gold to-warning-500 text-cinema-dark'
                  : 'bg-primary-500 text-white'
              }`}
            >
              {seat.label}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
