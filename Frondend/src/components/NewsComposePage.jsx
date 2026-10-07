import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router";
import { FaPaperPlane } from "react-icons/fa";
import dayjs from "dayjs";

const NewsComposePage = ({ isOpen, setIsOpen, setLatestNews }) => {
  const [preview, setPreview] = useState(null);
  const [headeline, setHeadline] = useState("");
  const [news, setNews] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };
  const handleSendButton = (e) => {
    e.preventDefault();
    const date = dayjs().format("MMMM DD, YYYY");
    const newNews = {
      id: crypto.randomUUID(),
      image: preview,
      headeline: headeline,
      news: news,
      date: date,
    };
    setLatestNews((prev) => [newNews, ...prev]);
    setPreview(null);
    setHeadline("");
    setNews("");
  };

  return (
    <div className="p-3">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold font-sans">PUBLIC NEWS</h2>
          <p className="text-sm text-base-content/70">
            Send school news to the public
          </p>
        </div>
        <Link
          className="btn btn-ghost md:hidden"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <FaBars size={24} />
        </Link>
      </div>
      <div className="rounded-md shadow-md my-8 p-4">
        <form action="">
          <div className="form-control">
            <label className="label" htmlFor="file">
              {preview ? (
                <img
                  className="h-[200px] w-[200px] border"
                  src={preview}
                  alt={preview}
                />
              ) : (
                <span className="label-text font-bold">Upload a picture</span>
              )}
            </label>
            <input
              onChange={handleUpload}
              type="file"
              accept="image/*"
              className="cursor-pointer w-2/3 md:w-1/4"
              name=""
              id="file"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="">
              <span className="label-text font-bold">Headline</span>
            </label>
            <input
              onChange={(e) => {
                setHeadline(e.target.value);
              }}
              value={headeline}
              className="input input-bordered input-sm rounded-md w-full md:w-1/2"
              type="text"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="">
              <span className="label-text font-bold">News</span>
            </label>
            <textarea
              onChange={(e) => {
                setNews(e.target.value);
              }}
              value={news}
              className="input input-bordered input-sm rounded-md w-full md:w-1/2 min-h-32"
              type="text"
            />
          </div>
          <div className="my-4">
            <button
              onClick={handleSendButton}
              className="btn btn-primary btn-sm rounded-md w-1/2"
            >
              <FaPaperPlane />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsComposePage;
