const fs = require("fs");
const path = require("path");
const readline = require("readline");

const player = require("play-sound")({
  player: "afplay"
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const musicfolder = path.join(__dirname, "songs");

const songs = fs
  .readdirSync(musicfolder)
  .filter(x => x.endsWith(".mp3"));

let currentSong = 0;
let audioProcess = null;
let paused = false;

function showSongs() {
  songs.forEach((song, index) => {
    console.log(`${index + 1}. ${song}`);
  });
}

function playSong(index) {

  if (index < 0 || index >= songs.length) {
    console.log("❌ Invalid song selection");
    return;
  }

  currentSong = index;

  const song = songs[currentSong];
  const songPath = path.join(musicfolder, song);

  console.log(`🎵 Now Playing: ${song}`);

  audioProcess = player.play(songPath, (err) => {

    if (err) {
      console.log("❌ Error playing song:", err.message);
      return;
    }

    console.log("Song finished.");
  });
}
