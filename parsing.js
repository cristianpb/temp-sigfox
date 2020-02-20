var parser = require('sigfox-parser')

var format = 'moduleTemp::int:16:little-endian dhtTemp::int:16:little-endian dhtHum::uint:16:little-endian lastMsg::uint:8';
var INT16_t_MAX = 32767;
var UINT16_t_MAX = 65536;

function computeHeatIndex(temperature, percentHumidity, isFahrenheit) {
    // Using both Rothfusz and Steadman's equations
    // http://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml
    var hi;

    if (!isFahrenheit)
        temperature = convertCtoF(temperature);

    hi = 0.5 * (temperature + 61.0 + ((temperature - 68.0) * 1.2) + (percentHumidity * 0.094));

    if (hi > 79) {
        hi = -42.379 +
            2.04901523 * temperature +
            10.14333127 * percentHumidity +
            -0.22475541 * temperature * percentHumidity +
            -0.00683783 * pow(temperature, 2) +
            -0.05481717 * pow(percentHumidity, 2) +
            0.00122874 * pow(temperature, 2) * percentHumidity +
            0.00085282 * temperature * pow(percentHumidity, 2) +
            -0.00000199 * pow(temperature, 2) * pow(percentHumidity, 2);

        if ((percentHumidity < 13) && (temperature >= 80.0) && (temperature <= 112.0))
            hi -= ((13.0 - percentHumidity) * 0.25) * sqrt((17.0 - abs(temperature - 95.0)) * 0.05882);

        else if ((percentHumidity > 85.0) && (temperature >= 80.0) && (temperature <= 87.0))
            hi += ((percentHumidity - 85.0) * 0.1) * ((87.0 - temperature) * 0.2);
    }

    return isFahrenheit ? hi : convertFtoC(hi);
}

function convertFtoC(f) {
    return (f - 32) * 0.55555;
}

function convertCtoF(c) {
    return c * 1.8 + 32;
}

function convertPayload(payload) {
  var parsed = parser(payload, format);

  var moduleTemp = (parsed.moduleTemp / INT16_t_MAX * 120).toFixed(2);
  var dhtTemp = (parsed.dhtTemp / INT16_t_MAX * 120).toFixed(2);
  var dhtHum = (parsed.dhtHum / UINT16_t_MAX * 110).toFixed(2);
  var heatIndex = computeHeatIndex(dhtTemp, dhtHum, false).toFixed(2);

  var result = {
    moduleTemp: moduleTemp,
    dhtTemp: dhtTemp,
    dhtHum: dhtHum,
    heatIndex: heatIndex
  }
  return result
}

module.exports = convertPayload;
