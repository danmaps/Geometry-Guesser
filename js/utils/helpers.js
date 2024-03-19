
export function getCurrentVisibleExtent(map) {
    console.log(map.getBounds())
    var currentBounds = map.getBounds();
    var southwest = [currentBounds._southWest.lat, currentBounds._southWest.lng];
    var southeast = [currentBounds._southWest.lat, currentBounds._northEast.lng];
    var northeast = [currentBounds._northEast.lat, currentBounds._northEast.lng];
    var northwest = [currentBounds._northEast.lat, currentBounds._southWest.lng];
    var visible_extent = turf.polygon([[southwest, southeast, northeast, northwest, southwest]]);
    console.log(visible_extent);
    return visible_extent;
}


// Log the current visible extent of the map to the console
export function logCurrentBounds(map) {
    var bounds = map.getBounds(); // Get the current bounds
    var southWest = bounds.getSouthWest(); // Get the South West corner
    var northEast = bounds.getNorthEast(); // Get the North East corner


    // var southwest = [bounds._southWest.lat, bounds._southWest.lng];
    // var southeast = [bounds._southWest.lat, bounds._northEast.lng];
    // var northeast = [bounds._northEast.lat, bounds._northEast.lng];
    // var northwest = [bounds._northEast.lat, bounds._southWest.lng];
    // var visible_extent = turf.polygon([[southwest, southeast, northeast, northwest, southwest]]);
    // console.log(visible_extent);
    
    console.log("Current visible bounds:");
    console.log("South West corner: ", southWest);
    console.log("North East corner: ", northEast);
    return [southWest.lng, southWest.lat, northEast.lng, northEast.lat];

}


