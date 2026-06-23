import {
  FaGraduationCap,
  FaAt,
  FaLock,
  FaEyeSlash,
  FaChalkboardTeacher,
  FaQuestionCircle,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FiLogIn } from "react-icons/fi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link } from "react-router";
const LoginPage = () => {
  return (
    <div className="min-h-screen">
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
                <button className="btn btn-outline">
                  <RiAdminFill size={18} />
                  Admin
                </button>
                <button className="btn btn-outline">
                  <FaChalkboardTeacher size={18} />
                  Teacher
                </button>
                <button className="btn btn-outline">
                  {" "}
                  <FaGraduationCap size={18} />
                  Student
                </button>
              </div>
            </div>
            <div className="card">
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
                  <button>
                    <FaEyeSlash
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                  </button>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="input input-bordered pl-10 w-full"
                    placeholder="············"
                  />
                </div>
              </div>
              <Link className="flex justify-end text-primary">
                Forgot Password?
              </Link>
            </div>
            <div className="card-actions justify-between my-4">
              <Link className="btn btn-primary">
                <FiLogIn size={18} />
                Sign In to Dashboard
              </Link>
              <Link to="/" className="btn btn-primary">
                {" "}
                <RiArrowGoBackLine size={18} />
                Home
              </Link>
            </div>
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
