var geneticRun = false;

function geneticStart(parameter) {
    switch (parameter) {
        case 'start':
            geneticRun = true;
            break;
        case 'stop':
            geneticRun = false;
            break;
        default:
            geneticRun = !geneticRun;
    }
    if (geneticRun) {
        document.getElementById('geneticStart').innerHTML = 'Stop (G)';
        startMotion('start');
    } else {
        document.getElementById('geneticStart').innerHTML = 'Start (G)';
        startMotion('stop');
    }
}

function geneticAlgorithm() {}
