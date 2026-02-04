// ===== SCRIPT TERSTRUKTUR DAN TAHAN GUGAT =====
(() => {
  // Utility
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const safeText = (el, text) => { if (el) el.textContent = text; };

  // ===== ELEMENT =====
  const openBtn = document.getElementById("openInvitation");
  const cover = document.getElementById("cover");

  const music = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  const disc = document.querySelector(".music-disc");
  const icon = document.querySelector(".music-icon");

  // ===== AOS INIT (cek ketersediaan AOS) =====
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({ duration: 1000, once: true });
  }

  // ===== NAMA TAMU =====
  const guestNameEl = document.getElementById("guest-name");
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("to");
    if (raw && guestNameEl) {
      // Ganti + jadi spasi dulu lalu decodeURIComponent
      const decoded = decodeURIComponent(raw.replace(/\+/g, " "));
      guestNameEl.innerText = decoded;
    }
  } catch (e) {
    console.warn("Failed to parse guest name:", e);
  }

  // ===== HELPERS MUSIC UI =====
  const updateMusicUI = (isPlaying) => {
    if (isPlaying) {
      disc?.classList.add("playing");
      if (icon) icon.innerText = "❚❚";
      toggle?.classList.remove("hidden");
      toggle?.setAttribute("aria-pressed", "true");
      toggle?.setAttribute("aria-label", "Pause music");
    } else {
      disc?.classList.remove("playing");
      if (icon) icon.innerText = "▶";
      toggle?.classList.remove("hidden");
      toggle?.setAttribute("aria-pressed", "false");
      toggle?.setAttribute("aria-label", "Play music");
    }
  };

  // Inisialisasi state musik (tidak otomatis play di sini)
  if (music) {
    music.preload = "auto";
    music.volume = (typeof music.volume === "number") ? music.volume : 0.7;
    // sync UI ke keadaan awal audio (paused atau playing)
    updateMusicUI(!music.paused && !music.ended);
  }

  // ===== OPEN INVITATION =====
  const openInvitation = () => {
    document.body.classList.remove("lock-scroll");
    cover?.classList.add("hide");

    setTimeout(() => {
      if (cover) cover.style.display = "none";

      $$(".section").forEach(sec => sec.classList.remove("hidden"));

      if (!music) return;

      // Coba play (bisa diblokir oleh browser jika bukan gesture)
      music.volume = 0.7;
      music.play()
        .then(() => {
          updateMusicUI(true);
        })
        .catch(err => {
          // Jika play diblokir, tetap tunjukkan kontrol supaya user bisa start audio
          console.warn("Music blocked (autoplay):", err);
          updateMusicUI(false);
        });

    }, 800);
  };

  if (openBtn && cover) {
    openBtn.addEventListener("click", openInvitation, { once: true });

    // Aksesibilitas: Enter/Space juga membuka
    openBtn.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        openInvitation();
      }
    });
  }

  // ===== MUSIC TOGGLE =====
  if (toggle && music) {
    toggle.addEventListener("click", () => {
      if (music.paused) {
        music.play()
          .then(() => updateMusicUI(true))
          .catch(err => {
            console.warn("Play failed:", err);
            updateMusicUI(false);
          });
      } else {
        music.pause();
        updateMusicUI(false);
      }
    });
  }

  // ===== COUNTDOWN =====
  const countdownEl = document.getElementById("countdown");

  // Dapatkan target date:
  // 1) data-target pada elemen #countdown (ISO), 2) meta[name="event-date"], 3) fallback const
  const fallbackDateISO = "2026-03-24T08:00:00";
  const getTargetTime = () => {
    if (!countdownEl) return new Date(fallbackDateISO).getTime();
    const attr = countdownEl.dataset?.target;
    if (attr) {
      const t = Date.parse(attr);
      if (!Number.isNaN(t)) return t;
    }
    const meta = document.querySelector('meta[name="event-date"]')?.content;
    if (meta) {
      const t = Date.parse(meta);
      if (!Number.isNaN(t)) return t;
    }
    return new Date(fallbackDateISO).getTime();
  };

  let countdownIntervalId = null;
  const two = n => String(n).padStart(2, "0");

  const startCountdown = () => {
    if (!countdownEl) return;
    const targetTime = getTargetTime();

    const tick = () => {
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        countdownEl.innerHTML = "Acara sudah dimulai";
        if (countdownIntervalId) {
          clearInterval(countdownIntervalId);
          countdownIntervalId = null;
        }
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);

      // Format: 1 Hari • 05 Jam • 04 Menit • 09 Detik
      countdownEl.innerHTML = `${d} Hari • ${two(h)} Jam • ${two(m)} Menit • ${two(s)} Detik`;
    };

    tick();
    countdownIntervalId = setInterval(tick, 1000);
  };

  // Start saat DOM siap
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startCountdown, { once: true });
  } else {
    startCountdown();
  }

  // ===== FAILSAFE (pastikan body tidak terkunci jika sesuatu gagal) =====
  window.addEventListener("load", () => {
    document.body.classList.remove("lock-scroll");
  });
})();