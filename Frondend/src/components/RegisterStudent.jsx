import { FaBars } from "react-icons/fa";
import { Link } from "react-router";
const RegisterStudent = ({ isOpen, setIsOpen }) => {
  return (
    <div className="mx-4 py-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">REGISTER STUDENT</h2>
          <p className="text-base-content/70">
            Enrol a new student and add guardian details
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
      <div className="flex flex-col gap-2 px-4"></div>
      <div className="max-w-4xl p-4">
        <h2 className="text-lg font-bold">Student Details</h2>
        <form className="" action="">
          <div className="grid grid-cols-2 gap-2 border rounded-lg shadow-md p-4">
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
                <span className="label-text font-bold">Date of birth</span>
              </label>
              <input
                required
                type="date"
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
                <span className="label-text font-bold">Previous School</span>
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
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
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
                <option value="Teacher">Junior</option>
                <option value="H.O.D">Senior</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">Class</span>
              </label>
              <select
                required
                className="select select-bordered select-sm rounded-md"
                name="class"
                id=""
              >
                <option value="">Select</option>
                <option value="Grade 7 A">Grade 7 A</option>
                <option value="Grade 7 B">Grade 7 B</option>
                <option value="Grade 7 C">Grade 7 C</option>
                <option value="Grade 7 D">Grade 7 D</option>
                <option value="Grade 8 A">Grade 8 A</option>
                <option value="Grade 10 A">Grade 10 A</option>
                <option value="Grade 10 B">Grade 10 B</option>
                <option value="Grade 11 A">Grade 11 A</option>
                <option value="Grade 12 A">Grade 12 A</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">Enrolled Date</span>
              </label>
              <input
                required
                type="date"
                className="input input-bordered input-sm rounded-md"
              />
            </div>
          </div>
          <h2 className="text-lg font-bold mt-4">Guadian Details</h2>
          <div className="border rounded-lg shadow-md p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="form-control">
                <label className="label" htmlFor="">
                  <span className="label-text font-bold">Guardian Name</span>
                </label>
                <input
                  required
                  type="text"
                  className="input input-bordered input-sm  rounded-md "
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
                  className="input input-bordered input-sm  rounded-md "
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered input-sm  rounded-md "
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">Home Address</span>
              </label>
              <input
                required
                type="text"
                className="input input-bordered input-sm  rounded-md "
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center justify-between gap-4">
              <button className="btn btn-outline rounded-lg btn-sm">
                Clear
              </button>
            </div>
            <button className="btn btn-primary rounded-lg btn-sm">
              Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStudent;
