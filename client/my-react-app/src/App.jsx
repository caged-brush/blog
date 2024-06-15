import React, { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sport from "./components/Sports";
export default function App({ setAuth, isAuthenticated }) {
  return (
    <>
      <Header setAuth={setAuth} isAuthenticated={isAuthenticated} />
      <Sport setAuth={setAuth} isAuthenticated={isAuthenticated} />
      <Footer />
    </>
  );
}
