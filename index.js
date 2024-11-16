// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const box = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  
  
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Tung Quen",
      singer: "Wren Evans",
      path: "audio/tungquen.mp3",
      image: "img/tungquen.jpg"
    },
    {
      name: "Chung Ta Cua Hien Tai",
      singer: "Son Tung MTP",
      path:"audio/ctcht.mp3",
      image:
        "img/ctcht.jpg"
    },
    {
      name: "Die With A Smile",
      singer: "Lady Gaga & Bruno Mars",
      path:
      "audio/diewithasmile.mp3",
      image: "img/diewithasmile.jpg"
    },
    {
      name: "Bong Hoa Chang Thuoc Ve Ta",
      singer: "Viet x Deus",
      path: "audio/bhctvt.mp3",
      image:"img/bonghoachangthuocveta.jpg"
    },
    {
      name: "Only",
      singer: "Lee Hi",
      path: "audio/only.mp3"
      ,image:
        "img/only.jpg"
    },
    {
      name: "Here To Stay",
      singer: "Raftaar x kr$na",
      path:
        "audio/heretostay.mp3",
      image:
        "img/heretostay.jpg"
    },
    {
      name: "Mystery of Love & Vision of Gideon",
      singer: "Sufjan Stevens",
      path: "audio/mystery.mp3",
      image:
        "img/callmebyyourname.jpg"
    }
  ],
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
          <div class="thumb" style="background-image: url('${song.image}')"></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  
  
  handleEvents: function(){
    
    const _this = this;
    const cdWidth = cd.offsetWidth;
    const cdThumbAnimate = cdThumb.animate([{transform : 'rotate(360deg)'}],{
        duration : 20000,
        iterations: Infinity 
    });
    cdThumbAnimate.pause();
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    audio.onplay = function()
    {
        _this.isPlaying = true;
        player.classList.add('playing');
    };
    audio.onpause = function()
    {
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdThumbAnimate.pause();
    };
    playBtn.onclick = function()
    {
        if(_this.isPlaying)
        {
            audio.pause();
            cdThumbAnimate.pause();
        }
        else{
            audio.play();
            cdThumbAnimate.play();
        }
    };
    audio.ontimeupdate = function()
    {
        if (audio.duration)
        {
            const progressPercentage = audio.currentTime*100/audio.duration;
            progress.value = progressPercentage;
        }
        
    };
    progress.onchange = function(e)
    {
        const seektime = audio.duration / 100 * e.target.value ;
        audio.currentTime = seektime;
    };
    nextBtn.onclick = function()
    {
     if(_this.isRandom)
      {
        _this.randomSong();
      } 
      else{_this.nextSong();}
      
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    prevBtn.onclick = function()
    {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    randomBtn.onclick = function()
    {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    repeatBtn.onclick = function()
    {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    playlist.onclick=function(e)
    {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vào song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 300);
  },
  loadCurrentSong: function(){    
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    

  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom || false;
    this.isRepeat = this.config.isRepeat || false;
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
  setConfig: function (key, value) {
    this.config[key] = value;
    // Uncomment this line if localStorage is used
    // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  

  prevSong:function()
  {
  this.currentIndex--;
    if(this.currentIndex<0) this.currentIndex = this.songs.length-1;
    this.loadCurrentSong();
  },
  nextSong: function()
  {
    this.currentIndex++;
    if(this.currentIndex>=this.songs.length) this.currentIndex = 0;
    this.loadCurrentSong();
  },
  repeatSong: function()
  {
    let newIndex;
    do{
      newIndex = Math.floor(Math.random()*this.songs.length);
    } while (newIndex === currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length); // Generate a random index
    } while (newIndex === this.currentIndex); // Ensure it's not the current song
    this.currentIndex = newIndex; // Update the current song index
    this.loadCurrentSong(); // Load the new song
  },
  start: function(){
    this.loadConfig();
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
    }
};
app.start();
