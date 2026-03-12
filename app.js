const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let x = 300;

document.addEventListener("keydown", move);

function move(e){

if(e.key === "ArrowLeft"){
x -= 20;
}

if(e.key === "ArrowRight"){
x += 20;
}

draw();
}

function draw(){

ctx.clearRect(0,0,600,600);

ctx.fillStyle = "white";
ctx.fillRect(x,550,40,40);

}

draw();
