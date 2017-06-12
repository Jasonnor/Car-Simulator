var psoRun = false,
    swarm = [],
    gobalBestParticle;
var maxVelocity = 40,
    cognition = 0.3,
    social = 0.3;

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

function updateMaxVelocity(value) {
    maxVelocity = parseFloat(value);
}

function updateCognition(value) {
    cognition = parseFloat(value);
}

function updateSocial(value) {
    social = parseFloat(value);
}

function pso() {
    var output = 0;
    if (dimension == 3) {
        output = gobalBestParticle.rbf.getOutput([distanceCenter, distanceRight, distanceLeft]);
    } else if (dimension == 5) {
        output = gobalBestParticle.rbf.getOutput([posX, posY, distanceCenter, distanceRight, distanceLeft]);
    }
    angleWheel = (output * 80.0) - 40;
    readAngleWheel();
}

function psoTrain() {
    document.getElementById('psoStart').disabled = true;
    geneticStart('stop');
    fuzzyStart('stop');
    psoStart('stop');
    psoReset();
    for (var i = 0; i < size; i++) {
        swarm.push(Particle.createNew());
        swarm[i].randomBuild();
    }
    // Read data
    var rawData = readTextFile(dataset);
    for (var i = 0; i < rawData.length; i++) {
        if (rawData[i] !== '') {
            input[i] = [];
            var data = rawData[i].split(' ');
            for (var j = 0; j < data.length - 1; j++) {
                input[i].push(parseFloat(data[j]));
            }
            output.push((parseFloat(data[data.length - 1]) + 40) / 80.0);
        }
    }
    var minFitness = 1000000;
    var personalBest = [];
    for (var i = 0; i < swarm.length; i++) {
        personalBest.push(Particle.createNew());
    }
    for (var iterations = 0; iterations < maxIterations; iterations++) {
        // Calcuate fitness
        for (var i = 0; i < swarm.length; i++) {
            var temp = swarm[i].getFitness(output, input);
            // Personal best
            if (temp < personalBest[i].fitness) {
                personalBest[i] = swarm[i].clone();
                personalBest[i].fitness = temp;
            }
            // Gobal best
            if (temp < minFitness) {
                minFitness = temp;
                gobalBestParticle = swarm[i].clone();
                console.log(minFitness);
                document.getElementById('lossRate').innerHTML = minFitness.toFixed(4);
            }
        }
        if (minFitness < 0.001)
            break;
        // Update Velocity 
        for (var i = 0; i < swarm.length; i++) {
            for (var j = 0; j < swarm[i].v.length; j++) {
                swarm[i].v[j] = swarm[i].v[j] + cognition * (personalBest[i].x[j] - swarm[i].x[j]) + social * (gobalBestParticle.x[j] - swarm[i].x[j]);
                swarm[i].v[j] = Math.min(Math.max(swarm[i].v[j], -maxVelocity), maxVelocity);
            }
            swarm[i].move();
        }
    }
    // Calcuate fitness
    for (var i = 0; i < swarm.length; i++) {
        var temp = swarm[i].getFitness(output, input);
        // Gobal best
        if (temp < minFitness) {
            minFitness = temp;
            gobalBestParticle = swarm[i].clone();
            console.log(minFitness);
            document.getElementById('lossRate').innerHTML = minFitness.toFixed(4);
        }
    }
    gobalBestParticle.getFitness(output, input);
    document.getElementById('psoStart').disabled = false;
}


function psoReset() {
    input = [];
    output = [];
    swarm = [];
    gobalBestParticle = null;
}
