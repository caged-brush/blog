import { useEffect, useState } from "react";
import React from "react";
import Header from "../components/Header";
import NBA from "../components/NBA";
import Footer from "../components/Footer";
import parse from "html-react-parser";

export default function Sports({ setAuth, isAuthenticated }) {
  const [football, setFootball] = useState([]);

  const getFootball = async () => {
    try {
      const response = await fetch("/footy");
      const jsonData = await response.json();

      setFootball(jsonData.response.slice(0, 6));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getFootball();
  }, []);

  return (
    <>
      <Header setAuth={setAuth} isAuthenticated={isAuthenticated} />
      <div className="footy">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {football.map((match, index) => (
            <div key={index} className="col mb-4">
              <div
                className="container card shadow-sm"
                style={{ maxWidth: "500px" }}
              >
                <div className="card-body" style={{ padding: "10px" }}>
                  <h1
                    className="display-6 fw-bold text-body-emphasis"
                    style={{ fontSize: "1.25rem" }}
                  >
                    {match.title}
                  </h1>
                  <div>{parse(match.videos[0].embed)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NBA />
      <Footer />
    </>
  );
}
