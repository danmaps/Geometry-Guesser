// Function to initialize and render tools
function initializeAndRenderTools(toolConfigs) {
    const toolContainer = document.getElementById('toolSelection');
    toolConfigs.forEach(config => {
        const tool = new Tool(config.name, config.parameters);
        tool.renderUI(toolContainer);
    });
}

// function updatePolygonSelector() {
//     let selector = document.getElementById('polygonSelector');
//     selector.innerHTML = ''; // Clear existing options
//     drawnItems.eachLayer(function(layer) {
//         if (layer instanceof L.Polygon) {
//             let option = document.createElement('option');
//             option.value = layer._leaflet_id; // Use Leaflet's internal ID or your custom ID
//             option.textContent = "Polygon " + layer._leaflet_id; // Customize option text as needed
//             selector.appendChild(option);
//         }
//     });
// }