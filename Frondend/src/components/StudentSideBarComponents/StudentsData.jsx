const getInitials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const StudentsData = ({ student }) => (
  <div className="flex items-center gap-3 border-b border-primary/20 py-3 last:border-b-0">
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary p-1 font-semibold text-white"
      aria-hidden="true"
    >
      {getInitials(student.name)}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate font-bold">{student.name}</p>
      <p className="text-sm text-base-content/70">
        Student ID: {student.studentId}
      </p>
      <p className="break-words text-sm text-base-content/70">
        Address: {student.address || "Not provided"}
      </p>
    </div>
    <span className="text-sm text-base-content/70">{student.gender}</span>
  </div>
);

export default StudentsData;
