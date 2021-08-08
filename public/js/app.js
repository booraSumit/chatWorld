const themChanger = document.querySelector(".customize");

themChanger.addEventListener("click", toggleTheme);

function toggleTheme() {
  if (themChanger.className == "customize dark") {
    themChanger.className = "customize";
    document.body.classList.remove("theme-dark");
  } else {
    document.body.classList.add("theme-dark");
    themChanger.className = "customize dark";
  }
}
