import React, { useState } from "react";
import Google from "../assets/google.png";
import eye from "../assets/eye-icon.jpeg";
import slash from "../assets/slash-eye.jpg";
import { Link } from "react-router-dom";

function Signup({ setAuth }) {
  const [inputs, setInputs] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const { fname, lname, email, password, confirm } = inputs;
  const [error, setError] = useState("");

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
      const body = { fname, lname, email, password, confirm };
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
      } else {
        setError(parseRes.message || parseRes.error);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <>
      <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div class="col-md-3 mb-2 mb-md-0"></div>

        <div class="col-md-3 text-end">
          <Link to="/login" class="btn btn-outline-primary me-2">
            Login
          </Link>
        </div>
      </header>
      <form
        onSubmit={onSubmitForm}
        className="container mt-1 pt-1 col-5 text-center flex justify-content-center"
      >
        <h1 class="h3 mb-3 fw-normal">Please sign up</h1>

        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            name="fname"
            value={fname}
            onChange={(e) => onChange(e)}
            required
          />
          <label for="floatingInput">First Name</label>
        </div>

        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            name="lname"
            value={lname}
            onChange={(e) => onChange(e)}
            required
          />
          <label for="floatingInput">Last Name</label>
        </div>

        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
          <label for="floatingInput">Email address</label>
        </div>

        <div class="form-floating">
          <input
            type={showPassword ? "text" : "password"}
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
          />
          <span onClick={togglePassword} className="toggle-password">
            <img width={35} height={35} src={showPassword ? slash : eye} />
          </span>
          <label for="floatingPassword">Password</label>
        </div>

        <div class="form-floating">
          <input
            type={showPassword ? "text" : "password"}
            class="form-control"
            id="floatingPassword"
            placeholder="Confirm Password"
            name="confirm"
            value={confirm}
            onChange={(e) => onChange(e)}
          />
          <span onClick={togglePassword} className="toggle-password">
            <img width={35} height={35} src={showPassword ? slash : eye} />
          </span>
          <label for="floatingPassword">Confirm Password</label>
        </div>

        <button class="btn mt-2 btn-primary w-100 py-2" type="submit">
          Sign up
        </button>

        <button
          // onClick={handleGoogleAuth}
          class="btn mt-2 btn-primary w-100 py-2"
          type="button"
        >
          <img
            src={Google}
            width={20}
            height={20}
            style={{ borderRadius: 10 }}
          />{" "}
          Sign up with Google
        </button>
        {error && <div className="alert alert-danger">{error}</div>}
        <p class="mt-5 mb-3 text-body-secondary">
          © {new Date().getFullYear()}
        </p>
      </form>
    </>
  );
}

export default Signup;
