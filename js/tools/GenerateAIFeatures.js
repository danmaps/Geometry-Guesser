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


    async execute() {
        //get api key from backend
        
        const prompt = document.getElementById('param-Prompt').value;
        const response = await fetch(`https://api.openai.com/v1/engines/text-davinci-002/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 1024,
                n: 1,
                stop: null,
                temperature: 0.5
            })
        });
        const data = await response.json();
        console.log(data);
    }
}