import { useEffect, useMemo, useState } from "react";
import { FaSdCard } from "react-icons/fa";
import {
  getTeacherClasses,
  getTeacherResultEntryWindow,
  getTeacherResults,
  saveTeacherResults,
} from "../../utils/teacherApi";
import ClassesResults from "./ClassesResults";

const EMPTY_LIST = [];

const getCurrentAcademicYear = () => {
  const today = new Date();
  const startYear = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
  return `${startYear}/${startYear + 1}`;
};

const EnterResults = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [evaluationPeriod, setEvaluationPeriod] = useState("First Term");
  const [academicYear, setAcademicYear] = useState(getCurrentAcademicYear);
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState({});
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [loadedResultsKey, setLoadedResultsKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [lastEntered, setLastEntered] = useState("");
  const [entryWindowResult, setEntryWindowResult] = useState({
    key: "",
    window: null,
    error: "",
  });

  useEffect(() => {
    let active = true;
    getTeacherClasses()
      .then((result) => {
        if (!active) return;
        setClasses(result);
        setClassName(result[0]?.name ?? "");
        setSubject(result[0]?.subjects[0] ?? "");
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setIsLoadingClasses(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const key = JSON.stringify([academicYear, evaluationPeriod]);
    getTeacherResultEntryWindow({ academicYear, evaluationPeriod })
      .then((result) => {
        if (active) setEntryWindowResult({ key, window: result, error: "" });
      })
      .catch((loadError) => {
        if (active) {
          setEntryWindowResult({ key, window: null, error: loadError.message });
        }
      });

    return () => {
      active = false;
    };
  }, [academicYear, evaluationPeriod]);

  const entryWindowKey = JSON.stringify([academicYear, evaluationPeriod]);
  const isLoadingEntryWindow = entryWindowResult.key !== entryWindowKey;
  const entryWindow =
    entryWindowResult.key === entryWindowKey ? entryWindowResult.window : null;
  const entryWindowError =
    entryWindowResult.key === entryWindowKey ? entryWindowResult.error : "";

  const selectedClass = useMemo(
    () => classes.find((classroom) => classroom.name === className),
    [classes, className],
  );
  const subjects = selectedClass?.subjects ?? EMPTY_LIST;
  const students = selectedClass?.students ?? EMPTY_LIST;
  const resultsKey =
    selectedClass && subjects.includes(subject)
      ? JSON.stringify([className, subject, academicYear, evaluationPeriod])
      : "";
  const isLoadingResults = Boolean(resultsKey && loadedResultsKey !== resultsKey);
  const isEntryOpen = Boolean(entryWindow?.isOpen && !entryWindowError);

  useEffect(() => {
    if (!resultsKey) return;

    let active = true;
    getTeacherResults({
      className,
      subject,
      academicYear,
      evaluationPeriod,
    })
      .then((results) => {
        if (!active) return;
        const savedByStudent = new Map(
          results.map((result) => [result.studentId, result]),
        );
        setMarks(
          Object.fromEntries(
            students.map((student) => {
              const saved = savedByStudent.get(student.id);
              return [
                student.id,
                {
                  testScore: saved ? String(saved.testScore) : "",
                  examScore: saved ? String(saved.examScore) : "",
                },
              ];
            }),
          ),
        );
        setLoadedResultsKey(resultsKey);
        const mostRecent = results
          .map((result) => result.updatedAt)
          .filter(Boolean)
          .sort((first, second) => new Date(second) - new Date(first))[0];
        setLastEntered(
          mostRecent
            ? new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(mostRecent))
            : "",
        );
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
          setLoadedResultsKey(resultsKey);
          setMarks(
            Object.fromEntries(
              students.map((student) => [
                student.id,
                { testScore: "", examScore: "" },
              ]),
            ),
          );
        }
      });

    return () => {
      active = false;
    };
  }, [academicYear, className, evaluationPeriod, resultsKey, students, subject]);

  const handleClassChange = (event) => {
    const nextClass = classes.find(
      (classroom) => classroom.name === event.target.value,
    );
    setClassName(event.target.value);
    setSubject(nextClass?.subjects[0] ?? "");
    setMarks({});
    setLastEntered("");
    setError("");
    setStatus({ type: "", message: "" });
  };

  const handleMarkChange = (studentId, field, value) => {
    setMarks((current) => ({
      ...current,
      [studentId]: { ...current[studentId], [field]: value },
    }));
    setStatus({ type: "", message: "" });
  };

  const handleSave = async () => {
    setStatus({ type: "", message: "" });
    const entries = students
      .map((student) => ({ student, ...marks[student.id] }))
      .filter(
        (entry) =>
          (entry.testScore !== "" && entry.testScore !== undefined) ||
          (entry.examScore !== "" && entry.examScore !== undefined),
      );
    if (!entries.length) {
      setStatus({
        type: "error",
        message: "Enter test and exam marks for at least one student.",
      });
      return;
    }

    const incompleteEntry = entries.find(
      (entry) => entry.testScore === "" || entry.examScore === "",
    );
    if (incompleteEntry) {
      setStatus({
        type: "error",
        message: "Enter both test and exam marks for each student being saved.",
      });
      return;
    }
    const invalidEntry = entries.find(
      (entry) =>
        !Number.isFinite(Number(entry.testScore)) ||
        Number(entry.testScore) < 0 ||
        Number(entry.testScore) > 30 ||
        !Number.isFinite(Number(entry.examScore)) ||
        Number(entry.examScore) < 0 ||
        Number(entry.examScore) > 70,
    );
    if (invalidEntry) {
      setStatus({
        type: "error",
        message: "Test scores must be 0-30 and exam scores must be 0-70.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveTeacherResults({
        className,
        subject,
        academicYear,
        evaluationPeriod,
        entries: entries.map((entry) => ({
          studentId: entry.student.id,
          testScore: Number(entry.testScore),
          examScore: Number(entry.examScore),
        })),
      });
      let savedResults;
      try {
        savedResults = await getTeacherResults({
          className,
          subject,
          academicYear,
          evaluationPeriod,
        });
      } catch (refreshError) {
        setStatus({
          type: "error",
          message: `${result.message} The saved marks could not be refreshed: ${refreshError.message}`,
        });
        return;
      }
      setStatus({ type: "success", message: result.message });
      const savedByStudent = new Map(
        savedResults.map((resultItem) => [resultItem.studentId, resultItem]),
      );
      setMarks(
        Object.fromEntries(
          students.map((student) => {
            const saved = savedByStudent.get(student.id);
            return [
              student.id,
              {
                testScore: saved ? String(saved.testScore) : "",
                examScore: saved ? String(saved.examScore) : "",
              },
            ];
          }),
        ),
      );
      const mostRecent = savedResults
        .map((resultItem) => resultItem.updatedAt)
        .filter(Boolean)
        .sort((first, second) => new Date(second) - new Date(first))[0];
      setLastEntered(
        mostRecent
          ? new Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(mostRecent))
          : "",
      );
    } catch (saveError) {
      setStatus({
        type: "error",
        message: saveError.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-2 rounded-md shadow-md px-2 pb-3 mb-4">
        <p className="text-sm md:text-base">ACADEMIC SESSION: {academicYear}</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-sm md:text-lg font-bold text-blue-600">
            Enter Results
          </h2>
          <span className="text-xs md:text-sm bg-blue-600/10 px-2 py-1 rounded-xl">
            Grading Scale: A1: 80+, B2: 75+, B3: 70+, C4: 65+, C5: 60+, C6: 55+,
            D7: 50+, E8: 40+ F9: below 39
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-3 text-sm text-error">
          {error}
        </p>
      )}
      {entryWindowError ? (
        <p role="alert" className="mb-3 text-sm text-error">
          {entryWindowError}
        </p>
      ) : isLoadingEntryWindow ? (
        <p role="status" className="mb-3 text-sm text-base-content/70">
          Checking marks-entry access...
        </p>
      ) : !isEntryOpen ? (
        <p
          role="status"
          className="mb-3 rounded-md bg-warning/10 p-3 text-sm text-warning"
        >
          Marks entry is closed for {evaluationPeriod}, {academicYear}.
          {entryWindow?.deadlineAt &&
            ` The deadline was ${new Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(entryWindow.deadlineAt))}.`}
        </p>
      ) : (
        <p className="mb-3 text-sm text-success">
          Marks entry is open
          {entryWindow.deadlineAt &&
            ` until ${new Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(entryWindow.deadlineAt))}.`}
        </p>
      )}
      {status.message && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={`mb-3 text-sm ${
            status.type === "error" ? "text-error" : "text-success"
          }`}
        >
          {status.message}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-md shadow-md px-2 py-3 my-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs md:text-sm text-base-content/70">
            ASSIGNED CLASS
          </span>
          <select
            className="select select-ghost select-sm rounded-md bg-blue-600/5"
            value={className}
            onChange={handleClassChange}
            disabled={isLoadingClasses || classes.length === 0}
          >
            {classes.map((classroom) => (
              <option key={classroom._id} value={classroom.name}>
                {classroom.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs md:text-sm text-base-content/70">
            EVALUATION PERIOD
          </span>
          <select
            className="select select-ghost select-sm rounded-md bg-blue-600/5"
            value={evaluationPeriod}
            onChange={(event) => {
              setEvaluationPeriod(event.target.value);
              setMarks({});
              setLastEntered("");
              setError("");
              setStatus({ type: "", message: "" });
            }}
          >
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs md:text-sm text-base-content/70">
            SUBJECT
          </span>
          <select
            className="select select-ghost select-sm rounded-md bg-blue-600/5"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setMarks({});
              setLastEntered("");
              setError("");
              setStatus({ type: "", message: "" });
            }}
            disabled={!subjects.length}
          >
            {subjects.map((subjectName) => (
              <option key={subjectName} value={subjectName}>
                {subjectName}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs md:text-sm text-base-content/70">
            ACADEMIC YEAR
          </span>
          <input
            className="input input-ghost input-sm bg-blue-600/5"
            value={academicYear}
            onChange={(event) => {
              setAcademicYear(event.target.value);
              setMarks({});
              setLastEntered("");
              setError("");
              setStatus({ type: "", message: "" });
            }}
            pattern="\d{4}/\d{4}"
            title="Use the format YYYY/YYYY"
            required
          />
        </label>
      </div>

      {isLoadingClasses ? (
        <p role="status" className="py-8 text-center">
          Loading your assigned classes...
        </p>
      ) : !classes.length ? (
        <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
          No active assigned classes are available for grade entry.
        </p>
      ) : !subjects.length ? (
        <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
          You do not have a subject assignment for this class.
        </p>
      ) : isLoadingResults ? (
        <p role="status" className="py-8 text-center">
          Loading saved marks...
        </p>
      ) : students.length ? (
        <>
          <div className="overflow-x-auto shadow-md">
            <div className="grid min-w-[680px] grid-cols-6 text-xs md:text-base px-2 py-4 bg-blue-600/20 rounded-t-md">
              <span>ID</span>
              <span>NAME</span>
              <span>TEST (30)</span>
              <span>EXAM (70)</span>
              <span>TOTAL (100)</span>
              <span>GRADE</span>
            </div>
            {students.map((student) => (
              <ClassesResults
                key={student.id}
                data={student}
                marks={marks[student.id] ?? { testScore: "", examScore: "" }}
                onMarkChange={handleMarkChange}
                disabled={!isEntryOpen || isLoadingEntryWindow}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-md"
              onClick={handleSave}
              disabled={
                isSaving ||
                Boolean(error) ||
                !isEntryOpen ||
                isLoadingEntryWindow
              }
            >
              <FaSdCard className="text-white" />
              {isSaving ? "Saving..." : "Save Marks"}
            </button>
            {lastEntered && (
              <span className="text-sm md:text-base text-base-content/70">
                Last Entered: {lastEntered}
              </span>
            )}
          </div>
        </>
      ) : (
        <p className="rounded-md p-6 text-center text-base-content/70 shadow-md">
          There are no active students in this class.
        </p>
      )}
    </div>
  );
};

export default EnterResults;
