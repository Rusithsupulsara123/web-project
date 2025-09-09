import React, { useState } from 'react'
import AuthModel from './AuthModel';
import { Button } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../../Store/Auth/Action";

const Authentication = () => {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const handleOpenAuthModal = () => setOpenAuthModal(true);
  const handleCloseAuthModal = () => setOpenAuthModal(false);
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    // Redirect to Spring Boot's Google OAuth2 endpoint
    window.location.href = 'http://localhost:5454/oauth2/authorization/google';
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side - Background */}
      <div className="hidden lg:block lg:w-7/12 relative">
        <div className="w-full h-full bg-gradient-to-br from-blue-400/80 via-purple-400/80 to-pink-400/80 relative">
          {/* Animated circles */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-blob animation-delay-4000"></div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
            <h1 className="text-5xl font-bold mb-6 text-center">
              Share Your Skills,
              <br />
              Learn Together
            </h1>
            <p className="text-xl text-center opacity-90">
              Join our community of learners and experts.
              <br />
              Connect, collaborate, and grow together.
            </p>

            {/* Feature highlights */}
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-semibold">Learn Skills</h3>
                <p className="text-sm opacity-80">Access expert knowledge</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🤝</div>
                <h3 className="font-semibold">Share Knowledge</h3>
                <p className="text-sm opacity-80">Help others grow</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💡</div>
                <h3 className="font-semibold">Get Inspired</h3>
                <p className="text-sm opacity-80">Discover new ideas</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌟</div>
                <h3 className="font-semibold">Build Network</h3>
                <p className="text-sm opacity-80">Connect with experts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-5/12 flex items-center justify-center h-full overflow-y-auto">
        <div className="w-full max-w-md px-8 py-8">
          <h1 className="font-bold text-5xl mb-4">Let's Improve Your Self</h1>
          <h2 className="font-bold text-2xl mb-8 ml-12">Join Skill Plus Today</h2>

          <div className="space-y-6">
            <div>
              <button
      onClick={handleGoogleLogin}
      className="ml-8 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 w-80 h-12 rounded-md shadow-sm hover:bg-gray-100 transition duration-200"

    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google Logo"
        className="w-5 h-5"
      />
      <span>Sign in with Google</span>
    </button>
              <br></br>
              <Button
                onClick={handleOpenAuthModal}
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  borderRadius: "29px",
                  py: "7px",
                  bgcolor: "rgb(29, 155, 240)",
                  "&:hover": {
                    bgcolor: "rgb(26, 140, 216)",
                  },
                }}
              >
                Create Account
              </Button>

              <p className="text-sm mt-2 text-gray-500">
                By signing up, you agree to the Terms of Service and Privacy
                Policy, including Cookie Use.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-xl mb-5">Already Have Account?</h3>
              <Button
                onClick={handleOpenAuthModal}
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: "29px",
                  py: "7px",
                  borderColor: "rgb(29, 155, 240)",
                  color: "rgb(29, 155, 240)",
                  "&:hover": {
                    borderColor: "rgb(26, 140, 216)",
                    bgcolor: "rgba(29, 155, 240, 0.1)",
                  },
                }}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AuthModel open={openAuthModal} handleClose={handleCloseAuthModal} />
    </div>
  );
};

export default Authentication;
