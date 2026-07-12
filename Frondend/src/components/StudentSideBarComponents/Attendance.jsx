const Attendance = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="py-4 px-2">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="flex flex-col p-4 rounded-md border-t-4 border-primary shadow-sm">
            <span className="text-base-content/70">Overall attendance</span>
            <span className="text-2xl font-bold">92%</span>
          </div>
          <div className="flex flex-col p-4 rounded-md border-t-4 border-primary shadow-sm">
            <span className="text-base-content/70">Classes this term</span>
            <span className="text-2xl font-bold">32</span>
          </div>
          <div className="flex flex-col p-4 rounded-md border-t-4 border-primary shadow-sm">
            <span className="text-base-content/70">Absences</span>
            <span className="text-2xl font-bold">4</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-2">
          <h1 className="text-base-content/70 font-bold">Recent days</h1>
          <div className="flex items-center justify-between p-2 rounded-md border border-base-content/20">
            <span className="font-bold">Mon, Jul 7</span>
            <span className="bg-green-600/60 text-green-900 rounded-md px-1">Present</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md border border-base-content/20">
            <span className="font-bold">Tue, Jul 8</span>
            <span className="bg-green-600/60 text-green-900 rounded-md px-1">Present</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md border border-base-content/20">
            <span className="font-bold">Wed, Jul 9</span>
            <span className="bg-red-600/60 text-red-900 rounded-md px-1">Absent</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md border border-base-content/20">
            <span className="font-bold">Thur, Jul 10</span>
            <span className="bg-green-600/60 text-green-900 rounded-md px-1">Present</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md border border-base-content/20">
            <span className="font-bold">Fri, Jul 11</span>
            <span className="bg-green-600/60 text-green-900 rounded-md px-1">Present</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
