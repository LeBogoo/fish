function constrainDistance(pos, anchor, constraint) {
    return p5.Vector.add(anchor, p5.Vector.sub(pos, anchor).setMag(constraint));
}

function constrainAngle(angle, anchor, constraint) {
    if (abs(relativeAngleDiff(angle, anchor)) <= constraint) {
        return simplifyAngle(angle);
    }

    if (relativeAngleDiff(angle, anchor) > constraint) {
        return simplifyAngle(anchor - constraint);
    }

    return simplifyAngle(anchor + constraint);
}

function relativeAngleDiff(angle, anchor) {
    angle = simplifyAngle(angle + PI - anchor);
    anchor = PI;

    return anchor - angle;
}

function simplifyAngle(angle) {
    while (angle >= TWO_PI) {
        angle -= TWO_PI;
    }

    while (angle < 0) {
        angle += TWO_PI;
    }

    return angle;
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}