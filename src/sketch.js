let chain;

function setup() {
    createCanvas(windowWidth, windowHeight);
    chain = new Fish(createVector(width / 2, height / 2), 5);
}

function draw() {
    background(40, 44, 52);

    chain.resolve();
    chain.draw();
    chain.debugDraw(10);

    // if (frameCount == 50) {
    //     noLoop();
    // }
}