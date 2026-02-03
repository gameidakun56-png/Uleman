AOS.init({
  duration: 1000,
  once: true
});

// ===== NAMA TAMU =====
const guestNameEl = document.getElementById("guest-name");
const params = new URLSearchParams(window.location.search);
const guestName = params.get("to");

if (guestName && guestNameEl) {
  guestNameEl.innerText = guestName.replace(/\+/g, " ");
}

// ===== ELEMENT =====
const openBtn = document.getElementById("openInvitation");
const cover = document.getElementById("cover");
const sambutan = document.getElementById("sambutan");
const music = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");

// ===== OPEN INVITATION =====
if (openBtn && cover && sambutan) {
  openBtn.addEventListener("click", () => {
    document.body.classList.remove("lock-scroll");
    cover.classList.add("hide");

    setTimeout(() => {
      cover.style.display = "none";
      sambutan.classList.remove("hidden");

      if (music) {
        music.volume = 0.7;
        music.play().catch(() => {});
      }

      if (toggle) {
        toggle.classList.remove("hidden");
        toggle.innerText = "⏸️";
      }
    }, 800);
  });
}

// ===== MUSIC TOGGLE =====
if (toggle && music) {
  toggle.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      toggle.innerText = "⏸️";
    } else {
      music.pause();
      toggle.innerText = "▶️";
    }
  });
}

// ===== COUNTDOWN =====
const countdownEl = document.getElementById("countdown");
const targetDate = new Date("2026-03-24T08:00:00").getTime();

if (countdownEl) {
  setInterval(() => {
    const diff = targetDate - Date.now();
    if (diff < 0) return;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    countdownEl.innerHTML = `${d} Hari • ${h} Jam • ${m} Menit • ${s} Detik`;
  }, 1000);
}

// ===== ANTI STUCK =====
window.addEventListener("load", () => {
  document.body.classList.remove("lock-scroll");
});