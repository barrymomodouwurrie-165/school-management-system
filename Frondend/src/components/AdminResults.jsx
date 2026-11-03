import { useEffect, useState } from "react";
import {
  getAdminResultOptions,
  getAdminResultEntryWindow,
  getAdminResultsForPublishing,
  publishAllAdminResults,
  publishAdminResults,
  updateAdminResultEntryWindow,
} from "../utils/adminApi";

const toLocalDateTimeInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const AdminResults = () => {
  const [options, setOptions] = useState({
    academicYears: [],
    classes: [],
    terms: [],
  });
  const [selection, setSelection] = useState({
    academicYear: "",
    className: "",
    evaluationPeriod: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [loadedSelectionKey, setLoadedSelectionKey] = useState("");
  const [publishingSubject, setPublishingSubject] = useState("");
  const [isPublishingAll, setIsPublishingAll] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [entryWindowResult, setEntryWindowResult] = useState({
    key: "",
    window: null,
    error: "",
  });
  const [deadlineInput, setDeadlineInput] = useState("");
  const [isUpdatingEntryWindow, setIsUpdatingEntryWindow] = useState(false);
  const [entryMessage, setEntryMessage] = useState("");

  useEffect(() => {
    let active = true;
    getAdminResultOptions()
      .then((result) => {
        if (!active) return;
        setOptions(result);
        setSelection({
          academicYear: result.academicYears[0] ?? "",
          className: result.classes[0] ?? "",
          evaluationPeriod: result.terms[0] ?? "",
        });
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setIsLoadingOptions(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selection.academicYear || !selection.evaluationPeriod) return undefined;

    let active = true;
    const key = JSON.stringify([
      selection.academicYear,
      selection.evaluationPeriod,
    ]);
    getAdminResultEntryWindow({
      academicYear: selection.academicYear,
      evaluationPeriod: selection.evaluationPeriod,
    })
      .then((result) => {
        if (!active) return;
        setEntryWindowResult({ key, window: result, error: "" });
        setDeadlineInput(toLocalDateTimeInput(result.deadlineAt));
      })
      .catch((loadError) => {
        if (active) {
          setEntryWindowResult({ key, window: null, error: loadError.message });
        }
      });

    return () => {
      active = false;
    };
  }, [selection.academicYear, selection.evaluationPeriod]);

  const entryWindowKey = JSON.stringify([
    selection.academicYear,
    selection.evaluationPeriod,
  ]);
  const isLoadingEntryWindow =
    Boolean(selection.academicYear && selection.evaluationPeriod) &&
    entryWindowResult.key !== entryWindowKey;
  const entryWindow =
    entryWindowResult.key === entryWindowKey ? entryWindowResult.window : null;
  const entryError =
    entryWindowResult.key === entryWindowKey ? entryWindowResult.error : "";

  useEffect(() => {
    if (
      !selection.academicYear ||
      !selection.className ||
      !selection.evaluationPeriod
    ) {
      return undefined;
    }

    let active = true;
    const selectionKey = JSON.stringify(selection);
    getAdminResultsForPublishing(selection)
      .then((result) => {
        if (active) {
          setSubjects(result);
          setLoadedSelectionKey(selectionKey);
        }
      })
      .catch((loadError) => {
        if (active) {
          setSubjects([]);
          setError(loadError.message);
          setLoadedSelectionKey(selectionKey);
        }
      });

    return () => {
      active = false;
    };
  }, [selection]);

  const hasSelection = Boolean(
    selection.academicYear && selection.className && selection.evaluationPeriod,
  );
  const isLoadingResults =
    hasSelection && loadedSelectionKey !== JSON.stringify(selection);

  const handleSelectionChange = (field, value) => {
    setSelection((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const handlePublish = async (subject) => {
    setPublishingSubject(subject);
    setError("");
    setMessage("");
    try {
      const result = await publishAdminResults({ ...selection, subject });
      setMessage(result.message);
      const updatedSubjects = await getAdminResultsForPublishing(selection);
      setSubjects(updatedSubjects);
      setLoadedSelectionKey(JSON.stringify(selection));
    } catch (publishError) {
      setError(publishError.message);
    } finally {
      setPublishingSubject("");
    }
  };

  const handlePublishAll = async () => {
    if (!selection.academicYear || !selection.evaluationPeriod) return;

    setIsPublishingAll(true);
    setError("");
    setMessage("");
    try {
      const result = await publishAllAdminResults({
        academicYear: selection.academicYear,
        evaluationPeriod: selection.evaluationPeriod,
      });
      setMessage(result.message);
      if (selection.className) {
        const updatedSubjects = await getAdminResultsForPublishing(selection);
        setSubjects(updatedSubjects);
        setLoadedSelectionKey(JSON.stringify(selection));
      }
    } catch (publishError) {
      setError(publishError.message);
    } finally {
      setIsPublishingAll(false);
    }
  };

  const handleToggleEntry = async () => {
    const isOpen = !entryWindow?.isOpen;
    if (isOpen && !deadlineInput) {
      setEntryWindowResult((current) => ({
        ...current,
        key: entryWindowKey,
        error: "Choose a deadline before opening marks entry.",
      }));
      return;
    }

    setIsUpdatingEntryWindow(true);
    setEntryWindowResult((current) => ({
      ...current,
      key: entryWindowKey,
      error: "",
    }));
    setEntryMessage("");
    try {
      const result = await updateAdminResultEntryWindow({
        academicYear: selection.academicYear,
        evaluationPeriod: selection.evaluationPeriod,
        isOpen,
        deadlineAt: isOpen ? new Date(deadlineInput).toISOString() : null,
      });
      setEntryWindowResult({
        key: entryWindowKey,
        window: result.window,
        error: "",
      });
      setDeadlineInput(toLocalDateTimeInput(result.window.deadlineAt));
      setEntryMessage(result.message);
    } catch (updateError) {
      setEntryWindowResult((current) => ({
        ...current,
        key: entryWindowKey,
        error: updateError.message,
      }));
    } finally {
      setIsUpdatingEntryWindow(false);
    }
  };

  return (
    <section className="space-y-4">
      <header>
        <h3 className="font-bold">Publish student results</h3>
        <p className="text-sm text-base-content/70">
          Review saved marks and publish each subject. Only published results
          are visible to students.
        </p>
      </header>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="text-sm text-success">
          {message}
        </p>
      )}
      <section className="space-y-3 rounded-lg border border-base-content/15 bg-white p-4 shadow-sm">
        <div>
          <h3 className="font-bold">Staff marks-entry access</h3>
          <p className="text-sm text-base-content/70">
            Open entry for the selected academic year and term until the deadline.
            You can close it early or reopen it with a new deadline.
          </p>
        </div>
        {entryError && (
          <p role="alert" className="text-sm text-error">
            {entryError}
          </p>
        )}
        {entryMessage && (
          <p role="status" className="text-sm text-success">
            {entryMessage}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="form-control max-w-sm">
            <span className="label-text mb-1">Marks deadline</span>
            <input
              type="datetime-local"
              className="input input-bordered input-sm"
              value={deadlineInput}
              min={toLocalDateTimeInput(new Date())}
              onChange={(event) => setDeadlineInput(event.target.value)}
              disabled={
                isLoadingOptions ||
                isLoadingEntryWindow ||
                isUpdatingEntryWindow ||
                !selection.academicYear ||
                !selection.evaluationPeriod
              }
            />
          </label>
          <button
            type="button"
            className={`btn btn-sm ${entryWindow?.isOpen ? "btn-error" : "btn-primary"}`}
            onClick={handleToggleEntry}
            disabled={
              isLoadingOptions ||
              isLoadingEntryWindow ||
              isUpdatingEntryWindow ||
              !selection.academicYear ||
              !selection.evaluationPeriod
            }
          >
            {isLoadingEntryWindow
              ? "Loading access..."
              : isUpdatingEntryWindow
                ? "Updating access..."
                : entryWindow?.isOpen
                  ? "Close marks entry"
                  : "Open marks entry"}
          </button>
        </div>
        <p className="text-sm font-medium">
          Status:{" "}
          {isLoadingEntryWindow
            ? "Loading"
            : entryWindow?.isOpen
              ? "Open"
              : entryWindow?.deadlineAt &&
                  new Date(entryWindow.deadlineAt) <= new Date()
                ? "Deadline passed"
                : "Closed"}
        </p>
      </section>

      {isLoadingOptions ? (
        <p role="status">Loading result selections...</p>
      ) : (
        <>
          <div className="grid gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-3">
            <label className="form-control">
              <span className="label-text mb-1">Academic year</span>
              <select
                className="select select-bordered select-sm"
                value={selection.academicYear}
                onChange={(event) =>
                  handleSelectionChange("academicYear", event.target.value)
                }
                disabled={!options.academicYears.length}
              >
                <option value="">Select academic year</option>
                {options.academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Class</span>
              <select
                className="select select-bordered select-sm"
                value={selection.className}
                onChange={(event) =>
                  handleSelectionChange("className", event.target.value)
                }
                disabled={!options.classes.length}
              >
                <option value="">Select class</option>
                {options.classes.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Term</span>
              <select
                className="select select-bordered select-sm"
                value={selection.evaluationPeriod}
                onChange={(event) =>
                  handleSelectionChange(
                    "evaluationPeriod",
                    event.target.value,
                  )
                }
                disabled={!options.terms.length}
              >
                <option value="">Select term</option>
                {options.terms.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-base-content/70">
              Publish every saved result across all classes and subjects for
              the selected year and term.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handlePublishAll}
              disabled={
                !selection.academicYear ||
                !selection.evaluationPeriod ||
                isPublishingAll ||
                Boolean(publishingSubject)
              }
            >
              {isPublishingAll ? "Publishing all..." : "Publish All"}
            </button>
          </div>

          {!hasSelection ? (
            <p className="rounded-lg bg-white p-6 text-center text-base-content/70 shadow-sm">
              Select an academic year, class, and term to review results.
            </p>
          ) : isLoadingResults ? (
            <p role="status" className="py-6 text-center">
              Loading saved results...
            </p>
          ) : subjects.length ? (
            <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Results saved</th>
                    <th>Publication</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((item) => (
                    <tr key={item.subject}>
                      <td>{item.subject}</td>
                      <td>
                        {item.publishedCount} / {item.totalStudents} published
                      </td>
                      <td>
                        {item.isPublished ? "Published" : "Not published"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={
                            item.isPublished || Boolean(publishingSubject)
                          }
                          onClick={() => handlePublish(item.subject)}
                        >
                          {publishingSubject === item.subject
                            ? "Publishing..."
                            : item.isPublished
                              ? "Published"
                              : "Publish"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-lg bg-white p-6 text-center text-base-content/70 shadow-sm">
              No saved results match this selection.
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default AdminResults;
