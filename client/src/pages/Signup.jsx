import React, { useState } from "react";
import Google from "../assets/google.png";

function Signup() {
  const [userInfo, setUserInfo] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { ...userInfo };
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <form
        onSubmit={onSubmitForm}
        className="container mt-5 pt-5 col-5 text-center flex justify-content-center"
      >
        <h1 class="h3 mb-3 fw-normal">Please sign up</h1>

        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            name="fname"
            value={userInfo.fname}
            onChange={handleChange}
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
            value={userInfo.lname}
            onChange={handleChange}
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
            value={userInfo.email}
            onChange={handleChange}
          />
          <label for="floatingInput">Email address</label>
        </div>

        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            name="password"
            value={userInfo.password}
            onChange={handleChange}
          />
          <label for="floatingPassword">Password</label>
        </div>

        <div class="form-check text-start my-3">
          <input
            class="form-check-input"
            type="checkbox"
            value="remember-me"
            id="flexCheckDefault"
          />
          <label class="form-check-label" for="flexCheckDefault">
            Remember me
          </label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">
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
        <p class="mt-5 mb-3 text-body-secondary">
          © {new Date().getFullYear()}
        </p>
      </form>
    </>
  );
}

export default Signup;
