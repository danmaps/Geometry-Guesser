import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';

export class ExtractTool extends Tool {
    constructor() {
        super("Extract", [
            new Parameter("Polygon","dropdown",""),
            new Parameter("Distance", "number"),
            new Parameter("Units","dropdown","meters",["meters","feet","miles"])    
        ]);
    }

}

