let lastKnownScrollPosition = 0;
let ticking = false;
let header = document.querySelector("header");
let button = document.getElementById("nav-toggle");
let modal = document.getElementById("nav-modal");

function adjustHeader(scrollPos) {
  if (scrollPos > 230) {
    header.classList.add("shrink");
    header.style.height = 70 + "px";
  } else {
    header.classList.remove("shrink");
    header.style.height = 300 - scrollPos + "px";
  }
}

function setNavModalTop(scrollPos) {
  let headerHeight = header.offsetHeight;
  if (headerHeight == 70) {
    // top value is unstable without this
    modal.style.top = 70 + scrollPos + "px";
  } else {
    modal.style.top = headerHeight + scrollPos + "px";
  }
}

function toggleNav() {
  if (button.classList.contains("fa-bars")) {
    button.classList.remove("fa-bars");
    button.classList.add("fa-times");
    modal.style.display = "flex";
  } else {
    button.classList.remove("fa-times");
    button.classList.add("fa-bars");
    modal.style.display = "none";
  }
}

document.addEventListener("scroll", (event) => {
  lastKnownScrollPosition = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      adjustHeader(lastKnownScrollPosition);
      setNavModalTop(lastKnownScrollPosition);
      ticking = false;
    });
    ticking = true;
  }
});

// Call setNavModalTop() on load
window.addEventListener("load", (event) => {
  adjustHeader(lastKnownScrollPosition);
  setNavModalTop(lastKnownScrollPosition);
});

// Call adjustHeader() on window resize
window.addEventListener("resize", (event) => {
  adjustHeader(lastKnownScrollPosition);
  setNavModalTop(lastKnownScrollPosition);
  if (window.innerWidth > 1000) {
    if (button.classList.contains("fa-times")) {
      toggleNav();
    }
  }
});

// Smooth scrolling when cliking on nav links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
