// const turf = require('@turf/turf');

const toolNames = ['RandomPointsTool', 'BufferTool', 'ExportTool', 'GenerateAIFeatures', 'GroupTool', 'AddDataTool']; // Keep this up to date

// Initialize the map
const map = L.map('map').setView([34, -117], 7);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('toolSelection').style.display = 'block';
    document.getElementById('toolDetails').classList.add('hidden');
    const statusMessage = document.getElementById('statusMessageText');
    statusMessage.textContent = "";
    document.getElementById('statusMessage').style.display = 'none';
});

// Set up an array to keep track of layers added to the TOC
const tocLayers = [];
const loadedTools = {}; // Object to store instantiated tools

let drawControl = new L.Control.Draw({
    draw: {
        // Options here
    },
    edit: {
        featureGroup: drawnItems,
    },
});
map.addControl(drawControl);

// Function to get a tool instance by name
function getToolByName(name) {
    return loadedTools[name] || null;
}

// Function to update the DataContent div
function updateDataContent() {
    let content = document.getElementById('DataContent');
    let geoJsonData = JSON.stringify(drawnItems.toGeoJSON(), null, 2);
    content.innerHTML = `<code class="language-json">${Prism.highlight(geoJsonData, Prism.languages.json, 'json')}</code>`;

    const toolElement = document.getElementById('toolName');
    if (toolElement) {
        let toolname = toolElement.getAttribute('tool');
        let tool = getToolByName(toolname);
        if (tool) {
            tool.renderUI();
        }
    }
}

// Event listeners remain the same...
map.on(L.Draw.Event.CREATED, function (e) {
    let type = e.layerType,
        layer = e.layer;
    
    drawnItems.addLayer(layer);


    
    let message = '';
    if (type === 'marker') {
        let latlng = layer.getLatLng();
        message = `${layer._leaflet_id}`;
    } else {
        let vertices = layer.getLatLngs()[0];
        message = `${layer._leaflet_id} ${type} (${vertices.length} vertices)`;
    }
    
    // console.log(message);
    addToToc(layer, message, type);
    updateDataContent();
});

map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        removeMessageForLayer(layer);
        let vertices = layer.getLatLngs()[0];
        let message = `${layer._leaflet_id} (${vertices.length} vertices)`;
        addToToc(layer, message);
    });
    updateDataContent();
});

map.on('draw:deleted', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        drawnItems.removeLayer(layer);
        removeMessageForLayer(layer);
    });
    updateDataContent();
});

map.on('layeradd', function (e) {
    let layer = e.layer;
    // console.log(layer)
    // if layer has a feature.toolMetadata, add the layer to the TOC
    if (layer.hasOwnProperty('feature') && layer.feature.toolMetadata) {
        // console.log(`Adding ${layer._leaflet_id} ${layer.featureType} to the TOC because it was made by the ${layer.feature.toolMetadata.name} tool.`);
        let featureType = layer.feature.geometry.type;
        let message = `${layer._leaflet_id} ${featureType}`;
        // console.log(message)
        addToToc(layer, message);
    }
});
let layerMessageMap = new Map();

function addToToc(layer, message, type) {
    // map types to fontawesome icons
    let iconMap = {
        marker: 'fa-solid fa-location-pin',
        rectangle: 'fa-solid fa-draw-polygon',
        circle: 'fa-solid fa-draw-polygon',
        polyline: 'fa-solid fa-draw-polygon',
        polygon: 'fa-solid fa-draw-circle',
    };
    let messageId = `message-${layer._leaflet_id}`;
    document.getElementById('tocContent').innerHTML += `<p class="layer-message" id="${messageId}"><i class="${iconMap[type]}"></i> ${message}</p>`;
    tocLayers.push(layer);
}

// Load tools dynamically and store them in the loadedTools object
document.addEventListener('DOMContentLoaded', () => {
    // Load tools synchronously since we're using require
    toolNames.forEach(name => {
        try {
            const ToolClass = require(`./tools/${name}`)[name];
            loadedTools[name] = new ToolClass();
        } catch (error) {
            console.error(`Failed to load tool: ${name}`, error);
        }
    });
    renderToolList(Object.values(loadedTools));
});

function renderToolList(tools) {
    const toolContainer = document.getElementById('toolSelection');
    tools.forEach(tool => {
        const toolDiv = document.createElement('div');
        toolDiv.className = 'tool';
        toolDiv.textContent = tool.name;
        toolDiv.addEventListener('click', () => {
            const toolNameElement = document.getElementById('toolName');
            if (toolNameElement) {
                toolNameElement.setAttribute('tool', tool.constructor.name);
                tool.renderUI();
            } else {
                console.error("Element with ID 'toolName' not found.");
            }
        });
        toolContainer.appendChild(toolDiv);
    });
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

document.addEventListener('DOMContentLoaded', () => {
    updateDataContent();
});

// Export necessary variables and functions
module.exports = {
    map,
    drawnItems,
    tocLayers
};

