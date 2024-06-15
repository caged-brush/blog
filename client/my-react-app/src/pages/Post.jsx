import React, { useState } from "react";
import Header from "../components/Header";

function Post({ setAuth, isAuthenticated }) {
  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  const { title, content } = post;

  const onChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  async function onSubmitForm(e) {
    e.preventDefault();
    try {
      const body = { title, content };
      const response = await fetch("http://localhost:3000/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
      const parseRes = await response.json();
      window.location.href = "/";
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <Header setAuth={setAuth} isAuthenticated={isAuthenticated} />
      <form
        onSubmit={onSubmitForm}
        className="container mt-5 pt-5 col-5 text-center flex justify-content-center"
      >
        <input
          className="form-control"
          type="text"
          placeholder="title"
          id="floatingInput"
          name="title"
          value={title}
          onChange={(e) => onChange(e)}
        />
        <textarea
          className="form-control"
          type="text"
          placeholder="Say your mind"
          name="content"
          id="floatingInput"
          value={content}
          onChange={(e) => onChange(e)}
        />
        <button type="submit" className="mt-3 btn btn-success">
          Post
        </button>
      </form>
    </>
  );
}

export default Post;
