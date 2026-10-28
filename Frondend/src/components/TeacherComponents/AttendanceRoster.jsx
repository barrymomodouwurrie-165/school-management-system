const AttendanceRoster = ({
  data,
  marks,
  onToggle,
  firstDisabled,
  secondDisabled,
}) => {
  return (
    <div className="grid grid-cols-4 items-center text-sm md:text-base rounded-sm shadow-md mb-4 px-2 py-1 hover:bg-blue-600/10">
      <span>{data.displayId ?? data.id}</span>
      <span className="text-xs md:text-base">{data.name}</span>
      <span className="pl-6">
        <input
          className="checkbox checkbox-xs md:checkbox-sm"
          type="checkbox"
          checked={marks.firstCall}
          onChange={() => onToggle(data.id, "firstCall")}
          disabled={firstDisabled}
          aria-label={`${data.name} first call`}
        />
      </span>
      <span className="pl-8">
        <input
          className="checkbox checkbox-xs md:checkbox-sm"
          type="checkbox"
          checked={marks.secondCall}
          onChange={() => onToggle(data.id, "secondCall")}
          disabled={secondDisabled}
          aria-label={`${data.name} second call`}
        />
      </span>
    </div>
  );
};

export default AttendanceRoster;