// Initialize the map
export const map = L.map('map').setView([34, -117], 7);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
}).addTo(map);

export const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
// set up an array to keep track of layers added to the TOC
export const tocLayers = [];

let drawControl = new L.Control.Draw({
    draw: {
        // Options here
    },
    edit: {
        featureGroup: drawnItems,
    },
});
map.addControl(drawControl);

// Function to update the DataContent div
function updateDataContent() {
    let content = document.getElementById('DataContent');
    let geoJsonData = JSON.stringify(drawnItems.toGeoJSON(), null, 2);
    content.innerHTML = `<code class="language-json">${Prism.highlight(geoJsonData, Prism.languages.json, 'json')}</code>`;
}

// Initially, show an empty list
updateDataContent();

// Event listener for when a new feature is drawn
map.on(L.Draw.Event.CREATED, function (e) {
    let type = e.layerType,
        layer = e.layer;
    
    drawnItems.addLayer(layer);
    updateDataContent();
    // type === 'marker', it is a point, so get the coordinates of the point
    if (type === 'marker') {
        let latlng = layer.getLatLng();
        let message = `${layer._leaflet_id} ${type}`;
        console.log(message)
        addToToc(layer, message);
    }
    else {
        let vertices = layer.getLatLngs()[0];
        let message = `${layer._leaflet_id} ${type} (${vertices.length} vertices)`;
        console.log(message)
        addToToc(layer,message);
    }    
});

// Event listener for when a new feature is added any other way
// inspect the map for any features that were added via addTo(map)
map.on('layeradd', function (e) {
    let layer = e.layer;
    // console.log(layer)
    // if layer has a feature.toolMetadata, add the layer to the TOC
    if (layer.hasOwnProperty('feature') && layer.feature.toolMetadata) {
        let featureType = layer.feature.geometry.type;
        console.log(`Adding ${layer._leaflet_id} ${featureType} to the TOC because it was made by the ${layer.feature.toolMetadata.name} tool.`);
        let message = `${layer._leaflet_id} ${featureType}`;
        console.log(message)
        addToToc(layer, message);
    }

});


let layerMessageMap = new Map();



function addToToc(layer, message) {
    let messageId = `message-${layer._leaflet_id}`; // Still generating an ID for the DOM element
    document.getElementById('tocContent').innerHTML += `<p id="${messageId}">${message}</p>`;
    layerMessageMap.set(layer, messageId); // Associate layer with message ID
    tocLayers.push(layer);
}

function removeMessageForLayer(layer) {
    let messageId = layerMessageMap.get(layer);
    if (messageId) {
        let messageElement = document.getElementById(messageId);
        // console.log(`removing ${messageElement}`);
        if (messageElement) {
            messageElement.remove();
        }
        layerMessageMap.delete(layer); // Remove association
    }
}

// event listener for when features are deleted 
map.on('draw:deleted', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        // Remove the layer from the drawnItems featureGroup
        drawnItems.removeLayer(layer);
        // Remove the corresponding message
        removeMessageForLayer(layer);
    });
    // update the DataContent after deletion
    updateDataContent();
});

// Event listener for when features are edited
map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        removeMessageForLayer(layer)
        let vertices = layer.getLatLngs()[0];
        let message = `${layer._leaflet_id} (${vertices.length} vertices)`;
        addToToc(layer,message);
    });
    updateDataContent();
});

document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('toolSelection').style.display = 'block';
    document.getElementById('toolDetails').classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    const toolNames = ['RandomPointsTool', 'BufferTool', 'ExportTool', 'GenerateAIFeatures']; // keep this up to date -_-
    const loadedTools = []; // To store instantiated tools

    Promise.all(toolNames.map(name => 
        import(`./tools/${name}.js`).then(module => {
            // Access the class using the named export
            const ToolClass = module[name]; // Adjusted for named export
            const toolInstance = new ToolClass();
            loadedTools.push(toolInstance);
        })
    )).then(() => {
        // Once all tools are loaded, proceed with further initialization
        // console.log(loadedTools);
        renderToolList(loadedTools);
        
    });
});

/**
 * Renders a list of tools in the tool container.
 *
 * @param {Array<Object>} tools - An array of tool objects.
 * @return {void} This function does not return anything.
 */
function renderToolList(tools) {
    const toolContainer = document.getElementById('toolSelection');
    tools.forEach(tool => {
        const toolDiv = document.createElement('div');
        toolDiv.className = 'tool';
        toolDiv.textContent = tool.name;
        toolDiv.addEventListener('click', () => tool.renderUI());
        document.getElementById('toolSelection').appendChild(toolDiv);
    });
       
}

import { logCurrentBounds } from './utils/helpers.js';

map.on('moveend', () => logCurrentBounds(map));

// Call updateDataContent after ensuring Prism is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateDataContent();
});
