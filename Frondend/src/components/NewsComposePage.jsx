import { useState } from "react";
import { FaBars, FaNewspaper, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router";
import { createNewsArticle } from "../utils/communicationApi";

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

function NewsComposePage({ isOpen, setIsOpen }) {
  const [headline, setHeadline] = useState("");
  const [story, setStory] = useState("");
  const [publicationDate, setPublicationDate] = useState(today);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await createNewsArticle({
        headline: headline.trim(),
        story: story.trim(),
        publicationDate,
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
      });
      setHeadline("");
      setStory("");
      setPublicationDate(today());
      setImageUrl("");
      setSuccess("News article published successfully.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 md:p-4">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold font-sans">PUBLIC NEWS</h2>
          <p className="text-sm text-base-content/70">
            Share school news and updates with the public
          </p>
        </div>
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={24} />
        </Link>
      </div>

      <section className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-md">
        <div className="border-b border-base-300 bg-base-200/60 px-5 py-4 md:px-7">
          <h3 className="text-lg font-bold">Create a news article</h3>
          <p className="mt-1 text-sm text-base-content/70">
            Add the details below. Your article will be published on the school
            landing page.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-7">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)]">
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="news-headline">
                  <span className="label-text font-bold">Headline</span>
                </label>
                <input
                  id="news-headline"
                  type="text"
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  placeholder="Write a clear, engaging headline"
                  className="input input-bordered input-sm w-full rounded-md"
                  required
                  maxLength={200}
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="news-story">
                  <span className="label-text font-bold">Story</span>
                </label>
                <textarea
                  id="news-story"
                  value={story}
                  onChange={(event) => setStory(event.target.value)}
                  placeholder="Write the full news story..."
                  className="textarea textarea-bordered min-h-48 w-full rounded-md"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-control">
                  <label className="label" htmlFor="news-publication-date">
                    <span className="label-text font-bold">
                      Publication date
                    </span>
                  </label>
                  <input
                    id="news-publication-date"
                    type="date"
                    value={publicationDate}
                    onChange={(event) => setPublicationDate(event.target.value)}
                    className="input input-bordered input-sm w-full rounded-md"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="news-image-url">
                    <span className="label-text font-bold">
                      Image URL or storage reference
                    </span>
                  </label>
                  <input
                    id="news-image-url"
                    type="text"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    maxLength={2048}
                    placeholder="Optional"
                    className="input input-bordered input-sm w-full rounded-md"
                  />
                </div>
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
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm min-w-40 rounded-md"
                >
                  <FaPaperPlane />
                  {isSubmitting ? "Publishing..." : "Publish news"}
                </button>
              </div>
            </div>

            <aside className="overflow-hidden rounded-lg border border-base-300 bg-base-200/40">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="News article preview"
                  className="h-48 w-full bg-base-200 object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary/10 to-base-200 text-primary">
                  <FaNewspaper size={52} aria-hidden="true" />
                </div>
              )}
              <div className="space-y-3 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Article preview
                </p>
                <h4 className="break-words text-lg font-bold">
                  {headline || "Your headline will appear here"}
                </h4>
                <p className="line-clamp-6 whitespace-pre-wrap break-words text-sm text-base-content/70">
                  {story || "Your story preview will appear here as you write."}
                </p>
                <p className="border-t border-base-300 pt-3 text-xs text-base-content/60">
                  {publicationDate
                    ? new Date(`${publicationDate}T00:00:00`).toLocaleDateString()
                    : "Publication date"}
                </p>
              </div>
            </aside>
          </div>
        </form>
      </section>
    </div>
  );
}

export default NewsComposePage;
