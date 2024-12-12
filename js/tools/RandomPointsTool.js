const { Tool } = require('../models/Tool');
const { Parameter } = require('../models/Parameter');
const { logCurrentBounds } = require('../utils/helpers');

/**
 * Represents a tool for adding random points within selected polygon.
 * @extends Tool
 */
class RandomPointsTool extends Tool {
    /**
     * Constructs an instance of RandomPointsTool.
     */
    constructor() {    
        super("Random Points", [
            new Parameter("Points Count", "Number of random points to generate.", "int", 10),
            new Parameter("Inside Polygon",  "Generate points inside polygon", "boolean", false),
            new Parameter("Polygon",  "Polygon to add random points within.", "dropdown", "")
        ]);

        this.description = 'Adds random points within selected polygon';
    }

    /**
     * Executes the RandomPointsTool logic, adding specified number of random points within a selected polygon.
     */
    execute() {
        const pointsCountInput = document.getElementById('param-Points Count');
        const insidePolygonInput = document.getElementById('param-Inside Polygon');
        const polygonIdInput = document.getElementById('param-Polygon');
        
        const pointsCount = pointsCountInput ? parseInt(pointsCountInput.value, 10) : 0;
        const insidePolygon = insidePolygonInput.checked ? true : false;
        const polygonId = polygonIdInput ? parseInt(polygonIdInput.value, 10) : null;
        
        if (insidePolygon){
            // console.log(`Executing RandomPointsTool with Polygon ID: ${polygonId} and Points Count: ${pointsCount}`);
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
                                // set attribute "random" to random text using regex
                                // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
                                randomPoint.features[0].properties.random = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
                                console.log(randomPoint.features[0].properties.random);
                                
                                // create geojson layer
                                let markerLayer = L.geoJSON(randomPoint);
                                markerLayer.addTo(map);

                                // config popups with attributes
                                markerLayer.bindPopup(JSON.stringify(randomPoint.features[0].properties, null, 2));

                                pointAdded = true;
                            }
                        }
                    }
                }
            });
        } else {
            var visible_extent = logCurrentBounds(map)
            let randomPoints = turf.randomPoint(pointsCount, {bbox: visible_extent});
            // Add markers to the map
            randomPoints.features.forEach((point) => {
                var coords = point.geometry.coordinates;
                let markerLayer = L.marker(coords.reverse());
                
                markerLayer.toolMetadata = {
                    name: this.name,
                    parameters: this.parameters
                };
                
                markerLayer.addTo(map);
            });
            
        }
        
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
// Utility function to generate a random string of 5 characters
function generateRandomString() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RandomPointsTool };
} else {
    window.RandomPointsTool = RandomPointsTool;
}