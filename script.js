/* ----ExtraFunctions----*/
var textBotonPlay = document.getElementById('play').textContent
var navegationPlayer = document.getElementById('playerNav')
console.log(textBotonPlay)
if(textBotonPlay=='play_arrow'){
    navegationPlayer.innerHTML ='<i style="cursor:pointer; color:white;" class="material-icons" onclick="previous()">skip_previous</i><i style="cursor:pointer; color:white;" class="material-icons" onclick="pause()" id="play">pause</i><i style="cursor:pointer; color:white;" class="material-icons" onclick="next()">skip_next</i>'
}
if(textBotonPlay=='pause'){
    navegationPlayer.innerHTML=`<i style="cursor:pointer; color:white;" class="material-icons" onclick="previous()">skip_previous</i>
    <i style="cursor:pointer; color:white;" class="material-icons" onclick="play()" id="play">play_arrow</i>
    <i style="cursor:pointer; color:white;" class="material-icons" onclick="next()">skip_next</i>`
    console.log(textBotonPlay)
}
console.log(textBotonPlay)