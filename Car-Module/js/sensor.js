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
    var length = 100000;
    for (var coordinate of map) {
        // X-line
        if (coordinate[4] != 0) {
            var tempLength = (coordinate[0] - xStart) / Math.cos(angle);
            if (tempLength < 0 || tempLength > length) {
                continue;
            }
            var yEnd = yStart + tempLength * Math.sin(angle);
            if (yEnd >= coordinate[1] && yEnd <= coordinate[3]) {
                length = tempLength;
            }
        }
        // Y-line
        else if (coordinate[5] != 0) {
            var tempLength = (coordinate[1] - yStart) / Math.sin(angle);
            if (tempLength < 0 || tempLength > length) {
                continue;
            }
            var xEnd = xStart + tempLength * Math.cos(angle);
            if (xEnd >= coordinate[0] && xEnd <= coordinate[2]) {
                length = tempLength;
            }
        }
    };
    return (length == 100000) ? -1 : length;
}
