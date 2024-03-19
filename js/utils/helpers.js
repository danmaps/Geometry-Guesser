
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