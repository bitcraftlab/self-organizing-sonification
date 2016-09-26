
    ///////  t a p e w o r m  ////////////  ///////
                                       //  //   //
                                      //////    ///////
                                                    //
      ////// (c) martin schneider 2010 ////// ///////
     //
    //////     //////////////////     /////////  ///////
       //     //              //     //     //  //   //
      //     ///////////     /////////     //////   //
     //                                            //
    //////// p5.js version 2016 ////////////////////


    ///////////////////////////////////////////////////
   //                 PARAMETERS                    //
  ///////////////////////////////////////////////////

// color theme is dark
var dark = true;

// activate physics
var assemble = true;

// collision detection iteration cycles
var maxiter = 10;

// radius of the bubble
var bblsize = 8;

// cellwall thickness
var cellwall = 8;

// speed of bubble movement
var speed = 5;

// speed of gravity
var gravity = 5;

// number of bubbles, after which the color cycle should repeat
var cycle = 100;

// a variable that controls if the simulation is running
var paused = false;


    ///////////////////////////////////////////////////
   //                 GLOBAL VARIABLES              //
  ///////////////////////////////////////////////////

var bubbles = [];
var bblcount = 0;

// color variables
var bg0, bg1, c1,c2;


    ///////////////////////////////////////////////////
   //                 MAIN CODE                     //
  ///////////////////////////////////////////////////

function setup() {

  createCanvas(windowWidth, windowHeight);
  noStroke();

  // create color objects
  bg0 = color(0, 45);
  bg1 = color(255, 45);
  c1  = color("#ff6666");
  c2  = color("#6666ff");

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
  speed = constrain(speed, 1, 2*bblsize);

}


    ///////////////////////////////////////////////////
   //                 MY FUNCTIONS                  //
  ///////////////////////////////////////////////////

// mouse interaction, called explicitly from the draw loop
function interaction() {

  if(mouseIsPressed) {

    // create a new bubble at the mouse pointer position
    var b = new Bubble(mouseX, mouseY, bblsize, bblcount);

    // let's only add the bubble if no collision occurs
    if(!b.collides()) {
      bubbles.push(b);
      bblcount++;
    }

  }

}


// draw a bubble at (x, y) with radius r
function bubble(x, y, r,  cellColor, wallColor) {

  // draw cell wall
  fill(wallColor);
  ellipse(x, y, 2*r, 2*r);

  // draw cell core
  fill(cellColor);
  ellipse(x, y, 2*r-cellwall, 2*r-cellwall);

}


    ///////////////////////////////////////////////////
   //                 MY CLASSES                    //
  ///////////////////////////////////////////////////

// create a bubble at position (x, y) with radius r, with the given id.
function Bubble(x, y, r, c) {

  this.x = x;
  this.y = y;
  this.r = r;
  this.c = c;

  // pick a color cyling between c1 and c2
  var cc = lerpColor(c1, c2, 0.5 + sin(this.c * TWO_PI / cycle) * 0.5);

  // assign cell color
  this.cellColor = cc;

  // use a slightly transparent shade for the wall color
  this.wallColor = color(red(cc), green(cc), blue(cc), 128);

}


// move the bubble according to our rules
Bubble.prototype.move = function() {

    // only apply physics if we are in assemble mode ...
    if(assemble) {

      // attract to successor
      if(this.c != bblcount - 1) {

        // get the successor
        var a = bubbles[this.c + 1];

        // distance between the bubbles
        var d = dist(this.x, this.y, a.x, a.y);

        // horizontal motion vector
        this.x += speed * (a.x - this.x) / d;

        // vertical motion vector
        this.y += speed * (a.y - this.y) / d;
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

    // move the other bubble half the distance
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
