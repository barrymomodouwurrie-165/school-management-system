import {
  FaGraduationCap,
  FaAt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChalkboardTeacher,
  FaQuestionCircle,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FiLogIn } from "react-icons/fi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const LoginPage = ({ theme, toggleTheme }) => {
  const [seePassword, setSeePassword] = useState(false);
  const [role, setRole] = useState("admin");
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
      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-sm rounded-full border border-primary/20 bg-primary/5 text-primary"
        >
          {theme === "corporate" ? "Dark mode" : "Light mode"}
        </button>
      </div>
      <div className="max-w-xl mx-auto p-4">
        <div className=" max-w-[20rem] mx-auto py-2 mb-4 flex items-center justify-center gap-2 bg-primary/90 rounded-lg border border-primary">
          <FaGraduationCap size={24} />
          <span className="font-bold">EDUCORE ADMIN</span>
        </div>
        <div className="card bg-white max-w-md mx-auto border-t-4 border-l-2 border-r-2 border-primary rounded-lg">
          <div className="px-3 py-6">
            <div className="flex flex-col items-center">
              <h2 className="text-primary/90 font-bold text-2xl">
                Welcome Back
              </h2>
              <p className="text-base-content/70 font-mono">
                Access your school portal
              </p>
            </div>
            <div>
              <h2 className="font-bold mb-2">ACCESS ROLE</h2>
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
              </div>
            </div>
            <form className="card" onSubmit={handleLogin}>
              <div className="form-control">
                <label className="label" htmlFor="email">
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
                <label className="label" htmlFor="password">
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
              <div className="card-actions justify-between my-4">
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
          <div className="w-full bg-base-content/10 p-4 rounded-b-lg">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-base-content/70">New faculty member?</span>
              <Link className="text-primary">Request access</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="text-xs md:text-sm max-w-6xl mx-auto px-8 py-2 flex items-top justify-between border-primary/50 border-t">
          <div>
            <span>
              &copy;2026 Barry's Junior and Secondary School Management. all
              rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link>Privacy & Policy</Link>
            <Link>Terms of Service</Link>
            <Link className="flex items-center gap-1">
              <FaQuestionCircle />
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
