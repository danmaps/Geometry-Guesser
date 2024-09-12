import { Tool } from '../models/Tool.js';
import { Parameter } from '../models/Parameter.js';
import { drawnItems, map } from '../app.js'; // Adjust the path as necessary



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
        
            const response = await fetch('http://127.0.0.1:3000/api/ai_geojson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: prompt })
            });
        
            const data = await response.json();
            console.log(data);
            // Add the generated GeoJSON to the map
            
            let layer = L.geoJSON(data);
            // convert to a geojson layer
            
            //add popups for the geojson attributes
            layer.eachLayer(function (layer) {
                let attributes =layer.feature.properties;
                let popupContent = "";
                popupContent += "<table>";
                for (let key in attributes) {
                    // Add the attribute and value to the popup formatted as a html table
                    popupContent += "<tr><td>" + key + "</td><td>" + attributes[key] + "</td></tr>";
                    
                    }
                popupContent += "</table>";
                layer.bindPopup(popupContent);
            })
            layer.addTo(map);
        })();
    }
}