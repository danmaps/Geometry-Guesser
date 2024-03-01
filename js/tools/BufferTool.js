import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';

export class BufferTool extends Tool {
    constructor() {
        super("Buffer", [
            new Parameter("Polygon","dropdown",""),
            new Parameter("Distance", "number"),
            new Parameter("Units","dropdown","meters",["meters","feet","miles"])    
        ]);
    }

}

