import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import image from '../assets/background.png';
import { toast } from 'react-hot-toast';
import { login } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function HotelLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validators = () => {
    let newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      return true;
    }
    return false;
  };

  const handleSubmit = async () => {
    try {
      if (validators()) {
        const dataToSubmit = {
          email,
          password
        }
        const response = await login(dataToSubmit);
        if (response.status === 200) {
          toast.success("Login Successful!");
          localStorage.setItem("token", response?.data?.token)

          let decoded;
          try {
            decoded = jwtDecode(response?.data?.token);
          } catch (error) {
            return toast.error("Invalid token")
          }

          navigate(decoded.role === 'admin' ? '/rooms' : '/');
        } else {
          return toast.error(response?.data?.message || "Login Failed! Please try again.");
        }
      }
    } catch (error) {
      console.log("Login Error: ", error);
      toast.error(error?.response?.data?.message || "An error occurred during login.");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        <img
          src={image}
          alt="Luxury Hotel Lobby"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <h2 className="text-white text-sm font-semibold tracking-widest mb-8">LUXE STAY</h2>

            <div className="mt-16">
              <h1 className="text-white text-5xl font-bold leading-tight mb-6">
                Elevate Your<br />
                <span className="text-amber-400">Hospitality Experience</span>
              </h1>

              <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                Streamline operations, enhance guest satisfaction, and drive revenue with our premium hotel management platform.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-amber-400 text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-400 text-sm">Hotels Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 text-4xl font-bold mb-2">98%</div>
              <div className="text-gray-400 text-sm">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Premium Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <h2 className="text-stone-800 text-xl font-bold tracking-widest">LUXE STAY</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">WELCOME BACK</h2>
              <p className="text-gray-600">Sign in to access your hotel dashboard</p>
            </div>

            <div>
              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-gray-900 font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="block text-gray-900 font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className={`w-full pl-10 pr-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={() => alert('Forgot password functionality')}
                  className="text-amber-600 hover:text-amber-700 font-semibold text-sm transition"
                >
                  Forget Password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                onClick={() => { handleSubmit() }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In
              </button>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <span className="text-gray-600">Don't have account? </span>
                <button
                  type="button"
                  onClick={() => alert('Sign up functionality')}
                  className="text-amber-600 hover:text-amber-700 font-semibold transition"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Terms and Privacy */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                By continuing, you agree to our{' '}
                <button className="text-amber-600 hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-amber-600 hover:underline">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}