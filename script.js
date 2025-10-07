const coverImage = document.getElementById("coverImage");
const authorName = document.getElementById("authorName");
const audioName = document.getElementById("audioName");
const audioPlayer = document.getElementById("audioPlayer");
const songsContainer = document.getElementById("songsContainer");
const songs = document.getElementById("songs");
const playerSection = document.getElementById("playerSection");
const previousButton = document.getElementById("previousButton");
const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const playIcon = playButton.querySelector("i");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar-placeholder");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// === Playlist ===
const audios = [
  {
    id: 1,
    name: "Doubt",
    author: "Twenty One Pilots",
    cover: "assets/images/doubt-cover.jpeg",
    audio: "assets/audios/doubt.mp3",
  },
  {
    id: 2,
    name: "Cry For Me",
    author: "The Weekend",
    cover: "assets/images/cry-for-me-cover.jpeg",
    audio: "assets/audios/cry-for-me.mp3",
  },
  {
    id: 3,
    name: "Growing Pain",
    author: "Tomorrow x Together",
    cover: "assets/images/growing-pain-cover.jpeg",
    audio: "assets/audios/growing-pain.mp3",
  },
  {
    id: 4,
    name: "Sahiba",
    author: "Aditya Rikhari",
    cover: "assets/images/sahiba-cover.jpeg",
    audio: "assets/audios/sahiba.mp3",
  },
  {
    id: 5,
    name: "Paaro",
    author: "Aditya Rikhari",
    cover: "assets/images/paaro-cover.jpeg",
    audio: "assets/audios/paaro.mp3",
  },
  {
    id: 6,
    name: "Its ok Im ok",
    author: "Tate McRae",
    cover: "assets/images/its-ok-im-ok-cover.png",
    audio: "assets/audios/its-ok-im-ok.mp3",
  },
   {
    id: 7,
    name: "Into It",
    author: "Chase Atlantic",
    cover: "assets/images/into-it-cover.jpeg",
    audio: "assets/audios/into-it.mp3",
  },
  {
    id: 8,
    name: "Kangana Tera Ni",
    author: "Abeer Arora",
    cover: "assets/images/kangna-tera-ni-cover.jpg",
    audio: "assets/audios/kangna-tera-ni.mp3",
  },
   {
    id: 9,
    name: "Passo Bem Solto",
    author: "ATLXS",
    cover: "assets/images/passo-bem-solto-cover.jpeg",
    audio: "assets/audios/passo-bem-solto.mp3",
  },
   {
    id: 10,
    name: "Maand",
    author: "Bayaan, Hasan Raheem, Rovalio",
    cover: "assets/images/maand-cover.jpeg",
    audio: "assets/audios/maand.mp3",
  }
];

// === Generate Song List ===
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

// === State ===
let currentIndex = 0;
const listButtons = document.querySelectorAll(".list-play");

// === Functions ===
function loadAudio(index) {
  const audio = audios[index];
  coverImage.src = audio.cover;
  authorName.textContent = audio.author;
  audioName.textContent = audio.name;
  audioPlayer.src = audio.audio;
  playIcon.className = "fa-solid fa-play";
  updateListIcons();
}

function toggle() {
  if (audioPlayer.paused || audioPlayer.ended) {
    audioPlayer.play();
    playIcon.className = "fa-solid fa-pause";
    updateListIcons();
  } else {
    audioPlayer.pause();
    playIcon.className = "fa-solid fa-play";
    updateListIcons();
  }
}

function next() {
  currentIndex = (currentIndex + 1) % audios.length;
  loadAudio(currentIndex);
  audioPlayer.play();
  playIcon.className = "fa-solid fa-pause";
  updateListIcons();
}

function previous() {
  currentIndex = (currentIndex - 1 + audios.length) % audios.length;
  loadAudio(currentIndex);
  audioPlayer.play();
  playIcon.className = "fa-solid fa-pause";
  updateListIcons();
}

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

// === Event Listeners ===
playButton.addEventListener("click", toggle);
nextButton.addEventListener("click", next);
previousButton.addEventListener("click", previous);

backButton.addEventListener("click", () => {
  playerSection.classList.add("hidden");
  songsContainer.classList.remove("hidden");
  updateListIcons();
});

// === Song List Buttons ===
listButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const index = parseInt(btn.dataset.index);

    // Toggle same song
    if (index === currentIndex && !audioPlayer.paused) {
      audioPlayer.pause();
      playIcon.className = "fa-solid fa-play";
    } else {
      currentIndex = index;
      loadAudio(currentIndex);
      audioPlayer.play();
      playIcon.className = "fa-solid fa-pause";
    }

    // Hide list, show player
    songsContainer.classList.add("hidden");
    playerSection.classList.remove("hidden");

    updateListIcons();
  });
});

// Auto-next when finished
audioPlayer.addEventListener("ended", next);

// Create an inner bar for actual progress
const progressFill = document.createElement("div");
progressFill.classList.add("progress-fill");
progressBar.appendChild(progressFill);

// Update progress bar as audio plays
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
