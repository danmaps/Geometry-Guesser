import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';



/**
 * A tool tool for generating AI features.
 * Calls an API associated with an AI to interpret the user prompt.
 * Draws the features on the map.
 * 
 * Infers layer name, description, and fields from the prompt.
 * 
 * 
 */

export class GenerateAIFeatures extends Tool {

    constructor() {    
        super("Generate AI Features", [
            new Parameter("Prompt","The prompt to generate AI features","text","")  
        ]);
    }


    execute() {
            (async () => {
            const prompt = document.getElementById('param-Prompt').value;
        
            const response = await fetch('http://127.0.0.1:3000/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: prompt })
            });
        
            const data = await response.json();
            console.log(data);
        })();
    }
}