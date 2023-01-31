const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope, fruit, ground, rope_1, rope_2
var fruit_con;
var fruit_con_2;
var mute_button
var blower

var bg_img;
var food;
var rabbit;

var button, button_1, button_2
var bunny;
var blink, eat, sad;

function preload() {
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  bg_sound = loadSound("sound1.mp3")
  cut_sound = loadSound("rope_cut.mp3")
  eat_sound = loadSound("eating_sound.mp3")
  air_sound = loadSound("air.wav")
  sad_sound = loadSound("sad.wav")

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}

function setup() {

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if(isMobile){
    canw = displayWidth
    canh = displayHeight
    createCanvas(displayWidth, displayHeight);
  }
  else{
    canw = windowWidth
    canh = windowHeight
    createCanvas(windowWidth, windowHeight)
  }
  frameRate(80);

  bg_sound.play()
  bg_sound.setVolume(0.2)

  engine = Engine.create();
  world = engine.world;

  button = createImg('cut_btn.png');
  button.position(20, 30);
  button.size(50, 50);
  button.mouseClicked(drop);

  button_1 = createImg('cut_btn.png')
  button_1.position(330, 35)
  button_1.size(50,50)
  button_1.mouseClicked(drop_1)

  button_2 = createImg('cut_btn.png')
  button_2.position(360, 200)
  button_2.size(50,50)
  button_2.mouseClicked(drop_2)

  mute_button = createImg('mute.png')
  mute_button.position(5, 5)
  mute_button.size(50, 50)
  mute_button.mouseClicked(mute)

  blower = createImg('blower.png')
  blower.position(0,215)
  blower.size(167, 120)
  blower.mouseClicked(air)

  rope = new Rope(7, { x: 40, y: 30 });
  rope_1 = new Rope(7, { x: 370, y: 40 });
  rope_2 = new Rope(7, { x: 400, y: 225 });
  ground = new Ground(canw, canh, displayWidth, 20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(420, canh-80, 100, 100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking', blink);

  bunny.addAnimation('eating', eat);
  bunny.addAnimation('crying', sad);
  bunny.changeAnimation('blinking');

  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con_1 = new Link(rope_1, fruit)
  fruit_con_2 = new Link(rope_2, fruit)

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);

}

function draw() {
  background(51);
  image(bg_img, width / 2, height / 2, displayWidth, displayHeight);

  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }

  rope.show();
  rope_1.show()
  rope_2.show()
  Engine.update(engine);
  ground.show();

  if (collide(fruit, bunny) == true) {
    bunny.changeAnimation('eating');
    eat_sound.play()
  }

  if (collide(fruit, ground.body) == true) {
    bunny.changeAnimation('crying');
    sad_sound.play()
    sad_sound.setVolume(1.3)
  }

  drawSprites();
}

function mute() {
  if (bg_sound.isPlaying) {
    bg_sound.stop()
  }
  else {
    bg_sound.play()
  }
}

function air(){
  Matter.Body.applyForce(fruit, {x : 0, y : 0}, {x : 0.02, y : 0})
  air_sound.play()
  air_sound.setVolume(0.3)
}

function drop() {
  rope.break();
  fruit_con.dettach();
  cut_sound.play()
  fruit_con = null;
}

function drop_1() {
  rope_1.break();
  fruit_con_1.dettach();
  cut_sound.play()
  fruit_con_1 = null;
}

function drop_2() {
  rope_2.break();
  fruit_con_2.dettach();
  cut_sound.play()
  fruit_con_2 = null;
}


function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    }
    else {
      return false;
    }
  }
}
