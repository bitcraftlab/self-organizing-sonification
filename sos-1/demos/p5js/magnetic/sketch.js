
///////////////////////////////////////////////////
//                                               //
//                 Magnetic Bubbles              //
//                                               //
///////////////////////////////////////////////////

// (c) Martin Schneider 2010 - 2016

///////////////////////////////////////////////////
//                 PARAMETERS                    //
///////////////////////////////////////////////////

// color theme is dark
var dark = true;

// activate physics
var assemble = true;

// is the simulation running?
var paused = false;

// collision detection iteration cycles
var maxiter = 1;

// minimum radius of the bubble
var minsize = 8;

// maximum radius of the bubble
var maxsize = 50;

// cellwall thickness
var cellwall = 8;

// speed of bubble movement
var speed = 5;

// speed of gravity
var gravity = 5;

// number of bubbles, after which the color cycle should repeat
var cycle = 100;


///////////////////////////////////////////////////
//                 GLOBAL VARIABLES              //
///////////////////////////////////////////////////

var bubbles = [];
var bblcount = 0;

// color variables
var bg0, bg1, c1, c2, cw1, cw2;


///////////////////////////////////////////////////
//                 MAIN CODE                     //
///////////////////////////////////////////////////

function setup() {

  frameRate(30);

  createCanvas(windowWidth, windowHeight);
  noStroke();

  // background colors
  bg0 = color(0, 90);
  bg1 = color(255, 90);

  // red and blue cells
  c1  = color("#ff6666");
  c2  = color("#6666ff");

  // shaded colors for the cell walls
  cw1 = color(red(c1), green(c1), blue(c1), 128);
  cw2 = color(red(c2), green(c2), blue(c2), 128);

  // a little hack to prevent context menus in chrome
  canvas.oncontextmenu = function () {
     return false;
  };

}


function draw() {

  if(!paused) {

    var n = bubbles.length;

    // blur background
    fill(dark ? bg0 : bg1);
    rect(0, 0, width, height);

    // move bubbles
    for(var i = 0; i < n; i++) {
       bubbles[i].move();
    }

    // resolve collisions
    for(var cc = 0; cc < maxiter; cc++) {
      for(i = 0; i < n; i++) {
        bubbles[i].collides();
      }
    }

    // draw bubbles
    for(i = 0; i < n; i++) {
      bubbles[i].draw();
    }

    // user interaction for adding bubbles
    interaction();

  }

}


///////////////////////////////////////////////////
//                 INTERACTION                   //
///////////////////////////////////////////////////

// adjust canvas to fill the entire window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(dark ? 0 : 255);
}

// keyboard interaction
function keyTyped() {

  switch(key) {

    // [SPACE] to toggle attraction
    case ' ':
      assemble = !assemble;
      break;

    // [p] to play / pause
    case 'p':
      paused = !paused;
      break;

    // [c] for color scheme
    case 'c':
      dark = !dark;
      break;

    // [+] for faster
    case '+':
      speed++;
      break;

    // [-] for slower
    case '-':
      speed--;
      break;

    // [r] for reset
    case 'r':
      bubbles = [];
      bblcount = 0;
      break;

  }

  // add speed limit
  speed = constrain(speed, 1, 2 * minsize);

}


// to start creating a new bubble press the mouse button
function mousePressed() {

  // store the position where the mouse was pressed
  x1 = mouseX;
  y1 = mouseY;

  // set the radius of the bubble to be added
  r = minsize;

}



///////////////////////////////////////////////////
//                 MY FUNCTIONS                  //
///////////////////////////////////////////////////

// mouse interaction, called explicitly from the draw loop
function interaction() {

  if(mouseIsPressed) {

    // draw bubble cursor at the current position
    bubble(x1, y1, r, mouseButton == LEFT ? c1 : c2, mouseButton == LEFT ? cw1 : cw2);

  }

}


