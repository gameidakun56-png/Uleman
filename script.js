const openBtn = document.getElementById("openInvitation");
const cover = document.getElementById("cover");
const sambutan = document.getElementById("sambutan");
const music = document.getElementById("bgMusic");

openBtn.addEventListener("click", () => {
  document.body.classList.remove("lock-scroll");

  music.play().catch(() => {
    console.log("Autoplay dicegah browser");
  });

  cover.style.opacity = "0";
  cover.style.transition = "0.8s";

  setTimeout(() => {
    cover.style.display = "none";
    sambutan.classList.remove("hidden");
    sambutan.scrollIntoView({ behavior: "smooth" });
  }, 800);
});

/* ===== COUNTDOWN ===== */
const targetDate = new Date("March 24, 2026 08:00:00").getTime();
const countdownEl = document.getElementById("countdown");

setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((distance % (1000 * 60)) / 1000);

  countdownEl.innerHTML = `${d} Hari • ${h} Jam • ${m} Menit • ${s} Detik`;
}, 1000);