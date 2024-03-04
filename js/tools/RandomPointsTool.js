import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';
import { drawnItems, map } from '../app.js'; // Adjust the path as necessary

/**
 * Represents a tool for adding random points within selected polygon.
 * @extends Tool
 */
export class RandomPointsTool extends Tool {
    /**
     * Constructs an instance of RandomPointsTool.
     */
    constructor() {    
        super("Random Points", [
            new Parameter("Polygon",  "Polygon to add random points within.", "dropdown", ""),
            new Parameter("Points Count", "Number of random points to generate.", "number", 5)
        ]);

        this.description = 'Adds random points within selected polygon';
    }

    /**
     * Executes the RandomPointsTool logic, adding specified number of random points within a selected polygon.
     */
    execute() {
        const polygonIdInput = document.getElementById('param-Polygon');
        const pointsCountInput = document.getElementById('param-Points Count');

        const polygonId = polygonIdInput ? parseInt(polygonIdInput.value, 10) : null;
        const pointsCount = pointsCountInput ? parseInt(pointsCountInput.value, 10) : 0;

        console.log(`Executing RandomPointsTool with Polygon ID: ${polygonId} and Points Count: ${pointsCount}`);
        drawnItems.eachLayer(function(layer) {
            // Check if the current layer matches the specified polygon ID
            if (layer instanceof L.Polygon && layer._leaflet_id === polygonId) {
                let polygon = layer.toGeoJSON();
    
                for (let i = 0; i < pointsCount; i++) {
                    let pointAdded = false;
                    while (!pointAdded) {
                        let randomPoint = turf.randomPoint(1, {bbox: turf.bbox(polygon)}); // https://turfjs.org/docs/#randomPoint
                        //todo: consider upgrade to turf.pointsWithinPolygon(points, searchWithin);
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

    // Dynamically populate dropdown when the tool is selected
    renderUI() {
        super.renderUI(); // Ensure any base UI rendering logic is called

        // Dynamically update the polygon dropdown options based on drawnItems
        const polygonIdInput = document.getElementById('param-Polygon');
        if (polygonIdInput) {
            // Clear existing options
            polygonIdInput.innerHTML = '';

            // Populate dropdown with current polygons
            drawnItems.eachLayer(function(layer) {
                if (layer instanceof L.Polygon) {
                    const option = document.createElement('option');
                    option.value = layer._leaflet_id.toString();
                    option.text = "Polygon " + layer._leaflet_id;
                    polygonIdInput.appendChild(option);
                }
            });
        }
    }
}
