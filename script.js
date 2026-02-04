// ===== ELEMENT =====
const openBtn = document.getElementById("openInvitation");
const cover = document.getElementById("cover");

const music  = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");
const disc   = document.querySelector(".music-disc");
const icon   = document.querySelector(".music-icon");

// ===== AOS INIT =====
function initAOS() {
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({
      duration: 1000,        // default animation duration
      easing: 'ease-in-out', // smoother easing
      offset: 120,           // trigger offset (px)
      once: true,            // animate only once while scrolling down
      mirror: false,         // whether elements should animate out while scrolling past them
      delay: 0
    });
  }
}

// Refresh AOS after load/assets ready to ensure correct offsets
window.addEventListener('load', () => {
  initAOS();
  if (window.AOS && typeof AOS.refresh === 'function') AOS.refresh();
  document.body.classList.remove("lock-scroll");
});

// Also init AOS on DOMContentLoaded as fallback
document.addEventListener('DOMContentLoaded', initAOS);


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
    // update aria-expanded for accessibility
    const expanded = openBtn.getAttribute('aria-expanded') === 'true';
    openBtn.setAttribute('aria-expanded', String(!expanded));

    document.body.classList.remove("lock-scroll");
    cover.classList.add("hide");

    setTimeout(() => {
      cover.style.display = "none";

      document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("hidden");
      });

      // Pastikan AOS menghitung ulang elemen yang baru terlihat
      if (window.AOS) {
        if (typeof AOS.refreshHard === 'function') {
          // refreshHard lebih agresif dan biasanya memaksa animasi muncul
          AOS.refreshHard();
        } else if (typeof AOS.refresh === 'function') {
          AOS.refresh();
        }
        // lalu paksakan event scroll agar AOS mem-trigger animasi yang berada di viewport
        // beri delay kecil supaya browser menerapkan perubahan layout dahulu
        setTimeout(() => {
          window.dispatchEvent(new Event('scroll'));
        }, 40);
      }

      if (!music) return;

      music.volume = 0.7;
      music.play()
        .then(() => {
          disc?.classList.add("playing");
          if (icon) icon.innerText = "❚❚";
          toggle?.classList.remove("hidden");
        })
        .catch(err => console.warn("Music blocked:", err));

    }, 800);
  });
}


// ===== MUSIC TOGGLE =====
if (toggle && music) {
  toggle.addEventListener("click", () => {
    if (music.paused) {
      music.play()
        .then(() => {
          disc?.classList.add("playing");
          if (icon) icon.innerText = "❚❚";
        })
        .catch(err => console.warn("Play failed:", err));
    } else {
      music.pause();
      disc?.classList.remove("playing");
      if (icon) icon.innerText = "▶";
    }
  });
}


// ===== COUNTDOWN =====
const countdownEl = document.getElementById("countdown");
const targetDate = new Date("2026-03-24T08:00:00").getTime();

if (countdownEl) {
  setInterval(() => {
    const diff = targetDate - Date.now();
    if (diff <= 0) return;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    countdownEl.innerHTML = `${d} Hari • ${h} Jam • ${m} Menit • ${s} Detik`;
  }, 1000);
}