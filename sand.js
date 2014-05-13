var canvas;
var context;

var sand;
var chance=0.5;
var speed=50;
function heapGrain(i) {
    grain = sand.falling[i];
    sand.falling.splice(i,1);
    grain.falling=false;
    sand.heap[grain.x]--;
}

function updateSand() {
    for (var i=sand.falling.length-1;i>=0;i--) {
	var grain = sand.falling[i];

	if (grain.y == canvas.height()-1) { //we have reached the bottom
	    heapGrain(i);
	    continue;
	}
	
	// Not at the bottom yet. Check one pixel below for sand.
	var below = (sand.heap[grain.x] == grain.y+1);
	if (below) {
	    //check left and right too
	    var left = (sand.heap[grain.x-1] > grain.y+1);
	    var right = (sand.heap[grain.x+1] > grain.y+1);

	    if (left && right) {
		var lt=chance;var rt=2*chance;
	    } else if (left) {
		var lt=2*chance;var rt=0;
	    } else if (right) {
		var lt=0;var rt=2*chance;
	    } else {
		var lt=0;var rt=0;
	    }

	    var rand = Math.random();

	    if (rand < lt) {
		grain.x--;
		grain.y++;
	    } else if (rand < rt) {
		grain.x++;
		grain.y++;
	    } else {
		heapGrain(i);
	    }
	} else { // Nothing below, just fall down one
	    grain.y++;
	}
    }
}

var falltimer;
function initSand() {
    sand =
	{source: canvas.width()/2,
	 sourceActive: false,
	 falling: [],
	 heap: []};

    for (var i=0;i<canvas.width();i++) {
	sand.heap[i] = canvas.height();
    }

    fallTimer=window.setInterval(updateSand,10);
}


function dropGrain() {
    grain = {x: sand.source,
	     y: 10,
	     falling: true};
    sand.falling.push(grain);
}

var dropEvent;
function toggleSand() {
    if (dropEvent) {
	window.clearInterval(dropEvent);
	dropEvent=null;
    }
    sand.sourceActive = !sand.sourceActive;
    if (sand.sourceActive) {
	dropEvent=window.setInterval(dropGrain,speed);
    }
}




function drawSource() {
    var source = sand.source;
    context.beginPath();
    context.moveTo(source-10,5);
    context.lineTo(source-10,15);
    context.moveTo(source+10,5);
    context.lineTo(source+10,15);
    context.stroke();
}

function drawSand() {
    context.fillStyle="#000";
    context.beginPath();
    for(var i=0;i<sand.falling.length;i++){
	var grain = sand.falling[i];
	context.fillRect(grain.x,grain.y,1,1);
    }



    for (var x=0;x<sand.heap.length;x++){
	for(var y=sand.heap[x];y<canvas.height();y++) {
	    context.fillRect(x,y,1,1);
	}
    }
    context.stroke();

	    
}

function clearCanvas() {
    context.fillStyle = "#eef";
    context.fillRect(0,0,canvas.width(),canvas.height());
}


    

function draw(ts) {
    clearCanvas();
    drawSource();
    drawSand();
    window.requestAnimationFrame(draw);
}
    
function mouseMoved(event) {
    sand.source=event.pageX - canvas.offset().left;
}

function setupCanvas() {
    canvas = $('canvas');
    context = canvas.get(0).getContext('2d');

    canvas.mousemove(mouseMoved);
    canvas.click(toggleSand);
    initSand();
    draw();
}
