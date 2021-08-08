// online slide toggler in mobile devices
const menuBar = document.querySelector(".fa-bars");

menuBar.addEventListener("click", (e) => {
  document.querySelector(".online-section").classList.toggle("slide");
});

//theme toggler

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
