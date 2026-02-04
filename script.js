// ELEMENT
const openBtn = document.getElementById("openInvitation");
const cover = document.getElementById("cover");

const music  = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");
const disc   = document.querySelector(".music-disc");
const icon   = document.querySelector(".music-icon");

// AOS INIT
AOS.init({
  duration:1200,
  easing:'ease-in-out-cubic',
  once:true
});

// NAMA TAMU
const guestNameEl = document.getElementById("guest-name");
const params = new URLSearchParams(window.location.search);
const guestName = params.get("to");

if(guestName && guestNameEl){
  guestNameEl.innerText = guestName.replace(/\+/g," ");
}

// OPEN INVITATION
openBtn?.addEventListener("click",()=>{

  window.scrollTo(0,0);

  cover.classList.add("hide");

  setTimeout(()=>{

    cover.style.display="none";
    document.body.classList.remove("lock-scroll");

    document.querySelectorAll(".section").forEach(sec=>{
      sec.classList.remove("hidden");
    });

    AOS.refresh();

    if(!music) return;

    music.volume=0.7;

    music.play().then(()=>{
      disc?.classList.add("playing");
      if(icon) icon.innerText="❚❚";
      toggle?.classList.remove("hidden");
    });

  },800);

});

// MUSIC TOGGLE
toggle?.addEventListener("click",()=>{

  if(music.paused){
    music.play().then(()=>{
      disc?.classList.add("playing");
      if(icon) icon.innerText="❚❚";
    });
  }else{
    music.pause();
    disc?.classList.remove("playing");
    if(icon) icon.innerText="▶";
  }

});

// COUNTDOWN
const countdownEl = document.getElementById("countdown");
const targetDate = new Date("2026-03-24T08:00:00").getTime();

if(countdownEl){
  setInterval(()=>{
    const diff = targetDate - Date.now();
    if(diff<=0) return;

    const d=Math.floor(diff/86400000);
    const h=Math.floor((diff/3600000)%24);
    const m=Math.floor((diff/60000)%60);
    const s=Math.floor((diff/1000)%60);

    countdownEl.innerHTML=`${d} Hari • ${h} Jam • ${m} Menit • ${s} Detik`;
  },1000);
}