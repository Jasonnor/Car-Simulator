var Gene = {
    // vectorLength: 1 + numberOfNeurons + numberOfNeurons * dimension + numberOfNeurons
    createNew: function () {
        var gene = {};
        gene.vector = [];
        gene.fitness = 10000;
        gene.rbf = RBF.createNew();
        gene.clone = function () {
            var geneNew = Gene.createNew();
            for (var i = 0; i < this.vector.length; i++)
                geneNew.vector[i] = this.vector[i];
            geneNew.normalization();
            return geneNew;
        };
        gene.normalization = function (gene) {
            this.vector[0] = Math.min(Math.max(this.vector[0], 0), 1);
            this.rbf.theta = this.vector[0];
            for (var i = 0; i < numberOfNeurons; i++) {
                this.vector[i + 1] = Math.min(Math.max(this.vector[i + 1], -40), 40);
                this.rbf.W[i] = this.vector[i + 1];
            }
            for (var i = 1 + numberOfNeurons, j = 0; i < 1 + numberOfNeurons + numberOfNeurons * dimension; i++, j++) {
                this.vector[i] = Math.min(Math.max(this.vector[i], 0), 30);
                this.rbf.M[parseInt(j / dimension)][parseInt(j % dimension)] = this.vector[i];
            }
            for (var i = 1 + numberOfNeurons + numberOfNeurons * dimension, j = 0; i < 1 + numberOfNeurons + numberOfNeurons * dimension + numberOfNeurons; i++, j++) {
                this.vector[i] = Math.min(Math.max(this.vector[i], 0.000001), 10);
                this.rbf.sigma[j] = this.vector[i];
            }
        };
        gene.randomBuild = function () {
            this.vector[0] = Math.random();
            for (var i = 1; i < 1 + numberOfNeurons; i++) {
                this.vector[i] = Math.random();
            }
            for (var i = 1 + numberOfNeurons; i < 1 + numberOfNeurons + numberOfNeurons * dimension; i++) {
                this.vector[i] = Math.random() * 30;
            }
            for (var i = 1 + numberOfNeurons + numberOfNeurons * dimension; i < 1 + numberOfNeurons + numberOfNeurons * dimension + numberOfNeurons; i++) {
                this.vector[i] = Math.random() * 10;
            }
            this.normalization();
        };
        gene.getFitness = function (yD, x) {
            this.normalization();
            var value = 0;
            for (var i = 0; i < yD.length; i++) {
                var fX = this.rbf.getOutput(x[i]);
                value += Math.pow(yD[i] - fX, 2);
            }
            value = value / 2.0;
            this.fitness = value;
            return value;
        };
        return gene;
    }
};
