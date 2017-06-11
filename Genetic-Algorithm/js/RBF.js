var RBF = {
    numberOfNeurons: 3,
    dimension: 3,
    createNew: function () {
        var rbf = {};
        rbf.theta = 0;
        rbf.W = [];
        rbf.M = [];
        rbf.sigma = [];
        rbf.getOutput = function (x) {
            var output = this.theta,
                value;
            for (var i = 0; i < RBF.numberOfNeurons; i++) {
                value = this.W[i] * Math.exp(-getVectorDistance(x, this.M[i]) / (2 * this.sigma[i] * this.sigma[i]));
                output += value;
            }
            return output;
        };
        for (var i = 0; i < RBF.numberOfNeurons; i++)
            rbf.M[i] = [];
        return rbf;
    }
};

function getVectorDistance(x, y) {
    var distance = 0;
    for (var i = 0; i < x.length; i++) {
        distance += (x[i] - y[i]) * (x[i] - y[i]);
    }
    return distance;
}
