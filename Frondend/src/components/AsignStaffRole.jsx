import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import {
  getStaffAssignments,
  updateStaffAssignments,
} from "../utils/adminApi";
import {
  OTHER_STAFF_STATUS_OPTION,
  STAFF_STATUSES,
} from "../utils/staffStatuses";

const ASSIGNMENT_STEPS = [
  "Status",
  "Assign teaching classes",
  "Assign class teacher",
];

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
  const [classSubjectAssignments, setClassSubjectAssignments] = useState({});
  const [classTeacherClasses, setClassTeacherClasses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Teacher");
  const [customStatus, setCustomStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [assignedBlock, setAssignedBlock] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    let active = true;
    getStaffAssignments(staffId)
      .then((result) => {
        if (!active) return;
        setClasses(result.classes);
        setSubjects(result.subjects);
        const existingClasses = result.staff.assigned_classes ?? [];
        const existingSubjects =
          result.staff.assigned_subjects ??
          (result.staff.subject_taught ? [result.staff.subject_taught] : []);
        const savedAssignments = new Map(
          (result.staff.class_subject_assignments ?? []).map((assignment) => [
            assignment.className,
            assignment.subjects,
          ]),
        );
        setAssignedClasses(existingClasses);
        setClassSubjectAssignments(
          Object.fromEntries(
            existingClasses.map((className) => {
              const classroom = result.classes.find(
                (item) => item.name === className,
              );
              const savedSubjects = savedAssignments.get(className);
              const selectedSubjects = savedSubjects
                ? savedSubjects
                : existingSubjects.filter((subjectName) => {
                    const subject = result.subjects.find(
                    (item) =>
                      item.name === subjectName &&
                      item.section === classroom?.section,
                    );
                    return (
                      subject &&
                      classroom &&
                      subjectIsAvailableForClass(subject, classroom)
                    );
                  });
              return [className, selectedSubjects];
            }),
          ),
        );
        setClassTeacherClasses(result.classTeacherClasses);
        const existingStatus = result.staff.staff_position;
        if (STAFF_STATUSES.includes(existingStatus)) {
          setSelectedStatus(existingStatus);
        } else {
          setSelectedStatus(existingStatus);
          setCustomStatus(existingStatus);
        }
        setDepartment(result.staff.department);
        setAssignedBlock(result.staff.assigned_block ?? "");
      })
      .catch((error) => {
        if (active) {
          setLoadError(true);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const toggleValue = (value, setSelected) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const toggleTeachingClass = (className) => {
    if (assignedClasses.includes(className)) {
      setAssignedClasses((current) =>
        current.filter((item) => item !== className),
      );
      setClassSubjectAssignments((current) => {
        const next = { ...current };
        delete next[className];
        return next;
      });
      return;
    }

    setAssignedClasses((current) => [...current, className]);
    setClassSubjectAssignments((current) => ({
      ...current,
      [className]: [],
    }));
  };

  const toggleClassSubject = (className, subjectName) => {
    setClassSubjectAssignments((current) => {
      const selected = current[className] ?? [];
      return {
        ...current,
        [className]: selected.includes(subjectName)
          ? selected.filter((subject) => subject !== subjectName)
          : [...selected, subjectName],
      };
    });
  };

  const resolvedStatus =
    selectedStatus === OTHER_STAFF_STATUS_OPTION
      ? customStatus.trim()
      : selectedStatus.trim();
  const statusOptions = [
    ...STAFF_STATUSES,
    ...(customStatus && !STAFF_STATUSES.includes(customStatus)
      ? [customStatus]
      : []),
    OTHER_STAFF_STATUS_OPTION,
  ];

  const validateCurrentStep = () => {
    if (
      currentStep === 0 &&
      (!resolvedStatus || resolvedStatus.length > 64)
    ) {
      setStatus({
        type: "error",
        message: "Enter a status of 1 to 64 characters.",
      });
      return false;
    }

    if (
      currentStep === 0 &&
      resolvedStatus === "H.O.B" &&
      !assignedBlock
    ) {
      setStatus({
        type: "error",
        message: "Select a block before continuing.",
      });
      return false;
    }

    if (currentStep === 1) {
      const classesWithoutSubjects = assignedClasses.filter(
        (className) => !classSubjectAssignments[className]?.length,
      );
      if (classesWithoutSubjects.length) {
        setStatus({
          type: "error",
          message: `Choose at least one subject for ${classesWithoutSubjects.join(", ")}.`,
        });
        return false;
      }
    }

    setStatus({ type: "", message: "" });
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((step) => Math.min(step + 1, ASSIGNMENT_STEPS.length - 1));
    }
  };

  const handleSubmit = async () => {
    if (currentStep < ASSIGNMENT_STEPS.length - 1) {
      handleNextStep();
      return;
    }

    if (!resolvedStatus || resolvedStatus.length > 64) {
      setCurrentStep(0);
      setStatus({
        type: "error",
        message: "Enter a status of 1 to 64 characters.",
      });
      return;
    }

    if (resolvedStatus === "H.O.B" && !assignedBlock) {
      setCurrentStep(0);
      setStatus({
        type: "error",
        message: "Select a block for this status.",
      });
      return;
    }

    const classesWithoutSubjects = assignedClasses.filter(
      (className) => !classSubjectAssignments[className]?.length,
    );
    if (classesWithoutSubjects.length) {
      setCurrentStep(1);
      setStatus({
        type: "error",
        message: `Choose at least one subject for ${classesWithoutSubjects.join(", ")}.`,
      });
      return;
    }

    setIsSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const selectedSubjects = [
        ...new Set(
          Object.values(classSubjectAssignments).flat(),
        ),
      ];
      const result = await updateStaffAssignments(staffId, {
        assignedClasses,
        assignedSubjects: selectedSubjects,
        classSubjectAssignments: assignedClasses.map((className) => ({
          className,
          subjects: classSubjectAssignments[className] ?? [],
        })),
        classTeacherClasses,
        staffPosition: resolvedStatus,
        assignedBlock: resolvedStatus === "H.O.B" ? assignedBlock : "",
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
            Complete each assignment section on its own page.
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
      ) : loadError ? (
        <p className="py-6 text-sm text-base-content/70">
          Assignments could not be loaded. Go back and try again before making
          changes.
        </p>
      ) : (
        <div className="space-y-4">
          <nav
            aria-label="Staff assignment sections"
            className="grid grid-cols-3 gap-2"
          >
            {ASSIGNMENT_STEPS.map((step, index) => (
              <div
                key={step}
                aria-current={currentStep === index ? "step" : undefined}
                className={`rounded-md border p-2 text-center text-xs sm:text-sm ${
                  currentStep === index
                    ? "border-primary bg-primary/10 font-semibold"
                    : "text-base-content/70"
                }`}
              >
                <span className="block text-xs">Step {index + 1}</span>
                {step}
              </div>
            ))}
          </nav>

          {currentStep === 0 && (
            <section className="rounded-md p-4 shadow-md">
              <h2 className="mb-3 font-bold">Status</h2>
              <label className="flex max-w-sm flex-col gap-1 text-sm">
                <span>Status</span>
                <select
                  className="select select-bordered select-sm"
                  value={selectedStatus}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedStatus(value);
                    setCustomStatus(
                      value === OTHER_STAFF_STATUS_OPTION ||
                        STAFF_STATUSES.includes(value)
                        ? ""
                        : value,
                    );
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === OTHER_STAFF_STATUS_OPTION ? "Other" : option}
                    </option>
                  ))}
                </select>
              </label>
              {(selectedStatus === OTHER_STAFF_STATUS_OPTION ||
                !STAFF_STATUSES.includes(selectedStatus)) && (
                <label className="mt-3 flex max-w-sm flex-col gap-1 text-sm">
                  <span>Enter status</span>
                  <input
                    type="text"
                    value={customStatus}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCustomStatus(value);
                      setSelectedStatus(
                        value || OTHER_STAFF_STATUS_OPTION,
                      );
                    }}
                    className="input input-bordered input-sm"
                    maxLength={64}
                    required
                  />
                </label>
              )}
              {resolvedStatus === "H.O.D" && (
                <p className="mt-2 text-sm text-base-content/70">
                  Department: {department}
                </p>
              )}
              {resolvedStatus === "H.O.B" && (
                <label className="mt-3 flex max-w-sm flex-col gap-1 text-sm">
                  <span>Block</span>
                  <select
                    className="select select-bordered select-sm"
                    value={assignedBlock}
                    onChange={(event) => setAssignedBlock(event.target.value)}
                    required
                  >
                    <option value="">Select a block</option>
                    {[7, 8, 9, 10, 11, 12].map((grade) => (
                      <option key={grade} value={`Grade ${grade}`}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </section>
          )}

          {currentStep === 1 && (
            <>
              <SelectionSection
                title="Assign teaching classes"
                items={classes.map((classroom) => classroom.name)}
                selected={assignedClasses}
                onToggle={toggleTeachingClass}
                emptyMessage="No active classes are available."
              />

              <section className="space-y-3 rounded-md p-4 shadow-md">
                <div>
                  <h2 className="font-bold">Choose subjects for each class</h2>
                  <p className="text-sm text-base-content/70">
                    Each class can have a different selection. Newly added
                    classes start with no subjects selected.
                  </p>
                </div>
                {assignedClasses.length ? (
                  assignedClasses.map((className) => {
                    const classroom = classes.find(
                      (item) => item.name === className,
                    );
                    const classSubjects = classroom
                      ? subjects
                          .filter((subject) =>
                            subjectIsAvailableForClass(subject, classroom),
                          )
                          .map((subject) => subject.name)
                          .sort((first, second) => first.localeCompare(second))
                      : [];
                    return (
                      <SelectionSection
                        key={className}
                        title={className}
                        items={classSubjects}
                        selected={classSubjectAssignments[className] ?? []}
                        onToggle={(subjectName) =>
                          toggleClassSubject(className, subjectName)
                        }
                        emptyMessage="No available subjects match this class."
                        description="Select the subject(s) this teacher will teach in this class."
                      />
                    );
                  })
                ) : (
                  <p className="text-sm text-base-content/70">
                    Select one or more teaching classes first.
                  </p>
                )}
              </section>
            </>
          )}

          {currentStep === 2 && (
            <SelectionSection
              title="Make class teacher"
              items={classes.map((classroom) => classroom.name)}
              selected={classTeacherClasses}
              onToggle={(value) => toggleValue(value, setClassTeacherClasses)}
              getDescription={(className) => {
                const classroom = classes.find(
                  (item) => item.name === className,
                );
                if (!classroom?.classTeacher)
                  return "No class teacher assigned";
                if (classroom.classTeacher.staffId === staffId) {
                  return "Currently assigned to this staff member";
                }
                return `Assigned to ${classroom.classTeacher.name}`;
              }}
              isDisabled={(className) => {
                const classroom = classes.find(
                  (item) => item.name === className,
                );
                return Boolean(
                  classroom?.classTeacher &&
                    classroom.classTeacher.staffId !== staffId,
                );
              }}
              emptyMessage="No active classes are available."
            />
          )}

          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">
              {currentStep > 0 && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setStatus({ type: "", message: "" });
                    setCurrentStep((step) => Math.max(step - 1, 0));
                  }}
                  disabled={isSaving}
                >
                  Previous
                </button>
              )}
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setAssign(false)}
                disabled={isSaving}
              >
                Back to staff
              </button>
            </div>
            {currentStep < ASSIGNMENT_STEPS.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleNextStep}
                disabled={isSaving}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving assignments..." : "Save assignments"}
              </button>
            )}
          </div>
        </div>
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
  description,
}) => (
  <section className="rounded-md p-4 shadow-md">
    <h2 className="mb-3 font-bold">{title}</h2>
    {description && (
      <p className="mb-3 text-sm text-base-content/70">{description}</p>
    )}
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
