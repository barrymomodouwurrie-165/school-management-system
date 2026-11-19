import { useEffect, useState } from "react";
import { FaArrowLeft, FaNewspaper } from "react-icons/fa";
import { Link, useParams } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getPublicNews } from "../utils/communicationApi";

const formatPublicationDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

const NewsPage = ({ theme, toggleTheme }) => {
  const { articleId } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isDark = theme === "dark";
  const cardClass = isDark
    ? "border-slate-800 bg-slate-900"
    : "border-slate-200 bg-white";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-600";

  useEffect(() => {
    let active = true;
    getPublicNews()
      .then((news) => {
        if (active) setArticles(news);
      })
      .catch((loadFailure) => {
        if (active) setError(loadFailure.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const article = articleId
    ? articles.find((item) => item._id === articleId)
    : null;

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="mx-auto min-h-[65vh] max-w-6xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
        <header className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            School updates
          </p>
          <h1 className="mt-1 text-3xl font-black sm:text-4xl">
            {articleId ? "News article" : "Latest news"}
          </h1>
          <p className={`mt-2 max-w-2xl ${mutedClass}`}>
            Read the latest announcements and stories from Barry&apos;s Junior
            and Secondary School.
          </p>
        </header>

        {error ? (
          <p role="alert" className="alert alert-error">
            {error}
          </p>
        ) : isLoading ? (
          <p role="status">Loading news...</p>
        ) : articleId && !article ? (
          <section className={`rounded-2xl border p-6 ${cardClass}`}>
            <p>This news article is no longer available.</p>
            <Link to="/news" className="btn btn-primary btn-sm mt-4">
              <FaArrowLeft aria-hidden="true" />
              Back to all news
            </Link>
          </section>
        ) : articleId ? (
          <article className={`overflow-hidden rounded-3xl border ${cardClass}`}>
            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt=""
                className="max-h-[34rem] w-full object-cover"
              />
            ) : (
              <div
                aria-label="News image placeholder"
                className="flex h-64 items-center justify-center bg-primary/5 text-primary/50"
              >
                <FaNewspaper aria-hidden="true" size={56} />
              </div>
            )}
            <div className="p-5 sm:p-8">
              <Link
                to="/news"
                className="btn btn-ghost btn-sm -ml-3 mb-4 text-primary"
              >
                <FaArrowLeft aria-hidden="true" />
                All news
              </Link>
              <time
                dateTime={article.publicationDate}
                className={`block text-sm ${mutedClass}`}
              >
                {formatPublicationDate(article.publicationDate)}
              </time>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">
                {article.headline}
              </h2>
              <p className={`mt-6 whitespace-pre-wrap break-words leading-7 ${mutedClass}`}>
                {article.story}
              </p>
            </div>
          </article>
        ) : articles.length ? (
          <div className="space-y-6">
            {articles.map((item) => (
              <article
                key={item._id}
                className={`grid overflow-hidden rounded-3xl border md:grid-cols-[minmax(240px,0.8fr)_1.2fr] ${cardClass}`}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-56 w-full object-cover md:h-full md:min-h-64"
                  />
                ) : (
                  <div
                    aria-label="News image placeholder"
                    className="flex min-h-56 items-center justify-center bg-primary/5 text-primary/50"
                  >
                    <FaNewspaper aria-hidden="true" size={48} />
                  </div>
                )}
                <div className="p-5 sm:p-7">
                  <time
                    dateTime={item.publicationDate}
                    className={`text-sm ${mutedClass}`}
                  >
                    {formatPublicationDate(item.publicationDate)}
                  </time>
                  <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                    {item.headline}
                  </h2>
                  <p className={`mt-4 whitespace-pre-wrap break-words leading-7 ${mutedClass}`}>
                    {item.story}
                  </p>
                  <Link
                    to={`/news/${encodeURIComponent(item._id)}`}
                    className="btn btn-outline btn-primary btn-sm mt-5 rounded-full"
                  >
                    Open article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No news articles have been published yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewsPage;
