export const Units = {
    moleculesPerHundredVolt: 'molecules/100eV',
    molPerJoule: 'mol/J'
};

export const getTrendResult = data => {
    const result = {
        slope: 0,
        intercept: 0,
        slopeError: 0,
        interceptError: 0,
        rSquared: 0,
        func: null
    };

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;
    let N = data.length;

    data.forEach(({x, y}) => {
        sumX += x;
        sumY += y;
        sumXY += x*y;
        sumXX += x*x;
        sumYY += y*y;
    });

    result.slope = ((N * sumXY - sumX * sumY) ) / (N * sumXX - sumX * sumX);
    result.intercept = (sumY - result.slope * sumX) / N;

    let varSum = 0;
    data.forEach(({x, y}) =>
        varSum += (y - result.intercept - result.slope * x) * (y - result.intercept - result.slope * x)
    )

    const delta = N * sumXX - sumX*sumX;
    const vari = 1.0 / (N - 2.0) * varSum;

    result.interceptError = Math.sqrt(vari / delta * sumXX);
    result.slopeError = Math.sqrt(N / delta * vari);
    result.rSquared = Math.pow((N * sumXY - sumX * sumY)/Math.sqrt((N * sumXX - sumX * sumX)*(N * sumYY - sumY * sumY)),2);
    result.func = x => result.slope * x + result.intercept;
    return result;
};