// Initialize the map
export const map = L.map('map').setView([34, -117], 7);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
}).addTo(map);

export const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

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
    content.textContent = JSON.stringify(drawnItems.toGeoJSON(), null, 2);
}

// Initially, show an empty list
updateDataContent();

// Event listener for when a new feature is created
map.on(L.Draw.Event.CREATED, function (e) {
    let type = e.layerType,
        layer = e.layer;

    drawnItems.addLayer(layer);
    updateDataContent();

    let vertices = layer.getLatLngs()[0];
    let message = `I see ${layer._leaflet_id} with ${vertices.length} vertices`;
    console.log(message)
    addMessageForLayer(layer,message);
});

let layerMessageMap = new Map();

function addMessageForLayer(layer, message) {
    let messageId = `message-${layer._leaflet_id}`; // Still generating an ID for the DOM element
    document.getElementById('messages').innerHTML += `<p id="${messageId}">${message}</p>`;
    layerMessageMap.set(layer, messageId); // Associate layer with message ID
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
        let message = `I see ${layer._leaflet_id} with ${vertices.length} vertices`;
        addMessageForLayer(layer,message);
    });
    updateDataContent();
});

document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('toolSelection').style.display = 'block';
    document.getElementById('toolDetails').classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    const toolNames = ['RandomPointsTool', 'BufferTool', 'ExportTool']; // keep this up to date -_-
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
        console.log(loadedTools);
        renderToolList(loadedTools);
        
    });
});

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

