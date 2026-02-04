document.addEventListener("DOMContentLoaded", () => {

  const openBtn = document.getElementById("openInvitation");
  const body = document.body;
  const cover = document.getElementById("cover");
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  // INIT AOS (JANGAN once dulu)
  AOS.init({
    once: false,
    duration: 1200,
    easing: "ease-out-cubic"
  });

  openBtn.addEventListener("click", () => {

    // 1. buka scroll
    body.classList.remove("lock-scroll");

    // 2. sembunyikan cover
    cover.style.display = "none";

    // 3. tampilkan semua konten
    document.querySelectorAll(".hidden").forEach(el => {
      el.classList.remove("hidden");
    });

    // 4. refresh AOS (INI KUNCI UTAMA)
    setTimeout(() => {
      AOS.refreshHard();
    }, 50);

    // 5. play music
    bgMusic.play().catch(() => {});
    musicToggle.classList.remove("hidden");

  });

});