const coverImage = document.getElementById('coverImage');
const authorName = document.getElementById('authorName');
const audioName = document.getElementById('audioName');
const audioPlayer = document.getElementById('audioPlayer');
const previousButton = document.getElementById('previousButton');
const playButton = document.getElementById('playButton');
const nextButton = document.getElementById('nextButton');

// Audios playlist
const audios = [
    {
        id: 1,
        name: "Doubt",
        author: "Twenty One Pilots",
        cover: "assets/images/doubt-cover.jpeg",
        audio: "assets/audios/doubt.mp3"
    },
    {
        id: 2,
        name: "Cry For Me",
        author: "The Weekend",
        cover: "assets/images/cry-for-me-cover.jpeg",
        audio: "assets/audios/cry-for-me.mp3"
    },
    {
        id: 3,
        name: "Growing Pain",
        author: "Tomorrow x Together",
        cover: "assets/images/growing-pain-cover.jpeg",
        audio: "assets/audios/growing-pain.mp3"
    },
];

// Current index of the audio
let currentIndex = 0;

// Function to load current audio info into UI and audio player
function loadAudio(index) {
    const audio = audios[index];
    coverImage.src = audio.cover;
    authorName.textContent = audio.author;
    audioName.textContent = audio.name;
    audioPlayer.src = audio.audio;
    playButton.className = "fa-solid fa-play";
}

// Play or pause toggle functionality
function toggle() {
    if (audioPlayer.paused || audioPlayer.ended) {
        audioPlayer.play();
        playButton.className = "fa-solid fa-pause";
    } else {
        audioPlayer.pause();
        playButton.className = "fa-solid fa-play";
    }
}

// Next track function
function next() {
    currentIndex++;
    if (currentIndex >= audios.length) {
        currentIndex = 0;
    }
    loadAudio(currentIndex);
    
    audioPlayer.play();
    playButton.className = "fa-solid fa-pause";
}

// Previous track function
function previous() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = audios.length - 1;
    }
    loadAudio(currentIndex);
    
    audioPlayer.play();
    playButton.className = "fa-solid fa-pause";
}

// Event listeners for buttons
playButton.addEventListener('click', toggle);
nextButton.addEventListener('click', next);
previousButton.addEventListener('click', previous);

// Auto-skip to next song when current one finishes
audioPlayer.addEventListener('ended', next);

// Load the initial audio on page load
loadAudio(currentIndex);