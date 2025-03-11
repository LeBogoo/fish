let fish;
let fishCount = 10;

let isPressed = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    fish = new Array(fishCount).fill().map(e => {
        let size = random(0.5, 1.5);
        let speed = (2 - size) * 4;
        return new Fish(createVector(random(width), random(height)), random(0.5, 1.5), speed)
    });
}

function draw() {
    background(40, 44, 52);

    fish.forEach(f => {
        if (isPressed) {
            f.foodPos = createVector(mouseX, mouseY);
            f.speedMultiplier = 2;
        }
        f.resolve();
        f.draw();
    });
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