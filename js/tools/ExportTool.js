const { Tool } = require('../models/Tool');
const { Parameter } = require('../models/Parameter');

class ExportTool extends Tool {
    constructor() {
        super("Export", [
            new Parameter("Layer","layer to export","dropdown",""),
            new Parameter("Format","format to export","dropdown","geojson")  
        ]);

        this.description = "Export data";
    }
    execute() {
        super.execute();
        console.log("Exporting data...");
        const inputLayerId = document.getElementById('param-Layer').value;
        const format = document.getElementById('param-Format').value;
        // if geojson format is selected, export as geojson
        if (format === 'GeoJSON') {
            
            // Find the selected layer by ID from the tocLayers array
            let selectedLayerGeoJSON;
            for (let i = 0; i < tocLayers.length; i++) {
                if (tocLayers[i]._leaflet_id.toString() === inputLayerId) {
                    selectedLayerGeoJSON = tocLayers[i].toGeoJSON();
                    break;
                }
            }

            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedLayerGeoJSON));
            let downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", `${inputLayerId}.${format.toLowerCase()}`);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }

    }

    renderUI() {
        super.renderUI(); 
        // update the polygon dropdown options based on tocLayers

        const inputLayer = document.getElementById('param-Layer');

        // Add an option for each layer in the tocLayers array
        for (let i = 0; i < tocLayers.length; i++) {
            const layer = tocLayers[i];
            const option = document.createElement('option');
            option.value = layer._leaflet_id.toString();
            option.text = layer._leaflet_id;
            inputLayer.appendChild(option);
        }
        
        // populate the format dropdown
        const formatID = document.getElementById('param-Format');
        if (formatID) {
            // create an array of options
            const options = ['GeoJSON']; // todo: KML, CSV, GeoPackage, Shapefile

            // loop through the options and create an option element for each one
            for (let i = 0; i < options.length; i++) {
                const option = document.createElement('option');
                option.value = options[i];
                option.text = options[i];
                formatID.appendChild(option);
            }

        }
    }


}

module.exports = { ExportTool };

