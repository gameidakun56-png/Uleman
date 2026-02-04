// ===== ELEMENT =====
const openBtn = document.getElementById("openInvitation");
const cover   = document.getElementById("cover");

const music  = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");
const disc   = document.querySelector(".music-disc");
const icon   = document.querySelector(".music-icon");

// ===== AOS =====
AOS.init({
  duration: 1200,
  easing: "ease-in-out-cubic",
  once: true,
  offset: 80
});

// ===== NAMA TAMU =====
const guestNameEl = document.getElementById("guest-name");
const params = new URLSearchParams(window.location.search);
const guestName = params.get("to");

if (guestName && guestNameEl) {
  guestNameEl.innerText = guestName.replace(/\+/g, " ");
}

// ===== OPEN INVITATION =====
openBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);

  cover.style.opacity = "0";

  setTimeout(() => {
    cover.style.display = "none";
    document.body.classList.remove("lock-scroll");

    document.querySelectorAll(".section").forEach(section => {
      section.classList.remove("hidden");

      // PAKSA RESET VISUAL
      section.style.display = "flex";
      section.style.opacity = "1";
      section.style.transform = "none";
    });

    // REFRESH AOS TOTAL
    AOS.refreshHard();

    // MUSIC
    if (music) {
      music.volume = 0.7;
      music.play().catch(()=>{});
      toggle.classList.remove("hidden");
      disc.classList.add("playing");
      icon.innerText = "❚❚";
    }

  }, 700);
});

// ===== MUSIC TOGGLE =====
toggle.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    disc.classList.add("playing");
    icon.innerText = "❚❚";
  } else {
    music.pause();
    disc.classList.remove("playing");
    icon.innerText = "▶";
  }
});