
// https://stackoverflow.com/a/65320730
// https://jsfiddle.net/rp1320mf/
// https://turfjs.org/docs/#buffer


import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';
import { drawnItems, map } from '../app.js'; // Adjust the path as necessary

/**
 * Represents a tool for adding adding a buffer to the selected layer.
 * @extends Tool
 */
export class BufferTool extends Tool {
    /**
     * Constructs an instance of BufferTool.
     */
    constructor() {    
        super("Buffer", [
            new Parameter("Input Layer","The input layer to buffer","dropdown",""),
            new Parameter("Distance", "The distance", "float"),
            new Parameter("Units","The units for the distance", "dropdown","miles", ["miles","kilometers","degrees"])    
        ]);

        this.description = 'Makes a buffer around the input layer';
    }

    /**
     * Executes the BufferTool logic.
     */
    execute() {
        // Retrieve the selected input layer's ID from the dropdown
        const inputLayerId = document.getElementById('param-Input Layer').value;
        // Retrieve the buffer distance
        const distance = parseFloat(document.getElementById('param-Distance').value);
        // Retrieve the selected units from the dropdown
        const units = document.getElementById('param-Units').value;
    
        // Find the selected layer by ID from the drawnItems layer group
        let selectedLayerGeoJSON;
        drawnItems.eachLayer(function(layer) {
            if (layer._leaflet_id.toString() === inputLayerId) {
                // Convert the selected layer to GeoJSON
                selectedLayerGeoJSON = layer.toGeoJSON();
            }
        });
    
        // Ensure a layer was selected and convert to GeoJSON was successful
        if (!selectedLayerGeoJSON) {
            console.error('Selected layer could not be found or converted to GeoJSON.');
            return;
        }
    
        // Use Turf.js to buffer the selected layer
        const buffered = turf.buffer(selectedLayerGeoJSON, distance, {units: units});
    
        // Add the buffered area to the map - this requires converting the Turf GeoJSON back to a Leaflet layer
        const bufferedLayer = L.geoJSON(buffered).addTo(map);
    
        // fit the map view to the buffered area
        // map.fitBounds(bufferedLayer.getBounds());
    }
    

    // populate dropdown when the tool is selected
    renderUI() {
        super.renderUI(); 

        // update the polygon dropdown options based on drawnItems
        const polygonIdInput = document.getElementById('param-Input Layer');
        if (polygonIdInput) {
            polygonIdInput.innerHTML = ''; // Clear existing options

            // Populate dropdown with current map data
            drawnItems.eachLayer(function(layer) {
                const option = document.createElement('option');
                option.value = layer._leaflet_id.toString();
                option.text = layer._leaflet_id;
                polygonIdInput.appendChild(option);
            });
        }

        // Populate the "Units" dropdown using the information from the Parameter object
        const unitsParameter = this.parameters.find(p => p.name === "Units");
        if (unitsParameter && unitsParameter.options) {
            const unitsInput = document.getElementById('param-Units');
            if (unitsInput) {
                unitsInput.innerHTML = ''; // Clear existing options

                // Populate dropdown with units options from the Parameter object
                unitsParameter.options.forEach(unit => {
                    const option = document.createElement('option');
                    option.value = unit;
                    option.text = unit.charAt(0).toUpperCase() + unit.slice(1); // Capitalize the first letter
                    if (unit === unitsParameter.defaultValue) {
                        option.selected = true; // Set the default value as selected
                    }
                    unitsInput.appendChild(option);
                });
            }
        }
    }
}
