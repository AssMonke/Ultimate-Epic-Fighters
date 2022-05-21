const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = "800";
canvas.height = "600";

const renderRate = 10;

var input = [];
var handleInput = (event) => { input[event.keyCode] = event.type == 'keydown'; }
document.addEventListener('keydown', handleInput);
document.addEventListener('keyup', handleInput);

const fighterSize = 0.5;
const movementSpeed = 2;

const floor = document.getElementById("floor");

const frames = 
[
    [document.getElementById("upPre"), -50, 0],//img, x offset, y offset
    [document.getElementById("upMid"), 0, -100],
    [document.getElementById("upPost"), 0, 0],
    [document.getElementById("upBlock"), 0, 0],
    [document.getElementById("sidePre"), 0, 0],
    [document.getElementById("sideMid"), 0, 0],
    [document.getElementById("sidePost"), 0, 0],
    [document.getElementById("sideBlock"), 0, 0],
    [document.getElementById("stabPre"), 0, -30],
    [document.getElementById("stabMid"), 0, 0],
    [document.getElementById("stabPost"), 0, 0],
    [document.getElementById("stabBlock"), 0, 0],
    [document.getElementById("moveRight"), 0, 0],
    [document.getElementById("moveLeft"), 0, 0],
    [document.getElementById("idle"), 0, 0],
    [document.getElementById("dead"), 0, 100]
]
const hitSfx = document.getElementById("hit");
const swingSfx = document.getElementById("swing");
const parrySfx = document.getElementById("parry");

var player1 = new Player(frames[14], -20, 365, 0, 1, "Player 1");
var player2 = new Player(frames[14], 820, 365, 0, -1, "Player 2");

var endGame = false;
var winner = null;

function Render()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear

    ctx.drawImage(floor, 0, 300, 800, 300);

    player1.update();
    player2.update();

    if(endGame)
    {
        ctx.fillStyle = 'white';
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText(winner.name + " Wins!", 400, 100);
        let looser = player1 == winner ? player2 : player1;
        looser.ref = frames[15];//incase
        return;
    }

    if(input[65] && player1.x > -20){player1.x-=movementSpeed;}
    if(input[68] && player1.x < 650 && player2.x-player1.x > 200){player1.x+=movementSpeed;}
    if(input[87] && !player1.isAttacking && !player1.isParrying){Attack(player1, 0);player1.isAttacking = true;}
    if(input[69] && !player1.isAttacking && !player1.isParrying){Attack(player1, 1);player1.isAttacking = true;}
    if(input[83] && !player1.isAttacking && !player1.isParrying){Attack(player1, 2);player1.isAttacking = true;}
    if(input[81] && player1.isWindup){player1.ref = frames[14]; player1.feint();}
    if(input[70] && player1.canParry){Parry(player1, player1.lastAttackDir);}

    if(input[37] && player2.x > -20 && player2.x-player1.x > 200){player2.x-=movementSpeed;}
    if(input[39] && player2.x < 820){player2.x+=movementSpeed;}
    if(input[38] && !player2.isAttacking && !player2.isParrying){Attack(player2, 0);player2.isAttacking = true;}
    if(input[190] && !player2.isAttacking && !player2.isParrying){Attack(player2, 1);player2.isAttacking = true;}
    if(input[40] && !player2.isAttacking && !player2.isParrying){Attack(player2, 2);player2.isAttacking = true;}
    if(input[222] && player2.isWindup){player2.ref = frames[14]; player2.feint();}
    if(input[191] && player2.canParry){Parry(player2, player2.lastAttackDir);}

    if(player2.x-player1.x < 300){ //attacking distance
        if(player1.attacked && (!player2.isParrying || player2.currentDirection != player1.currentDirection)){
            player2.ref = frames[15];
            endGame = true;
            winner = player1;
            setTimeout(()=>{location.reload();}, 3000);
            hitSfx.play();
            return;
        }
        else if(player1.attacked){
            parrySfx.play();
            player1.attacked = false;
        }

        if(player2.attacked && (!player1.isParrying || player1.currentDirection != player2.currentDirection)){
            player1.ref = frames[15];
            endGame = true;
            winner = player2;
            setTimeout(()=>{location.reload();}, 3000);
            hitSfx.play();
            return;
        }
        else if(player2.attacked){
            parrySfx.play();
            player2.attacked = false;
        }
    }
}
window.setInterval(Render, renderRate);

