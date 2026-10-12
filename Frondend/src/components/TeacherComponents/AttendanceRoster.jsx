const AttendanceRoster = ({data}) => {
  return (
    <div className="grid grid-cols-4 text-sm md:text-base rounded-sm shadow-md mb-4 px-2 py-1 hover:bg-blue-600/10 cursor-pointer">
      <span>{data.id}</span>
      <span className="text-xs md:text-base ">{data.name}</span>
      <span className="pl-6">
        <input
          className="checkbox-xs md:checkbox-sm"
          type="checkbox"
          name=""
          id=""
        />
      </span>
      <span className="pl-8">
        <input
          className="checkbox-xs md:checkbox-sm"
          type="checkbox"
          name=""
          id=""
        />
      </span>
    </div>
  );
};

export default AttendanceRoster;
