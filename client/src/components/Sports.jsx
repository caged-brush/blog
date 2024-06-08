import React from "react";
import NBA from "./NBA";
import CFL from "./CFL";
import NHL from "./NHL";
import Football from "./Football";
import NEWS from "./NEWS";
import BlogPost from "./BlogPost";

export default function Sport() {
  return (
    <>
      <Football />
      <NEWS />
      <BlogPost />
      <NBA />
      <CFL />
      <NHL />
    </>
  );
}
