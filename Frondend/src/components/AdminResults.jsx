import { useEffect, useState } from "react";
import {
  getAdminResultOptions,
  getAdminResultsForPublishing,
  publishAdminResults,
} from "../utils/adminApi";

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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
