import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createStripeCheckout } from '../services/api';

function PaymentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const reservationId = searchParams.get('reservationId');
    const amount = searchParams.get('amount');

    useEffect(() => {
        if (!reservationId || !amount) {
            setError('Invalid payment details');
        }
    }, [reservationId, amount]);

    const handlePayNow = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await createStripeCheckout({
                reservationId,
                amount: parseFloat(amount),
            });

            if (response.data.success) {
                window.location.href = response.data.data.checkoutUrl;
            } else {
                setError(response.data.message || 'Failed to create checkout session');
                setLoading(false);
            }
        } catch(err) {
            setError('Payment initiation failed. Please try again.');
            setLoading(false);
            console.error(err);
        }
    };

    if (error && (!reservationId || !amount)) {
        return (
            <div className="max-w-md mx-auto mt-12 p-6 text-center">
                <h1 className="text-2xl mb-4">❌ Error</h1>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                    onClick={() => navigate('/reservations')}
                    className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
                >
                    Back to Reservations
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow-lg rounded-xl text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
                Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
                Your reservation has been created successfully
            </p>

            <div className="bg-gray-50 p-6 rounded-lg text-left mb-8">
                <div className="mb-4">
                    <strong className="text-gray-700">Reservation ID:</strong>
                    <p className="text-lg text-gray-900 mt-1">
                        {reservationId}
                    </p>
                </div>

                <div>
                    <strong className="text-gray-700">Total Amount:</strong>
                    <p className="text-3xl text-green-600 font-bold mt-1">
                        ${parseFloat(amount).toFixed(2)}
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            <p className="text-gray-600 text-sm mb-6">
                Please complete the payment to confirm your reservation.
                <br />
                You will be redirected to Stripe&apos;s secure payment page.
            </p>

            <button
                onClick={handlePayNow}
                disabled={loading}
                className={`w-full py-4 text-lg font-bold rounded-lg transition
                    ${loading
                        ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
            >
                {loading ? '⏳ Redirecting to Stripe...' : '💳 Proceed to Payment →'}
            </button>

            <button
                onClick={() => navigate('/my-bookings')}
                disabled={loading}
                className={`w-full mt-4 py-3 text-sm rounded-lg border transition
                    ${loading
                        ? 'cursor-not-allowed text-gray-400 border-gray-200'
                        : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
            >
                Pay Later (View My Bookings)
            </button>
        </div>
    );
}

export default PaymentPage;
