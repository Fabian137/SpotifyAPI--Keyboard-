var redirect_uri = "http://127.0.0.1:5500/index.html"; // change this your value
//var redirect_uri = "http://127.0.0.1:5500/index.html";
 

var client_id = ""; 
var client_secret = ""; // In a real app you should not expose your client_secret to the user

var access_token = null;
var refresh_token = null;
var currentPlaylist = "";

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const PAUSE = "https://api.spotify.com/v1/me/player/pause";
const NEXT = "https://api.spotify.com/v1/me/player/next";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const PLAYER = "https://api.spotify.com/v1/me/player";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";

function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    if ( window.location.search.length > 0 ){
        handleRedirect();
    }
    else{
        access_token = localStorage.getItem("access_token");
        if ( access_token == null ){
            // we don't have an access token so present token section
            document.getElementById("tokenSection").style.display = 'block';  
        }
        else {
            // we have an access token so present device section
            document.getElementById("deviceSection").style.display = 'block';  
            refreshDevices();
            refreshPlaylists();
            currentlyPlaying();
        }
    }
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri); // remove param from url
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function requestAuthorization(){
    client_id = document.getElementById("clientId").value;
    client_secret = document.getElementById("clientSecret").value;
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret); // In a real app you should not expose your client_secret to the user

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function refreshDevices(){
     callApi( "GET", DEVICES, null, handleDevicesResponse );
}

function handleDevicesResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        // removeAllItems( "devices" );
        data.devices.forEach(item => addDevice(item));
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addDevice(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name;
    document.getElementById("devices").appendChild(node); 
}
function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function refreshPlaylists(){
    callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
}

function handlePlaylistsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        // removeAllItems( "playlists" );
        data.items.forEach(item => addPlaylist(item));
        document.getElementById('playlists').value=currentPlaylist;
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addPlaylist(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name + " (" + item.tracks.total + ")";
    document.getElementById("playlists").appendChild(node); 
}
function removeAllItems(elementId){
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
const play = () =>{
    currentlyPlaying()
    let playlist_id = document.getElementById("playlists").value;
    let trackindex = document.getElementById("tracks").value;
    let album = document.getElementById("album").value;
    let textBotonPlay = document.getElementById('play')
    let body = {};
    if ( album.length > 0 ){
        body.context_uri = album;
    }
    else{
        body.context_uri = "spotify:playlist:" + playlist_id;
    }
    body.offset = {};
    body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
        textBotonPlay.textContent = 'pause'
        textBotonPlay.setAttribute('onclick', 'pause()')
    callApi( "PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );
}

const shuffle = () =>{
    currentlyPlaying()
    callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId(), null, handleApiResponse );
    play(); 
}

const pause = () =>{
    let textBotonPlay = document.getElementById('play')
    textBotonPlay.textContent = 'play_arrow'
    textBotonPlay.setAttribute('onclick', 'play()')
    callApi( "PUT", PAUSE + "?device_id=" + deviceId(), null, handleApiResponse );
}

const next = () =>{
    callApi( "POST", NEXT + "?device_id=" + deviceId(), null, handleApiResponse );
    currentlyPlaying()
}

const previous = () =>{
    currentlyPlaying()
    callApi( "POST", PREVIOUS + "?device_id=" + deviceId(), null, handleApiResponse );
}

const transfer = () =>{
    let body = {};
    body.device_ids = [];
    body.device_ids.push(deviceId())
    callApi( "PUT", PLAYER, JSON.stringify(body), handleApiResponse );
}

function handleApiResponse(){
    if ( this.status == 200){
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 204 ){
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
}

const deviceId = () =>{
    return document.getElementById("devices").value;
}

function fetchTracks(){
    let playlist_id = document.getElementById("playlists").value;
    if ( playlist_id.length > 0 ){
        url = TRACKS.replace("{{PlaylistId}}", playlist_id);
        callApi( "GET", url, null, handleTracksResponse );
    }
}

function handleTracksResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        // removeAllItems( "tracks" );
        data.items.forEach( (item, index) => addTrack(item, index));
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addTrack(item, index){
    let node = document.createElement("option");
    node.value = index;
    node.innerHTML = item.track.name + " (" + item.track.artists[0].name + ")";
    document.getElementById("tracks").appendChild(node); 
}

const currentlyPlaying = () =>{
    callApi( "GET", PLAYER + "?market=US", null, handleCurrentlyPlayingResponse );
}

function handleCurrentlyPlayingResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if ( data.item != null ){
            document.getElementById("albumImage").src = data.item.album.images[0].url;
            document.getElementById("trackTitle").innerHTML = data.item.name;
            document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
        }
        if ( data.device != null ){
            // select device
            currentDevice = data.device.id;
            document.getElementById('devices').value=currentDevice;
        }
        if ( data.context != null ){
            // select playlist
            currentPlaylist = data.context.uri;
            currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
            document.getElementById('playlists').value=currentPlaylist;
        }
    }
    else if ( this.status == 204 ){

    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}


/*
var Sonidos= [65, 69,73, 77, 82, 87, 92, 97, 103, 110, 116, 123, 261,277,293,311,329,349,369,392,415,440,466,493];
var context = new (window.AudioContext || window.webkitAudioContext)();
function Sonido(nota){
  var osc = context.createOscillator();
  osc.type = 'sawtooth'; 
  osc.frequency.value=Sonidos[nota];
  osc.connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + .35);
}
Styles | tecla presionada 
var do3 = document.getElementById('do3')
var doh3 = document.getElementById('do#3')
var re3 = document.getElementById('re3')
var reh3 = document.getElementById('re#3')
var mi4 = document.getElementById('mi3')
var mih3 = document.getElementById('mi#3')
var fa3 = document.getElementById('fa3')
var sol3 = document.getElementById('sol3')
var solh3 = document.getElementById('sol#3')
var la3 = document.getElementById('la3')
var lah3 = document.getElementById('la#3')
var si3 = document.getElementById('si3')

var do4 = document.getElementById('do4')
var tcl2 = document.getElementById('do#4')
var re4 = document.getElementById('re4')
var tcl3 = document.getElementById('re#4')
var mi4 = document.getElementById('mi4')
var tcl4 = document.getElementById('mi#4')
var fa4 = document.getElementById('fa4')
var sol4 = document.getElementById('sol4')
var tcl5 = document.getElementById('sol#4')
var la4 = document.getElementById('la4')
var tcl6 = document.getElementById('la#4')
var si4 = document.getElementById('si4')
function myFunction(event) {
  var x = event.key;
  var y = event.keyup;
  console.log(`La tecla presionada fue: ${x}`) 
  if(x == 'q' || x == 'Q'){
    do3.setAttribute('class', 'whitePres b')
    Sonido(0)
  }
  setTimeout(function(){do3.setAttribute('class', 'white b')}, 250);  

  if(x == '2'){
    doh3.setAttribute('class', 'blackPress')
    Sonido(1)
  }
  setTimeout(function(){doh3.setAttribute('class', 'black as')}, 250);
  
  if(x == 'w' || x == 'W'){
    re3.setAttribute('class', 'whitePres a')
    Sonido(2)
  }
    setTimeout(function(){re3.setAttribute('class', 'white a')}, 250);
  
  if(x == '3'){
    reh3.setAttribute('class', 'blackPress')
    Sonido(3)
  }
     setTimeout(function(){reh3.setAttribute('class', 'black gs')}, 250);
  if(x == 'e'){
    mi3.setAttribute('class', 'whitePres g')
    Sonido(4) 
  }
    setTimeout(function(){mi3.setAttribute('class', 'white g')}, 250);
  if(x == '4'){
    mih3.setAttribute('class', 'blackPress')
    Sonido(5)
  }
    setTimeout(function(){mih3.setAttribute('class', 'black fs')}, 250);
  if(x == 'r' || x == 'R'){
    fa3.setAttribute('class', 'whitePres f')
    Sonido(6) 
  }
    setTimeout(function(){fa3.setAttribute('class', 'white f')}, 250);
  if(x == 't'){
    sol3.setAttribute('class', 'whitePres e')
    Sonido(7) 
  }
    setTimeout(function(){sol3.setAttribute('class', 'white e')}, 250);
  if(x == '6'){
    solh3.setAttribute('class', 'blackPress')
    Sonido(8)
  }
    setTimeout(function(){solh3.setAttribute('class', 'black ds')}, 250);
  if(x == 'y'){
    la3.setAttribute('class', 'whitePres d')
    Sonido(9)
  }
    setTimeout(function(){la3.setAttribute('class', 'white d')}, 250);
  if(x == '7'){
    lah3.setAttribute('class', 'blackPress')
    Sonido(10)
  }
    setTimeout(function(){lah3.setAttribute('class', 'black cs')}, 250);
  if(x == 'u' || x == 'U'){
    si3.setAttribute('class', 'whitePres c')
    Sonido(11)
  }
    setTimeout(function(){si3.setAttribute('class', 'white c')}, 250);

    if(x == 'z' || x == 'Z'){
    do4.setAttribute('class', 'whitePres b')
    Sonido(12)
  }
  setTimeout(function(){do4.setAttribute('class', 'white b')}, 250);  

  if(x == 's'){
    tcl2.setAttribute('class', 'blackPress')
    Sonido(13)
  }
  setTimeout(function(){tcl2.setAttribute('class', 'black as')}, 250);
  
  if(x == 'x'){
    re4.setAttribute('class', 'whitePres a')
    Sonido(14)
  }
    setTimeout(function(){re4.setAttribute('class', 'white a')}, 250);
  
  if(x == 'd'){
    tcl3.setAttribute('class', 'blackPress')
    Sonido(15)
  }
     setTimeout(function(){tcl3.setAttribute('class', 'black gs')}, 250);
  if(x == 'c'){
    mi4.setAttribute('class', 'whitePres g')
    Sonido(16) 
  }
    setTimeout(function(){mi4.setAttribute('class', 'white g')}, 250);
  if(x == 'f'){
    tcl4.setAttribute('class', 'blackPress')
    Sonido(17)
  }
    setTimeout(function(){tcl4.setAttribute('class', 'black fs')}, 250);
  if(x == 'v'){
    fa4.setAttribute('class', 'whitePres f')
    Sonido(18) 
  }
    setTimeout(function(){fa4.setAttribute('class', 'white f')}, 250);
  if(x == 'b'){
    sol4.setAttribute('class', 'whitePres e')
    Sonido(19) 
  }
    setTimeout(function(){sol4.setAttribute('class', 'white e')}, 250);
  if(x == 'h'){
    tcl5.setAttribute('class', 'blackPress')
    Sonido(20)
  }
    setTimeout(function(){tcl5.setAttribute('class', 'black ds')}, 250);
  if(x == 'n'){
    la4.setAttribute('class', 'whitePres d')
    Sonido(21)
  }
    setTimeout(function(){la4.setAttribute('class', 'white d')}, 250);
  if(x == 'j'){
    tcl6.setAttribute('class', 'blackPress')
    Sonido(22)
  }
    setTimeout(function(){tcl6.setAttribute('class', 'black cs')}, 250);
  if(x == 'm'){
    si4.setAttribute('class', 'whitePres c')
    Sonido(23)
  }
    setTimeout(function(){si4.setAttribute('class', 'white c')}, 250);
}*/