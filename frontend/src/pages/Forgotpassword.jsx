import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import bgImage from "../assets/images/Background.jpg";
import { sendResetLink } from '../services/api';
// import { forgotPasswordApi } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await sendResetLink({ email });

      if (response.data.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div
        className="hidden lg:block lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          minHeight: "100vh",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <h1 className="text-3xl font-bold">LUXE STAY</h1>

          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Elevate Your <br />
              <span className="text-amber-400">Hospitality Experience</span>
            </h2>

            <p className="text-lg text-gray-200 max-w-md">
              Streamline operations, enhance guest satisfaction, and drive revenue
              with our premium hotel management platform.
            </p>

            <div className="flex gap-12 mt-12">
              <div>
                <div className="text-4xl font-bold text-amber-400">500+</div>
                <div className="text-sm text-gray-300">Hotels Worldwide</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400">98%</div>
                <div className="text-sm text-gray-300">Satisfaction rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400">24/7</div>
                <div className="text-sm text-gray-300">Premium Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {!isSubmitted ? (
              <>
                <button
                  onClick={handleBack}
                  className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Sign In
                </button>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600 mb-8">
                  No worries! Enter your email address and we'll send you instructions to reset your password.
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your email"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md disabled:bg-amber-300 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Remember your password?{' '}
                    <button 
                      onClick={handleBack}
                      className="text-amber-500 hover:text-amber-600 font-semibold"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <CheckCircle className="w-20 h-20 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-2">
                  We've sent password reset instructions to:
                </p>
                <p className="text-amber-600 font-semibold mb-6">
                  {email}
                </p>
                <p className="text-gray-500 text-sm mb-8">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                    setError('');
                  }}
                  className="text-amber-500 hover:text-amber-600 font-semibold"
                >
                  Try another email
                </button>
                <div className="mt-6">
                  <button
                    onClick={handleBack}
                    className="flex items-center justify-center w-full text-gray-600 hover:text-gray-800 font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}