import { useEffect, useState } from "react";
import {
  getStudentResult,
  getStudentResultOptions,
} from "../../utils/studentApi";

const EMPTY_OPTIONS = { academicYears: [], classes: [], terms: [] };

const ResultCheck = ({ onBack, setViewResult, setSelectedResult }) => {
  const [options, setOptions] = useState(EMPTY_OPTIONS);
  const [selection, setSelection] = useState({
    academicYear: "",
    className: "",
    evaluationPeriod: "",
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [optionsError, setOptionsError] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [lookupStatus, setLookupStatus] = useState("");

  useEffect(() => {
    let active = true;
    getStudentResultOptions()
      .then((result) => {
        if (!active) return;
        setOptions(result);
        setSelection({
          academicYear: result.academicYears[0] ?? "",
          className: result.classes[0] ?? "",
          evaluationPeriod: result.terms[0] ?? "",
        });
      })
      .catch((error) => {
        if (active) setOptionsError(error.message);
      })
      .finally(() => {
        if (active) setIsLoadingOptions(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setSelection((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setLookupError("");
    setLookupStatus("");
    setSelectedResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {
      academicYear: selection.academicYear
        ? ""
        : "Select an academic year.",
      className: selection.className ? "" : "Select a class.",
      evaluationPeriod: selection.evaluationPeriod ? "" : "Select a term.",
    };
    setFieldErrors(errors);
    setLookupError("");
    setLookupStatus("");
    setSelectedResult(null);

    if (Object.values(errors).some(Boolean)) return;

    setIsLoadingResult(true);
    try {
      const result = await getStudentResult(selection);
      if (!result.subjects.length) {
        setLookupStatus("No result found for this selection.");
        return;
      }
      setSelectedResult(result);
      setViewResult(true);
    } catch (error) {
      setLookupError(error.message);
    } finally {
      setIsLoadingResult(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto max-w-2xl rounded-lg border border-base-300 bg-base-100 p-4 shadow-md sm:p-6"
      >
        <header className="mb-5">
          <h1 className="text-xl font-bold text-primary">CHECK RESULTS</h1>
          <p className="text-sm text-base-content/70">
            Select the academic year, class, and term to view your published
            result.
          </p>
        </header>

        {isLoadingOptions ? (
          <p role="status" className="py-6 text-center">
            Loading result selections...
          </p>
        ) : (
          <>
            {optionsError && (
              <p role="alert" className="mb-4 text-sm text-error">
                {optionsError}
              </p>
            )}

            <div className="grid gap-4">
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">
                  Academic Year
                </span>
                <select
                  className={`select select-bordered ${
                    fieldErrors.academicYear ? "select-error" : ""
                  }`}
                  value={selection.academicYear}
                  onChange={(event) =>
                    handleChange("academicYear", event.target.value)
                  }
                  disabled={!options.academicYears.length}
                  aria-invalid={Boolean(fieldErrors.academicYear)}
                >
                  <option value="">Select academic year</option>
                  {options.academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {fieldErrors.academicYear && (
                  <span className="mt-1 text-sm text-error">
                    {fieldErrors.academicYear}
                  </span>
                )}
              </label>

              <label className="form-control">
                <span className="label-text mb-1 font-semibold">Class</span>
                <select
                  className={`select select-bordered ${
                    fieldErrors.className ? "select-error" : ""
                  }`}
                  value={selection.className}
                  onChange={(event) =>
                    handleChange("className", event.target.value)
                  }
                  disabled={!options.classes.length}
                  aria-invalid={Boolean(fieldErrors.className)}
                >
                  <option value="">Select class</option>
                  {options.classes.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
                {fieldErrors.className && (
                  <span className="mt-1 text-sm text-error">
                    {fieldErrors.className}
                  </span>
                )}
              </label>

              <label className="form-control">
                <span className="label-text mb-1 font-semibold">Term</span>
                <select
                  className={`select select-bordered ${
                    fieldErrors.evaluationPeriod ? "select-error" : ""
                  }`}
                  value={selection.evaluationPeriod}
                  onChange={(event) =>
                    handleChange("evaluationPeriod", event.target.value)
                  }
                  disabled={!options.terms.length}
                  aria-invalid={Boolean(fieldErrors.evaluationPeriod)}
                >
                  <option value="">Select term</option>
                  {options.terms.map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
                {fieldErrors.evaluationPeriod && (
                  <span className="mt-1 text-sm text-error">
                    {fieldErrors.evaluationPeriod}
                  </span>
                )}
              </label>
            </div>

            {!optionsError &&
              (!options.academicYears.length || !options.terms.length) && (
                <p className="mt-4 rounded-md bg-base-200 p-3 text-sm text-base-content/70">
                  No results have been entered for your account yet.
                </p>
              )}
          </>
        )}

        {lookupError && (
          <p role="alert" className="mt-4 text-sm text-error">
            {lookupError}
          </p>
        )}
        {lookupStatus && (
          <p role="status" className="mt-4 text-sm text-base-content/70">
            {lookupStatus}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onBack}
            disabled={isLoadingResult}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoadingOptions || isLoadingResult || Boolean(optionsError)}
          >
            {isLoadingResult ? "Loading result..." : "View Result"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ResultCheck;
