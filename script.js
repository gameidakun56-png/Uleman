document.addEventListener("DOMContentLoaded", () => {

  // INIT AOS
  AOS.init({
    once: true,
    duration: 1200,
    easing: "ease-out-cubic"
  });

  const openBtn = document.getElementById("openInvitation");
  const body = document.body;
  const cover = document.getElementById("cover");
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  openBtn.addEventListener("click", () => {
    // unlock scroll
    body.classList.remove("lock-scroll");

    // hide cover
    cover.style.display = "none";

    // show all hidden elements
    document.querySelectorAll(".hidden").forEach(el => {
      el.classList.remove("hidden");
    });

    // refresh aos
    AOS.refresh();

    // play music
    bgMusic.play().catch(() => {});
    musicToggle.classList.remove("hidden");
  });

});