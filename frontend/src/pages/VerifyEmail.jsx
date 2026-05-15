// VerifyEmail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";


const API_URL = "https://tsb-api.onrender.com/api/auth";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
    useEffect(() => {
      // Page loads instantly after mount
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }, []);
  
    // THIS MUST BE INSIDE the component function
    if (loading) return <LoadingSpinner message="Loading Verify Email..." />;
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/verify-email/${token}`);
      setStatus("success");
      setMessage(data.message);
      localStorage.setItem("tsb_token", data.token);
      localStorage.setItem("tsb_creator", JSON.stringify(data.creator));
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.error || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-gray-700/50"
      >
        {status === "verifying" && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <h2 className="text-white text-xl font-bold">
              Verifying your email...
            </h2>
          </>
        )}

        {status === "success" && (
          <>
            <span className="text-6xl block mb-4">✅</span>
            <h2 className="text-white text-xl font-bold mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-400">{message}</p>
            <p className="text-gray-500 text-sm mt-4">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <span className="text-6xl block mb-4">❌</span>
            <h2 className="text-white text-xl font-bold mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-400">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg"
            >
              Go to Login
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
