var map = [
    [-6, -13, 6, -13, 0, 1],
    [-6, -13, -6, 22, -1, 0],
    [-6, 22, 18, 22, 0, 1],
    [18, 22, 18, 50, -1, 0],
    [18, 50, 30, 50, 0, -1],
    [6, -13, 6, 10, 1, 0],
    [6, 10, 30, 10, 0, -1],
    [30, 10, 30, 50, 1, 0]
];

function getDistance(xStart, yStart, angleCar, type) {
    switch (type) {
        case 'center':
            break;
        case 'right':
            angleCar = angleCar - 45;
            break;
        case 'left':
            angleCar = angleCar + 45;
            break;
    }
    var angle = angleCar * Math.PI / 180.0;
    var length = -1;
    for (var coordinate of map) {
        // X-line
        if (coordinate[4] != 0) {
            var length = (coordinate[0] - xStart) / Math.cos(angle);
            if (length < 0)
                continue;
            var yEnd = yStart + length * Math.sin(angle);
            if (yEnd >= coordinate[1] && yEnd <= coordinate[3])
                return length;
        }
        // Y-line
        else if (coordinate[5] != 0) {
            var length = (coordinate[1] - yStart) / Math.sin(angle);
            if (length < 0)
                continue;
            var xEnd = xStart + length * Math.cos(angle);
            if (xEnd >= coordinate[0] && xEnd <= coordinate[2])
                return length;
        }
    };
    return -1;
}
