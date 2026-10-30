import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import {
  getStaffAssignments,
  updateStaffAssignments,
} from "../utils/adminApi";

const subjectIsAvailableForClass = (subject, classroom) => {
  if (
    subject.section !== classroom.section ||
    !subject.programs.includes(classroom.program)
  ) {
    return false;
  }

  const streamRule = subject.programStreams?.find(
    (item) => item.program === classroom.program,
  );
  return (
    !streamRule ||
    streamRule.streamNumbers.includes(classroom.stream_number)
  );
};

const AsignStaffRole = ({ setAssign, staffName, staffId }) => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [classTeacherClasses, setClassTeacherClasses] = useState([]);
  const [staffPosition, setStaffPosition] = useState("Teacher");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    let active = true;
    getStaffAssignments(staffId)
      .then((result) => {
        if (!active) return;
        setClasses(result.classes);
        setSubjects(result.subjects);
        setAssignedClasses(result.staff.assigned_classes ?? []);
        setAssignedSubjects(
          result.staff.assigned_subjects ??
            (result.staff.subject_taught ? [result.staff.subject_taught] : []),
        );
        setClassTeacherClasses(result.classTeacherClasses);
        setStaffPosition(result.staff.staff_position);
        setDepartment(result.staff.department);
      })
      .catch((error) => {
        if (active) {
          setStatus({
            type: "error",
            message: error.message || "Unable to load staff assignments.",
          });
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [staffId]);

  const toggleValue = (value, setSelected) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const availableSubjectNames = [
    ...new Set(
      subjects
        .filter((subject) =>
          classes.some(
            (classroom) =>
              assignedClasses.includes(classroom.name) &&
              subjectIsAvailableForClass(subject, classroom),
          ),
        )
        .map((subject) => subject.name),
    ),
  ].sort((first, second) => first.localeCompare(second));

  const toggleTeachingClass = (className) => {
    const next = assignedClasses.includes(className)
      ? assignedClasses.filter((item) => item !== className)
      : [...assignedClasses, className];
    setAssignedClasses(next);
    setAssignedSubjects((selected) =>
      selected.filter((subjectName) =>
        subjects.some(
          (subject) =>
            subject.name === subjectName &&
            classes.some(
              (classroom) =>
                next.includes(classroom.name) &&
                subjectIsAvailableForClass(subject, classroom),
            ),
        ),
      ),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const result = await updateStaffAssignments(staffId, {
        assignedClasses,
        assignedSubjects,
        classTeacherClasses,
        staffPosition,
      });
      setStatus({
        type: "success",
        message: result.message || "Staff assignments updated successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to update staff assignments.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-bold">
            Assign {staffName} ({staffId})
          </h1>
          <p className="text-sm text-base-content/70">
            Manage teaching classes, subjects, department leadership, and
            class-teacher duties.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => setAssign(false)}
        >
          Back
        </button>
      </header>

      {status.message && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={`my-4 text-sm ${
            status.type === "error" ? "text-error" : "text-success"
          }`}
        >
          {status.message}
        </p>
      )}

      {isLoading ? (
        <p role="status" className="py-8 text-center">
          Loading staff assignments...
        </p>
      ) : status.type === "error" ? (
        <p className="py-6 text-sm text-base-content/70">
          Assignments could not be loaded. Go back and try again before making
          changes.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="rounded-md p-4 shadow-md">
            <h2 className="mb-3 font-bold">Staff position</h2>
            <label className="flex max-w-sm flex-col gap-1 text-sm">
              <span>Position</span>
              <select
                className="select select-bordered select-sm"
                value={staffPosition}
                onChange={(event) => setStaffPosition(event.target.value)}
              >
                {["Teacher", "H.O.D", "H.O.B", "Admin"].map((position) => (
                  <option key={position} value={position}>
                    {position === "H.O.D"
                      ? `Head of Department - ${position}`
                      : position}
                  </option>
                ))}
              </select>
            </label>
            {staffPosition === "H.O.D" && (
              <p className="mt-2 text-sm text-base-content/70">
                Department: {department}
              </p>
            )}
          </section>

          <SelectionSection
            title="Assign teaching classes"
            items={classes.map((classroom) => classroom.name)}
            selected={assignedClasses}
            onToggle={toggleTeachingClass}
            emptyMessage="No active classes are available."
          />

          <SelectionSection
            title="Assign subjects to teach"
            items={availableSubjectNames}
            selected={assignedSubjects}
            onToggle={(value) => toggleValue(value, setAssignedSubjects)}
            emptyMessage={
              assignedClasses.length
                ? "No subjects are available for the selected classes."
                : "Select teaching classes to see their available subjects."
            }
          />

          <SelectionSection
            title="Make class teacher"
            items={classes.map((classroom) => classroom.name)}
            selected={classTeacherClasses}
            onToggle={(value) => toggleValue(value, setClassTeacherClasses)}
            getDescription={(className) => {
              const classroom = classes.find((item) => item.name === className);
              if (!classroom?.classTeacher) return "No class teacher assigned";
              if (classroom.classTeacher.staffId === staffId) {
                return "Currently assigned to this staff member";
              }
              return `Assigned to ${classroom.classTeacher.name}`;
            }}
            isDisabled={(className) => {
              const classroom = classes.find((item) => item.name === className);
              return Boolean(
                classroom?.classTeacher &&
                  classroom.classTeacher.staffId !== staffId,
              );
            }}
            emptyMessage="No active classes are available."
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSaving}
            >
              {isSaving ? "Saving assignments..." : "Save assignments"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setAssign(false)}
            >
              Back to staff
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

const SelectionSection = ({
  title,
  items,
  selected,
  onToggle,
  getDescription,
  isDisabled,
  emptyMessage,
}) => (
  <section className="rounded-md p-4 shadow-md">
    <h2 className="mb-3 font-bold">{title}</h2>
    {!items.length ? (
      <p className="text-sm text-base-content/70">{emptyMessage}</p>
    ) : (
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const disabled = isDisabled?.(item) ?? false;
          return (
            <label
              key={item}
              className={`flex items-start gap-2 rounded border p-2 text-sm ${
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={selected.includes(item)}
                disabled={disabled}
                onChange={() => onToggle(item)}
              />
              <span>
                <span className="block font-medium">{item}</span>
                {getDescription && (
                  <span className="block text-xs text-base-content/60">
                    {getDescription(item)}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    )}
    {!!selected.length && (
      <div className="mt-3 flex flex-wrap gap-2">
        {selected.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded bg-green-600/10 px-2 py-1 text-xs"
          >
            {item}
            <button
              type="button"
              aria-label={`Remove ${item}`}
              onClick={() => onToggle(item)}
              className="text-red-600"
            >
              <FaTimes />
            </button>
          </span>
        ))}
      </div>
    )}
  </section>
);

export default AsignStaffRole;
