var numberOfNeurons = 8,
    dimension = 5;
var RBF = {
    createNew: function () {
        var rbf = {};
        rbf.theta = 0;
        rbf.W = [];
        rbf.M = [];
        rbf.sigma = [];
        rbf.getOutput = function (x) {
            var output = this.theta,
                value;
            for (var i = 0; i < numberOfNeurons; i++) {
                value = this.W[i] * Math.exp(-getVectorDistance(x, this.M[i]) / (2 * this.sigma[i] * this.sigma[i]));
                output += value;
            }
            return output;
        };
        for (var i = 0; i < numberOfNeurons; i++)
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
