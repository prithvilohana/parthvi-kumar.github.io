//sliders
$(".trending-playlist").slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: false,
  autoplaySpeed: 2000,
});

$("#infoPopup").on("shown.bs.modal", function () {
  $("#myInput").trigger("focus");
});

//App logic
//hamburger
const hamfunct = () => {
  rightpart = document.querySelector(".right");
  ham.addEventListener("click", () => {
    if (rightpart.style.left != "0px") {
      rightpart.style.left = "0px";
    }
  });
  closeham.addEventListener("click", ()=>{
    if (rightpart.style.left = "0px") {
      rightpart.style.left = "-500px";
    }
  })
};

//event listner for song
function handleClick(element) {
  let lis = document.querySelectorAll("li.song");
  let currentTrack = null;
  lis.forEach((e) => {
    e.addEventListener("click", () => {
      let musicName = e.querySelector(".song-name").innerHTML.trim();
      console.log(musicName);
      if (currentTrack === musicName) {
        if (currentSong.paused) {
          currentSong.play();
          play.src = "assets/images/pause.svg";
        } else {
          currentSong.pause();
          play.src = "assets/images/play.svg";
        }
      } else {
        currentTrack = musicName;
        musicPlayer(musicName);
      }
    });
  });
}

const currentSong = new Audio();
let songs;
let currFolder;
const getsong = async (folder) => {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (const a of as) {
    if (a.href.endsWith(".mp3")) {
      songs.push(a.href.split(`/${folder}/`)[1]);
    }
  }

  //getting songs in playlist
  let songUL = document.querySelector("ul.songslist");
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      ` <li class="song" onclick="handleClick(this)" contenteditable="false" >
                  <img
                    src="assets/images/musicnote.svg"
                    alt="play"
                    class="icons-nav"
                    id="playimage"
                  />
                  <div class="text-wrap">
                    <span class="song-name">${song.replace(/%20/g, " ")}</span>
                  </div>
         </li>`;
  }
  return songs;
};

//musicplayer
const musicPlayer = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "assets/images/pause.svg";
  }
  document.querySelector("#track-name").innerHTML = decodeURI(track);
};

//second to minutes
function formatSeconds(seconds) {
  // Check if input is a valid number
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"; // Default format for invalid input
  }
  seconds = Math.floor(seconds);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesString = minutes.toString().padStart(2, "0");
  const secondsString = remainingSeconds.toString().padStart(2, "0");

  return `${minutesString}:${secondsString}`;
}

//display albums

const displayAlbum = async () => {
  let a = await fetch("/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let firstalbumslider = document.querySelector(".album-slider");

  let array = Array.from(anchors);

  for (let i = 0; i < array.length; i++) {
    let e = array[i];

    if (e.href.includes("/songs")) {
      let foldername = e.href.split("/").pop();

      try {
        let res = await fetch(
          `/songs/${foldername}/info.json`
        );
        let data = await res.json();

        firstalbumslider.innerHTML += `
          <li class="slider-col card-my" data-folder="${foldername}">
            <div class="image-wrap">
              <img src="songs/${foldername}/cover.png" alt="coverphoto" />
            </div>
            <div class="text-wrap-inner">
              <h3>${data.title}</h3>
              <span>${data.artist}</span>
            </div>
          </li>`;
      } catch (error) {
        console.error(`Failed to fetch data for folder: ${foldername}`, error);
      }
    }
  }
  //eventlistner for folders
  Array.from(document.getElementsByClassName("card-my")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log(item.currentTarget.dataset.folder);
      await getsong(`songs/${item.currentTarget.dataset.folder}`);
      musicPlayer(songs[0]);
    });
  });
};

//main function
async function main() {
  //ham
  hamfunct();

  //display albums
  displayAlbum();

  //getting list of songs
  await getsong("songs/lofi");

  //playing the song
  let audio = new Audio(songs[0]);
  audio.play();
  musicPlayer(songs[0], true);

  //event listner for song
  handleClick();

  //event listner for play bar
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "assets/images/play.svg";
    }
  });

  let progressbar = document.querySelector("#duration");
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".end-time").innerHTML = `${formatSeconds(
      currentSong.duration
    )}`;
    document.querySelector(".start-time").innerHTML = `${formatSeconds(
      currentSong.currentTime
    )}`;
    progressbar.value = (currentSong.currentTime / currentSong.duration) * 100;
  });

  progressbar.addEventListener("input", () => {
    const seektime = (progressbar.value / 100) * currentSong.duration;
    currentSong.currentTime = seektime;
  });

  //event listner for previous button
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      musicPlayer(songs[index - 1]);
    }
  });

  //event listner for next button
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index >= songs.length - 1) {
      musicPlayer(songs[0]);
    } else {
      musicPlayer(songs[index + 1]);
    }
  });

  //event listner for volumebar
  let volumebar = document.querySelector("#volumebar");
  currentSong.volume = 0.5;
  volumebar.addEventListener("input", () => {
    if (volumebar.value == 0) {
      currentSong.volume = 0.0;
      volumeup.src = "assets/images/volumedown.svg";
    } else if (volumebar.value >= 50) {
      volumeup.src = "assets/images/volumeup.svg";
      currentSong.volume = 1.0;
    } else {
      volumeup.src = "assets/images/volumehalf.svg";
      currentSong.volume = 0.3;
    }
  });

  //event listner for volumeicon
  volumeup.addEventListener("click", () => {
    console.log(volumeup);
    if (volumebar.value > 0) {
      volumebar.value = 0;
      currentSong.volume = 0.0;
      volumeup.src = "assets/images/volumedown.svg";
    } else {
      volumebar.value = 50;
      volumeup.src = "assets/images/volumeup.svg";
      currentSong.volume = 1.0;
    }
  });
}

main();
