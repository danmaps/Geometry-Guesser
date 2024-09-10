import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';
import { drawnItems, map } from '../app.js'; // Adjust the path as necessary

export class ExportTool extends Tool {
    constructor() {
        super("Export", [
            new Parameter("Layer","layer to export","dropdown",""),
            new Parameter("Format","format to export","dropdown","geojson")  
        ]);

        this.description = "Export data";
    }
    execute() {
        console.log("Exporting data...");
        const inputLayerId = document.getElementById('param-Layer').value;
        const format = document.getElementById('param-Format').value;

        let data = drawnItems.toGeoJSON();
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", `${inputLayerId}.${format.toLowerCase()}`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
    }

    renderUI() {
        super.renderUI(); 

        // update the polygon dropdown options based on drawnItems
        const layerID = document.getElementById('param-Layer');
        if (layerID) {
            layerID.innerHTML = ''; // Clear existing options

            // Populate dropdown with current map data
            drawnItems.eachLayer(function(layer) {
                const option = document.createElement('option');
                option.value = layer._leaflet_id.toString();
                option.text = layer._leaflet_id;
                layerID.appendChild(option);
            });
        }

        // populate the format dropdown
        const formatID = document.getElementById('param-Format');
        if (formatID) {
            formatID.innerHTML = ''; // Clear existing options
            formatID.appendChild(document.createElement('GeoJSON'));
            formatID.appendChild(document.createElement('KML'));
            formatID.appendChild(document.createElement('CSV'));
            formatID.appendChild(document.createElement('GeoPackage'));
            formatID.appendChild(document.createElement('Shapefile'));
        }
    }


}

