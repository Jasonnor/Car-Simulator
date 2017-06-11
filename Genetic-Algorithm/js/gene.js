var Gene = {
    numberOfNeurons: 3,
    dimension: 3,
    // vectorLength: 1 + numberOfNeurons + numberOfNeurons * dimension + numberOfNeurons,
    createNew: function () {
        var gene = {};
        gene.theta = 0;
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
            for (var i = 0; i < Gene.numberOfNeurons; i++) {
                this.vector[i + 1] = Math.min(Math.max(this.vector[i + 1], 0), 80);
                this.rbf.W[i] = this.vector[i + 1];
            }
            for (var i = 1 + Gene.numberOfNeurons, j = 0; i < 1 + Gene.numberOfNeurons + Gene.numberOfNeurons * Gene.dimension; i++, j++) {
                this.vector[i] = Math.min(Math.max(this.vector[i], 0), 30);
                this.rbf.M[parseInt(j / Gene.dimension)][parseInt(j % Gene.dimension)] = this.vector[i];
            }
            for (var i = 1 + Gene.numberOfNeurons + Gene.numberOfNeurons * Gene.dimension, j = 0; i < 1 + Gene.numberOfNeurons + Gene.numberOfNeurons * Gene.dimension + Gene.numberOfNeurons; i++, j++) {
                this.vector[i] = Math.min(Math.max(this.vector[i], 0.000001), 10);
                this.rbf.sigma[j] = this.vector[i];
            }
        };
        gene.randomBuild = function () {
            this.vector[0] = Math.random();
            for (var i = 1; i < 1 + Gene.numberOfNeurons; i++) {
                this.vector[i] = Math.random();
            }
            for (var i = 1 + Gene.numberOfNeurons; i < 1 + Gene.numberOfNeurons + Gene.numberOfNeurons * Gene.dimension; i++) {
                this.vector[i] = Math.random() * 30;
            }
            for (var i = 1 + Gene.numberOfNeurons + Gene.numberOfNeurons * Gene.dimension; i < 1 + Gene.numberOfNeurons + Gene.numberOfNeurons * Gene.dimension + Gene.numberOfNeurons; i++) {
                this.vector[i] = Math.random() * 10;
            }
            this.normalization();
        };
        gene.getFitness = function (yD, x) {
            var value = 0;
            for (var i = 0; i < yD.length; i++) {
                var fX = this.rbf.getOutput(x[i]);
                value += Math.pow(yD[i] - fX, 2);
            }
            value = value / 2.0;
            this.fitness = value;
            return value;
        };
        gene.getVectorTypeName = function () {
            var typeName = [];
            typeName[0] = "theta";
            for (var i = 1; i <= Gene.numberOfNeurons; i++) {
                typeName[i] = "w" + i;
            }
            for (var i = 1 + Gene.numberOfNeurons, j = 0; i < 1 + Gene.numberOfNeurons + Gene.numberOfNeurons * Gene.dimension; i++, j++) {
                typeName[i] = "m" + (j / Gene.dimension + 1) + "," + (j % Gene.dimension + 1);
            }
            for (var i = 1 + Gene.numberOfNeurons + Gene.numberOfNeurons * Gene.dimension, j = 0; i < 1 + Gene.numberOfNeurons + Gene.numberOfNeurons * Gene.dimension + Gene.numberOfNeurons; i++, j++) {
                typeName[i] = "sigma" + (j + 1);
            }
            return typeName;
        };
        return gene;
    }
};
