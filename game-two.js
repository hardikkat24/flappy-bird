var flappyBird;
var obstacles=[];
var score;

//To go up on clicking
//accelerate function to be defined later
//document.getElementById("game-body").addEventListener ("click", accelerate(-0.3), false);

function startFlappyBird() {
    flappyBird= new component(30,30,"red",10,120);
    flappyBird.gravity = 0.08;
    score = new component("30px", "Consolas", "black", 280, 40, "text");
    gameArea.start();
}

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 680;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        updateGameArea();
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = gameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj){
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);

        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea(){
    var x, y, gap, minHeight, maxHeight, minGap, maxGap;
    for(i = 0; i< obstacles.length; i = i + 1)
    {
        if(flappyBird.crashWith(obstacles[i]))
            return;
    }
    
    gameArea.clear();
    gameArea.frameNo += 1;
    if(gameArea.frameNo == 1 || everyinterval(150)){
        x = gameArea.canvas.width;
        y = gameArea.canvas.height;

        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight - minHeight +1) + minHeight);

        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap - minGap + 1) + minGap);

        obstacles.push(new component(10, height, 'green', x, 0));
        obstacles.push(new component(10, y - height - gap, 'green', x, height + gap));

    }

    for(i = 0; i < obstacles.length; i= i+1)
    {
        obstacles[i].x += -1;
        obstacles[i].update()
    }

    score.text = gameArea.frameNo;
    score.update();
    flappyBird.newPos();
    flappyBird.update();
}

function everyinterval(n)
{
    if((gameArea.frameNo/n)%1 == 0)
        return true;
    
    return false;
}
function accelerate(n) {
    if(!gameArea.interval) {
        gameArea.interval=setInterval(updateGameArea,20);
    }

    flappyBird.gravity=n;

}
