class Chain {
    constructor(origin, jointCount, linkSize, angleConstraint = TWO_PI) {
        this.joints = [];
        this.angles = [];
        this.linkSize = linkSize;
        this.angleConstraint = angleConstraint;
        this.joints.push(origin.copy());
        this.angles.push(0);
        for (let i = 1; i < jointCount; i++) {
            this.joints.push(p5.Vector.add(this.joints[i - 1], createVector(0, this.linkSize)));
            this.angles.push(0);
        }
    }

    resolve(pos) {
        this.angles[0] = p5.Vector.sub(pos, this.joints[0]).heading();
        this.joints[0] = pos;
        for (let i = 1; i < this.joints.length; i++) {
            let curAngle = p5.Vector.sub(this.joints[i - 1], this.joints[i]).heading();
            this.angles[i] = constrainAngle(curAngle, this.angles[i - 1], this.angleConstraint);
            this.joints[i] = p5.Vector.sub(this.joints[i - 1], p5.Vector.fromAngle(this.angles[i]).setMag(this.linkSize));
        }
    }

    draw(size) {
        strokeWeight(2);
        stroke(255);
        for (let i = 0; i < this.joints.length - 1; i++) {
            let startJoint = this.joints[i];
            let endJoint = this.joints[i + 1];
            line(startJoint.x, startJoint.y, endJoint.x, endJoint.y);
        }

        fill(42, 44, 53);
        for (let joint of this.joints) {
            ellipse(joint.x, joint.y, size, size);
        }
    }
}
