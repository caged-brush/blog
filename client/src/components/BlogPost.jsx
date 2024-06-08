import React from "react";

export default function BlogPost() {
  return (
    <>
      <article class="blog-post">
        <h2 class="display-5 link-body-emphasis mb-1">Sample blog post</h2>
        <p class="blog-post-meta">
          January 1, 2021 by <a href="#">Mark</a>
        </p>

        <p>
          This blog post shows a few different types of content that’s supported
          and styled with Bootstrap. Basic typography, lists, tables, images,
          code, and more are all supported as expected.
        </p>
        <hr />
      </article>
    </>
  );
}
