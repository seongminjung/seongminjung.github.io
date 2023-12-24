let lastKnownScrollPosition = 0;
let ticking = false;
let header = document.querySelector("header");

function adjustHeader(scrollPos) {
  if (scrollPos > 200) {
    header.classList.add("shrink");
    header.style.height = 100 + "px";
  } else {
    header.classList.remove("shrink");
    header.style.height = 300 - scrollPos + "px";
  }
}

document.addEventListener("scroll", (event) => {
  lastKnownScrollPosition = window.scrollY;
  console.log(lastKnownScrollPosition);
  if (!ticking) {
    window.requestAnimationFrame(() => {
      adjustHeader(lastKnownScrollPosition);
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
