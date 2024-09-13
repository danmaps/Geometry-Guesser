
// Log the current visible extent of the map to the console and return the bounds in a format suitable for use with Turf.js
export function logCurrentBounds(map) {
    var bounds = map.getBounds(); 
    var southWest = bounds.getSouthWest(); 
    var northEast = bounds.getNorthEast(); 

    console.log("Current visible bounds:");
    console.log("South West corner: ", southWest);
    console.log("North East corner: ", northEast);
    return [southWest.lng, southWest.lat, northEast.lng, northEast.lat];

}

