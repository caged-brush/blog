import React from "react";
import { useEffect, useState } from "react";
export default function NBA() {
  const [nba, setNba] = useState([]);

  async function getNba() {
    try {
      const result = await fetch("/nba");
      const response = await result.json();
      setNba(response.data.slice(0, 30));
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getNba();
  }, []);
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Conference</th>
            <th scope="col">Division</th>
            <th scope="col">City</th>
            <th scope="col">Name</th>
            <th scope="col">Full name</th>
            <th scope="col">Abbreviation</th>
          </tr>
        </thead>
        <tbody className="nba">
          {nba.map((ball, index) => (
            <tr key={index}>
              <th scope="row">{ball.id}</th>
              <td>{ball.conference}</td>
              <td>{ball.division}</td>
              <td>{ball.city}</td>
              <td>{ball.name}</td>
              <td>{ball.full_name}</td>
              <td>{ball.abbreviation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
