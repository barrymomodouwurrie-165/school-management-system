import { Link } from "react-router";
import { FaBars } from "react-icons/fa";

const RegisterStaff = ({ isOpen, setIsOpen }) => {
  return (
    <div className="mx-4 py-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold font-sans">RESGISTER STAFF</h2>
          <p className="text-base-content/70">
            Add a new staff member to the school
          </p>
        </div>
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <FaBars size={24} />
        </Link>
      </div>
      <div className="max-w-4xl ">
        <div className="p-2">
          <form className="" action="">
            <div className="flex flex-col border rounded-lg shadow-md p-4 mb-2">
              <h2 className="font-bold">Personal Details</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">First Name</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="input input-bordered input-sm  rounded-md "
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Last Name</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Gender</span>
                  </label>
                  <select
                    required
                    className="select select-bordered select-sm rounded-md"
                    name="gender"
                    id=""
                  >
                    <option value="">--select--</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Nationality</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="eg. Gambian"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Phone</span>
                  </label>

                  <input
                    required
                    type="tel"
                    placeholder="+220XXXXXXXXX"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Email</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="email@gmail.com"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Nationality</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="eg. Gambian"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Address</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Ethnicity</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Marital status</span>
                  </label>
                  <select
                    required
                    className="select select-bordered select-sm rounded-md"
                    name="gender"
                    id=""
                  >
                    <option value="Maried">Maried</option>
                    <option value="Single">Single</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col border rounded-lg shadow-md p-4 mt-2">
              <h2 className="font-bold">Professional Details</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Staff ID</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="input input-bordered input-sm  rounded-md "
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">
                      Highest qualification
                    </span>
                  </label>
                  <select
                    required
                    className="select select-bordered select-sm rounded-md"
                    name="gender"
                    id=""
                  >
                    <option value="">--Select--</option>
                    <option value="ECD">ECD</option>
                    <option value="PTC">PTC</option>
                    <option value="HTC">HTC</option>
                    <option value="Diploma">Diploma</option>
                    <option value="BA/BSc">BA/BSc</option>
                    <option value="Master's">Master's</option>
                    <option value="PHd">PHd</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Role</span>
                  </label>
                  <select
                    required
                    className="select select-bordered select-sm rounded-md"
                    name="role"
                    id=""
                  >
                    <option value="Teacher">Teacher</option>
                    <option value="H.O.D">H.O.D</option>
                    <option value="H.O.B">H.O.B</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Subject Taught</span>
                  </label>
                  <select
                    required
                    className="select select-bordered select-sm rounded-md"
                    name="gender"
                    id=""
                  >
                    <option value="">--Select--</option>
                    <option value="English Language">English Language</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Financial Accounting">
                      Financial Accounting
                    </option>
                    <option value="Cost Accounting">Cost Accounting</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Department</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="eg. Mathematics"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Section</span>
                  </label>
                  <select
                    required
                    className="select select-bordered select-sm rounded-md"
                    name="section"
                    id=""
                  >
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">
                      Employment Type
                    </span>
                  </label>
                  <select
                    required
                    className="select select-bordered select-sm rounded-md"
                    name="section"
                    id=""
                  >
                    <option value="Full Time">Full-time</option>
                    <option value="Senior">Part-time</option>
                    <option value="Senior">Contract</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Start Date</span>
                  </label>
                  <input
                    required
                    type="date"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Username</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="">
                    <span className="label-text font-bold">Password</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="input input-bordered input-sm rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-8">
              <button className="btn btn-outline rounded-lg btn-sm">
                Clear
              </button>
              <button className="btn btn-primary rounded-lg btn-sm">
                Register Staff
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStaff;
