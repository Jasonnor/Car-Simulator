var fuzzyRun = false;

function fuzzyStart(parameter) {
    switch (parameter) {
        case 'start':
            fuzzyRun = true;
            break;
        case 'stop':
            fuzzyRun = false;
            break;
        default:
            fuzzyRun = !fuzzyRun;
    }
    if (fuzzyRun) {
        document.getElementById('fuzzyStart').innerHTML = 'Stop (F)';
        geneticStart('stop');
        psoStart('stop');
        startMotion('start');
    } else {
        document.getElementById('fuzzyStart').innerHTML = 'Start (F)';
        startMotion('stop');
    }
}

function fuzzyControl() {
    var alpha = [];
    // Center Small, Right Medium, Right Large, Left Medium, Left Large, Center Large & Right Small, Center Large & Left Small
    var functionValue = [60, 40, 80, -40, -80, 30, -30];
    alpha.push(fuzzyRulesCenter(distanceCenter, 'Small'));
    alpha.push(fuzzyRulesRight(distanceRight, 'Medium'));
    alpha.push(fuzzyRulesRight(distanceRight, 'Large'));
    alpha.push(fuzzyRulesLeft(distanceLeft, 'Medium'));
    alpha.push(fuzzyRulesLeft(distanceLeft, 'Large'));
    alpha.push(fuzzyRulesCenter(distanceCenter, 'Large') * fuzzyRulesRight(distanceRight, 'Small'));
    alpha.push(fuzzyRulesCenter(distanceCenter, 'Large') * fuzzyRulesLeft(distanceLeft, 'Small'));
    angleWheel = discreteCenterOfMass(alpha, functionValue);
    readAngleWheel();
}

function discreteCenterOfMass(alpha, functionValue) {
    var molecular = 0,
        denominator = 0,
        output;
    for (var i = 0; i < alpha.length; i++) {
        molecular += alpha[i] * functionValue[i];
        denominator += alpha[i];
    }
    if (denominator == 0)
        return 40;
    output = molecular / denominator;
    return Math.max(Math.min(output, 40), -40);
}

function fuzzyRulesCenter(distance, type) {
    if (distance == -1)
        distance = 1000;
    switch (type) {
        case 'Small':
            if (distance < 3)
                return 1;
            if (distance < 10)
                return -distance / 7.0 + 10.0 / 7.0;
            break;
        case 'Large':
            if (distance >= 30)
                return 1;
            break;
    }
    return 0;
}

function fuzzyRulesRight(distance, type) {
    if (distance == -1)
        distance = 1000;
    switch (type) {
        case 'Small':
            if (distance < 4)
                return 1;
            if (distance < 5)
                return -distance + 5;
            break;
        case 'Medium':
            if (distance < 4)
                return 0;
            if (distance < 10)
                return distance / 6 - 4 / 6.0;
            if (distance < 16)
                return -distance / 6 + 16 / 6.0;
            break;
        case 'Large':
            if (distance < 8)
                return 0;
            if (distance < 16)
                return distance / 8 - 1;
            return 1;
    }
    return 0;
}

function fuzzyRulesLeft(distance, type) {
    if (distance == -1)
        distance = 1000;
    switch (type) {
        case 'Small':
            if (distance < 4)
                return 1;
            if (distance < 5)
                return -distance + 5;
            break;
        case 'Medium':
            if (distance < 4)
                return 0;
            if (distance < 10)
                return distance / 6 - 4 / 6.0;
            if (distance < 16)
                return -distance / 6 + 16 / 6.0;
            break;
        case 'Large':
            if (distance < 10)
                return 0;
            if (distance < 16)
                return distance / 6 - 10 / 6.0;
            return 1;
    }
    return 0;
}
