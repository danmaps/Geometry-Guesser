// Initialize the map
let map = L.map('map').setView([34, -117], 7);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
}).addTo(map);

let drawnItems = new L.FeatureGroup();
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
    updatePolygonSelector();

    if (type === 'polygon') {
        let vertices = layer.getLatLngs()[0];
        let message = `I see polygon ${layer._leaflet_id} with ${vertices.length} vertices`;
        addMessageForLayer(layer,message);
    }
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

// Adjust the event listener for when features are deleted to also remove messages
map.on('draw:deleted', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        // Remove the layer from the drawnItems featureGroup
        drawnItems.removeLayer(layer);
        // Remove the corresponding message
        removeMessageForLayer(layer);
    });
    // Make sure to update the DataContent as well after deletion
    updateDataContent();
    updatePolygonSelector();
});

// Event listener for when features are deleted
map.on('draw:deleted', function () {
    updateDataContent();
    updatePolygonSelector();
});

// Event listener for when features are edited
map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        // Check if the layer is a polygon
        if (layer instanceof L.Polygon) {
          removeMessageForLayer(layer)
          let vertices = layer.getLatLngs()[0];
          let message = `I see your polygon with ${vertices.length} vertices`;
          addMessageForLayer(layer,message);
        }
    });
    
    // Optional: Update any other UI components or data representations as necessary
    updateDataContent();
    updatePolygonSelector();
});

function addRandomPointsToPolygons() {
    drawnItems.eachLayer(function(layer) {
        if (layer instanceof L.Polygon) {
            // Convert the Leaflet polygon to a GeoJSON polygon
            let polygon = layer.toGeoJSON();
            // Define how many points you want to add
            let pointsCount = 5; // Example: Adjust as needed

            for (let i = 0; i < pointsCount; i++) {
                let pointAdded = false;
                while (!pointAdded) {
                    // Generate a single random point within the bounding box
                    let randomPoint = turf.randomPoint(1, {bbox: turf.bbox(polygon)});
                    // Check if the random point is within the polygon
                    if (turf.booleanPointInPolygon(randomPoint.features[0], polygon)) {
                        let pointCoords = randomPoint.features[0].geometry.coordinates;
                        // Add the point to the map
                        L.marker([pointCoords[1], pointCoords[0]]).addTo(map);
                        pointAdded = true;
                    }
                }
            }
        }
    });
}

// document.getElementById('fillPolygons').addEventListener('click', addRandomPointsToSpecificPolygon);
document.getElementById('fillPolygons').addEventListener('click', () => {
    // Retrieve the selected polygon ID from the dropdown
    var polygonId = parseInt(document.getElementById('polygonSelector').value);

    // Retrieve the number of points to add from the input
    var pointsCount = parseInt(document.getElementById('pointsCount').value, 10);

    addRandomPointsToSpecificPolygon(polygonId, pointsCount);
});

function updatePolygonSelector() {
    let selector = document.getElementById('polygonSelector');
    selector.innerHTML = ''; // Clear existing options
    drawnItems.eachLayer(function(layer) {
        if (layer instanceof L.Polygon) {
            let option = document.createElement('option');
            option.value = layer._leaflet_id; // Use Leaflet's internal ID or your custom ID
            option.textContent = "Polygon " + layer._leaflet_id; // Customize option text as needed
            selector.appendChild(option);
        }
    });
}


document.querySelectorAll('.tool').forEach(item => {
    item.addEventListener('click', function() {
        let toolName = this.getAttribute('data-tool');
        showToolDetails(toolName);
    });
});

document.getElementById('backButton').addEventListener('click', function() {
    document.getElementById('toolSelection').style.display = 'block';
    document.getElementById('toolDetails').classList.add('hidden');
});

function showToolDetails(toolName) {
    let toolContent = document.getElementById('toolContent');
    toolContent.innerHTML = ''; // Clear existing content

    if (toolName === "Random Points") {
        let dropdown = '<select id="polygonSelector">';
        drawnItems.eachLayer(function(layer) {
            if (layer instanceof L.Polygon) {
                dropdown += `<option value="${layer._leaflet_id}">Polygon ${layer._leaflet_id}</option>`;
            }
        });
        dropdown += '</select>';
        let slider = '<input type="range" id="pointsCount" min="1" max="100" value="10">';
        toolContent.innerHTML = `<h2>${toolName}</h2>${dropdown}<br>${slider}`;
    }
    // Similar setup for Buffer tool...

    document.getElementById('toolSelection').style.display = 'none';
    document.getElementById('toolDetails').classList.remove('hidden');
}

