import React, { useEffect, useState } from "react";

export default function BlogPost() {
  const [post, setPost] = useState([]);

  async function getPost() {
    try {
      const response = await fetch("/posts");
      const jsonData = await response.json(response);
      setPost(jsonData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <div className="blog">
        {post.map((posts, index) => (
          <article key={index} className="blog-post">
            <h2 className="display-5 link-body-emphasis mb-1">{posts.title}</h2>
            <p className="blog-post-meta blogText">
              {posts.date} by {posts.fname}, {posts.lname}
            </p>
            <p className="blogText">{posts.post}</p>
            <hr />
          </article>
        ))}
      </div>
    </>
  );
}
