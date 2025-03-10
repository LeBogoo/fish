class Fish {
    constructor(origin, speed) {
        // 12 segments, first 10 for body, last 2 for caudal fin
        this.speed = speed;
        this.spine = new Chain(origin, 12, 16, PI / 8);
        this.bodyColor = color(58, 124, 165);
        this.finColor = color(129, 195, 215);
        this.bodyWidth = [16, 20, 21, 21, 19, 16, 13, 10, 8, 5];
    }

    resolve() {

        let headPos = this.spine.joints[0];

        this.target = p5.Vector.add(headPos, createVector(sin(frameCount / (this.speed * 3)), cos(frameCount / (this.speed * 3))).mult(100));

        let targetPos = p5.Vector.add(headPos, p5.Vector.sub(this.target, headPos).setMag(this.speed));
        this.spine.resolve(targetPos);
    }

    draw() {
        strokeWeight(4);
        stroke(255);

        ellipse(this.target.x, this.target.y, 10, 10);

        fill(this.finColor);

        let spineJoints = this.spine.joints;
        let spineAngles = this.spine.angles;

        let headToMid1 = relativeAngleDiff(spineAngles[0], spineAngles[6]);
        let headToMid2 = relativeAngleDiff(spineAngles[0], spineAngles[7]);

        let headToTail = headToMid1 + relativeAngleDiff(spineAngles[6], spineAngles[11]);


        this.drawPectoralFins(spineAngles);
        this.drawVentralFins(spineAngles);
        this.drawCaudalFins(headToTail, spineJoints, spineAngles);
        this.drawBody();
        this.drawDorsalFin(spineJoints, spineAngles, headToMid1, headToMid2);
        this.drawEyes();
    }

    drawPectoralFins(spineAngles) {
        push();
        translate(this.getPosX(3, PI / 3, 0), this.getPosY(3, PI / 3, 0));
        rotate(spineAngles[2] - PI / 4);
        ellipse(0, 0, 50, 20); // Right
        pop();
        push();
        translate(this.getPosX(3, -PI / 3, 0), this.getPosY(3, -PI / 3, 0));
        rotate(spineAngles[2] + PI / 4);
        ellipse(0, 0, 50, 20); // Left
        pop();

    }

    drawVentralFins(spineAngles) {
        push();
        translate(this.getPosX(7, PI / 2, 0), this.getPosY(7, PI / 2, 0));
        rotate(spineAngles[6] - PI / 4);
        ellipse(0, 0, 30, 10); // Right
        pop();
        push();
        translate(this.getPosX(7, -PI / 2, 0), this.getPosY(7, -PI / 2, 0));
        rotate(spineAngles[6] + PI / 4);
        ellipse(0, 0, 30, 10); // Left
        pop();
    }

    drawCaudalFins(headToTail, spineJoints, spineAngles) {
        beginShape();
        // "Bottom" of the fish
        for (let i = 8; i < 12; i++) {
            let tailWidth = 1.5 * headToTail * (i - 8) * (i - 8);
            curveVertex(spineJoints[i].x + cos(spineAngles[i] - PI / 2) * tailWidth, spineJoints[i].y + sin(spineAngles[i] - PI / 2) * tailWidth);
        }

        // "Top" of the fish
        for (let i = 11; i >= 8; i--) {
            let tailWidth = headToTail * 0.2;
            curveVertex(spineJoints[i].x + cos(spineAngles[i] + PI / 2) * tailWidth, spineJoints[i].y + sin(spineAngles[i] + PI / 2) * tailWidth);
        }
        endShape(CLOSE);
    }

    drawBody() {
        fill(this.bodyColor);

        beginShape();

        // Right half of the fish
        for (let i = 2; i < 10; i++) {
            curveVertex(this.getPosX(i, PI / 2, 0), this.getPosY(i, PI / 2, 0));
        }

        // Bottom of the fish
        curveVertex(this.getPosX(9, PI, 0), this.getPosY(9, PI, 0));

        // Left half of the fish
        for (let i = 9; i >= 0; i--) {
            curveVertex(this.getPosX(i, -PI / 2, 0), this.getPosY(i, -PI / 2, 0));
        }

        // Top of the head (completes the loop)
        curveVertex(this.getPosX(0, -PI / 6, 0), this.getPosY(0, -PI / 6, 0));
        curveVertex(this.getPosX(0, 0, 4), this.getPosY(0, 0, 4));
        curveVertex(this.getPosX(0, PI / 6, 0), this.getPosY(0, PI / 6, 0));

        // Some overlap needed because curveVertex requires extra vertices that are not rendered
        curveVertex(this.getPosX(0, PI / 2, 0), this.getPosY(0, PI / 2, 0));
        curveVertex(this.getPosX(1, PI / 2, 0), this.getPosY(1, PI / 2, 0));
        curveVertex(this.getPosX(2, PI / 2, 0), this.getPosY(2, PI / 2, 0));

        endShape(CLOSE);
    }

    drawDorsalFin(spineJoints, spineAngles, headToMid1, headToMid2) {
        fill(this.finColor);
        beginShape();
        vertex(spineJoints[4].x, spineJoints[4].y);
        bezierVertex(spineJoints[5].x, spineJoints[5].y, spineJoints[6].x, spineJoints[6].y, spineJoints[7].x, spineJoints[7].y);
        bezierVertex(spineJoints[6].x + cos(spineAngles[6] + PI / 2) * headToMid2 * 16, spineJoints[6].y + sin(spineAngles[6] + PI / 2) * headToMid2 * 16, spineJoints[5].x + cos(spineAngles[5] + PI / 2) * headToMid1 * 16, spineJoints[5].y + sin(spineAngles[5] + PI / 2) * headToMid1 * 16, spineJoints[4].x, spineJoints[4].y);
        endShape();
    }

    drawEyes() {
        fill(255);
        ellipse(this.getPosX(0, PI / 2, -2), this.getPosY(0, PI / 2, -2), 8, 8);
        ellipse(this.getPosX(0, -PI / 2, -2), this.getPosY(0, -PI / 2, -2), 8, 8);
    }

    debugDraw(size) {
        this.spine.draw(size);
    }

    // Various helpers to shorten lines

    getPosX(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].x + cos(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset);
    }

    getPosY(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].y + sin(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset);
    }
}
