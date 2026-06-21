const Statictics = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-2 gap-4 md:flex items-center justify-between">
        <div className="card bg-secondary p-2 md:p-8 text-center font-bold">
          <span>Established</span>
          <span>1998</span>
        </div>
        <div className="card bg-secondary p-2 md:p-8 text-center font-bold">
          <span>Students</span>
          <span>1,200+</span>
        </div>
        <div className="card bg-secondary p-2 md:p-8 text-center font-bold">
          <span>Pass rate</span>
          <span>93%</span>
        </div>
        <div className="card bg-secondary p-2 md:p-8 text-center font-bold">
          <span>Teaching staff</span>
          <span>85</span>
        </div>
      </div>
    </div>
  );
};

export default Statictics;
