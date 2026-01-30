import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayments } from '../services/api';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');

            if (!sessionId) {
                setError('Invalid payment session');
                setLoading(false);
                return;
            }

            try {
                const response = await verifyPayments(sessionId);

                if (response.data.success) {
                    setVerified(true);
                    setPaymentDetails(response.data.data);
                } else {
                    setError(response.data.message || 'Payment verification failed');
                }
            } catch {
                setError('Failed to verify payment. Please contact support.');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center mt-24 text-center">
                <div className="text-5xl mb-4">⏳</div>
                <h2 className="text-xl font-semibold">Verifying your payment...</h2>
                <p className="text-gray-500">Please wait</p>
            </div>
        );
    }

    if (error || !verified) {
        return (
            <div className="max-w-md mx-auto mt-12 p-8 text-center bg-white shadow-lg rounded-xl">
                <div className="text-6xl mb-4">❌</div>
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Payment Verification Failed
                </h1>
                <p className="text-gray-600 mb-4">{error}</p>
                <p className="text-sm text-gray-400">
                    If you've been charged, please contact our support team.
                </p>

                <button
                    onClick={() => navigate('/my-bookings')}
                    className="mt-6 px-8 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                    View My Bookings
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-12 p-10 bg-white shadow-xl rounded-xl text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
                Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
                Thank you for your payment. Your booking is now confirmed!
            </p>

            <div className="bg-gray-50 p-6 rounded-lg text-left mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Payment Details
                </h3>

                <div className="mb-2">
                    <strong>Reservation ID:</strong>
                    <span className="ml-2 text-gray-800">
                        {searchParams.get('reservationId')}
                    </span>
                </div>

                <div className="mb-2">
                    <strong>Amount Paid:</strong>
                    <span className="ml-2 text-green-600 font-bold">
                        ${parseFloat(paymentDetails?.amount || 0).toFixed(2)}
                    </span>
                </div>

                <div className="mb-2">
                    <strong>Payment Status:</strong>
                    <span className="ml-2 text-green-700 bg-green-100 px-3 py-1 rounded-md text-sm">
                        {paymentDetails?.status || 'Successful'}
                    </span>
                </div>

                <div>
                    <strong>Payment Date:</strong>
                    <span className="ml-2 text-gray-800">
                        {new Date(paymentDetails?.paidAt).toLocaleString()}
                    </span>
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
                A confirmation email has been sent to your registered email address.
            </p>

            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => navigate('/my-bookings')}
                    className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                    View My Bookings
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default PaymentSuccess;
