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
/*-----Styles | tecla presionada -----*/
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
/*Revisar con keyup, keypress para el estilo de tecla presionada */
}
// se puede resumir con un for? Yo digo que seh | La parte de los if