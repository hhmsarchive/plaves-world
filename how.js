// "How a virtual group works" page: the steps appear while you scroll

(function () {
  const items = document.querySelectorAll(".t-step");

  // Old browsers: just show everything
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("show"); });
    return;
  }

  // Show a step when it comes into view
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // only once
      }
    });
  }, { threshold: 0.2 });

  items.forEach(function (el) { observer.observe(el); });
})();
