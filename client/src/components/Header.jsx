import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import profile from "../assets/profile.png";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  useEffect(() => {
    // Re-render the Header component when the user state changes
  }, [user]);

  return (
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom header">
      <div className="col-md-3 mb-2 mb-md-0">
        <a
          href="/"
          className="d-inline-flex link-body-emphasis text-decoration-none"
        >
          <img
            className="logo"
            src={profile}
            width="90px"
            height="80px"
            alt="Profile"
          />
        </a>
      </div>
      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          <Link to="/" className="nav-link px-2 link-secondary">
            Home
          </Link>
        </li>
        <li>
          <Link to="/sports" className="nav-link px-2">
            Sport
          </Link>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            FIFA
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            NHL
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            CFL
          </a>
        </li>
      </ul>
      <div className="col-md-3 text-end">
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={logout} className="btn btn-outline-primary ms-2">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline-primary me-2">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary me-2">
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
