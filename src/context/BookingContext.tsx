import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Movie, Showtime, SeatSelection, BookingState } from '../types';

type BookingAction =
  | { type: 'SET_MOVIE'; payload: Movie }
  | { type: 'SET_SHOWTIME'; payload: Showtime }
  | { type: 'ADD_SEAT'; payload: SeatSelection }
  | { type: 'REMOVE_SEAT'; payload: string }
  | { type: 'CLEAR_SEATS' }
  | { type: 'SET_STEP'; payload: BookingState['currentStep'] }
  | { type: 'RESET' };

const initialState: BookingState = {
  movie: null,
  showtime: null,
  selectedSeats: [],
  totalPrice: 0,
  currentStep: 'movie',
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_MOVIE':
      return { ...state, movie: action.payload, currentStep: 'showtime' };
    case 'SET_SHOWTIME':
      return { ...state, showtime: action.payload, currentStep: 'seats' };
    case 'ADD_SEAT': {
      const exists = state.selectedSeats.find(s => s.seatId === action.payload.seatId);
      if (exists) return state;
      const newSeats = [...state.selectedSeats, action.payload];
      return {
        ...state,
        selectedSeats: newSeats,
        totalPrice: newSeats.reduce((sum, s) => sum + s.price, 0),
      };
    }
    case 'REMOVE_SEAT': {
      const newSeats = state.selectedSeats.filter(s => s.seatId !== action.payload);
      return {
        ...state,
        selectedSeats: newSeats,
        totalPrice: newSeats.reduce((sum, s) => sum + s.price, 0),
      };
    }
    case 'CLEAR_SEATS':
      return { ...state, selectedSeats: [], totalPrice: 0 };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface BookingContextType {
  state: BookingState;
  setMovie: (movie: Movie) => void;
  setShowtime: (showtime: Showtime) => void;
  addSeat: (seat: SeatSelection) => void;
  removeSeat: (seatId: string) => void;
  clearSeats: () => void;
  setStep: (step: BookingState['currentStep']) => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider
      value={{
        state,
        setMovie: (movie) => dispatch({ type: 'SET_MOVIE', payload: movie }),
        setShowtime: (showtime) => dispatch({ type: 'SET_SHOWTIME', payload: showtime }),
        addSeat: (seat) => dispatch({ type: 'ADD_SEAT', payload: seat }),
        removeSeat: (seatId) => dispatch({ type: 'REMOVE_SEAT', payload: seatId }),
        clearSeats: () => dispatch({ type: 'CLEAR_SEATS' }),
        setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
        reset: () => dispatch({ type: 'RESET' }),
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
