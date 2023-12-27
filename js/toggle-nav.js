function toggleNav() {
  var bars = document.getElementById("nav-toggle");
  var items = document.querySelectorAll("header .nav-wrapper-dropdown .nav a");
  if (bars.classList.contains("fa-bars")) {
    bars.classList.remove("fa-bars");
    bars.classList.add("fa-times");
    for (var i = 0; i < items.length; i++) {
      items[i].style.display = "block";
    }
  } else {
    bars.classList.remove("fa-times");
    bars.classList.add("fa-bars");
    for (var i = 0; i < items.length; i++) {
      items[i].style.display = "none";
    }
  }
}
