import { useState, useEffect, useContext } from "react";
import React from "react";
import Google from "../assets/google.png";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function Login() {
  const [authUrl, setAuthUrl] = useState("");
  const [loggin, setLoggedIn] = useState({
    email: "",
    password: "",
  });
  const [isSuccess, setSuccess] = useState(null);
  const [errorMessage, setMessage] = useState("");
  const { login } = useContext(AuthContext); // Get login function from context

  async function handleLoggin(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", loggin);
      if (response.data.redirect) {
        const { user, token } = response.data; // Destructure user and token from response data
        login(user, token); // Call login function with user and token
        window.location.href = response.data.redirect;
        setSuccess(true);
      } else {
        setSuccess(false);
        setMessage(response.data.error);
      }
    } catch (error) {
      console.error(error);
      setSuccess(false);
      setMessage("Internal server error");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setLoggedIn((prevState) => ({ ...prevState, [name]: value }));
  }

  useEffect(() => {
    const url = `http://localhost:3000/auth/google`;
    setAuthUrl(url);
  }, []);

  const handleGoogleAuth = () => {
    window.location.href = authUrl;
  };

  return (
    <>
      <form
        onSubmit={handleLoggin}
        className="container mt-5 pt-5 col-5 text-center flex justify-content-center"
      >
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            name="email"
            value={loggin.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            name="password"
            value={loggin.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="form-check text-start my-3">
          <input
            className="form-check-input"
            type="checkbox"
            value="remember-me"
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Remember me
          </label>
        </div>
        <button className="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>

        <button
          onClick={handleGoogleAuth}
          className="btn mt-2 btn-primary w-100 py-2"
          type="button"
        >
          <img
            src={Google}
            width={20}
            height={20}
            style={{ borderRadius: 10 }}
            alt="Google"
          />{" "}
          Sign in with Google
        </button>
        {isSuccess === false && (
          <span style={{ color: "red" }}>{errorMessage}</span>
        )}
        <p className="mt-5 mb-3 text-body-secondary">
          © {new Date().getFullYear()}
        </p>
      </form>
    </>
  );
}

export default Login;
