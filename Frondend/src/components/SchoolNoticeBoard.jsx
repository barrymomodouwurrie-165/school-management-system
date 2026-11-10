import { useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa";
import { getSchoolNotices } from "../utils/communicationApi";

const SchoolNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSchoolNotices()
      .then((items) => {
        if (active) setNotices(items);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      aria-labelledby="school-notice-heading"
      className="mx-auto max-w-6xl px-4 pt-8 md:px-8"
    >
      <div className="overflow-hidden rounded-3xl border border-primary/15 bg-base-100 shadow-xl shadow-primary/5">
        <div className="flex items-center gap-4 bg-primary px-5 py-5 text-primary-content md:px-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-content/15">
            <FaBullhorn size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">
              Stay informed
            </p>
            <h2
              id="school-notice-heading"
              className="mt-1 text-2xl font-black md:text-3xl"
            >
              School notice board
            </h2>
          </div>
        </div>

        <div className="p-5 md:p-8">
          {isLoading ? (
            <p className="text-sm text-base-content/70" role="status">
              Loading school notices...
            </p>
          ) : error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : notices.length === 0 ? (
            <p className="text-sm text-base-content/70">
              There are no school notices at the moment.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {notices.map((notice) => (
                <article
                  key={notice._id}
                  className="rounded-2xl border border-base-300 bg-base-200/50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-base-content">
                      {notice.title}
                    </h3>
                    <time
                      className="text-xs text-base-content/60"
                      dateTime={notice.createdAt}
                    >
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-base-content/80">
                    {notice.message}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SchoolNoticeBoard;
