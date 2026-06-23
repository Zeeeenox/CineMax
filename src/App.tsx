import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navigation, Footer } from './components/layout/Navigation';
import { NotificationContainer } from './components/ui';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import PaymentPage from './pages/PaymentPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <NotificationProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <NotificationContainer />
            <main className="flex-1 pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/showtime/:showtimeId/seats" element={<SeatSelectionPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/bookings/:bookingRef" element={<BookingDetailsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NotificationProvider>
      </BookingProvider>
    </BrowserRouter>
  );
}

export default App;
