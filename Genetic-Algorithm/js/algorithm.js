var geneticRun = false,
    input = [],
    output = [],
    genes = [],
    newGenes = [],
    bestGene;
var size = 512,
    matingRate = 0.5,
    matingRatio = 0.5,
    mutationRate = 0.5,
    mutationRatio = 0.5,
    maxIterations = 500;
var dataset = './Genetic-Algorithm/dataset-6D/train_5.txt';

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
        fuzzyStart('stop');
        psoStart('stop');
        startMotion('start');
    } else {
        document.getElementById('geneticStart').innerHTML = 'Start (G)';
        startMotion('stop');
    }
}

function geneticAlgorithm() {
    var output = 0;
    if (dimension == 3) {
        output = bestGene.rbf.getOutput([distanceCenter, distanceRight, distanceLeft]);
    } else if (dimension == 5) {
        output = bestGene.rbf.getOutput([posX, posY, distanceCenter, distanceRight, distanceLeft]);
    }
    angleWheel = (output * 80.0) - 40;
    readAngleWheel();
}

function updateDataset(selectedDataset) {
    dataset = './Genetic-Algorithm/' + selectedDataset;
    if (selectedDataset.includes('4D')) {
        dimension = 3;
    } else if (selectedDataset.includes('6D')) {
        dimension = 5;
    }
}

function updateNumberOfNeurons(value) {
    numberOfNeurons = parseInt(value);
}

function updateMaxIterations(value) {
    maxIterations = parseInt(value);
}

function updateSize(value) {
    size = parseInt(value);
}

function updateMatingRate(value) {
    matingRate = parseFloat(value);
}

function updateMutationRate(value) {
    mutationRate = parseFloat(value);
}

function geneticTrain() {
    document.getElementById('geneticStart').disabled = true;
    geneticStart('stop');
    fuzzyStart('stop');
    geneticReset();
    for (var i = 0; i < size; i++) {
        genes.push(Gene.createNew());
        genes[i].randomBuild();
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
    for (var iterations = 0; iterations < maxIterations; iterations++) {
        // Calcuate fitness
        for (var i = 0; i < genes.length; i++) {
            var temp = genes[i].getFitness(output, input);
            if (temp < minFitness) {
                minFitness = temp;
                bestGene = genes[i].clone();
                console.log(minFitness);
                document.getElementById('lossRate').innerHTML = minFitness.toFixed(4);
            }
        }
        if (minFitness < 0.01)
            break;
        // Copy gene to mating pool by tournament selection
        for (var i = 0; i < genes.length; i++) {
            var a, b;
            do {
                a = Math.floor((Math.random() * genes.length));
                b = Math.floor((Math.random() * genes.length));
            } while (a == b);
            newGenes[i] = (genes[a].fitness < genes[b].fitness) ? genes[a] : genes[b];
        }
        for (var i = 0; i < genes.length; i++) {
            genes[i] = newGenes[i];
        }
        // Gene mating
        for (var i = 0; i < genes.length; i++) {
            if (Math.random() < matingRate) {
                var j = Math.floor((Math.random() * genes.length));
                geneMating(i, j, genes[i], genes[j]);
            }
        }
        for (var i = 0; i < genes.length; i++) {
            genes[i] = newGenes[i];
        }
        // Gene mutation
        for (var i = 0; i < genes.length; i++) {
            if (Math.random() < mutationRate) {
                geneMutation(genes[i]);
            }
        }
    }
    // Calcuate fitness
    for (var i = 0; i < genes.length; i++) {
        var temp = genes[i].getFitness(output, input);
        if (temp < minFitness) {
            minFitness = temp;
            bestGene = genes[i].clone();
            console.log(minFitness);
            document.getElementById('lossRate').innerHTML = minFitness.toFixed(4);
        }
    }
    bestGene.getFitness(output, input);
    document.getElementById('geneticStart').disabled = false;
    Materialize.toast('Training finished!', 3000);
}

function geneticReset() {
    input = [];
    output = [];
    genes = [];
    newGenes = [];
    bestGene = null;
}

function geneMating(x, y, geneX, geneY) {
    var ratio = (Math.random() - 0.5) * 2 * this.matingRatio;
    var nextGeneX = Gene.createNew(),
        nextGeneY = Gene.createNew();
    for (var i = 0; i < geneX.vector.length; i++) {
        nextGeneX.vector[i] = geneX.vector[i] + ratio * (geneX.vector[i] - geneY.vector[i]);
        nextGeneY.vector[i] = geneY.vector[i] - ratio * (geneX.vector[i] - geneY.vector[i]);
    }
    nextGeneX.normalization();
    nextGeneY.normalization();
    newGenes[x] = nextGeneX;
    newGenes[y] = nextGeneY;
}

function geneMutation(gene) {
    ratio = (Math.random() - 0.5) * 2 * this.mutationRatio;
    for (var i = 0; i < gene.vector.length; i++) {
        if (Math.random() < mutationRate)
            gene.vector[i] = gene.vector[i] + ratio * Math.random() * gene.vector[i];
    }
    gene.normalization();
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var allText;
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText.split('\n');
}
