import { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa";
import { Link } from "react-router";
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

const LatestNews = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPublicNews({ limit: 5 })
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

  return (
    <section id="news" className="w-full scroll-mt-36 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              School updates
            </p>
            <h2 className="mt-1 text-2xl font-bold">Latest news</h2>
          </div>
          <Link
            to="/news"
            className="btn btn-ghost btn-sm text-primary"
          >
            View all news
          </Link>
        </header>

        {error ? (
          <p role="alert" className="alert alert-error">
            {error}
          </p>
        ) : isLoading ? (
          <p role="status">Loading news...</p>
        ) : !articles.length ? (
          <p>No news articles have been published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article._id}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
              >
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt=""
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div
                    aria-label="News image placeholder"
                    className="flex h-48 items-center justify-center bg-primary/5 text-primary/50"
                  >
                    <FaNewspaper aria-hidden="true" size={44} />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <time
                    dateTime={article.publicationDate}
                    className="text-sm text-slate-500"
                  >
                    {formatPublicationDate(article.publicationDate)}
                  </time>
                  <h3 className="mt-2 line-clamp-3 text-lg font-bold text-slate-800">
                    {article.headline}
                  </h3>
                  <Link
                    to={`/news/${encodeURIComponent(article._id)}`}
                    className="btn btn-primary btn-sm mt-5 self-start rounded-full px-5"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestNews;
