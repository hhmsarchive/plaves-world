// Shows errors on the screen when the address ends with ?debug
// (useful for testing on a phone, where there is no console)
// Example: https://your-site/index.html?debug

(function () {
  if (window.location.search.indexOf("debug") === -1) return;

  const box = document.createElement("pre");
  box.style.cssText =
    "position:fixed;left:0;right:0;top:0;max-height:40vh;overflow:auto;margin:0;padding:8px;" +
    "z-index:99999;background:#400;color:#fff;font:12px/1.4 monospace;white-space:pre-wrap";

  function add(text) {
    box.textContent += text + "\n";
    if (!box.parentNode && document.body) document.body.appendChild(box);
  }

  // JavaScript errors, and files that could not be loaded
  window.addEventListener("error", function (e) {
    if (e.target && e.target !== window && (e.target.src || e.target.href)) {
      add("FILE NOT LOADED: " + (e.target.src || e.target.href));
    } else {
      add("ERROR: " + e.message + " (" + (e.filename || "").split("/").pop() + ":" + e.lineno + ")");
    }
  }, true);

  window.addEventListener("unhandledrejection", function (e) {
    add("PROMISE ERROR: " + e.reason);
  });

  add("debug is on: " + navigator.userAgent);
  add("page: " + window.location.href);
})();
