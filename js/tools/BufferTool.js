
// https://stackoverflow.com/a/65320730
// https://jsfiddle.net/rp1320mf/
// https://turfjs.org/docs/#buffer


import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';
import { drawnItems, tocLayers ,map } from '../app.js'; // Adjust the path as necessary

/**
 * Represents a tool for adding a buffer to the selected layer.
 * @extends Tool
 */
export class BufferTool extends Tool {
    /**
     * Constructs an instance of BufferTool.
     */
    constructor() {    
        super("Buffer", [
            new Parameter("Input Layer","The input layer to buffer","dropdown",""),
            new Parameter("Distance", "The distance", "float", 10),
            new Parameter("Units","The units for the distance", "dropdown","miles", ["feet","miles","kilometers","degrees"])    
        ]);

        this.description = 'Makes a buffer around the input layer';
    }

    /**
     * Executes the BufferTool logic.
     */
    execute() {
        super.execute();

        // Retrieve the selected input layer's ID from the dropdown
        const inputLayerId = document.getElementById('param-Input Layer').value;
        // Retrieve the buffer distance
        const distance = parseFloat(document.getElementById('param-Distance').value);
        // Retrieve the selected units from the dropdown
        const units = document.getElementById('param-Units').value;
    
        // Find the selected layer by ID from the tocLayers array
        let selectedLayerGeoJSON;
        for (let i = 0; i < tocLayers.length; i++) {
            if (tocLayers[i]._leaflet_id.toString() === inputLayerId) {
                selectedLayerGeoJSON = tocLayers[i].toGeoJSON();
                break;
            }
        }
    
        // Ensure a layer was selected and convert to GeoJSON was successful
        if (!selectedLayerGeoJSON) {
            this.setStatus(2, 'No layer selected.');
            return;
        }

        // if no distance is selected, return
        if (isNaN(distance)) {
            this.setStatus(2, 'No distance selected.');
            return;
        }
    
        // Use Turf.js to buffer the selected layer
        const buffered = turf.buffer(selectedLayerGeoJSON, distance, {units: units});

        // Add metadata to the layer with tool name and parameters
        buffered.toolMetadata = {
            name: this.name,
            parameters: this.parameters
        };

        // Add the buffered area to the map - this requires converting the Turf GeoJSON back to a Leaflet layer
        const bufferedLayer = L.geoJSON(buffered).addTo(map);

        this.setStatus(0, 'Buffered layer added to map.');
    }
    
    renderUI() {
        super.renderUI(); 

        // update the polygon dropdown options based on tocLayers
        const inputLayer = document.getElementById('param-Input Layer');
        if (inputLayer) {
            inputLayer.innerHTML = ''; // Clear existing options

            // Add an option for each layer in the tocLayers array
            for (let i = 0; i < tocLayers.length; i++) {
                const layer = tocLayers[i];
                const option = document.createElement('option');
                option.value = layer._leaflet_id.toString();
                option.text = layer._leaflet_id;
                inputLayer.appendChild(option);
            }

        }

        // Populate the "Units" dropdown using the information from the Parameter object
        const unitsParameter = this.parameters.find(p => p.name === "Units");
        if (unitsParameter && unitsParameter.options) {
            const unitsInput = document.getElementById('param-Units');
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
