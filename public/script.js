const songs = [
    { file: 'songs/song4.mp3', name: 'Song 4' },
    { file: 'songs/song1.mp3', name: 'Song 1' },
    { file: 'songs/song2.mp3', name: 'Song 2' },
    { file: 'songs/song3.mp3', name: 'Song 3' },
    { file: 'songs/song5.mp3', name: 'Song 5' }
];

let currentIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeating = false;
let isMuted = false;
let volume = 1;
let shuffledPlaylist = [...songs];

const audioPlayer = document.getElementById('audioPlayer');
const playerContainer = document.getElementById('playerContainer');
const prevButton = document.getElementById('prevBtn');
const nextButton = document.getElementById('nextBtn');
const playPauseButton = document.getElementById('playPauseBtn');
const shuffleButton = document.getElementById('shuffleBtn');
const repeatButton = document.getElementById('repeatBtn');
const volumeButton = document.getElementById('volumeBtn');
const progressBar = document.getElementById('progressBar');
const progressWrapper = document.getElementById('progressWrapper');
const volumeSlider = document.getElementById('volumeSlider');
const volumeWrapper = document.getElementById('volumeWrapper');
const trackName = document.getElementById('trackName');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const volumeIcon = document.getElementById('volumeIcon');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// Format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update progress bar
function updateProgress() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + '%';
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    }
}

// Shuffle playlist
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    if (isShuffled) {
        shuffledPlaylist = shuffleArray(songs);
        shuffleButton.classList.add('active');
    } else {
        shuffledPlaylist = [...songs];
        shuffleButton.classList.remove('active');
    }
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    if (isRepeating) {
        repeatButton.classList.add('active');
    } else {
        repeatButton.classList.remove('active');
    }
}

function playCurrentSong() {
    const playlist = isShuffled ? shuffledPlaylist : songs;
    if (playlist.length > 0 && currentIndex >= 0 && currentIndex < playlist.length) {
        const song = playlist[currentIndex];
        audioPlayer.src = song.file;
        trackName.textContent = song.name;
        audioPlayer.load();
        if (isPlaying) {
            audioPlayer.play().catch(err => console.log('Autoplay prevented:', err));
        }
    }
}

function playNextSong() {
    const playlist = isShuffled ? shuffledPlaylist : songs;
    if (playlist.length === 0) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    playCurrentSong();
}

function playPreviousSong() {
    const playlist = isShuffled ? shuffledPlaylist : songs;
    if (playlist.length === 0) return;
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
    } else {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        playCurrentSong();
    }
}

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        audioPlayer.play().catch(err => console.log('Autoplay prevented:', err));
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
}

function toggleMute() {
    if (isMuted) {
        audioPlayer.volume = volume;
        isMuted = false;
        volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    } else {
        audioPlayer.volume = 0;
        isMuted = true;
        volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    }
}

function setVolume(e) {
    const rect = volumeWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / rect.width));
    volume = newVolume;
    audioPlayer.volume = newVolume;
    volumeSlider.style.width = (newVolume * 100) + '%';
    if (newVolume === 0) {
        isMuted = true;
        volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else {
        isMuted = false;
        volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
}

function setProgress(e) {
    const rect = progressWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / rect.width) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
}

function downloadAllSongs() {
    songs.forEach((song, index) => {
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = song.file;
            link.download = song.file.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, index * 200);
    });
}

// Event listeners
playPauseButton.addEventListener('click', togglePlayPause);
nextButton.addEventListener('click', playNextSong);
prevButton.addEventListener('click', playPreviousSong);
shuffleButton.addEventListener('click', toggleShuffle);
repeatButton.addEventListener('click', toggleRepeat);
volumeButton.addEventListener('click', toggleMute);
volumeWrapper.addEventListener('click', setVolume);
progressWrapper.addEventListener('click', setProgress);
downloadAllBtn.addEventListener('click', downloadAllSongs);

// Progress tracking
audioPlayer.addEventListener('timeupdate', updateProgress);

// Auto-play next song when current ends
audioPlayer.addEventListener('ended', () => {
    if (isRepeating) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNextSong();
        if (isPlaying) {
            audioPlayer.play().catch(err => console.log('Autoplay prevented:', err));
        }
    }
});

// Update play state
audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
});

audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') {
        playNextSong();
    } else if (e.code === 'ArrowLeft') {
        playPreviousSong();
    } else if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        togglePlayPause();
    }
});

// Initialize
if (songs.length > 0) {
    playCurrentSong();
}

