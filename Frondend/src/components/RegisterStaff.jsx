const RegisterStaff = () => {
  return (
    <div className="mx-4 py-4">
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-lg font-bold">Register Staff</h2>
        <p className="text-base-content/70">
          Add a new staff member to the school
        </p>
      </div>
      <div className="max-w-4xl p-4 border rounded-lg shadow-md ">
        <div className="p-2">
          <form className="" action="">
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">First Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm  rounded-md "
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">Last Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm rounded-md"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@gmail.com"
                className="input input-bordered input-sm rounded-md"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">Phone</span>
              </label>

              <input
                type="tel"
                placeholder="+220XXXXXXXXX"
                className="input input-bordered input-sm rounded-md"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">Role</span>
              </label>
              <select
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
                <span className="label-text font-bold">Section</span>
              </label>
              <select
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
                <span className="label-text font-bold">Department</span>
              </label>
              <input
                type="text"
                placeholder="eg. Mathematics"
                className="input input-bordered input-sm rounded-md"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="">
                <span className="label-text font-bold">Start Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered input-sm rounded-md"
              />
            </div>
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center justify-between gap-4">
                <button className="btn btn-outline rounded-lg btn-">Back</button>
                <button className="btn btn-outline rounded-lg btn-">Clear</button>
              </div>
              <button className="btn btn-primary rounded-lg btn-">Register Staff</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStaff;
