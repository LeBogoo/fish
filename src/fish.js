class Fish {
    constructor(id, origin, size, speed) {
        this.id = id;
        this.size = size
        // 12 segments, first 10 for body, last 2 for caudal fin
        this.speed = speed;
        this.spine = new Chain(origin, 12, 16 * this.size, PI / 8);
        // random color
        this.bodyColor = color(random(255), random(255), random(255));
        // lighter body color
        this.recalculateColors();
        this.bodyWidth = [16, 20, 21, 21, 19, 16, 13, 10, 8, 5].map(e => e * this.size);

        this.angle = 0;
        this.lerpSpeed = 0.025;
        this.speedMultiplier = 1;
        this.randomOffset = random(1000);

        this.spots = new Array(10).fill().map((_, i) => {
            if (random() > 0.25) {
                return null;
            }

            return {
                segment: i,
                angle: random(-PI, PI),
                size: random(20, 50)
            }
        }).filter(e => e !== null);


        this.foodPos = createVector(random(width), random(height));
    }

    recalculateColors() {
        this.spotColor = color(red(this.bodyColor) - 50, green(this.bodyColor) - 50, blue(this.bodyColor) - 50);
        this.finColor = color(red(this.bodyColor) + 50, green(this.bodyColor) + 50, blue(this.bodyColor) + 50);
    }

    resolve() {
        let headPos = this.spine.joints[0];

        let targetAngle = this.angle;

        this.speedMultiplier = max(1, this.speedMultiplier - 0.01);

        if (this.foodPos.dist(headPos) > (100 * this.size)) {

            targetAngle = atan2(this.foodPos.y - headPos.y, this.foodPos.x - headPos.x);
        } else {
            this.onFoodEaten();
        }


        // Normalize the angle difference
        let angleDiff = targetAngle - this.angle;
        while (angleDiff > PI) angleDiff -= TWO_PI;
        while (angleDiff < -PI) angleDiff += TWO_PI;

        this.angle += angleDiff * this.lerpSpeed;

        this.angle += sin((frameCount + this.randomOffset) / 20) * 0.025;


        let targetDir = createVector(cos(this.angle), sin(this.angle));

        // Move in target direction
        let targetPos = p5.Vector.add(headPos, targetDir.mult(this.speed * this.speedMultiplier));
        this.spine.resolve(targetPos);
    }

    onFoodEaten() {
        this.foodPos = createVector(random(width), random(height));
    }

    draw() {
        strokeWeight(2);
        stroke(255);

        let spineJoints = this.spine.joints;
        let spineAngles = this.spine.angles;

        let headToMid1 = relativeAngleDiff(spineAngles[0], spineAngles[6]);
        let headToMid2 = relativeAngleDiff(spineAngles[0], spineAngles[7]);

        let headToTail = headToMid1 + relativeAngleDiff(spineAngles[6], spineAngles[11]);


        this.drawPectoralFins(spineAngles);
        this.drawVentralFins(spineAngles);
        this.drawCaudalFins(headToTail, spineJoints, spineAngles);
        this.drawBody();
        this.drawSpots();
        this.drawDorsalFin(spineJoints, spineAngles, headToMid1, headToMid2);
        this.drawEyes();
    }

    drawPectoralFins(spineAngles) {
        fill(this.finColor);
        push();
        translate(this.getPosX(3, PI / 3, 0), this.getPosY(3, PI / 3, 0));
        rotate(spineAngles[2] - PI / 4);
        ellipse(0, 0, 50 * this.size, 20 * this.size); // Right
        pop();
        push();
        translate(this.getPosX(3, -PI / 3, 0), this.getPosY(3, -PI / 3, 0));
        rotate(spineAngles[2] + PI / 4);
        ellipse(0, 0, 50 * this.size, 20 * this.size); // Left
        pop();
    }

    drawVentralFins(spineAngles) {
        push();
        translate(this.getPosX(7, PI / 2, 0), this.getPosY(7, PI / 2, 0));
        rotate(spineAngles[6] - PI / 4);
        ellipse(0, 0, 30 * this.size, 10 * this.size); // Right
        pop();
        push();
        translate(this.getPosX(7, -PI / 2, 0), this.getPosY(7, -PI / 2, 0));
        rotate(spineAngles[6] + PI / 4);
        ellipse(0, 0, 30 * this.size, 10 * this.size); // Left
        pop();
    }

    drawCaudalFins(headToTail, spineJoints, spineAngles) {
        beginShape();
        // "Bottom" of the fish
        for (let i = 8; i < 12; i++) {
            let tailWidth = 1.5 * headToTail * (i - 8) * (i - 8);
            curveVertex(
                spineJoints[i].x + cos(spineAngles[i] - PI / 2) * tailWidth,
                spineJoints[i].y + sin(spineAngles[i] - PI / 2) * tailWidth
            );
        }

        // "Top" of the fish
        for (let i = 11; i >= 8; i--) {
            let tailWidth = headToTail * 0.2;
            curveVertex(
                spineJoints[i].x + cos(spineAngles[i] + PI / 2) * tailWidth,
                spineJoints[i].y + sin(spineAngles[i] + PI / 2) * tailWidth
            );
        }
        endShape(CLOSE);
    }

    drawBody() {
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

        fill(this.bodyColor);
    }

    drawSpots() {
        push();
        beginClip();
        this.drawBody()
        endClip();

        rect(0, 0, width, height);

        fill(this.spotColor);
        strokeWeight(0);

        for (let spot of this.spots) {
            push();
            translate(this.getPosX(spot.segment, spot.angle, 0), this.getPosY(spot.segment, spot.angle, 0));
            ellipse(0, 0, spot.size * this.size, spot.size * this.size);
            pop()
        }
        pop();
    }

    drawDorsalFin(spineJoints, spineAngles, headToMid1, headToMid2) {
        fill(this.finColor);
        beginShape();
        vertex(spineJoints[4].x, spineJoints[4].y);
        bezierVertex(
            spineJoints[5].x,
            spineJoints[5].y,
            spineJoints[6].x,
            spineJoints[6].y,
            spineJoints[7].x,
            spineJoints[7].y
        );
        bezierVertex(
            spineJoints[6].x + cos(spineAngles[6] + PI / 2) * headToMid2 * 16,
            spineJoints[6].y + sin(spineAngles[6] + PI / 2) * headToMid2 * 16,
            spineJoints[5].x + cos(spineAngles[5] + PI / 2) * headToMid1 * 16,
            spineJoints[5].y + sin(spineAngles[5] + PI / 2) * headToMid1 * 16,
            spineJoints[4].x,
            spineJoints[4].y
        );
        endShape();
    }

    drawEyes() {
        fill(255);
        ellipse(this.getPosX(0, PI / 2, -2), this.getPosY(0, PI / 2, -2), 8 * this.size, 8 * this.size);
        ellipse(this.getPosX(0, -PI / 2, -2), this.getPosY(0, -PI / 2, -2), 8 * this.size, 8 * this.size);
    }

    debugDraw() {
        this.spine.draw(this.size * 8);
        fill(this.bodyColor)

        ellipse(this.foodPos.x, this.foodPos.y, 10, 10);

        fill("black")
        textAlign(CENTER);
        textSize(20);
        text(`ID: ${this.id}\nS: ${round(this.size, 2)} \nV: ${round(this.speed * this.speedMultiplier, 2)}\nSP: ${this.spots.length}`, this.getPosX(0, 0, 50), this.getPosY(0, 0, 50));
    }

    // Various helpers to shorten lines

    getPosX(i, angleOffset, lengthOffset) {
        return (
            this.spine.joints[i].x +
            cos(this.spine.angles[i] + angleOffset) *
            (this.bodyWidth[i] + lengthOffset)
        );
    }

    getPosY(i, angleOffset, lengthOffset) {
        return (
            this.spine.joints[i].y +
            sin(this.spine.angles[i] + angleOffset) *
            (this.bodyWidth[i] + lengthOffset)
        );
    }
}
