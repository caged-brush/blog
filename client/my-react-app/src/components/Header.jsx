import React, { useEffect, useState } from "react";
import profile from "../assets/profile.png";
import { Link } from "react-router-dom";

export default function Header({ setAuth, isAuthenticated }) {
  const [name, setName] = useState("");
  async function getName() {
    try {
      const response = await fetch("http://localhost:3000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setName(parseRes.fname);
      setAuth(true);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getName();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getName();
  }, []);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };
  return (
    <>
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 pb-4 border-bottom header">
        <div class="col-md-3 mb-2 mb-md-0">
          <a
            href="/"
            class="d-inline-flex link-body-emphasis text-decoration-none"
          >
            <img class="logo" src={profile} width="90px" height="80px" />
          </a>
        </div>

        <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <Link to="/" class="nav-link px-2 link-secondary">
              Home
            </Link>
          </li>
          <li>
            <Link to="/sports" class="nav-link px-2">
              Sport
            </Link>
          </li>
          <li>
            <Link to="/world" class="nav-link px-2">
              World
            </Link>
          </li>
          <li>
            <Link to="/fashion" class="nav-link px-2 ">
              Fashion
            </Link>
          </li>
          <li>
            <Link to="/Food" class="nav-link px-2 ">
              Food
            </Link>
          </li>
        </ul>

        <div class="col-md-3 text-end">
          <>
            {isAuthenticated ? (
              <>
                <h1 style={{ color: "white" }}>Hello, {name}</h1>
                <button onClick={(e) => logout(e)} class="btn btn-primary me-2">
                  logout
                </button>
                <Link to="/post" class="btn btn-outline-primary me-2">
                  Post
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" class="btn btn-outline-primary me-2">
                  Login
                </Link>
                <Link to="/signup" class="btn btn-primary me-2">
                  Signup
                </Link>
                <Link to="/post" class="btn btn-outline-primary me-2">
                  Post
                </Link>
              </>
            )}
          </>
        </div>
      </header>
    </>
  );
}
