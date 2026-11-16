// Back / Menu / Forward buttons for the pages after the start page

// The order of the pages. Add new pages to this list.
const pages = ["menu.html", "how-it-works.html", "members.html", "achievements.html"];

// Find which page we are on now
// Find the file name of this page. This also works when the web host hides ".html"
// (for example /menu instead of /menu.html), or when the address ends with "/".
function getPageName() {
  let name = window.location.pathname.split("/").pop();
  try { name = decodeURIComponent(name); } catch (e) {}
  if (name === "") return "index.html";
  if (name.indexOf(".") === -1) name += ".html";
  return name;
}
const current = getPageName();
const index = pages.indexOf(current);

// Remember that the visitor opened this page (the menu page uses it for the XP bar)
const lessonPages = ["how-it-works.html", "members.html", "achievements.html"];
if (lessonPages.includes(current)) {
  try {
    const visited = JSON.parse(localStorage.getItem("plaveVisited") || "[]");
    if (!visited.includes(current)) {
      visited.push(current);
      localStorage.setItem("plaveVisited", JSON.stringify(visited));
    }
  } catch (e) {}
}

// Make one button (a link). No link = the button is turned off.
function makeButton(text, href) {
  const a = document.createElement("a");
  a.className = "nav-btn";
  a.textContent = text;
  if (href) {
    a.href = href;
  } else {
    a.classList.add("disabled");
    a.setAttribute("aria-disabled", "true");
  }
  return a;
}

// Back = the page before, Next = the page after (off at the first/last page)
const backHref = index > 0 ? pages[index - 1] : null;
const nextHref = index >= 0 && index < pages.length - 1 ? pages[index + 1] : null;
const menuHref = current === "menu.html" ? null : "menu.html";

const nav = document.createElement("nav");
nav.className = "page-nav";

const backBtn = makeButton("< 뒤로", backHref);
const menuBtn = makeButton("", menuHref);   // the Menu button is an earth icon
menuBtn.classList.add("home");
menuBtn.title = "메인 메뉴";
menuBtn.setAttribute("aria-label", "메인 메뉴");
const earth = document.createElement("img");
earth.src = "images/earth.png";               // pixel-art earth
earth.srcset = "images/earth.png 2x, images/earth@2x.png 4x"; // exact pixel copies (icon is shown at 14x14)
earth.alt = "메뉴";
earth.width = 14;
earth.height = 14;
menuBtn.appendChild(earth);
const nextBtn = makeButton("다음 >", nextHref);

if (current === "menu.html") menuBtn.classList.add("current"); // we are on the menu

nav.appendChild(backBtn);
nav.appendChild(menuBtn);
nav.appendChild(nextBtn);
document.body.appendChild(nav);

// Wait a moment so the click sound can finish, then go to the page
nav.addEventListener("click", function (e) {
  const link = e.target.closest("a.nav-btn");
  if (!link || !link.href) return;
  e.preventDefault();
  setTimeout(function () {
    window.location.href = link.href;
  }, 150);
});
