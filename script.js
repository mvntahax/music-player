// Playlist module
import { audios } from "./playlist.js";

// DOM
const songsContainer = document.getElementById("songsContainer");
const playerSection  = document.getElementById("playerSection");
const songs          = document.getElementById("songs");
const audioPlayer    = document.getElementById("audioPlayer");
const coverImage     = document.getElementById("coverImage");
const authorName     = document.getElementById("authorName");
const audioName      = document.getElementById("audioName");
const playButton     = document.getElementById("playButton");
const previousButton = document.getElementById("previousButton");
const nextButton     = document.getElementById("nextButton");
const backButton     = document.getElementById("backButton");
const playIcon       = playButton.querySelector("i");
const progressBar    = document.querySelector(".progress-bar-placeholder");
const currentTimeEl  = document.getElementById("currentTime");
const durationEl     = document.getElementById("duration");

// Render list once
songs.innerHTML = audios.map((a, i) => `
  <li>
    <img src="${a.cover}" alt="${a.name} Cover">
    <div>
      <h5>${a.name}</h5>
      <p>${a.author}</p>
    </div>
    <button class="play-button list-play" data-index="${i}" aria-label="Play ${a.name}">
      <i class="fa-solid fa-play"></i>
    </button>
  </li>
`).join("");

// State
let currentIndex = 0;

// Helpers
const ICON_PLAY  = "fa-solid fa-play";
const ICON_PAUSE = "fa-solid fa-pause";

const formatTime = (t) => {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

function updateListIcons() {
  const isPlaying = !audioPlayer.paused && !audioPlayer.ended;
  songs.querySelectorAll(".list-play").forEach((btn) => {
    const icon = btn.firstElementChild; // <i>
    const idx = Number(btn.dataset.index);
    icon.className = (idx === currentIndex && isPlaying) ? ICON_PAUSE : ICON_PLAY;
  });
}

function setPlayButtonIcon() {
  playIcon.className = (!audioPlayer.paused && !audioPlayer.ended) ? ICON_PAUSE : ICON_PLAY;
}

function setTrack(index) {
  currentIndex = (index + audios.length) % audios.length;
  const a = audios[currentIndex];

  // Set media + labels
  coverImage.src = a.cover;
  coverImage.alt = `${a.name} Cover`;
  authorName.textContent = a.author;
  audioName.textContent  = a.name;
  audioPlayer.src        = a.audio;

  // Reset progress UI instantly
  progressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent    = "0:00";

  // After source swap, icons assume 'paused' until play() resolves
  setPlayButtonIcon();
  updateListIcons();
}

async function playSafely() {
  try {
    await audioPlayer.play();
  } catch {
    console.log("Couldn't play the song!")
  }
  setPlayButtonIcon();
  updateListIcons();
}

function setPlayState(shouldPlay) {
  if (shouldPlay) playSafely(); else audioPlayer.pause();
  setPlayButtonIcon();
  updateListIcons();
}

function togglePlay() {
  setPlayState(audioPlayer.paused || audioPlayer.ended);
}

function seekBy(step) {
  setTrack(currentIndex + step);
  playSafely();
}

// Section show/hide
function showPlayer(show) {
  playerSection.classList.toggle("hidden", !show);
  songsContainer.classList.toggle("hidden", show);
}

// Events
playButton.addEventListener("click", togglePlay);
nextButton.addEventListener("click", () => seekBy(+1));
previousButton.addEventListener("click", () => seekBy(-1));
backButton.addEventListener("click", () => {
  showPlayer(false);
  updateListIcons();
});

// Events list
songs.addEventListener("click", (e) => {
  const btn = e.target.closest(".list-play");
  if (!btn) return;
  const index = Number(btn.dataset.index);

  if (index === currentIndex && !audioPlayer.paused && !audioPlayer.ended) {
    setPlayState(false);
  } else {
    setTrack(index);
    playSafely();
    showPlayer(true);
  }
});

// Progress bar
const progressFill = document.createElement("div");
progressFill.classList.add("progress-fill");
progressBar.appendChild(progressFill);

// Time + duration
audioPlayer.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audioPlayer;
  if (!duration) return;
  const pct = (currentTime / duration) * 100;
  progressFill.style.width = pct + "%";
  currentTimeEl.textContent = formatTime(currentTime);
});

// Click seek
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  if (audioPlayer.duration) audioPlayer.currentTime = Math.max(0, Math.min(1, ratio)) * audioPlayer.duration;
});

// Drag seek
let dragging = false;

const onPointerMove = (clientX) => {
  const rect = progressBar.getBoundingClientRect();
  const x = Math.max(rect.left, Math.min(clientX, rect.right));
  const ratio = (x - rect.left) / rect.width;
  progressFill.style.width = (ratio * 100) + "%";
  if (audioPlayer.duration) audioPlayer.currentTime = ratio * audioPlayer.duration;
};

progressBar.addEventListener("pointerdown", (e) => {
  dragging = true;
  progressBar.setPointerCapture(e.pointerId);
  onPointerMove(e.clientX);
});
progressBar.addEventListener("pointermove", (e) => {
  if (dragging) onPointerMove(e.clientX);
});
progressBar.addEventListener("pointerup", (e) => {
  dragging = false;
  progressBar.releasePointerCapture(e.pointerId);
});
progressBar.addEventListener("pointercancel", () => { dragging = false; });

// Media events keep icons perfectly in sync
audioPlayer.addEventListener("play",   () => { setPlayButtonIcon(); updateListIcons(); });
audioPlayer.addEventListener("pause",  () => { setPlayButtonIcon(); updateListIcons(); });
audioPlayer.addEventListener("ended",  () => seekBy(+1));

// Initial
setTrack(0);