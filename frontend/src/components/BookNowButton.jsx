import { useNavigate } from "react-router-dom";

const BookNowButton = ({ className = "" }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/rooms-booking")}
      className={`px-6 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition ${className}`}
    >
      Book Now
    </button>
  );
};

export default BookNowButton;
