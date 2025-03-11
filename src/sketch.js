let chain;

function setup() {
    createCanvas(windowWidth, windowHeight);
    chain = new Fish(createVector(width * 0.2, height * 0.5), 5);
}

function draw() {
    background(40, 44, 52);

    chain.resolve();
    chain.draw();
}