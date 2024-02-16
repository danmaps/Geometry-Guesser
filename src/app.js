// app.js
let map = L.map('map').setView([39.949610, -75.150282], 16);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

let drawControl = new L.Control.Draw({
    draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
        polygon: {
            allowIntersection: false,
        },
    },
    edit: {
        featureGroup: drawnItems,
    },
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
    let content = document.getElementById('DataContent');
    content.textContent = JSON.stringify(drawnItems.toGeoJSON(), null, 2);
    let type = e.layerType,
        layer = e.layer;

    if (type === 'polygon') {
        processPolygon(layer);
    }

    drawnItems.addLayer(layer);
});

function processPolygon(layer) {
    let vertices = layer.getLatLngs()[0];
    let message = `I see your polygon with ${vertices.length} vertices`;
    document.getElementById('messages').innerHTML += `<p>${message}</p>`;


}
