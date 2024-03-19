import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';

export class ExportTool extends Tool {
    constructor() {
        super("Export", [
            new Parameter("Polygon","drawn polygon to export","dropdown",""),
            new Parameter("Format","format","dropdown,","geojson")  
        ]);
    }

}

