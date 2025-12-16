var audio = document.getElementById("audioTag");
// 暂停按钮
var playpause = document.getElementsByClassName("playpause")[0];
//
var recordImg = document.getElementsByClassName("cp-img")[0];
//body元素
var body = document.body;
//音乐信息
var musicTitle = document.getElementsByClassName("yymc")[0];
var authorName = document.getElementsByClassName("zzmc")[0];
//上一首下一首
var beforeMusic = document.getElementsByClassName("before")[0];
var nextMusic = document.getElementsByClassName("next")[0];
//播放时间
var playTime = document.getElementsByClassName("played-time")[0];
var totalTime = document.getElementsByClassName("audio-time")[0];
//获取已播放进度条元素
var progressPlayed=document.getElementsByClassName("progress-played")[0];
//循环模式
var playMode=document.getElementsByClassName("play")[0];
//总进度条
var totleProgress=document.getElementsByClassName("jindutiao")[0];
//静音按钮
var volumn=document.getElementsByClassName("volumn")[0];
var volumnTogger=document.getElementById("volumn-togger");
//倍数
var speed=document.getElementsByClassName("speed")[0];
//列表
var listIcon=document.getElementsByClassName("list")[0];
var closeList=document.getElementsByClassName("close-list")[0];
var musicList=document.getElementsByClassName("musicList-container")[0];
var musicNameList=document.getElementsByClassName("musics-list")[0];

//当前播放音乐序号
var musicId = 0;
var musicData = [
  ["M八七", "高桥洋子"],
  ["春雷", "以冬"],
  ["剑心", "知更鸟"],
  ["他不懂", "hanser"],
];
// 初始化音乐
var musicId = 0;
function initMusic() {
  audio.src = `mp3/music${musicId}.mp3`;
  audio.load();
  //当音乐的原数据被加载时执行
  audio.onloadedmetadata = function () {
    recordImg.style.backgroundImage = `url('img/record${musicId}.jpg')`;
    body.style.backgroundImage = `url('img/bg${musicId}.jpg')`;
    refreshRotate();
    musicTitle.innerText = musicData[musicId][0];
    authorName.innerText = musicData[musicId][1];
    totalTime.innerText = transTime(audio.duration);
    audio.currentTime = 0;
    updateProgrsess();
  };
}

initMusic();

// 初始化并播放
function initAndPlay() {
  initMusic();
  audio.play();
  // rotateRecord();
  playpause.classList.remove("icon-play");
  playpause.classList.add("icon-pause");
  rotateRecord();
}
//暂停播放功能
playpause.addEventListener("click", function () {
  if (audio.paused) {
    audio.play();
    rotateRecord();
    playpause.classList.remove("icon-play");
    playpause.classList.add("icon-pause");
  } else {
    audio.pause();
    rotateRecordStop();
    playpause.classList.remove("icon-pause");
    playpause.classList.add("icon-play");
  }
});
//唱片旋转
function rotateRecord() {
  recordImg.style.animationPlayState = "running";
}
//让唱片停止旋转
function rotateRecordStop() {
  recordImg.style.animationPlayState = "paused";
}
//刷新唱片旋转角度
function refreshRotate() {
  recordImg.classList.add("rotate-play");
}
//下一首
nextMusic.addEventListener("click", function () {
  musicId++;
  if (musicId >= musicData.length) {
    musicId = 0;
  }
  initAndPlay();
});
//上一首
beforeMusic.addEventListener("click", function () {
  musicId--;
  if (musicId < 0) {
    musicId=musicData.length - 1;
  }
  initAndPlay();
});
//格式化时间
function transTime(value) {
  var hour = parseInt(value / 3600);
  var minute = parseInt((value % 3600) / 60);
  var second = parseInt(value % 60);
  if (hour > 0) {
    //hour=1,00:00:00   11:00:00
    return `$(hour.toString().padStart(2,'0')):${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  }
  return `${minute.toString().padStart(2, "0")}:${second
    .toString()
    .padStart(2, "0")}`;
}

//更新时间和进度条
audio.addEventListener("timeupdate",
  updateProgrsess);
function updateProgrsess() {
  playTime.innerText = transTime(audio.
    currentTime);
    var value=audio.currentTime/audio.duration;
    progressPlayed.style.width=value*100+"%";
}


//循环模式
var modeId=1;
playMode.addEventListener("click",function(){
  modeId++;
  if(modeId>3){
    modeId=1;
  }
  playMode.style.backgroundImage=`url('img/mode${modeId}.jpg')`;
})
//音乐播放结束时
audio.addEventListener("ended",function(){
  if(modeId==2){
    musicId=(musicId+1)%musicData.length;
  }else if(modeId==3){
    var oldId=musicId;
    while(true){
      musicId=Math.floor(Math.random()*musicData.length);
      if(musicId!=oldId){
        break;
      }
  }
}
initAndPlay();
})

//点击进度条
totleProgress.addEventListener('mousedown',function(event){
  if(!audio.paused||audio.currentTime!=0){
    var pgswidth=totleProgress.
    getBoundingClientRect().width;
    var rate=event.offsetX/pgswidth;
    audio.currentTime=audio.duration*rate;
    updateProgrsess(audio);
  }
});

//音量控制
let lastVolumn=70;
audio.volumn=lastVolumn/100;
//滑动音量调节
// 滑动音量调节
volumnTogger.addEventListener('input', updatevolumn);
function updatevolumn(){
  audio.volume = volumnTogger.value / 100;
}


volumn.addEventListener('click',setNoVolumn);

//点击音量按钮
function setNoVolumn(){
  audio.muted=!audio.muted;
  if(audio.muted){
    lastVolumn=volumnTogger.value;
    volumnTogger.value=0;
    volumn.style.backgroundImage=`url('img/静音.png')`;
  }else{
    volumnTogger.value=lastVolumn;
    volumn.style.backgroundImage=`url('img/音量.png')`
  }
}

//倍速
speed.addEventListener('click',function(){
  var speedText=speed.innerText;
  if(speedText=='1.0x'){
      speed.innerText='1.5x';
      audio.playbackRate=1.5;
  }else if(speedText=='1.5x'){
      speed.innerText='2.0x';
      audio.playbackRate=2.0;
  }else if(speedText=='2.0x'){
      speed.innerText='0.5x';
      audio.playbackRate=0.5;
  }else if(speedText=='0.5x'){
      speed.innerText='1.0x';
      audio.playbackRate=1.0;
  }
})

//列表
listIcon.addEventListener('click',function(){
  musicList.classList.remove('list-hide');
  musicList.classList.add('list-show');
  closeList.style.display='block';
  musicList.style.display='block';
});
closeList.addEventListener('click',function(){
  musicList.classList.remove('list-show');
  musicList.classList.add('list-hide');
  closeList.style.display='none';
  // musicList.style.display='none';
});

//创建列表歌单
function createMusicList(){
  for(let i=0;i<musicData.length;i++){
    //在musicList中创建div元素
    let div=document.createElement('div');
    div.innerText=`${musicData[i][0]}`;
    // add.classList.add('eachMusic');
    musicNameList.appendChild(div);
    div.addEventListener('click',function(){
      musicId=i;
      initAndPlay();
  });
}
}

//加载整个页面元素时触发的事件
document.addEventListener('DOMContentLoaded',createMusicList);