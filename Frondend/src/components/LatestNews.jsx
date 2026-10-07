const LatestNews = ({ latestNews }) => {
  return (
    <div className="w-full px-8 py-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold mb-2">Lastest news</h1>
        <div className="flex flex-col">
          {latestNews &&
            latestNews.map((news) => {
              return (
                <div
                  key={news.id}
                  className="flex flex-col md:flex-row items-top justify-between pt-2 gap-4 border-primary/40 border-t my-2"
                >
                  <div>
                    <img
                      src={news.image}
                      alt=""
                      className="w-[300px] h-[200px] position-fit"
                    />
                  </div>
                  <p className="flex-1">
                    <b>Headline: {news.headline}</b>
                    <br />
                    News: {news.news}
                  </p>
                  <span>{news.date}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