// change the radius of the bubble to be created
function mouseDragged() {
  r = constrain(dist(x1, y1, mouseX, mouseY), minsize, maxsize);
}


// add a new bubble to the screen as soon as we release the mousebutton
function mouseReleased() {

  println("released");

  // set charge of the bubble
  // (left mouse button = plus, right mouse button = minus)
  var charge = (mouseButton === LEFT) ? +1 : -1;

  // create a new bubble and add it to the scene
  bubbles.push(new Bubble(x1, y1, r, charge));

}


// draw a bubble at (x, y) with radius r
function bubble(x, y, r,  cellColor, wallColor) {

  // draw cell wall
  fill(wallColor);
  ellipse(x, y, 2*r, 2*r);

  // draw cell core
  fill(cellColor);
  ellipse(x, y, 2*r - cellwall, 2*r - cellwall);

}


///////////////////////////////////////////////////
//                 MY CLASSES                    //
///////////////////////////////////////////////////

// create a bubble at position (x, y) with radius r, with the given charge.
function Bubble(x, y, r, charge) {

  this.x = x;
  this.y = y;
  this.r = r;

  this.charge = charge;

  // assign cell color based on charge
  this.cellColor = charge > 0 ? c1 : c2;

  // use a slightly transparent shade for the wall color
  this.wallColor = charge > 0 ? cw1 : cw2;

}


// move the bubble according to our rules
Bubble.prototype.move = function() {

    // only apply physics if we are in assemble mode ...
    if(assemble) {

      // attract to opposite charges
      var n = bubbles.length;

      // interact with all other bubbles
      for(var i = 0; i < n; i++)  {

        var a = bubbles[i];

        // do not interact with your self
        if(a===this) continue;

        // distance between the bubbles
        var d = dist(this.x, this.y, a.x, a.y);

        // sum of the radii
        var rr = this.r + a.r;

        // force based on squares of radii, and distances of the bubbles
        // make sure to add a speed limit!
        var dd = min(rr * rr / d / d * a.r * a.r / this.r / this.r, speed);

        // attraction / repulsion force
        var f = (this.charge != a.charge) ? dd : -dd;

        // update positions
        this.x += f * (a.x - this.x) / d ;
        this.y += f * (a.y - this.y) / d;

      }

    }

    // otherwise just add gravity
    else {
      this.y += gravity;
    }

  };


// method to check for collisions
Bubble.prototype.collides = function() {

  var check = false;

  // check for bubble collisions
  for(var i = 0; i < bubbles.length; i++)  {
    if(this.collidesWith(bubbles[i])) {
      check = true;
    }
  }

  // check for collision with the left wall
  if(this.x < this.r)  {
    this.x = this.r ;
    check = true;
  }

  // check for collision with the right wall
  if(this.x > width - this.r) {
    this.x = width - this.r;
    check = true;
  }

  // check for collison with the top wall
  if(this.y < this.r) {
    this.y = this.r;
    check = true;
  }

  // check for collisions with the bottom wall
  if(this.y > height - this.r) {
    this.y = height - this.r;
    check = true;
  }

  return check;

};


// check for collision with bubble 'a'
Bubble.prototype.collidesWith = function (a) {

  // no self collision
  if(a == this) {
    return false;
  }

  var d = dist(this.x, this.y, a.x, a.y);
  var rr =  this.r + a.r;

  // correct bubble positions, if the bubbles collide
  if (d < rr) {

    // relative amount of overlap
    var t = (rr-d) / rr;

    // vector components in x and y direction
    var dx =  t * (this.x - a.x) / 2;
    var dy =  t * (this.y - a.y) / 2;

    // move this bubble half the distance
    this.x += dx;
    this.y += dy;

    // move other bubble half the distance
    a.x -= dx;
    a.y -= dy;

    return true;

  }

  return false;

};

// method to draw the bubble on screen
Bubble.prototype.draw = function() {

  // call our custom bubble function
  bubble(this.x, this.y, this.r, this.cellColor, this.wallColor);

};
