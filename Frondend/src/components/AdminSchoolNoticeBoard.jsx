import { useEffect, useState } from "react";
import { FaBullhorn, FaPaperPlane } from "react-icons/fa";
import {
  createSchoolNotice,
  getSchoolNotices,
} from "../utils/communicationApi";

const AdminSchoolNoticeBoard = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getSchoolNotices()
      .then((items) => {
        if (active) setNotices(items);
      })
      .catch((loadFailure) => {
        if (active) setLoadError(loadFailure.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const notice = await createSchoolNotice({
        title: title.trim(),
        message: message.trim(),
      });
      setNotices((current) =>
        [notice, ...current.filter((item) => item._id !== notice._id)].slice(
          0,
          2,
        ),
      );
      setTitle("");
      setMessage("");
      setSuccess("Notice published to the school landing page.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="space-y-6 p-3 md:p-6">
      <header>
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <FaBullhorn className="text-primary" aria-hidden="true" />
          School notice board
        </h1>
        <p className="mt-1 text-sm text-base-content/70">
          Publish important updates for everyone visiting the school landing
          page.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 bg-base-200/60 px-5 py-4 md:px-7">
          <h2 className="text-lg font-bold">Post a notice</h2>
          <p className="mt-1 text-sm text-base-content/70">
            The two latest notices appear on the public landing page.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 md:p-7">
          <div className="form-control">
            <label className="label" htmlFor="school-notice-title">
              <span className="label-text font-bold">Title</span>
            </label>
            <input
              id="school-notice-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="input input-bordered w-full"
              placeholder="For example: Parent-teacher meeting"
              maxLength={160}
              required
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="school-notice-message">
              <span className="label-text font-bold">Message</span>
            </label>
            <textarea
              id="school-notice-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="textarea textarea-bordered min-h-36 w-full"
              placeholder="Write the notice for students, families, and staff..."
              maxLength={3000}
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                {message.length}/3000 characters
              </span>
            </label>
          </div>

          {error && (
            <p className="alert alert-error py-2 text-sm" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="alert alert-success py-2 text-sm" role="status">
              {success}
            </p>
          )}
          <div className="flex justify-end border-t border-base-300 pt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <FaPaperPlane aria-hidden="true" />
              {isSubmitting ? "Publishing..." : "Publish notice"}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Recently published</h2>
        {loadError ? (
          <p className="text-sm text-error" role="alert">
            {loadError}
          </p>
        ) : isLoading ? (
          <p className="text-sm text-base-content/70" role="status">
            Loading notices...
          </p>
        ) : notices.length === 0 ? (
          <p className="text-sm text-base-content/70">
            No notices have been published yet.
          </p>
        ) : (
          notices.map((notice) => (
            <article
              key={notice._id}
              className="rounded-xl border border-base-300 bg-base-100 p-4"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="font-bold">{notice.title}</h3>
                <time
                  className="text-xs text-base-content/60"
                  dateTime={notice.createdAt}
                >
                  {new Date(notice.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm text-base-content/80">
                {notice.message}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default AdminSchoolNoticeBoard;
