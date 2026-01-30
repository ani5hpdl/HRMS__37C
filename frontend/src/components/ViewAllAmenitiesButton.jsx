import { useNavigate } from "react-router-dom";

const ViewAllAmenitiesButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/amenities")}
      className={`mt-8 px-6 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition ${className}`}
    >
      View All Amenities
    </button>
  );
};

export default ViewAllAmenitiesButton;
