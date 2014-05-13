var canvas;
var context;

var sand;

function heapGrain(i) {
    grain = sand.falling[i];
    grain.falling=false;
    sand.heap[[grain.x,grain.y]] = grain;
    sand.falling.splice(i,1);
}

function updateSand() {
    for (var i=sand.falling.length-1;i>=0;i--) {
	var grain = sand.falling[i];

	if (grain.y == canvas.height()-1) { //we have reached the bottom
	    heapGrain(i);
	    continue;
	}
	
	// Not at the bottom yet. Check one pixel below for sand.
	var below = sand.heap[[grain.x,grain.y+1]];
	if (below) {
	    //check left and right too
	    var left = sand.heap[[grain.x-1,grain.y+1]];
	    var right = sand.heap[[grain.x+1,grain.y+1]];

	    if (!left && !right) {
		var lt=0.495;var rt=0.99;
	    } else if (left) {
		var lt=0;var rt=0.90;
	    } else if (right) {
		var lt=0.99;var rt=0.0;
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
	 grains: [],
	 falling: [],
	 heap: {}};

    fallTimer=window.setInterval(updateSand,10);
}


function dropGrain() {
    grain = {x: sand.source,
	     y: 10,
	     falling: true};
    sand.grains.push(grain);
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
	dropEvent=window.setInterval(dropGrain,50);
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
    for(var i=0;i<sand.grains.length;i++){
	var grain = sand.grains[i];
	context.fillRect(grain.x,grain.y,1,1);
    }
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
