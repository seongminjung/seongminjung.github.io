let lastKnownScrollPosition = 0;
let ticking = false;
let header = document.querySelector("header");
let button = document.getElementById("nav-toggle");
let modal = document.getElementById("nav-modal");
let modalBg = document.getElementById("nav-modal-bg");
let tabButtons = document.querySelectorAll("#articles .tab p");

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
    modalBg.style.display = "block";
  } else {
    button.classList.remove("fa-times");
    button.classList.add("fa-bars");
    modal.style.display = "none";
    modalBg.style.display = "none";
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

window.addEventListener("load", (event) => {
  // Call setNavModalTop() on load
  adjustHeader(lastKnownScrollPosition);
  setNavModalTop(lastKnownScrollPosition);

  // When there is a hash in the url, scroll to the element
  if (window.location.hash) {
    let hash = window.location.hash.substring(1);
    let element = document.getElementById(hash);
    element.scrollIntoView();
  }
  // But scroll a little bit more to account for the header
  window.scrollBy(0, -68);
});

// When the modal is open and resizing the window bigger than 1200px, close the modal
window.addEventListener("resize", (event) => {
  adjustHeader(lastKnownScrollPosition);
  setNavModalTop(lastKnownScrollPosition);
  if (window.innerWidth > 1200) {
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

// Tab control
function showTabContent(tabName) {
  let tabContent = document.querySelectorAll(".tab-content > div");
  tabContent.forEach((tab) => {
    if (tab.classList.contains(tabName)) {
      tab.style.display = "block";
    } else {
      tab.style.display = "none";
    }
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    let tabName = this.textContent.toLowerCase();
    if (tabName == "all posts") {
      tabName = "all-posts";
    }
    showTabContent(tabName);
    // Add active class to the current button (highlight it)
    let current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace("active", "");
    this.className += "active";
  });
});

window.addEventListener("load", (event) => {
  // Call showTabContent() on load, default tab is "all-posts" or "travel"
  // showTabContent("all posts") if it is articles.html, and "travel" if it is blog.html
  let tabName = "all-posts";
  if (window.location.pathname.includes("blog")) {
    tabName = "travel";
  }
  showTabContent(tabName);
});
