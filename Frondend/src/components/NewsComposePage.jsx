import { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaEdit,
  FaNewspaper,
  FaPaperPlane,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router";
import {
  createNewsArticle,
  deleteNewsArticle,
  getAdminNews,
  updateNewsArticle,
} from "../utils/communicationApi";

const MAX_IMAGE_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadingImage, setIsReadingImage] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const fileInput = useRef(null);

  useEffect(() => {
    let active = true;
    getAdminNews()
      .then((items) => {
        if (active) setArticles(items);
      })
      .catch((loadFailure) => {
        if (active) setArticlesError(loadFailure.message);
      })
      .finally(() => {
        if (active) setIsLoadingArticles(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError("");
    setError("");
    setSuccess("");
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageUrl("");
      setImageError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageUrl("");
      setImageError("News photos must be 1 MB or smaller.");
      event.target.value = "";
      return;
    }

    setIsReadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setImageUrl("");
        setImageError("Unable to read the selected image.");
      } else {
        setImageUrl(reader.result);
      }
      setIsReadingImage(false);
    };
    reader.onerror = () => {
      setImageUrl("");
      setImageError("Unable to read the selected image.");
      setIsReadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload = {
        headline: headline.trim(),
        story: story.trim(),
        publicationDate,
        ...(editingId || imageUrl.trim()
          ? { imageUrl: imageUrl.trim() }
          : {}),
      };
      const article = editingId
        ? await updateNewsArticle(editingId, payload)
        : await createNewsArticle(payload);
      setArticles((current) =>
        editingId
          ? current.map((item) => (item._id === article._id ? article : item))
          : [article, ...current],
      );
      setHeadline("");
      setStory("");
      setPublicationDate(today());
      setImageUrl("");
      setImageError("");
      setEditingId("");
      if (fileInput.current) fileInput.current.value = "";
      setSuccess(
        editingId
          ? "News article updated successfully."
          : "News article published successfully.",
      );
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (article) => {
    const articleDate = new Date(article.publicationDate);
    setHeadline(article.headline);
    setStory(article.story);
    setPublicationDate(
      Number.isNaN(articleDate.getTime())
        ? today()
        : articleDate.toISOString().slice(0, 10),
    );
    setImageUrl(article.imageUrl || "");
    setImageError("");
    setEditingId(article._id);
    setError("");
    setSuccess("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleCancelEdit = () => {
    setHeadline("");
    setStory("");
    setPublicationDate(today());
    setImageUrl("");
    setImageError("");
    setEditingId("");
    setError("");
    setSuccess("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleDelete = async (article) => {
    if (!window.confirm(`Delete "${article.headline}" permanently?`)) return;

    setArticlesError("");
    setDeletingId(article._id);
    try {
      await deleteNewsArticle(article._id);
      setArticles((current) =>
        current.filter((item) => item._id !== article._id),
      );
      if (editingId === article._id) handleCancelEdit();
    } catch (deleteFailure) {
      setArticlesError(deleteFailure.message);
    } finally {
      setDeletingId("");
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
          <h3 className="text-lg font-bold">
            {editingId ? "Edit news article" : "Create a news article"}
          </h3>
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
                  <label className="label" htmlFor="news-image">
                    <span className="label-text font-bold">Photo</span>
                  </label>
                  <input
                    ref={fileInput}
                    id="news-image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered file-input-sm w-full rounded-md"
                  />
                  <span className="mt-1 text-xs text-base-content/60">
                    JPEG, PNG, or WebP, up to 1 MB.
                  </span>
                  {imageError && (
                    <p className="mt-2 text-sm text-error" role="alert">
                      {imageError}
                    </p>
                  )}
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        if (fileInput.current) fileInput.current.value = "";
                      }}
                      className="btn btn-ghost btn-xs mt-2 self-start"
                    >
                      Remove photo
                    </button>
                  )}
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
                  disabled={isSubmitting || isReadingImage}
                  className="btn btn-primary btn-sm min-w-40 rounded-md"
                >
                  <FaPaperPlane />
                  {isReadingImage
                    ? "Reading photo..."
                    : isSubmitting
                      ? "Saving..."
                      : editingId
                        ? "Save changes"
                        : "Publish news"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                )}
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

      <section className="mt-8 space-y-3">
        <h3 className="text-lg font-bold">Published news</h3>
        {articlesError && (
          <p role="alert" className="alert alert-error py-2 text-sm">
            {articlesError}
          </p>
        )}
        {isLoadingArticles ? (
          <p role="status" className="text-sm text-base-content/70">
            Loading published news...
          </p>
        ) : !articles.length && !articlesError ? (
          <p className="text-sm text-base-content/70">
            No news articles have been published yet.
          </p>
        ) : (
          articles.map((article) => (
            <article
              key={article._id}
              className="flex flex-col gap-4 rounded-xl border border-base-300 bg-base-100 p-4 sm:flex-row sm:items-start"
            >
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt=""
                  className="h-24 w-full rounded-lg object-cover sm:w-32"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="break-words font-bold">{article.headline}</h4>
                  <time
                    className="text-xs text-base-content/60"
                    dateTime={article.publicationDate}
                  >
                    {new Date(article.publicationDate).toLocaleDateString()}
                  </time>
                </div>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap break-words text-sm text-base-content/70">
                  {article.story}
                </p>
                <div className="mt-3 flex justify-end gap-2 border-t border-base-300 pt-3">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleEdit(article)}
                  >
                    <FaEdit aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => handleDelete(article)}
                    disabled={deletingId === article._id}
                  >
                    <FaTrash aria-hidden="true" />
                    {deletingId === article._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default NewsComposePage;