function Attack(player, dir)
{
    player.lastAttackDir = dir;
    switch(dir)
    {
        case 0:
            player.ref = frames[0];
            player.isWindup = true;
            player.windup = setTimeout(()=>
            { 
                player.currentDirection = dir;
                player.ref = frames[1];
                player.isWindup = false;
                setTimeout(()=>
                { 
                    player.ref = frames[2]; 
                    player.attacked = true;
                    setTimeout(()=>
                    { 
                        player.ref = frames[14]; 
                        player.attacked = false;
                        setTimeout(()=>{player.isAttacking = false;}, 200);
                    }, 250); 
                }, 325); 
            }, 500);

            break;
        
        case 1:
            player.ref = frames[4];
            player.isWindup = true;
            player.windup = setTimeout(()=>
            { 
                player.currentDirection = dir;
                player.ref = frames[5];
                player.isWindup = false;
                setTimeout(()=>
                { 
                    player.ref = frames[6]; 
                    player.attacked = true;
                    setTimeout(()=>
                    { 
                        player.ref = frames[14]; 
                        player.attacked = false;
                        setTimeout(()=>{player.isAttacking = false;}, 200);
                    }, 250); 
                }, 325); 
            }, 500);

            break;

        case 2:
            player.ref = frames[8];
            player.isWindup = true;
            player.windup = setTimeout(()=>
            { 
                player.currentDirection = dir;
                player.ref = frames[9];
                player.isWindup = false;
                setTimeout(()=>
                { 
                    player.ref = frames[10]; 
                    player.attacked = true;
                    setTimeout(()=>
                    { 
                        player.ref = frames[14]; 
                        player.attacked = false;
                        setTimeout(()=>{player.isAttacking = false;}, 200);
                    }, 250); 
                }, 300); 
            }, 550);

            break;
    }
}

function Parry(player, dir)
{
    player.feint();
    switch(dir)
    {
        case 0:
            player.ref = frames[3];
            player.isParrying = true;
            player.canParry = false;
            player.currentDirection = dir;
            setTimeout(()=>
            { 
                player.ref = frames[14];
                player.isParrying = false;
                setTimeout(()=>{player.canParry = true;},800);
            }, 400);

            break;
        
        case 1:
            player.ref = frames[7];
            player.isParrying = true;
            player.canParry = false;
            player.currentDirection = dir;
            setTimeout(()=>
            { 
                player.ref = frames[14];
                player.isParrying = false;
                setTimeout(()=>{player.canParry = true;},800);
            }, 400);

            break;

        case 2:
            player.ref = frames[11];
            player.isParrying = true;
            player.canParry = false;
            player.currentDirection = dir;
            setTimeout(()=>
            { 
                player.ref = frames[14];
                player.isParrying = false;
                setTimeout(()=>{player.canParry = true;},800);
            }, 400);

            break;
    }
}

function Player(ref, x, y, angle, flip, name)
{
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.ref = ref;
    this.flip = flip;
    this.name = name;

    this.isAttacking = false;
    this.attacked = false;
    this.currentDirection = 0;
    this.isWindup = false;
    this.windup = null;
    this.canceledAttack = false;
    this.isParrying = false;
    this.canParry = true;
    this.lastAttackDir = 0;

    this.feint = () =>
    {
        this.isWindup = false;
        this.isAttacking = false;
        this.canceledAttack = false;
        clearTimeout(this.windup);
    }

    this.update = function update()
    {
        let w = this.ref[0].naturalWidth*fighterSize;
        let h =this.ref[0].naturalHeight*fighterSize;

        ctx.translate(this.x+this.ref[1]*this.flip, this.y+this.ref[2]);

        ctx.scale(this.flip,1);
    
        ctx.drawImage(this.ref[0], 0, 0, w, h);

        ctx.setTransform(1,0,0,1,0,0);
    }
}