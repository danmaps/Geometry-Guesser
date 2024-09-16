const toolNames = ['RandomPointsTool', 'BufferTool', 'ExportTool', 'GenerateAIFeatures']; // Keep this up to date

// Initialize the map
export const map = L.map('map').setView([34, -117], 7);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
}).addTo(map);

export const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);


document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('toolSelection').style.display = 'block';
    document.getElementById('toolDetails').classList.add('hidden');
    const statusMessage = document.getElementById('statusMessageText');
    statusMessage.textContent = "";
    // hide div div id="statusMessage"
    document.getElementById('statusMessage').style.display = 'none';
});


// Set up an array to keep track of layers added to the TOC
export const tocLayers = [];
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
    console.log("Loaded tools:", loadedTools);

    return loadedTools[name] || null;
}

// Function to update the DataContent div
function updateDataContent() {
    let content = document.getElementById('DataContent');
    let geoJsonData = JSON.stringify(drawnItems.toGeoJSON(), null, 2);
    content.innerHTML = `<code class="language-json">${Prism.highlight(geoJsonData, Prism.languages.json, 'json')}</code>`;

    // If there's a div with id toolName showing, run the associated tool's renderUI method
    const toolElement = document.getElementById('toolName');
    if (toolElement) {
        let toolname = toolElement.getAttribute('tool');
        let tool = getToolByName(toolname);
        console.log(`trying to render UI for ${toolname}`);
        console.log(tool);
        if (tool) {
            tool.renderUI();
        }
    }
}

// Event listener for when a new feature is drawn
map.on(L.Draw.Event.CREATED, function (e) {
    let type = e.layerType,
        layer = e.layer;
    
    drawnItems.addLayer(layer);
    
    let message = '';
    if (type === 'marker') {
        let latlng = layer.getLatLng();
        message = `${layer._leaflet_id} ${type}`;
    } else {
        let vertices = layer.getLatLngs()[0];
        message = `${layer._leaflet_id} ${type} (${vertices.length} vertices)`;
    }
    
    console.log(message);
    addToToc(layer, message);
    updateDataContent();
});

// Event listener for when features are edited
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

// Event listener for when features are deleted
map.on('draw:deleted', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        drawnItems.removeLayer(layer);
        removeMessageForLayer(layer);
    });
    updateDataContent();
});

// Function to add layer information to the table of contents (TOC)
function addToToc(layer, message) {
    let messageId = `message-${layer._leaflet_id}`;
    document.getElementById('tocContent').innerHTML += `<p id="${messageId}">${message}</p>`;
    tocLayers.push(layer);
}

// Load tools dynamically and store them in the loadedTools object
document.addEventListener('DOMContentLoaded', () => {
    Promise.all(toolNames.map(name => 
        import(`./tools/${name}.js`).then(module => {
            const ToolClass = module[name]; // Assuming the tool class is exported with the same name
            const toolInstance = new ToolClass();
            loadedTools[name] = toolInstance;
        })
    )).then(() => {
        renderToolList(Object.values(loadedTools));
    });
});

// Function to render tool list in the UI
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

// Helper to remove messages related to deleted layers
function removeMessageForLayer(layer) {
    const messageElement = document.getElementById(`message-${layer._leaflet_id}`);
    if (messageElement) {
        messageElement.remove();
    }
}

// Call updateDataContent after ensuring Prism is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateDataContent();
});
