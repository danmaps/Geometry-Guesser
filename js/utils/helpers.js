// Log the current visible extent of the map to the console and return the bounds in a format suitable for use with Turf.js
function logCurrentBounds(map) {
    var bounds = map.getBounds(); 
    var southWest = bounds.getSouthWest(); 
    var northEast = bounds.getNorthEast(); 
    return [southWest.lng, southWest.lat, northEast.lng, northEast.lat];
}

module.exports = { logCurrentBounds };

