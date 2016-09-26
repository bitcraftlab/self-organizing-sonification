///////////////////////////////////////////////////
//                                               //
//   P 5 . J S    E X A M P L E   S K E T C H    //
//                                               //
///////////////////////////////////////////////////

// Example for a sketch, that has all the sections.
// Feel free to copy and paste!

// @bitcraftlab 2016


///////////////////////////////////////////////////
//                 PARAMETERS                    //
///////////////////////////////////////////////////

// default diameter for bubbles
var d = 200;


///////////////////////////////////////////////////
//                 GLOBAL VARIABLES              //
///////////////////////////////////////////////////

// global reference to my bubble
var mybubble;


///////////////////////////////////////////////////
//                 MAIN CODE                     //
///////////////////////////////////////////////////

// to set everything up, make a canvas that fills the entire window
function setup() {

  // create the drawing canvas
  createCanvas(windowWidth, windowHeight);

  // create a random color for the bubble
  var c = color(random(255), random(255), random(255));

  // create a bubble object
  mybubble = new Bubble(d, c);

  // move it to the center of the screen
  mybubble.moveto(width/2, height/2);


}


// the draw function is called 60 times per second!
function draw() {
  background(255);
  mybubble.draw();
}


///////////////////////////////////////////////////
//                 INTERACTION                   //
///////////////////////////////////////////////////


function windowResized() {

  // adjust canvas to fill the entire window
  resizeCanvas(windowWidth, windowHeight);

  // re-center the bubble
  mybubble.moveto(width/2, height/2);

}


///////////////////////////////////////////////////
//                 MY FUNCTIONS                  //
///////////////////////////////////////////////////

// draw a circles with diamater at positon (x, y) with radius r
function circle(x, y, r) {

  // calculate diameter
  var d = 2 * r;

  // draw the circle
  ellipse(x, y, d, d);

}


///////////////////////////////////////////////////
//                 MY CLASSES                    //
///////////////////////////////////////////////////

// constructor for the bubble object:

// creates a bubble with the given diameter and color
function Bubble(d, c) {

  // assign diameter and color
  this.d = d;
  this.c = c;

  //assign default coordinates
  this.x = 0;
  this.y = 0;

}


// method to update the position of the bubble
Bubble.prototype.moveto = function(x, y) {

  this.x = x;
  this.y = y;
  
};


// method to draw the bubble using our own circle function
Bubble.prototype.draw = function() {

  // set fill color
  fill(this.c);

  // set stroke style
  stroke(0); strokeWeight(1);

  // draw the circle
  circle(this.x, this.y, this.d / 2);

};
