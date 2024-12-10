import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';
import { tocLayers, map } from '../app.js'; // Adjust the path as necessary

export class ExportTool extends Tool {
    constructor() {
        super("Export", [
            new Parameter("Layer","layer to group","dropdown",""),
            new Parameter("Distance","distance threshold","float",10),
            new Parameter("Units","The units for the distance", "dropdown","miles", ["miles","kilometers","degrees"])
        ]);

        this.description = "Export data";
    }
    execute() {
        super.execute();
        console.log("Exporting data...");
        const inputLayerId = document.getElementById('param-Layer').value;
        const distance = document.getElementById('param-Distance').value;
        const units = document.getElementById('param-Units').value;

        const inputLayer = tocLayers.find(layer => layer._leaflet_id === inputLayerId);

        if (inputLayer) {
            const geojson = inputLayer.toGeoJSON();
            const features = geojson.features;
            const groupedFeatures = this.groupFeatures(features, distance, units);
            const groupedGeojson = { type: 'FeatureCollection', features: groupedFeatures };    
            const geojsonString = JSON.stringify(groupedGeojson);
            const blob = new Blob([geojsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'grouped.geojson';
            link.click();
            URL.revokeObjectURL(url);
        }
    }

    renderUI() {
        super.renderUI(); 
        // update the layer dropdown options based on tocLayers

        const inputLayer = document.getElementById('param-Layer');

        // Add an option for each layer in the tocLayers array
        for (let i = 0; i < tocLayers.length; i++) {
            const layer = tocLayers[i];
            const option = document.createElement('option');
            option.value = layer._leaflet_id.toString();
            option.text = layer._leaflet_id;
            inputLayer.appendChild(option);
        }
    }


}

