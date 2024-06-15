import React from "react";
import Header from "../components/Header";

function Fashion({ setAuth, isAuthenticated }) {
  return (
    <>
      <Header setAuth={setAuth} isAuthenticated={isAuthenticated} />
    </>
  );
}

export default Fashion;
