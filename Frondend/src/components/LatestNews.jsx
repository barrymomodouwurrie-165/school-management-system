import { useEffect, useState } from "react";
import { getPublicNews } from "../utils/communicationApi";

const LatestNews = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="w-full px-8 py-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-2">Latest news</h1>
        {error && <p role="alert">{error}</p>}
        {isLoading ? (
          <p>Loading news...</p>
        ) : !articles.length && !error ? (
          <p>No news articles have been published yet.</p>
        ) : (
          <div className="flex flex-col">
            {articles.map((article) => (
              <article
                key={article._id}
                className="flex flex-col md:flex-row items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2"
              >
                {article.imageUrl && (
                  <div>
                    <img
                      src={article.imageUrl}
                      alt=""
                      className="w-[300px] h-[200px] object-cover"
                    />
                  </div>
                )}
                <p className="flex-1">
                  <b>Headline: {article.headline}</b>
                  <br />
                  News: {article.story}
                </p>
                <time dateTime={article.publicationDate}>
                  {new Date(article.publicationDate).toLocaleDateString()}
                </time>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestNews;
