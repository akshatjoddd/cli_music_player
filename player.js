const fs = require("fs");
const path = require("path");
const readline = require("readline");
const player = require("play-sound")();
const musicfolder=path.join(__dirname,"songs")
const songs = fs.readdirSync(musicfolder).filter(x=>x.endsWith(".mp3"))
function show(){


    songs.forEach((song, index) => {
    console.log(`${index + 1}. ${song}`);
  });

}