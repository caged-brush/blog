import React from "react";
import Instagram from "../assets/ig.png";

export default function Footer() {
  return (
    <>
      <footer class=" footer d-flex flex-wrap justify-content-between align-items-center py-3  border-top">
        <div class="col-md-4 d-flex align-items-center">
          <a
            href="/"
            class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
          ></a>
          <span class="mb-3 mb-md-0 text-body-secondary">
            © {new Date().getFullYear} SJ Blog
          </span>
        </div>

        <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li class="ms-3">
            <a class="text-body-secondary" href="#">
              <svg class="bi" width="24" height="24">
                <use xlink:href="#twitter"></use>
              </svg>
            </a>
          </li>
          <li class="ms-3">
            <a
              class="text-body-secondary"
              href="https://www.instagram.com/admiral_jb/"
            >
              <img src={Instagram} />
            </a>
          </li>
          <li class="ms-3">
            <a class="text-body-secondary" href="#">
              <svg class="bi" width="24" height="24">
                <use xlink:href="#facebook"></use>
              </svg>
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
}
