// Get the elements from the HTML
const startBtn = document.getElementById("startBtn");
const loading = document.getElementById("loading");
const barFill = document.getElementById("barFill");
const whiteLight = document.getElementById("whiteLight");

// When the Start button is clicked
startBtn.addEventListener("click", function () {
  startBtn.disabled = true; // stop double clicks

  // 1. The question and button fade out (CSS: body.started)
  document.body.classList.add("started");

  // 2. After 0.8 seconds, show the loading bar
  setTimeout(showLoading, 800);
});

// Show the loading bar. When it is full, start the white light.
function showLoading() {
  loading.classList.add("show");
  let percent = 0;

  const timer = setInterval(function () {
    percent += 2;
    barFill.style.width = percent + "%";

    if (percent >= 100) {
      clearInterval(timer);
      enterWorld();
    }
  }, 40);
}

// The white light grows and fills the screen, then we go to the menu page
function enterWorld() {
  whiteLight.classList.add("on");
  setTimeout(function () {
    // Remember it, so the menu page shows the white fade only after the start page
    try { sessionStorage.setItem("fromStart", "1"); } catch (e) {}
    window.location.href = "menu.html";
  }, 1800);
}
