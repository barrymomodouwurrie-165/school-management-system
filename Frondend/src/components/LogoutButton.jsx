import { useState } from "react";
import axios from "../utils/apiClient.js";
import { useNavigate } from "react-router";
import { FaSignOutAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const LogoutButton = ({ className = "btn btn-ghost" }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await axios.post(
        `${API_URL}/users/logout`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error(
        "Server logout failed; clearing this browser session:",
        error.message,
      );
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login", { replace: true });
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <FaSignOutAlt size={18} />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
