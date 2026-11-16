// Menu page: XP bar, badge, and "visited" marks

const menuPages = ["how-it-works.html", "members.html", "achievements.html"];

// Read which pages the visitor has opened (saved by nav.js in localStorage)
let visited = [];
try {
  visited = JSON.parse(localStorage.getItem("plaveVisited") || "[]");
} catch (e) {}

// XP = how many of the 3 pages were visited (0, 33, 67, or 100)
const count = menuPages.filter(function (p) { return visited.includes(p); }).length;
const xp = Math.round((count / menuPages.length) * 100);

document.getElementById("xpText").textContent = xp + " / 100";

// Fill the bar a moment after the page loads, so it grows with an animation
setTimeout(function () {
  document.getElementById("xpFill").style.width = xp + "%";
}, 300);

// Mark the pages that were visited
document.querySelectorAll(".menu-item").forEach(function (link) {
  if (visited.includes(link.getAttribute("href"))) {
    link.classList.add("visited");
  }
});

// Unlock the badge when all 3 pages were visited
if (count === menuPages.length) {
  document.getElementById("badge").classList.add("unlocked");
  document.getElementById("badgeText").textContent = "탐험가 배지 획득!";
}

// Wait a moment so the click sound can finish, then go to the page
document.querySelector(".menu-list").addEventListener("click", function (e) {
  const link = e.target.closest("a.menu-item");
  if (!link) return;
  e.preventDefault();
  setTimeout(function () {
    window.location.href = link.href;
  }, 150);
});
