function updateSpeed() {
    speed = document.getElementById('speedRange').value;
    document.getElementById('speed').innerHTML = speed;
}

function updateAngleWheel() {
    angleWheel = document.getElementById('angleWheelRange').value;
    document.getElementById('angleWheel').innerHTML = parseFloat(angleWheel).toFixed(1);
}

function readAngleWheel() {
    document.getElementById('angleWheelRange').value = angleWheel;
    document.getElementById('angleWheel').innerHTML = parseFloat(angleWheel).toFixed(1);
}

function updateMotion() {
    if (run) {
        var phi = degreeToRadian(angleCar);
        var delta = degreeToRadian(angleWheel);
        deltaX = (Math.cos(phi + delta) + Math.sin(delta) * Math.sin(phi)) * 0.1;
        deltaY = (Math.sin(phi + delta) - Math.sin(delta) * Math.cos(phi)) * 0.1;
        posX = posX + deltaX;
        posY = posY + deltaY;
        rotY = rotY + 0.1 * deltaX;
        rotX = rotX - 0.1 * deltaY;
        phi = phi - (Math.asin((2.0 * Math.sin(delta)) / 6.0)) * 0.1;
        angleCar = 180.0 * phi / Math.PI;
        if (angleCar > 270)
            angleCar -= 360;
        else if (angleCar < -90)
            angleCar += 360;
        distanceCenter = getDistance(posX, posY, angleCar, 'center');
        distanceRight = getDistance(posX, posY, angleCar, 'right');
        distanceLeft = getDistance(posX, posY, angleCar, 'left');
        document.getElementById('x').innerHTML = posX.toFixed(4);
        document.getElementById('y').innerHTML = posY.toFixed(4);
        document.getElementById('angleCar').innerHTML = angleCar.toFixed(1);
        document.getElementById('distanceCenter').innerHTML = distanceCenter.toFixed(4);
        document.getElementById('distanceRight').innerHTML = distanceRight.toFixed(4);
        document.getElementById('distanceLeft').innerHTML = distanceLeft.toFixed(4);
        if (failure || distanceCenter == -1 || distanceRight == -1 || distanceLeft == -1) {
            document.getElementById('success').style.display = 'none';
            document.getElementById('failure').style.display = 'block';
            failure = true;
        } else if (posY >= 37 && posX <= 30 && posX >= 18) {
            document.getElementById('success').style.display = 'block';
            document.getElementById('failure').style.display = 'none';
            run = false;
        } else {
            document.getElementById('success').style.display = 'none';
            document.getElementById('failure').style.display = 'none';
        }
    }
    if (fuzzyRun)
        fuzzyControl();
    setTimeout(updateMotion, 1000 / speed);
}


document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            // Left
            --posX;
            rotY += 0.1;
            break;
        case 65:
            // A
            if (angleWheel > -40) {
                --angleWheel;
                readAngleWheel();
            }
            break;

        case 38:
        case 87:
            // Up & W
            ++posY;
            rotX += 0.1;
            break;

        case 39:
            // Right
            ++posX;
            rotY += 0.1;
            break;
        case 68:
            // D
            if (angleWheel < 40) {
                ++angleWheel;
                readAngleWheel();
            }
            break;

        case 40:
        case 83:
            // Down & S
            --posY;
            rotX += 0.1;
            break;

        case 32:
            // Start/Stop (space)
            run = !run;
            break;

        case 82:
            // Reset (R)
            posX = posY = rotX = rotY = angleWheel = 0.0;
            angleCar = 90.0;
            distanceCenter = 22;
            distanceRight = 8.4853;
            distanceLeft = 8.4853;
            failure = false;
            document.getElementById('success').style.display = 'none';
            document.getElementById('failure').style.display = 'none';
            readAngleWheel();
            break;
    }
};

setTimeout(updateMotion, 1000 / speed);
