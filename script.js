(() => {
  "use strict";

  // ========= HELPERS =========
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const setText = (el, text) => { if (el) el.textContent = text; };

  // ========= ELEMENTS =========
  const openBtn = $("#openInvitation");
  const cover = $("#cover");
  const main = $("#main");

  const music = $("#bgMusic");
  const toggle = $("#musicToggle");
  const disc = $(".music-disc");
  const icon = $(".music-icon");

  const guestNameEl = $("#guest-name");
  const countdownEl = $("#countdown");
  const calendarBtn = $("#addToCalendar");

  // ========= AOS INIT =========
  if (window.AOS && typeof window.AOS.init === "function") {
    window.AOS.init({
      duration: 1000,
      once: true,
      offset: 40,
    });
  }

  // ========= GUEST NAME (from ?to=...) =========
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("to");
    if (raw && guestNameEl) {
      const decoded = decodeURIComponent(raw.replace(/\+/g, " "));
      setText(guestNameEl, decoded);
    }
  } catch (e) {
    console.warn("Failed to parse guest name:", e);
  }

  // ========= MUSIC UI =========
  const updateMusicUI = (isPlaying) => {
    if (!toggle) return;

    toggle.classList.remove("hidden"); // tampilkan setelah invitation dibuka
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");

    if (disc) disc.classList.toggle("playing", isPlaying);
    if (icon) setText(icon, isPlaying ? "❚❚" : "▶");
  };

  if (music) {
    music.preload = "auto";
    music.volume = 0.7;
  }

  // ========= OPEN INVITATION =========
  const openInvitation = async () => {
    document.body.classList.remove("lock-scroll");

    if (openBtn) openBtn.setAttribute("aria-expanded", "true");

    cover?.classList.add("hide");

    window.setTimeout(async () => {
      if (cover) cover.style.display = "none";

      // reveal all sections
      $$(".section").forEach((sec) => sec.classList.remove("hidden"));

      // focus main for accessibility
      main?.focus?.();

      // try play music after click gesture
      if (music) {
        try {
          await music.play();
          updateMusicUI(true);
        } catch (err) {
          // Autoplay blocked by browser, user can manually press toggle
          console.warn("Music blocked (autoplay):", err);
          updateMusicUI(false);
        }
      }
    }, 800);
  };

  if (openBtn) {
    openBtn.addEventListener("click", openInvitation, { once: true });

    // keyboard accessibility
    openBtn.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        openInvitation();
      }
    });
  }

  // ========= MUSIC TOGGLE =========
  if (toggle && music) {
    toggle.addEventListener("click", async () => {
      try {
        if (music.paused) {
          await music.play();
          updateMusicUI(true);
        } else {
          music.pause();
          updateMusicUI(false);
        }
      } catch (err) {
        console.warn("Toggle play failed:", err);
        updateMusicUI(false);
      }
    });
  }

  // ========= COUNTDOWN =========
  const fallbackDateISO = "2026-03-24T08:00:00";

  const getTargetTime = () => {
    const fromAttr = countdownEl?.dataset?.target;
    if (fromAttr) {
      const t = Date.parse(fromAttr);
      if (!Number.isNaN(t)) return t;
    }

    const meta = $('meta[name="event-date"]')?.content;
    if (meta) {
      const t = Date.parse(meta);
      if (!Number.isNaN(t)) return t;
    }

    return Date.parse(fallbackDateISO);
  };

  const pad2 = (n) => String(n).padStart(2, "0");

  const startCountdown = () => {
    if (!countdownEl) return;

    const targetTime = getTargetTime();
    let timerId = null;

    const tick = () => {
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        countdownEl.textContent = "Acara sudah dimulai";
        if (timerId) clearInterval(timerId);
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);

      countdownEl.textContent = `${d} Hari • ${pad2(h)} Jam • ${pad2(m)} Menit • ${pad2(s)} Detik`;
    };

    tick();
    timerId = setInterval(tick, 1000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startCountdown, { once: true });
  } else {
    startCountdown();
  }

  // ========= CALENDAR (.ics download) =========
  const downloadICS = () => {
    // Bisa kamu ubah detailnya di sini
    const title = "Pernikahan Khoiril & Nisa";
    const description = "Undangan pernikahan Khoiril & Nisa";
    const location = "Lokasi acara (isi sesuai kebutuhan)";

    const startISO = $('meta[name="event-date"]')?.content || fallbackDateISO;
    const start = new Date(startISO);

    // default durasi 2 jam
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const toICSDate = (date) => {
      // format: YYYYMMDDTHHMMSSZ (UTC)
      const y = date.getUTCFullYear();
      const mo = pad2(date.getUTCMonth() + 1);
      const da = pad2(date.getUTCDate());
      const hh = pad2(date.getUTCHours());
      const mm = pad2(date.getUTCMinutes());
      const ss = pad2(date.getUTCSeconds());
      return `${y}${mo}${da}T${hh}${mm}${ss}Z`;
    };

    const uid = `${Date.now()}@wedding-invitation`;
    const ics =
`BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//Wedding Invitation//ID
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${toICSDate(new Date())}
DTSTART:${toICSDate(start)}
DTEND:${toICSDate(end)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  if (calendarBtn) {
    calendarBtn.addEventListener("click", downloadICS);
  }

  // ========= FAILSAFE =========
  window.addEventListener("load", () => {
    // kalau ada error sebelum klik cover, minimal user tidak terkunci
    document.body.classList.remove("lock-scroll");
  });
})();
``
