// Playlist Module
import { audios } from "./playlist.js";

// DOM Elements
const songsContainer = document.getElementById("songsContainer");
const playerSection = document.getElementById("playerSection");
const songs = document.getElementById("songs");
const audioPlayer = document.getElementById("audioPlayer");
const coverImage = document.getElementById("coverImage");
const authorName = document.getElementById("authorName");
const audioName = document.getElementById("audioName");
const playButton = document.getElementById("playButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const playIcon = playButton.querySelector("i");
const progressBar = document.querySelector(".progress-bar-placeholder");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// Generate Song List
songs.innerHTML = "";
audios.forEach((audio, index) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <img src="${audio.cover}" alt="${audio.name} Cover">
    <div>
      <h5>${audio.name}</h5>
      <p>${audio.author}</p>
    </div>
    <button class="play-button list-play" data-index="${index}">
      <i class="fa-solid fa-play"></i>
    </button>
  `;
  songs.appendChild(li);
});

// State
let currentIndex = 0;
const listButtons = document.querySelectorAll(".list-play");

// Loading Audio Function
function loadAudio(index) {
  const audio = audios[index];
  coverImage.src = audio.cover;
  authorName.textContent = audio.author;
  audioName.textContent = audio.name;
  audioPlayer.src = audio.audio;
  playIcon.className = "fa-solid fa-play";
  updateListIcons();
}

// Toggle Audio Function
function toggle() {
  if (audioPlayer.paused || audioPlayer.ended) {
    audioPlayer.play();
    playIcon.className = "fa-solid fa-pause";
  } else {
    audioPlayer.pause();
    playIcon.className = "fa-solid fa-play";
  }
}

// Next Audio Function
function next() {
  currentIndex = (currentIndex + 1) % audios.length;
  loadAudio(currentIndex);
  audioPlayer.play();
  playIcon.className = "fa-solid fa-pause";
}

// Previous Audio Function
function previous() {
  currentIndex = (currentIndex - 1 + audios.length) % audios.length;
  loadAudio(currentIndex);
  audioPlayer.play();
  playIcon.className = "fa-solid fa-pause";
}

// Update Icons Function
function updateListIcons() {
  listButtons.forEach((btn, index) => {
    const icon = btn.querySelector("i");
    if (index === currentIndex && !audioPlayer.paused) {
      icon.className = "fa-solid fa-pause";
    } else {
      icon.className = "fa-solid fa-play";
    }
  });
}

// Event Listeners
playButton.addEventListener("click", toggle);
nextButton.addEventListener("click", next);
previousButton.addEventListener("click", previous);
backButton.addEventListener("click", () => {
  playerSection.classList.add("hidden");
  songsContainer.classList.remove("hidden");
  updateListIcons();
});

// Song List Buttons
listButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const index = parseInt(btn.dataset.index);

    if (index === currentIndex && !audioPlayer.paused) {
      audioPlayer.pause();
      playIcon.className = "fa-solid fa-play";
    } else {
      currentIndex = index;
      loadAudio(currentIndex);
      audioPlayer.play();
      playIcon.className = "fa-solid fa-pause";
    }

    songsContainer.classList.add("hidden");
    playerSection.classList.remove("hidden");

    updateListIcons();
  });
});

// Auto-next once ended
audioPlayer.addEventListener("ended", next);

// Progress bar implementation
const progressFill = document.createElement("div");
progressFill.classList.add("progress-fill");
progressBar.appendChild(progressFill);

audioPlayer.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audioPlayer;
  if (!duration) return;

  const percent = (currentTime / duration) * 100;
  progressFill.style.width = `${percent}%`;

  // Time formatting
  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

// Seek (jump to point) when clicking on bar
progressBar.addEventListener("click", (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;

  audioPlayer.currentTime = (clickX / width) * duration;
});

// Drag to seek
let isDragging = false;

progressBar.addEventListener("mousedown", (e) => {
  isDragging = true;
  updateSeek(e);
});
progressBar.addEventListener("mousemove", (e) => {
  if (isDragging) updateSeek(e);
});
document.addEventListener("mouseup", () => {
  isDragging = false;
});

function updateSeek(e) {
  const width = progressBar.clientWidth;
  const rect = progressBar.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const duration = audioPlayer.duration;

  if (offsetX >= 0 && offsetX <= width) {
    const percent = (offsetX / width) * 100;
    progressFill.style.width = `${percent}%`;
    audioPlayer.currentTime = (offsetX / width) * duration;
  }
}

// Initial Load
loadAudio(currentIndex);