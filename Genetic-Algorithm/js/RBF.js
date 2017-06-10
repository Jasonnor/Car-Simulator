function getOutput() {
    var output = theta,
        value;
    for (var i = 0; i < numberOfNeurons; i++) {
        value = W[i] * Math.exp(-getDistance(x, M[i]) / (2 * sigma[i] * sigma[i]));
        output += value;
    }
    return output;
}

function getDistance(x, y) {
    var distance = 0;
    for (var i = 0; i < x.length; i++) {
        distance += (x[i] - y[i]) * (x[i] - y[i]);
    }
    return distance;
}
