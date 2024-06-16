import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import NEWS from "../components/NEWS";

function World({ setAuth, isAuthenticated }) {
  const [news, setNews] = useState([]);

  const getNews = async () => {
    try {
      const response = await fetch("/news");
      const jsonData = await response.json();
      setNews(jsonData.articles);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };
  console.log(news);
  return (
    <>
      <Header setAuth={setAuth} isAuthenticated={isAuthenticated} />
      <div className=" pt-4 news ">
        <div className="row">
          {news.map((info, index) => (
            <div key={index} class="col-md-6">
              <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div class="new col p-4 d-flex flex-column position-static">
                  <strong class="d-inline-block mb-2 text-primary-emphasis">
                    World
                  </strong>
                  <h3 class="mb-0">{info.author}</h3>
                  <div class="mb-1 text-body-secondary">
                    {formatDate(info.publishedAt)}
                  </div>
                  <p class="card-text mb-auto">{info.description}</p>
                  <a
                    href={info.url}
                    class="icon-link gap-1 icon-link-hover stretched-link"
                  >
                    Continue reading
                  </a>
                </div>
                {info.urlToImage && info.urlToImage !== "null" ? (
                  <div className="col-auto d-none d-lg-block">
                    <img
                      src={info.urlToImage}
                      width={250}
                      height={270}
                      alt="headline image"
                    />
                  </div>
                ) : (
                  <div className="col-auto d-none d-lg-block"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default World;
