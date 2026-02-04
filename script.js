AOS.init({ once: true });

// Nama tamu
const guestNameEl = document.getElementById("guest-name");
const params = new URLSearchParams(window.location.search);
const guestName = params.get("to");

if (guestName && guestNameEl) {
  guestNameEl.innerText = guestName.replace(/\+/g, " ");
}

// Elements
const openBtn = document.getElementById("openInvitation");
const cover = document.getElementById("cover");
const main = document.getElementById("mainContent");
const music = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");

// Open invitation
openBtn.addEventListener("click", () => {
  document.body.classList.remove("lock-scroll");
  cover.classList.add("hide");

  setTimeout(() => {
    cover.style.display = "none";
    main.classList.remove("hidden");

    music.volume = 0.7;
    music.play().catch(() => {});
    toggle.classList.remove("hidden");
  }, 800);
});

// Music toggle
toggle.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    toggle.innerText = "▶️";
  } else {
    music.pause();
    toggle.innerText = "⏸️";
  }
});