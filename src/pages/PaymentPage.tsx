import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useBooking } from '../context/BookingContext';
import { useNotifications } from '../context/NotificationContext';
import { Button, Input, ProgressSteps, Modal } from '../components/ui';
import { BookingSummary } from '../components/cinema/BookingSummary';
import { CreditCard, Lock, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export function PaymentPage() {
  const navigate = useNavigate();
  const { state, reset } = useBooking();
  const { addNotification } = useNotifications();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!state.showtime || state.selectedSeats.length === 0) {
      navigate('/');
    }
  }, [state.showtime, state.selectedSeats, navigate]);

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
    }
    if (!formData.cvv || formData.cvv.length !== 3) {
      newErrors.cvv = 'Please enter a valid 3-digit CVV';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function formatCardNumber(value: string) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : v;
  }

  function formatExpiry(value: string) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create booking
      const totalAmount = state.totalPrice + state.selectedSeats.length * 1.5;
      const seatIds = state.selectedSeats.map(s => s.seatId);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          showtime_id: state.showtime!.id,
          seats: seatIds,
          total_amount: totalAmount,
          status: 'confirmed',
          payment_status: 'completed',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Update seat status
      const { error: seatError } = await supabase
        .from('seats')
        .update({ status: 'occupied' })
        .in('id', seatIds);

      if (seatError) console.error('Error updating seats:', seatError);

      setBookingRef(booking.booking_reference);
      setSuccess(true);

      addNotification({
        type: 'success',
        title: ' booking Confirmed!',
        message: 'Your tickets have been booked successfully.',
      });
    } catch (err) {
      console.error('Booking error:', err);
      addNotification({
        type: 'error',
        title: 'Payment Failed',
        message: 'There was an issue processing your payment. Please try again.',
      });
    } finally {
      setProcessing(false);
    }
  }

  if (success && bookingRef) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 max-w-lg w-full mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-success-500/20 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-success-400" />
          </motion.div>

          <h1 className="text-2xl font-bold text-secondary-100 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-secondary-400 mb-6">
            Your tickets have been booked successfully.
          </p>

          <div className="bg-secondary-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-secondary-400 mb-1">Booking Reference</p>
            <p className="text-xl font-mono font-bold text-primary-400">{bookingRef}</p>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                reset();
                navigate(`/bookings/${bookingRef}`);
              }}
            >
              View Booking Details
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                reset();
                navigate('/');
              }}
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const steps = ['Movie', 'Showtime', 'Seats', 'Payment', 'Done'];

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

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ProgressSteps steps={steps} currentStep={3} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-primary-400" />
                <h2 className="text-xl font-bold text-secondary-100">Payment Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Details */}
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                    error={errors.cardNumber}
                    leftIcon={<CreditCard className="w-5 h-5" />}
                    maxLength={19}
                  />

                  <Input
                    label="Cardholder Name"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                    error={errors.cardName}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: formatExpiry(e.target.value) })}
                      error={errors.expiry}
                      maxLength={5}
                    />

                    <Input
                      label="CVV"
                      placeholder="123"
                      type="password"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                      error={errors.cvv}
                      maxLength={3}
                    />
                  </div>
                </div>

                <hr className="border-secondary-800" />

                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-secondary-200">Contact Details</h3>

                  <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                  />

                  <Input
                    label="Phone (optional)"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <hr className="border-secondary-800" />

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-success-500/10 border border-success-500/30">
                  <Lock className="w-5 h-5 text-success-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-success-400 font-medium">Secure Payment</p>
                    <p className="text-secondary-400">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={processing}
                  loadingText="Processing..."
                >
                  Pay ${(state.totalPrice + state.selectedSeats.length * 1.5).toFixed(2)}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Summary */}
          <div>
            <BookingSummary showContinueButton={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
