const Statictics = () => {
  return (
    <div className="max-w-6xl mx-auto px-8 py-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 items-center justify-between">
        <div className="card bg-white border-primary border-t-4 border-r-2 border-l-2   p-2 md:p-8 text-center font-bold">
          <span className="text-primary">Established</span>
          <span>1998</span>
        </div>
        <div className="card bg-white border-primary border-t-4 border-r-2 border-l-2  p-2 md:p-8 text-center font-bold">
          <span className="text-primary">Students</span>
          <span>1,200+</span>
        </div>
        <div className="card bg-white border-primary border-t-4 border-r-2 border-l-2  p-2 md:p-8 text-center font-bold">
          <span className="text-primary">Pass rate</span>
          <span>93%</span>
        </div>
        <div className="card bg-white border-primary border-t-4 border-r-2 border-l-2 p-2 md:p-8 text-center font-bold">
          <span className="text-primary">Teaching staff</span>
          <span>85</span>
        </div>
      </div>
    </div>
  );
};

export default Statictics;
