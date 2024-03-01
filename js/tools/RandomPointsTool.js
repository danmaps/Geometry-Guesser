function addRandomPointsToSpecificPolygon(polygonId, pointsCount) {
    drawnItems.eachLayer(function(layer) {
        // Check if the current layer matches the specified polygon ID
        if (layer instanceof L.Polygon && layer._leaflet_id === polygonId) {
            let polygon = layer.toGeoJSON();

            for (let i = 0; i < pointsCount; i++) {
                let pointAdded = false;
                while (!pointAdded) {
                    let randomPoint = turf.randomPoint(1, {bbox: turf.bbox(polygon)});
                    if (turf.booleanPointInPolygon(randomPoint.features[0], polygon)) {
                        let pointCoords = randomPoint.features[0].geometry.coordinates;
                        L.marker([pointCoords[1], pointCoords[0]]).addTo(map);
                        pointAdded = true;
                    }
                }
            }
        }
    });
}
