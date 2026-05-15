import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Earnings from "./pages/Earnings";
import Profile from "./pages/Profile";
import Withdraw from "./pages/Withdraw";
import Settings from "./pages/Settings";
import SupporterHistory from "./pages/SupporterHistory";
import About from "./pages/About";
import VerifyEmail from "./pages/VerifyEmail";
import CreatorPage from "./pages/CreatorPage";
import HowItWorks from "./pages/HowItWorks";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/withdraw" element={<Withdraw />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/creator-profile" element={<CreatorPage />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/supporter-history" element={<SupporterHistory />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
