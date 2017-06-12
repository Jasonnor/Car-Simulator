var psoRun = false;
var swarmSize = 512;

function psoStart(parameter) {
    switch (parameter) {
        case 'start':
            psoRun = true;
            break;
        case 'stop':
            psoRun = false;
            break;
        default:
            psoRun = !psoRun;
    }
    if (psoRun) {
        document.getElementById('psoStart').innerHTML = 'Stop (P)';
        fuzzyStart('stop');
        geneticStart('stop');
        startMotion('start');
    } else {
        document.getElementById('psoStart').innerHTML = 'Start (P)';
        startMotion('stop');
    }
}

function particleSwarmOptimization() {
    /*var output = 0;
    if (dimension == 3) {
        output = bestGene.rbf.getOutput([distanceCenter, distanceRight, distanceLeft]);
    } else if (dimension == 5) {
        output = bestGene.rbf.getOutput([posX, posY, distanceCenter, distanceRight, distanceLeft]);
    }
    angleWheel = (output * 80.0) - 40;
    readAngleWheel();*/
}
