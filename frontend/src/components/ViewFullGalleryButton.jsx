import { useNavigate } from "react-router-dom";

const ViewFullGalleryButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/gallery")}
      className={`mt-8 px-6 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition ${className}`}
    >
      View Full Gallery
    </button>
  );
};

export default ViewFullGalleryButton;
