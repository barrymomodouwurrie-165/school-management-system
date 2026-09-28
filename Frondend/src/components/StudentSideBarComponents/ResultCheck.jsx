const ResultCheck = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 border rounded-md bg-slate-200/70">
      <div className="max-w-lg mx-auto flex flex-col px-4 py-8">
        <div className="flex justify-center bg-blue-600 py-12 rounded-t-md">
          <h2 className="text-xl font-bold">CHECK RESULTS</h2>
        </div>
        <div className="flex justify-center bg-blue-950 py-10 rounded-b-md shadow-sm shadow-black">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="font-bold text-white/60">
                  Enter the Academic Year
                </span>
                <select
                  className="text-center border rounded py-1"
                  name=""
                  id=""
                >
                  <option value="">---</option>
                  <option value="2020/2021">2020/2021</option>
                  <option value="2021/2022">2021/2022</option>
                  <option value="2022/2023">2022/2023</option>
                  <option value="2023/2024">2023/2024</option>
                </select>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white/60">Enter the term</span>
                <select
                  className="text-center border rounded py-1"
                  name=""
                  id=""
                >
                  <option value="">---</option>
                  <option value="First term">First term</option>
                  <option value="Second term">Second term</option>
                  <option value="Third term">Third term</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between gap-1">
              <button
                className="btn btn-outline border border-white text-white"
                onClick={onBack}
              >
                Back
              </button>
              <button className="btn btn-outline border border-white text-white">
                Display Result
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCheck;
