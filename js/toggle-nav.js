function toggleNav() {
  let button = document.getElementById("nav-toggle");
  let modal = document.getElementById("nav-modal");
  if (button.classList.contains("fa-bars")) {
    button.classList.remove("fa-bars");
    button.classList.add("fa-times");
    modal.style.display = "block";
  } else {
    button.classList.remove("fa-times");
    button.classList.add("fa-bars");
    modal.style.display = "none";
  }
}
