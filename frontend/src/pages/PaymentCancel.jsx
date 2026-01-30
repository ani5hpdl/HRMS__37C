import { useSearchParams, useNavigate } from 'react-router-dom';

function PaymentCancel() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reservationId = searchParams.get('reservationId');
    const amount = searchParams.get('amount') || '0';

    return (
        <div className="max-w-md mx-auto mt-12 p-10 text-center bg-white shadow-lg rounded-xl">
            <div className="text-6xl mb-4">⚠️</div>

            <h1 className="text-2xl font-bold text-yellow-500 mb-2">
                Payment Cancelled
            </h1>

            <p className="text-gray-600 mb-8">
                You have cancelled the payment process.
            </p>

            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-5 rounded-lg mb-8">
                <p className="text-sm leading-relaxed">
                    <strong>Note:</strong> Your reservation ({reservationId}) is still active,
                    <br />
                    but payment is pending. Please complete the payment to confirm your booking.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={() =>
                        navigate(
                            `/payment?reservationId=${reservationId}&amount=${amount}`
                        )
                    }
                    className="py-4 text-lg font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Try Again
                </button>

                <button
                    onClick={() => navigate('/my-bookings')}
                    className="py-3 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                    View My Bookings
                </button>
            </div>
        </div>
    );
}

export default PaymentCancel;
