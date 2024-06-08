import { useEffect, useState } from "react";
import React from "react";

export default function Football() {
  const [football, setFootball] = useState([]);

  const getFootball = async () => {
    try {
      const response = await fetch("http://localhost:3000/footy");
      const jsonData = await response.json();

      setFootball(jsonData.response.slice(0, 2));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getFootball();
  }, []);
  return (
    <div className="footy">
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {football.map((match, index) => (
          <div key={index} className="col mb-4">
            <div
              className=" container card shadow-sm"
              style={{ maxWidth: "500px" }}
            >
              <img
                src={match.thumbnail}
                className="card-img-top"
                alt={match.title}
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
              <div className="card-body" style={{ padding: "10px" }}>
                <h1
                  className="display-6 fw-bold text-body-emphasis"
                  style={{ fontSize: "1.25rem" }}
                >
                  {match.title}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
