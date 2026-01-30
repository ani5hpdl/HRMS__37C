import { useNavigate } from "react-router-dom";

const ViewAllRoomsButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/rooms")}
      className={`mt-8 px-6 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition ${className}`}
    >
      View All Rooms
    </button>
  );
};

export default ViewAllRoomsButton;
