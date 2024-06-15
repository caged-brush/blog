import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import App from "./App.jsx";
import Sports from "./pages/Sports.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";
import Header from "./components/Header.jsx";
import Post from "./pages/Post.jsx";
import World from "./pages/World.jsx";
import Food from "./pages/Food.jsx";
import Fashion from "./pages/Fashion.jsx";

const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:3000/isVerified", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    isAuth();
  });

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <App setAuth={setAuth} isAuthenticated={isAuthenticated} />,
        },
        {
          path: "post",
          element: (
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Post setAuth={setAuth} isAuthenticated={isAuthenticated} />
            </PrivateRoute>
          ),
        },
        {
          path: "sports",
          element: (
            <Sports setAuth={setAuth} isAuthenticated={isAuthenticated} />
          ),
        },
        {
          path: "world",
          element: (
            <World setAuth={setAuth} isAuthenticated={isAuthenticated} />
          ),
        },
        {
          path: "food",
          element: <Food setAuth={setAuth} isAuthenticated={isAuthenticated} />,
        },
        {
          path: "fashion",
          element: (
            <Fashion setAuth={setAuth} isAuthenticated={isAuthenticated} />
          ),
        },
        {
          path: "login",
          element: !isAuthenticated ? (
            <Login setAuth={setAuth} location={location} />
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "signup",
          element: !isAuthenticated ? (
            <Signup setAuth={setAuth} />
          ) : (
            <Navigate to="/" />
          ),
        },
      ])}
    />
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
