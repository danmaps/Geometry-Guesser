import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';

export class RandomPointsTool extends Tool {
    constructor() {
        super("Random Points", [
            new Parameter("Polygon", "dropdown", ""),
            new Parameter("Points Count", "number", 5)
        ]);
    }

    execute() {
        // Assuming 'Polygon' parameter is a dropdown with IDs of polygons and 'Points Count' is a number input
        const polygonIdInput = document.getElementById('param-Polygon'); // Adjust if using a different identifier
        const pointsCountInput = document.getElementById('param-Points Count');

        const polygonId = polygonIdInput ? parseInt(polygonIdInput.value, 10) : null;
        const pointsCount = pointsCountInput ? parseInt(pointsCountInput.value, 10) : 0;

        // Tool-specific execution logic
        console.log(`Executing RandomPointsTool with Polygon ID: ${polygonId} and Points Count: ${pointsCount}`);
        drawnItems.eachLayer(function(layer) {
            // Check if the current layer matches the specified polygon ID
            if (layer instanceof L.Polygon && layer._leaflet_id === polygonId) {
                console.log(layer)
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

    // Override or extend renderUI if necessary
    renderUI() {
        super.renderUI(); // Call the base implementation if needed
        // Specific UI rendering logic for RandomPointsTool
    }
}



