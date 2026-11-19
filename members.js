// Members page: flip cards and photo loading

const cards = document.querySelectorAll(".member-card");

// Flip a card when it is clicked, or when Enter / Space is pressed
cards.forEach(function (card) {
  card.addEventListener("click", function () {
    card.classList.toggle("flipped");
  });
  card.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.classList.toggle("flipped");
    }
  });
});

// Load each photo from images/members/. Try .jpg, then .png, then .webp.
// If no photo is found, the image is removed and the big letter is shown.
const extensions = ["jpg", "png", "webp"];

// Where the face is in each photo (left to right), so the card crop keeps the face in view
const facePosition = {
  yejun: "54% 50%",
  noah: "40% 50%",
  bamby: "51% 50%",
  eunho: "52% 50%",
  hamin: "46% 50%"
};

document.querySelectorAll("img[data-photo]").forEach(function (img) {
  const name = img.dataset.photo;
  let attempt = 0;
  img.style.objectPosition = facePosition[name] || "50% 50%";

  function tryNext() {
    if (attempt >= extensions.length) {
      img.remove(); // no photo found
      return;
    }
    img.src = "images/members/" + name + "." + extensions[attempt];
    attempt++;
  }

  img.addEventListener("error", tryNext);
  tryNext();
});


// ---------- Keyword popups: small preview on hover, big popup on click ----------
(function () {
  const canHover = window.matchMedia("(hover: hover)").matches; // phones: no hover
  const extensions = ["mp4", "webm", "gif", "jpg", "jpeg", "png", "webp"];
  const found = {}; // remembers the file found for each name

  // The two popup boxes (made once, placed on the page, not inside the cards)
  const preview = document.createElement("div");
  preview.className = "pop-preview";
  document.body.appendChild(preview);

  const modal = document.createElement("div");
  modal.className = "pop-modal";
  modal.innerHTML =
    '<div class="pop-box" role="dialog" aria-modal="true">' +
    '<button class="pop-close" type="button" aria-label="닫기">X</button>' +
    '<div class="pop-media"></div>' +
    '<p class="pop-caption"></p>' +
    '<p class="pop-credit"></p>' +
    "</div>";
  document.body.appendChild(modal);

  const modalMedia = modal.querySelector(".pop-media");
  const modalCaption = modal.querySelector(".pop-caption");
  const modalCredit = modal.querySelector(".pop-credit");
  const closeBtn = modal.querySelector(".pop-close");

  // Check if a file exists and can be shown
  function probe(src, type) {
    return new Promise(function (resolve) {
      if (type === "video") {
        const v = document.createElement("video");
        v.preload = "metadata";
        v.onloadedmetadata = function () { resolve(true); };
        v.onerror = function () { resolve(false); };
        v.src = src;
      } else {
        const img = new Image();
        img.onload = function () { resolve(true); };
        img.onerror = function () { resolve(false); };
        img.src = src;
      }
    });
  }

  // Look for images/pop/<name>.mp4, .webm, .gif, .jpg, .jpeg, .png, .webp (first one found)
  async function findMedia(name) {
    if (found[name] !== undefined) return found[name];

    // If the name already has a file type (data-media="hamin-binary.gif"),
    // use exactly that file in images/pop/
    const exact = name.match(/\.(mp4|webm|gif|jpe?g|png|webp)$/i);
    if (exact) {
      const ext = exact[1].toLowerCase();
      const type = ext === "mp4" || ext === "webm" ? "video" : "image";
      const src = "images/pop/" + name;
      found[name] = (await probe(src, type)) ? { src: src, type: type } : null;
      return found[name];
    }

    // Otherwise try these file types one by one
    for (const ext of extensions) {
      const type = ext === "mp4" || ext === "webm" ? "video" : "image";
      const src = "images/pop/" + name + "." + ext;
      if (await probe(src, type)) {
        found[name] = { src: src, type: type };
        return found[name];
      }
    }
    found[name] = null;
    return null;
  }

  // Make the picture or the looping video
  function makeElement(media) {
    if (media.type === "video") {
      const v = document.createElement("video");
      v.src = media.src;
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      const start = v.play(); // some phones need an explicit play()
      if (start && start.catch) start.catch(function () {});
      return v;
    }
    const img = document.createElement("img");
    img.src = media.src;
    img.alt = "";
    return img;
  }

  // ----- small preview (mouse on the word) -----
  let hoverId = 0;

  function movePreview(x, y) {
    const w = preview.offsetWidth;
    const h = preview.offsetHeight;
    let left = x + 18;
    let top = y + 18;
    if (left + w > window.innerWidth - 8) left = x - w - 18;
    if (top + h > window.innerHeight - 8) top = y - h - 18;
    preview.style.left = Math.max(8, left) + "px";
    preview.style.top = Math.max(8, top) + "px";
  }

  async function showPreview(el, x, y) {
    const id = ++hoverId;
    const media = await findMedia(el.dataset.media);
    if (id !== hoverId || !media) return; // mouse already left, or no file yet
    preview.innerHTML = "";
    preview.appendChild(makeElement(media));
    preview.style.display = "block";
    movePreview(x, y);
  }

  function hidePreview() {
    hoverId++;
    preview.style.display = "none";
    preview.innerHTML = "";
  }

  // ----- big popup (click) -----
  let lastFocus = null;

  async function openModal(el) {
    hidePreview();
    lastFocus = el;
    const media = await findMedia(el.dataset.media);
    modalMedia.innerHTML = "";
    if (media) {
      modalMedia.appendChild(makeElement(media));
      modalCredit.textContent = el.dataset.credit || "© VLAST";
    } else {
      const note = document.createElement("p");
      note.className = "pop-empty";
      note.textContent = "이미지 준비 중";
      modalMedia.appendChild(note);
      modalCredit.textContent = "";
    }
    modalCaption.textContent = el.dataset.caption || "";
    modal.classList.add("show");
    document.body.classList.add("pop-open");
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("show");
    document.body.classList.remove("pop-open");
    modalMedia.innerHTML = ""; // also stops the video
    if (lastFocus) lastFocus.focus();
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal(); // click outside the box
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
  });

  // ----- connect every keyword -----
  document.querySelectorAll(".pop").forEach(function (el) {
    // do not flip the card when a keyword is clicked
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      openModal(el);
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        openModal(el);
      }
    });
    if (canHover) {
      el.addEventListener("mouseenter", function (e) { showPreview(el, e.clientX, e.clientY); });
      el.addEventListener("mousemove", function (e) { movePreview(e.clientX, e.clientY); });
      el.addEventListener("mouseleave", hidePreview);
    }
  });

  // keyboard: keywords can be reached with Tab only when the card is turned over
  document.querySelectorAll(".member-card").forEach(function (card) {
    function sync() {
      const flipped = card.classList.contains("flipped");
      card.querySelectorAll(".pop").forEach(function (el) {
        el.tabIndex = flipped ? 0 : -1;
      });
    }
    new MutationObserver(sync).observe(card, { attributes: true, attributeFilter: ["class"] });
  });
})();


