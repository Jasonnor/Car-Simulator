var geneticRun = false;
var genes = [];
var nextGenes = [];
var poolSize = 512,
    matingRate = 0.5,
    matingRatio = 0.5,
    mutationRate = 0.5,
    mutationRatio = 0.5;

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
        startMotion('start');
    } else {
        document.getElementById('geneticStart').innerHTML = 'Start (G)';
        startMotion('stop');
    }
}

function geneticAlgorithm() {
    for (var i = 0; i < poolSize; i++) {
        genes.push(Gene.createNew());
        genes[i].randomBuild();
    }
    // Get Fitness from data
}

function geneMating(x, y, geneX, geneY) {
    var ratio = (Math.random() - 0.5) * 2 * this.matingRatio;
    var nextGeneX = Gene.createNew(),
        nextGeneY = Gene.createNew();
    for (var i = 0; i < geneX.vector.length; i++) {
        nextGeneX.vector[i] = geneX.vector[i] + ratio * (geneX.vector[i] - geneY.vector[i]);
        nextGeneY.vector[i] = geneY.vector[i] - ratio * (geneX.vector[i] - geneY.vector[i]);
    }
    newGene[x] = nextGeneX;
    newGene[y] = nextGeneY;
}

function geneMutation(gene) {
    ratio = (Math.random() - 0.5) * 2 * this.mutationRatio;
    for (var i = 0; i < gene.vector.length; i++) {
        if (Math.random() < mutationRate)
            gene.vector[i] = gene.vector[i] + ratio * Math.random() * gene.vector[i];
    }
}
