import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';

export class ExportTool extends Tool {
    constructor() {
        super("Export", [
            new Parameter("Polygon","drawn polygon to export","dropdown",""),
            new Parameter("Format","format","dropdown,","geojson")  
        ]);
    }
    execute() {
        console.log("Exporting polygon");
        const inputLayerId = document.getElementById('param-Polygon').value;
        const format = document.getElementById('param-Format').value;
        let data = drawnItems.toGeoJSON();
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "map_data.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
    }

}

