import { useEffect, useMemo, useRef, useState } from "react";
import { FaBars, FaMoon, FaSun } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { getAdminStaff, getAdminStudents } from "../utils/adminApi";
import logo from "../assets/logo.jpg";

const getRecordName = (record) =>
  `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
  record.fullName ||
  "Unnamed record";

const getSearchFields = (record, type) =>
  type === "student"
    ? [
        getRecordName(record),
        record.student_id,
        record.class,
        record.section,
        record.guardian_name,
        record.gender,
        record.status,
      ]
    : [
        getRecordName(record),
        record.staff_id,
        record.email,
        record.department,
        record.staff_position,
        record.subject_taught,
        record.phone_number,
      ];

const AdminNavebar = ({
  isOpen,
  setIsOpen,
  isClick,
  theme,
  toggleTheme,
  onSearchSelect,
}) => {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState(null);
  const [searchError, setSearchError] = useState("");
  const recordsRequest = useRef(null);
  const searchContainer = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2 || records) return undefined;

    let active = true;
    recordsRequest.current ??= Promise.all([
      getAdminStudents(),
      getAdminStaff(),
    ]);

    recordsRequest.current
      .then(([students, staff]) => {
        if (active) setRecords({ students, staff });
      })
      .catch((error) => {
        recordsRequest.current = null;
        if (active) {
          setSearchError({
            query: query.trim(),
            message: error.message || "Unable to search school records.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [query, records]);

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery || !records) return [];

    return [
      ...records.students.map((record) => ({ record, type: "student" })),
      ...records.staff.map((record) => ({ record, type: "staff" })),
    ]
      .filter(({ record, type }) =>
        getSearchFields(record, type).some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(normalizedQuery),
        ),
      )
      .slice(0, 8);
  }, [query, records]);

  const selectResult = (result) => {
    setQuery("");
    onSearchSelect(result.type === "student" ? "students" : "staff", query.trim());
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchResults.length) selectResult(searchResults[0]);
  };

  if (isOpen || isClick) return null;

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-base-300 bg-base-100/95 px-3 py-2 shadow-sm backdrop-blur-md md:left-[220px] md:px-5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
          <img
            src={logo}
            alt="School logo"
            className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
          />
          <div className="min-w-0">
            <h1 className="font-bold leading-tight">Admin</h1>
            <p className="max-w-40 text-[10px] leading-tight text-base-content/70 sm:max-w-none sm:text-xs">
              Designed and Developed by BarryDev-HUB
            </p>
          </div>
        </div>

        <form
          className="relative order-3 w-full md:order-none md:mx-4 md:max-w-2xl md:flex-1"
          onSubmit={handleSearchSubmit}
          ref={searchContainer}
          role="search"
        >
          <FiSearch
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60"
            aria-hidden="true"
          />
          <input
            type="search"
            className="input input-bordered w-full pl-10"
            placeholder="Search students or staff by name, ID, email..."
            aria-label="Search student and staff records"
            aria-expanded={query.trim().length >= 2}
            aria-controls="admin-search-results"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setQuery("");
            }}
          />
          {query.trim().length >= 2 && (
            <div
              id="admin-search-results"
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              {!records && searchError?.query !== query.trim() ? (
                <p className="p-3 text-sm text-base-content/70">
                  Searching records...
                </p>
              ) : searchError?.query === query.trim() ? (
                <p role="alert" className="p-3 text-sm text-error">
                  {searchError.message}
                </p>
              ) : searchResults.length ? (
                <ul className="space-y-1">
                  {searchResults.map((result) => {
                    const recordId =
                      result.record._id ||
                      result.record.student_id ||
                      result.record.staff_id;
                    const detail =
                      result.type === "student"
                        ? [
                            result.record.student_id,
                            result.record.class,
                            result.record.section,
                          ]
                            .filter(Boolean)
                            .join(" · ")
                        : [
                            result.record.staff_id,
                            result.record.email,
                            result.record.department,
                          ]
                            .filter(Boolean)
                            .join(" · ");

                    return (
                      <li key={`${result.type}-${recordId}`}>
                        <button
                          type="button"
                          className="flex w-full items-start justify-between gap-3 rounded-lg p-3 text-left hover:bg-base-200"
                          onClick={() => selectResult(result)}
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">
                              {getRecordName(result.record)}
                            </span>
                            <span className="block truncate text-xs text-base-content/70">
                              {detail || "School record"}
                            </span>
                          </span>
                          <span className="badge badge-outline capitalize">
                            {result.type}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="p-3 text-sm text-base-content/70">
                  No student or staff records match “{query.trim()}”.
                </p>
              )}
            </div>
          )}
        </form>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm rounded-full border border-primary/20 bg-primary/5 text-primary"
            aria-label="Toggle theme"
          >
            {theme === "corporate" ? <FaMoon size={14} /> : <FaSun size={14} />}
            <span className="hidden sm:inline">
              {theme === "corporate" ? "Dark" : "Light"}
            </span>
          </button>

          <button
            type="button"
            className="btn btn-ghost md:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
          >
            <FaBars size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavebar;
