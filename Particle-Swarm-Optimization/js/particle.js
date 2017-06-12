var Particle = {
    // xLength: 1 + numberOfNeurons + numberOfNeurons * dimension + numberOfNeurons
    createNew: function () {
        var particle = {};
        particle.x = [];
        particle.v = [];
        particle.fitness = 10000;
        particle.rbf = RBF.createNew();
        particle.clone = function () {
            var particleNew = Particle.createNew();
            for (var i = 0; i < this.x.length; i++)
                particleNew.x[i] = this.x[i];
            for (var i = 0; i < this.v.length; i++)
                particleNew.v[i] = this.v[i];
            particleNew.normalization();
            return particleNew;
        };
        particle.move = function () {
            for (var i = 0; i < this.x.length; i++)
                this.x[i] += this.v[i];
        };
        particle.normalization = function (particle) {
            this.x[0] = Math.min(Math.max(this.x[0], 0), 1);
            this.rbf.theta = this.x[0];
            for (var i = 0; i < numberOfNeurons; i++) {
                this.x[i + 1] = Math.min(Math.max(this.x[i + 1], -40), 40);
                this.rbf.W[i] = this.x[i + 1];
            }
            for (var i = 1 + numberOfNeurons, j = 0; i < 1 + numberOfNeurons + numberOfNeurons * dimension; i++, j++) {
                this.x[i] = Math.min(Math.max(this.x[i], 0), 30);
                this.rbf.M[parseInt(j / dimension)][parseInt(j % dimension)] = this.x[i];
            }
            for (var i = 1 + numberOfNeurons + numberOfNeurons * dimension, j = 0; i < 1 + numberOfNeurons + numberOfNeurons * dimension + numberOfNeurons; i++, j++) {
                this.x[i] = Math.min(Math.max(this.x[i], 0.000001), 10);
                this.rbf.sigma[j] = this.x[i];
            }
        };
        particle.randomBuild = function () {
            this.x[0] = Math.random();
            for (var i = 1; i < 1 + numberOfNeurons; i++) {
                this.x[i] = Math.random();
            }
            for (var i = 1 + numberOfNeurons; i < 1 + numberOfNeurons + numberOfNeurons * dimension; i++) {
                this.x[i] = Math.random() * 30;
            }
            for (var i = 1 + numberOfNeurons + numberOfNeurons * dimension; i < 1 + numberOfNeurons + numberOfNeurons * dimension + numberOfNeurons; i++) {
                this.x[i] = Math.random() * 10;
            }
            for (var i = 0; i < 1 + numberOfNeurons + numberOfNeurons * dimension + numberOfNeurons; i++) {
                this.v[i] = Math.random();
            }
            this.normalization();
        };
        particle.getFitness = function (yD, x) {
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
        return particle;
    }
};
