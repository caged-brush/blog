import React from "react";
import Header from "../components/Header";

function Food({ setAuth, isAuthenticated }) {
  return (
    <>
      <Header setAuth={setAuth} isAuthenticated={isAuthenticated} />
    </>
  );
}

export default Food;
