import {
  FaGraduationCap,
  FaAt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChalkboardTeacher,
  FaQuestionCircle,
  FaUserFriends,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FiLogIn } from "react-icons/fi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const LoginPage = ({ theme, toggleTheme }) => {
  const [seePassword, setSeePassword] = useState(false);
  const location = useLocation();
  const requestedRole = new URLSearchParams(location.search).get("role");
  const [role, setRole] = useState(
    ["admin", "teacher", "student", "guardian"].includes(requestedRole)
      ? requestedRole
      : "admin",
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const { data } = await axios.post(`${API_URL}/users/login`, {
        role,
        username: identifier,
        password,
      });

      localStorage.setItem("accessToken", data.accessToken);
      navigate(
        role === "admin"
          ? "/admin-dashboard"
          : role === "teacher"
            ? "/teacher-dashboard"
            : role === "guardian"
              ? "/guardian-portal"
              : "/student-portal",
      );
    } catch (loginError) {
      setError(
        loginError.response?.data?.message ||
          loginError.message ||
          "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      <div className="mb-4 pt-2 px-2 flex items-center justify-between">
        <p className="developer-credit text-sm text-base-content/70">
          Designed and Developed by BarryDev-HUB
        </p>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-sm rounded-full border border-primary/20 bg-primary/5 text-primary"
        >
          {theme === "corporate" ? "Dark mode" : "Light mode"}
        </button>
      </div>
      <div className="max-w-xl mx-auto px-4 py-1">
        <div className=" max-w-[20rem] mx-auto py-1 mb-2 flex items-center justify-center gap-2 bg-primary/90 rounded-lg border border-primary">
          <FaGraduationCap size={24} />
          <span className="font-bold">EDUCORE SCHOOL PORTAL</span>
        </div>
        <div className="card bg-white max-w-md mx-auto border-t-4 border-l-2 border-r-2 border-primary rounded-lg">
          <div className="px-3 py-3">
            <div className="flex flex-col items-center">
              <h2 className="text-primary/90 font-bold text-2xl">
                Welcome Back
              </h2>
              <p className="text-base-content/70 font-mono">
                Access your school portal
              </p>
            </div>
            <div>
              <h2 className="font-bold mb-1">ACCESS ROLE</h2>
              <div className="grid grid-cols-2 gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`btn btn-outline ${role === "admin" ? "btn-active" : ""}`}
                >
                  <RiAdminFill size={18} />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`btn btn-outline ${role === "teacher" ? "btn-active" : ""}`}
                >
                  <FaChalkboardTeacher size={18} />
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`btn btn-outline ${role === "student" ? "btn-active" : ""}`}
                >
                  {" "}
                  <FaGraduationCap size={18} />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("guardian")}
                  className={`btn btn-outline ${role === "guardian" ? "btn-active" : ""}`}
                >
                  <FaUserFriends size={18} />
                  Guardian
                </button>
              </div>
            </div>
            <form className="card" onSubmit={handleLogin}>
              <div className="form-control">
                <label className="label py-1 min-h-0" htmlFor="email">
                  <span className="label-text font-bold">
                    EMAIL OR USERNAME
                  </span>
                </label>
                <div className="relative">
                  <FaAt
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/70"
                  />
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="input input-bordered pl-10 w-full"
                    placeholder="Enter your credentials"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label py-1 min-h-0" htmlFor="password">
                  <span className="label-text font-bold">PASSWORD</span>
                </label>
                <div className="relative">
                  <FaLock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/70"
                  />
                  <button
                    type="button"
                    onClick={() => setSeePassword(!seePassword)}
                  >
                    {seePassword ? (
                      <FaEyeSlash
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70"
                      />
                    ) : (
                      <FaEye
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70"
                      />
                    )}
                  </button>
                  <input
                    type={seePassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="input input-bordered pl-10 w-full"
                    placeholder="············"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </div>
              <Link className="flex justify-end text-primary">
                Forgot Password?
              </Link>
              {error && (
                <p role="alert" className="mt-2 text-sm text-error">
                  {error}
                </p>
              )}
              <div className="card-actions justify-between my-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  <FiLogIn size={18} />
                  {isSubmitting ? "Signing in..." : "Sign In to Dashboard"}
                </button>
                <Link to="/" className="btn btn-primary">
                  <RiArrowGoBackLine size={18} />
                  Home
                </Link>
              </div>
            </form>
          </div>
          <div className="w-full bg-base-content/10 p-2 rounded-b-lg">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
              <span className="text-base-content/70">New faculty member?</span>
              <a
                href="mailto:info@school.edu.gh?subject=Faculty%20access%20request"
                className="text-primary"
              >
                Request access
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <footer className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-primary/50 px-4 py-3 text-center text-xs md:flex-row md:items-center md:justify-between md:text-left md:text-sm">
          <div className="text-base-content/70">
            <span>
              &copy;2026 Barry's Junior and Secondary School Management. all
              rights reserved.
            </span>
          </div>
          <nav
            aria-label="Legal and support links"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          >
            <a href="mailto:info@school.edu.gh?subject=Privacy%20policy%20request">
              Privacy Policy
            </a>
            <a href="mailto:info@school.edu.gh?subject=Terms%20of%20service%20request">
              Terms of Service
            </a>
            <a
              href="mailto:info@school.edu.gh?subject=Help%20center"
              className="flex items-center gap-1"
            >
              <FaQuestionCircle />
              Help Center
            </a>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