// ---------- Voice clips: a short YouTube clip on the back of each card ----------
// The clip is played with the official YouTube player (the player stays visible).
(function () {
  // Accepts a full link (watch?v=..., youtu.be/..., shorts/...) or just the video ID
  function getVideoId(text) {
    text = (text || "").trim();
    if (!text) return "";
    const m = text.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(text) ? text : "";
  }

  // Accepts seconds (75) or minutes:seconds (1:15) or h:mm:ss
  function toSeconds(value) {
    value = (value || "").trim();
    if (!value) return null;
    if (/^\d+$/.test(value)) return parseInt(value, 10);
    if (/^\d+(:\d{1,2}){1,2}$/.test(value)) {
      return value.split(":").reduce(function (sum, part) { return sum * 60 + parseInt(part, 10); }, 0);
    }
    return null;
  }

  // The popup (made once)
  const modal = document.createElement("div");
  modal.className = "pop-modal voice-modal";
  modal.innerHTML =
    '<div class="pop-box voice-box" role="dialog" aria-modal="true">' +
    '<button class="pop-close" type="button" aria-label="닫기">X</button>' +
    '<p class="voice-title"></p>' +
    '<div class="voice-frame"></div>' +
    '<p class="pop-credit"></p>' +
    "</div>";
  document.body.appendChild(modal);

  const titleEl = modal.querySelector(".voice-title");
  const frameEl = modal.querySelector(".voice-frame");
  const creditEl = modal.querySelector(".pop-credit");
  const closeBtn = modal.querySelector(".pop-close");
  let lastFocus = null;

  function openVoice(slot, button) {
    const id = getVideoId(slot.dataset.youtube);
    const start = toSeconds(slot.dataset.start);
    const end = toSeconds(slot.dataset.end);

    let src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1";
    if (start !== null) src += "&start=" + start;
    if (end !== null) src += "&end=" + end;

    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = slot.dataset.title || "YouTube video";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    frameEl.innerHTML = "";
    frameEl.appendChild(iframe);
    titleEl.textContent = slot.dataset.title || "";
    creditEl.textContent = slot.dataset.credit || "영상 출처: YouTube";

    lastFocus = button;
    modal.classList.add("show");
    document.body.classList.add("pop-open");
    closeBtn.focus();
  }

  function closeVoice() {
    modal.classList.remove("show");
    document.body.classList.remove("pop-open");
    frameEl.innerHTML = ""; // removing the player also stops the sound
    if (lastFocus) lastFocus.focus();
  }

  closeBtn.addEventListener("click", closeVoice);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeVoice();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) closeVoice();
  });

  // Make a button in every card that has a YouTube link
  document.querySelectorAll(".voice").forEach(function (slot) {
    if (!getVideoId(slot.dataset.youtube)) return; // no link yet: no button

    const button = document.createElement("button");
    button.type = "button";
    button.className = "voice-btn";
    button.textContent = "▶ 목소리 듣기";
    button.tabIndex = -1; // reachable with Tab only when the card is turned over (see below)

    button.addEventListener("click", function (e) {
      e.stopPropagation(); // do not flip the card
      openVoice(slot, button);
    });
    button.addEventListener("keydown", function (e) {
      e.stopPropagation();
    });
    slot.appendChild(button);

    const card = slot.closest(".member-card");
    new MutationObserver(function () {
      button.tabIndex = card.classList.contains("flipped") ? 0 : -1;
    }).observe(card, { attributes: true, attributeFilter: ["class"] });
  });
})();
