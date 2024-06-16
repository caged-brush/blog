import { useState, useEffect } from "react";
import React from "react";
import Google from "../assets/google.png";
import eye from "../assets/eye-icon.jpeg";
import slash from "../assets/slash-eye.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Login({ setAuth }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputs;
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const [showPassword, setShowPassword] = useState(false);

  function togglePassword() {
    setShowPassword(!showPassword);
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        navigate("/");
      } else {
        setError(parseRes.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "/auth/google";
  };

  const extractTokenFromUrl = () => {};

  useEffect(() => {
    console.log("Location changed:", location.search);
    extractTokenFromUrl();
  }, [location.search]);

  return (
    <>
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div className="col-md-3 mb-2 mb-md-0"></div>
        <div className="col-md-3 text-end">
          <Link to="/signup" className="btn btn-outline-primary me-2">
            Signup
          </Link>
        </div>
      </header>
      <form
        onSubmit={onSubmitForm}
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
            value={email}
            onChange={(e) => onChange(e)}
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
          />
          <span onClick={togglePassword} className="toggle-password">
            <img
              width={35}
              height={35}
              src={showPassword ? slash : eye}
              alt="Toggle Password Visibility"
            />
          </span>
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
          />
          Sign in with Google
        </button>

        {error && <div className="alert alert-danger">{error}</div>}

        <p className="mt-5 mb-3 text-body-secondary">
          © {new Date().getFullYear()}
        </p>
      </form>
    </>
  );
}

export default Login;
