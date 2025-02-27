const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const songList = document.getElementById('song-list');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

// Song titles
const songs = ['Mere Naam Tu','Deva Deva','Alkananda','Kesariya','Perfect','Prithibi Ta Naki Chhoto Hote Hote', 'Tum Se Hi', 'Ek Purono Masjide','Kisi Se Pyar Ho Jaye','Bhuter Raja Dilo Bor','faded', 'Beche Thakar Gaan',
'Abar-Phire-Ele','Boba-Tunnel','Ei Sraabon','Apna-Bana-Le','Tere Hawaale','Ami shei manushta r nei'];;
// Keep track of song 
let songIndex = songs.length - 1;

// Load current song from localStorage
function loadSongFromStorage() {
  const currentSong = localStorage.getItem('currentSong');

  if (currentSong) {
    const { song } = JSON.parse(currentSong);
    loadSong(song);
    playSong();
  }
}

// Initially load song details into DOM
loadSongFromStorage();

// Check if there is a stored songIndex and playback position in localStorage
const savedIndex = localStorage.getItem('savedSongIndex');
const savedPosition = localStorage.getItem('playbackPosition');

// If both index and position are found, set them
if (savedIndex !== null && savedPosition !== null) {
  songIndex = parseInt(savedIndex);
  audio.currentTime = parseFloat(savedPosition);
}

// Play the initial song in the background
playSong();

// Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `../music/${song}.mp3`;
  cover.src = `../images/${song}.jpg`;
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  
  audio.play();
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


// Adding List Of Songs In "My Audio" Page
let x = 1;
for (let i in songs) {
  let layout = document.createElement('div');
  layout.className = 'layout';
  layout.id = i;
  layout.addEventListener('click', () => {
    loadSong(songs[layout.id]);
    playSong();
  });

  let songnumber = document.createElement('div');
  songnumber.className = 'song-number';
  songnumber.innerHTML = x;

  let songimage = document.createElement('div');
  songimage.className = 'song-image';
  songimage.style.backgroundImage = `url('../images/${songs[i]}.jpg')`;

  let songname = document.createElement('div');
  songname.className = 'song-name';
  songname.innerHTML = songs[i];

  layout.appendChild(songnumber);
  layout.appendChild(songimage);
  layout.appendChild(songname);

  songList.appendChild(layout);
  x++;
}

// Listen for page visibility change
document.addEventListener('visibilitychange', () => {
  // If the page becomes hidden, save the playback position
  if (document.visibilityState === 'hidden') {
    savePlaybackPosition();
  }
});