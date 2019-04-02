// aqiScaleTools.js

export default {
    normalizePollutantId: normalizePollutantId,
    extraChecks: extraChecks
};

function normalizePollutantId(id) {
    switch (id.toLowerCase()) {
        case 'sp_aqi':
        case 'aqi':
            return 'aqi';
        case 'pm2.5':
        case 'bpm2.5':
        case 'ipm2.5':
        case 'pm25':
            return 'pm2.5';
        default:
            return id.toLowerCase();
    }
};

function extraChecks(aqiScaleId) {
    switch (aqiScaleId) {
        case 'EUEEA':
        case 'USEPA':
            return (thresh, pollutant) => {
                return normalizePollutantId(thresh.pollutant) === normalizePollutantId(pollutant);
            };
        case 'AUEPA':
        default:
            return null;
    }
}
