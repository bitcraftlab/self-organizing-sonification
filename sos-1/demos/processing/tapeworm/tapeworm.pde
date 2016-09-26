
//  t a p e w o r m  ///////    ///////  ///////
                         //    //   //  //   //                   
                        ////////   //////   //////// (c) Martin Schneider 2010 - 2016 ////


color  bg0 = 0, bg1 = 255, c1 = #ff6666, c2 = #6666ff;
boolean dark = true, assemble = true;
int maxiter = 10;
int bblsize = 8;
int cellwall = 8;
int speed = 5;
int cycle = 100;

ArrayList bubbles = new ArrayList();
int bblcount;

void setup() {
  size(500, 500, P2D);
  noStroke();
}


void draw() {
  
  // blur background
  fill(dark ? bg0 : bg1, 50);
  rect(0, 0, width, height);
    
  // move bubbles
  int n = bubbles.size();
  for(int i=0; i<n; i++) getBubble(i).move();
  
  // resolve collisions
  for(int cc=0; cc<maxiter; cc++) {
    for(int i=0; i<n; i++) getBubble(i).collide();
  }
 
  // draw bubbles
  for(int i=0; i<n; i++) getBubble(i).draw();
  
  interaction();
  
}


/// user interaction 

void interaction() {  
  if(mousePressed) {
    Bubble b = new Bubble(mouseX, mouseY, bblsize, bblcount);
    if(!b.collide()) {
      bubbles.add(b);
      bblcount++;
    }
  }
}


void keyPressed() {
  switch(key) {
    case ' ': assemble = !assemble; break;
    case 'c': dark = !dark; break;
    case '+': speed++; break;
    case '-': speed--; break;
    case 'r': bubbles = new ArrayList(); bblcount = 0; break;
  }
  speed = constrain(speed, 1, 2*bblsize);
}


// helper functions

Bubble getBubble(int i) {
  return (Bubble) bubbles.get(i);
}

void bubble(float x, float y, float r, int n) {
  color c = lerpColor(c1, c2, .5 + sin(n * TWO_PI / cycle) *.5  );
  fill(c, 128); ellipse(x, y, 2*r, 2*r); // cell wall
  fill(c); ellipse(x, y, 2*r-cellwall, 2*r-cellwall); // cell core
}