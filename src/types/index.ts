export interface Movie {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  genre: string[];
  rating: string;
  poster_url: string;
  backdrop_url: string;
  release_date: string;
  director: string;
  starring: string[];
  is_featured: boolean;
}

export interface Theater {
  id: string;
  name: string;
  screen_type: 'standard' | 'imax' | 'dolby' | 'premium';
  total_rows: number;
  seats_per_row: number;
}

export interface Showtime {
  id: string;
  movie_id: string;
  theater_id: string;
  theater?: Theater;
  movie?: Movie;
  show_date: string;
  show_time: string;
  price_regular: number;
  price_premium: number;
}

export interface Seat {
  id: string;
  showtime_id: string;
  row_number: number;
  seat_number: number;
  seat_label: string;
  is_premium: boolean;
  status: 'available' | 'occupied' | 'selected';
}

export interface Booking {
  id: string;
  user_id: string;
  showtime_id: string;
  showtime?: Showtime;
  seats: string[];
  seatDetails?: Seat[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  booking_reference: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface SeatSelection {
  seatId: string;
  label: string;
  isPremium: boolean;
  price: number;
}

export interface BookingState {
  movie: Movie | null;
  showtime: Showtime | null;
  selectedSeats: SeatSelection[];
  totalPrice: number;
  currentStep: 'movie' | 'showtime' | 'seats' | 'payment' | 'confirmation';
}
