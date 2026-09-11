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
  if (index < 0||index>=songs.length) {
    console.log("❌ Invalid song selection");
    return;
  }

  stopSong();
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
  paused = false;
}



function chooseSong() {
  showSongs();
  rl.question("Choose a song number: ", (answer) => {
    const index = Number(answer) - 1;
    if (
      Number.isNaN(index) ||
      index <0||
      index >=songs.length
    ) {
      console.log("❌ Invalid song selection");
      return;
    }

    playSong(index);
  });
}




function nextSong() {

  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  playSong(currentSong);
}



function previousSong() {
  currentSong--;
  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }
  playSong(currentSong);
}



function stopSong() {
  if (audioProcess) {
    audioProcess.kill();
    audioProcess = null;
    paused = false;
    console.log("⏹ Stopped");
  }
}


function pauseSong() {
  if (audioProcess && !paused) {
    audioProcess.kill("SIGSTOP");
    paused = true;
    console.log("⏸ Paused");
  }
}



function resumeSong() {
  if (audioProcess && paused) {
    audioProcess.kill("SIGCONT");
    paused = false;
    console.log("▶ Resumed");
  }
}


function showMenu() {
  console.log(`
-------------------------
     CLI MUSIC PLAYER
-------------------------

p  → Pause
r  → Resume
s  → Stop
n  → Next
b  → Previous
l  → List songs
q  → Quit
c  → Choose song

`);
}
showSongs();
showMenu();
chooseSong();
rl.on("line", command => {
  command = command.trim().toLowerCase();
  if (command=="p") {
    pauseSong();
  } else if (command=="r") {
    resumeSong();
  } else if (command=="s") {
    stopSong();
  } else if (command=="n") {
    nextSong();
  } else if (command=="b") {
    previousSong();
  } else if (command=="l") {
    showSongs();
  } else if (command=="c") {
    chooseSong();
  } else if (command=="q") {
    stopSong();
    rl.close();
    console.log(" Goodbye!");
    process.exit(0);
  } else {
    console.log("❌ Invalid command.");
  }
});
