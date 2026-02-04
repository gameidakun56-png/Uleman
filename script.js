// ===== ELEMENT =====
const openBtn = document.getElementById("openInvitation");
const cover = document.getElementById("cover");

const music = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");
const disc = document.querySelector(".music-disc");
const icon = document.querySelector(".music-icon");


// ===== AOS =====
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

// ===== OPEN INVITATION =====
if (openBtn && cover) {
  openBtn.addEventListener("click", () => {
    document.body.classList.remove("lock-scroll");
    cover.classList.add("hide");

    setTimeout(() => {
      cover.style.display = "none";

      document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("hidden");
      });

      if (!music) return;

      music.volume = 0.7;

      music.play()
        .then(() => {
          // 🔥 HANYA JALAN JIKA MUSIK BENAR-BENAR PLAY
          if (disc) disc.classList.add("playing");
          if (icon) icon.innerText = "❚❚";
          if (toggle) toggle.classList.remove("hidden");
        })
        .catch(err => {
          console.warn("Music blocked:", err);
        });

    }, 800);
  });
}

// ===== MUSIC TOGGLE =====
if (toggle && music) {
  toggle.addEventListener("click", () => {
    if (music.paused) {
      music.play()
        .then(() => {
          disc.classList.add("playing");
          icon.innerText = "❚❚";
        })
        .catch(err => console.warn("Play failed:", err));
    } else {
      music.pause();
      disc.classList.remove("playing");
      icon.innerText = "▶";
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
