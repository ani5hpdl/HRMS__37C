import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import bgImage from "../assets/images/Background.jpg";
import { register } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name : "",
    email : "",
    password : ""
  })

  const changeHandler = (e) =>{
    const{name, value} = e.target

    setFormData(prev => ({
      ...prev,
      [name] : value
    }))
  }

  const validator = () =>{
    if(!formData.name || !formData.email || !formData.password){
      alert("all fields are required")
      return false
    }
    if(formData.password !== confirmPassword){
      alert("confirm password didn't match")
      return false
    }
    return true
  }

  const handleRegister = async () => {

    if(!validator()) return
    try {
      setLoading(true);
      register(formData)
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100 font-sans overflow-hidden">
      
      <div
        className="relative bg-cover bg-center hidden md:block h-screen"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 p-16 flex flex-col justify-center text-white">
          <h2 className="text-lg font-bold tracking-wide">LUXE STAY</h2>
          <h1 className="text-4xl font-extrabold mt-4">Create Your</h1>
          <h1 className="text-4xl font-extrabold text-yellow-400 mt-2">
            Account
          </h1>
          <p className="mt-6 max-w-md text-gray-200">
            Join Luxe Stay to book rooms, explore amenities, and enjoy a seamless user experience.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-10 h-screen">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          <h2 className="text-center text-xl font-bold">SIGN UP</h2>
          <p className="text-center text-sm text-gray-600 mt-2">
            Create your account to start booking
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              name= "name"
              value={formData.name}
              onChange={(e) => changeHandler(e)}
              className="w-full border rounded-lg p-3 focus:ring focus:ring-yellow-300"
            />
            <input
              type="email"
              placeholder="Email Address"
              name = "email"
              value={formData.email}
              onChange={(e) => changeHandler(e)}
              className="w-full border rounded-lg p-3 focus:ring focus:ring-yellow-300"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name = "password"
                value={formData.password}
                onChange={(e) => changeHandler(e)}
                className="w-full border rounded-lg p-3 pr-12 focus:ring focus:ring-yellow-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg p-3 pr-12 focus:ring focus:ring-yellow-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-6 bg-yellow-500 text-black p-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-yellow-500 font-semibold cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
