
async function getSongs(){
  // Fetching the songs from the server
  
    let a = await fetch('http://127.0.0.1:5501/songs/')
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as =  div.getElementsByTagName("a");
    

    let songs = [];
    for(let index = 0;index<as.length;index++){
      const element = as[index];
      if(element.href.endsWith(".mp3")){
       songs.push(element.href.split("/songs/")[1]);
    }
  }
  
  return songs;  
}


async function main() {
  const songs = await getSongs();
  const ul = document.querySelector(".song-list ul");
  const audio = new Audio();
  let currentLi = null;

  songs.forEach((song) => {
    const decodedName = decodeURIComponent(song.replace(".mp3", ""));
    
    let artist = "";
    let title = decodedName;

    // Try to extract artist and title from format "Artist - Title"
    if (decodedName.includes(" - ")) {
      const parts = decodedName.split(" - ");
      if (parts.length >= 2) {
        artist = parts[0];
        title = parts.slice(1).join(" - "); // In case title has more dashes
      }
    }

    const li = document.createElement("li");
    li.innerHTML = `
    <i class="fa-solid fa-music"></i>
    <div class="info">
      <div class="song-name-scroll"><span>${decodeURIComponent(song.replace(".mp3", ""))}</span></div>
      
      <div class="song-name">
        <span class="artist">${artist}</span>
        <span class="title">${title}</span>
        </div>
    </div>
    <div class="play-now">
      <span>Play Now</span>
      <img src="./assets/play-button-svgrepo-com.svg" alt="Play" class="play-icon">
    </div>
  `;
  

    li.addEventListener("click", () => {
      audio.src = `songs/${song}`;
      audio.play();
      document.querySelector(".circle").style.left = "0px";
      

      if (currentLi) currentLi.classList.remove("playing");
      li.classList.add("playing");
      currentLi = li;
      document.querySelector(".text").innerHTML = decodedName.slice(0, 10) + "...";
     
     
      

    });
    ul.appendChild(li);
  });

  // attach an event listener to play,next and previous buttons
  const playButton = document.querySelector(".play-button");
  const nextButton = document.querySelector(".next-button");
  const previousButton = document.querySelector(".previous-button");
  playButton.addEventListener("click", () =>{
    if (audio.paused) {
      audio.play();
     
      playButton.src = "./assets/pause button.jpeg";
      
    } else {
      audio.pause();
      playButton.src = "./assets/play_musicbar.png";

    
    }
  }
  
  ) 
  nextButton.addEventListener("click", () =>
    {
      if (currentLi) {
        currentLi.classList.remove("playing");
        const nextLi = currentLi.nextElementSibling || ul.firstElementChild;
        nextLi.click();
      }
    }
  );
  previousButton.addEventListener("click", () =>
    {
      if (currentLi) {
        currentLi.classList.remove("playing");
        const previousLi = currentLi.previousElementSibling || ul.lastElementChild;
        previousLi.click();
      }
    }

  );

// add event listener to the suffle button
  const shuffleButton = document.querySelector(".shuffle-button");
  shuffleButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    audio.src = `songs/${randomSong}`;
    audio.play();
  });


  // add event listener to the repeat button
  const repeatButton = document.querySelector(".repeat-button");
  repeatButton.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play();
  });

  // add event listener to the volume button

  const volumeSlider = document.querySelector(".voulume-bar");
  
  // Set initial volume (0 to 1)
  audio.volume = volumeSlider.value / 100;
  
  // Update volume when user moves the slider
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
  });
  // Update current time and duration


  // function formatTime(seconds) {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = Math.floor(seconds % 60);
  //   return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  // }

  audio.addEventListener("timeupdate", () => {
    const playbackBar = document.querySelector('.playbackBar');

    const currentTime = audio.currentTime;
    const duration = audio.duration;
  
    if (!isNaN(duration)) {
      const percentage = (currentTime / duration) * 100;
  
      // Move the circle
      document.querySelector(".circle").style.left = `${percentage}%`;
  
      // Update dynamic background color of the playback bar
      playbackBar.style.background = `linear-gradient(to right, #14b14b ${percentage}%,#ffffff ${percentage}%)`;
  
      // Update time display
     
    }
   

    audio.addEventListener("timeupdate" ,()=>{
  document.querySelector(".songtime").innerHTML = `${Math.floor(audio.currentTime / 60)}:${Math.round(audio.currentTime % 60)}`;
     document.querySelector(".duration").innerHTML = `${Math.floor(audio.duration / 60)}:${Math.round(audio.duration % 60)}`;
     })
  });



  // function to open the sidebar when clicked on hamburger.
  const sidebar   = document.querySelector(".sidebar");
  const hamburger = document.querySelector(".hamburger");
  
  document.querySelector(".hamburger").addEventListener     ("click",()=>{
    document.querySelector(".sidebar").style.left = "-1px";
    document.querySelector(".sidebar").style.transition = "left 0.5s";
    document.querySelector(".sidebar").style.zIndex = "1000";
    document.querySelector(".sidebar").style.backgroundColor = "black";
    document.querySelector(".sidebar").style.width = "80%";
    
    document.querySelector(".sidebar").style.position = "absolute";

    //  manipulating the controls as per the sidebar.
    document.querySelector(".controls i").style.display = "none";
    document.querySelector(".controls .hide-img").style.display = "none";
    document.querySelector(".controls .voulume-bar").style.marginRight= "100px";
     document.querySelector(".controls .voulume-bar").style.width = "90px";
     document.querySelector(".controls .volume-button").style.marginRight = "8px";

     

  });
 

  // function to close the sidebar when clicked outside
  document.addEventListener("click",(e)=>{
  if(sidebar.contains(e.target) || hamburger.contains(e.target)){
    return; 
  }else {
    sidebar.style.left = "-400px";
    sidebar.style.transition = "left 1.0s";
    sidebar.style.backgroundColor = "transparent";
    sidebar.style.position = "fixed";
    sidebar.style.overflow = "hidden";
    sidebar.style.left = "-400px";
    sidebar.style.zIndex = "0";
    sidebar.style.width = "0%";
  
  }
 
})





}
  
  
 

main();