const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

// Song titles
const songs = ['Mere Naam Tu', 'Deva Deva', 'Alkananda', 'Kesariya', 'Perfect', 'Prithibi Ta Naki Chhoto Hote Hote', 'Tum Se Hi', 'Ek Purono Masjide', 'Kisi Se Pyar Ho Jaye', 'Bhuter Raja Dilo Bor', 'faded', 'Beche Thakar Gaan',
  'Abar-Phire-Ele', 'Boba-Tunnel', 'Ei Sraabon', 'Apna-Bana-Le', 'Tere Hawaale', 'Ami shei manushta r nei'];
// Keep track of song
let songIndex = songs.length - 1;

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Check if there is a stored songIndex and playback position in localStorage
const savedIndex = localStorage.getItem('savedSongIndex');
const savedPosition = localStorage.getItem('playbackPosition');

// If both index and position are found, set them
if (savedIndex !== null && savedPosition !== null) {
  songIndex = parseInt(savedIndex);
  audio.currentTime = parseFloat(savedPosition);
}

// Play the initial song in the background
pauseSong();

// Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
}

// Save current song to localStorage
function saveCurrentSong() {
  localStorage.setItem('currentSong', JSON.stringify({ song: songs[songIndex] }));
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();

  // Save current song to localStorage
  saveCurrentSong();
}

// Save playback position when pausing or changing songs
function savePlaybackPosition() {
  localStorage.setItem('playbackPosition', audio.currentTime.toString());
  localStorage.setItem('savedSongIndex', songIndex.toString());
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();

  // Save playback position when pausing
  savePlaybackPosition();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

//get duration & currentTime for Time of song
function DurTime(e) {
  const { duration, currentTime } = e.srcElement;
  var sec;
  var sec_d;

  // define minutes currentTime
  let min = (currentTime == null) ? 0 :
    Math.floor(currentTime / 60);
  min = min < 10 ? '0' + min : min;

  // define seconds currentTime
  function get_sec(x) {
    if (Math.floor(x) >= 60) {

      for (var i = 1; i <= 60; i++) {
        if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
          sec = Math.floor(x) - (60 * i);
          sec = sec < 10 ? '0' + sec : sec;
        }
      }
    } else {
      sec = Math.floor(x);
      sec = sec < 10 ? '0' + sec : sec;
    }
  }

  get_sec(currentTime, sec);

  // change currentTime DOM
  currTime.innerHTML = min + ':' + sec;

  // define minutes duration
  let min_d = (isNaN(duration) === true) ? '0' :
    Math.floor(duration / 60);
  min_d = min_d < 10 ? '0' + min_d : min_d;


  function get_sec_d(x) {
    if (Math.floor(x) >= 60) {

      for (var i = 1; i <= 60; i++) {
        if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
          sec_d = Math.floor(x) - (60 * i);
          sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
        }
      }
    } else {
      sec_d = (isNaN(duration) === true) ? '0' :
        Math.floor(x);
      sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
    }
  }

  // define seconds duration

  get_sec_d(duration);

  // change duration DOM
  durTime.innerHTML = min_d + ':' + sec_d;

};

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change volume of the Song 
const setVolume = (volume) => {
  audio.volume = volume
}

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', () => {
  nextSong();
  // Save playback position when changing songs
  savePlaybackPosition();
});

// Time of song
audio.addEventListener('timeupdate', DurTime);

document.addEventListener('DOMContentLoaded', function () {
  const audio = document.getElementById('audio');
  const playButton = document.getElementById('play');
  const timestampElement = document.getElementById('timestamp');

  let isPlaying = false;

  audio.addEventListener('timeupdate', function () {
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);

    timestampElement.textContent = `${currentTime} / ${duration}`;
  });

  playButton.addEventListener('click', function () {
    if (isPlaying == true) {
      audio.pause();
      isPlaying = false;
    }
    else {
      audio.play();
      isPlaying = true;
    }
  });

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
});


// Listen for page visibility change
document.addEventListener('visibilitychange', () => {
  // If the page becomes hidden, save the playback position
  if (document.visibilityState === 'hidden') {
    savePlaybackPosition();
  }
});