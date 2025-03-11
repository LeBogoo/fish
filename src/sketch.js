let fish;
let fishCount = 10;
let fishLifeTime = 60000;

let isPressed = false;
let isDebug = false;

if (localStorage.getItem('debug') === 'true') {
    isDebug = true;
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    fish = new Array(fishCount).fill().map((e, id) => {
        let size = random(0.5, 1.5);
        let speed = (2 - size) * 4;
        return new Fish(id, createVector(random(width), random(height)), size, speed)
    });

    setTimeout(() => {
        swapFish();
    }, fishLifeTime);
}

function draw() {
    background(40, 44, 52);

    fish.forEach((f) => {
        if (isPressed) {
            f.foodPos = createVector(mouseX, mouseY);
            f.speedMultiplier = 2;
        }
        f.resolve();
        f.draw();
        if (isDebug) {
            f.debugDraw();
        }
    });
}

function swapFish() {

    console.log('swapping fish');

    // get random position outside of the canvas
    let direction = random(0, 2 * PI);
    let pos = createVector(cos(direction) * width * 2, sin(direction) * height * 2);

    // get first fish
    let f = fish[0];
    f.foodPos = pos;
    f.onFoodEaten = () => {
        console.log("removed fish", f.id);
        fish = fish.filter(e => e.id !== f.id);
        setTimeout(() => {
            swapFish();
        }, fishLifeTime);
    }


    // create new fish outside of the canvas
    console.log('creating new fish');
    let size = random(0.5, 1.5);
    let speed = (2 - size) * 4;
    let newFish = new Fish(fishCount++, createVector(-pos.x, -pos.y), size, speed);
    fish.push(newFish);
}

function toggleDebug() {
    isDebug = !isDebug;
    localStorage.setItem('debug', isDebug);
}

function mousePressed() {
    isPressed = true;
}

function mouseReleased() {
    isPressed = false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}