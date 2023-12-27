let lastKnownScrollPosition = 0;
let ticking = false;
let header = document.querySelector("header");

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
  let modal = document.getElementById("nav-modal");
  if (headerHeight == 70) {
    // top value is unstable without this
    modal.style.top = 70 + scrollPos + "px";
  } else {
    modal.style.top = headerHeight + scrollPos + "px";
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

// Smooth scrolling when cliking on nav links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
