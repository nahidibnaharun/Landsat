const key = 'tYkgK0rFt2fS776eqiye';
const map = L.map('map').setView([49.2125578, 16.62662018], 14);

L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`, {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "&copy; MapTiler &copy; OpenStreetMap contributors",
}).addTo(map);

L.control.maptilerGeocoding({ apiKey: key }).addTo(map);

let marker;

document.getElementById('searchButton').addEventListener('click', function() {
    const location = document.getElementById('locationInput').value;
    fetch(`https://api.maptiler.com/geocoding/${location}.json?key=${key}`)
        .then(response => response.json())
        .then(data => {
            const coords = data.features[0].geometry.coordinates;
            map.setView([coords[1], coords[0]], 14);
            if (marker) {
                marker.remove();
            }
            marker = L.marker([coords[1], coords[0]]).addTo(map);
            createGrid(coords[1], coords[0]);
        });
});

// Set coordinates from input
document.getElementById('setCoordsButton').addEventListener('click', function() {
    const lat = parseFloat(document.getElementById('latInput').value);
    const lon = parseFloat(document.getElementById('lonInput').value);
    if (lat && lon) {
        map.setView([lat, lon], 14);
        if (marker) {
            marker.remove();
        }
        marker = L.marker([lat, lon]).addTo(map);
        createGrid(lat, lon);
    }
});

// Create a 3x3 grid around the pinned location
function createGrid(lat, lon) {
    // Clear existing grid layers
    if (window.gridLayers) {
        window.gridLayers.forEach(layer => layer.remove());
    }
    window.gridLayers = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const pixelLat = lat + (i - 1) * 0.01;
            const pixelLon = lon + (j - 1) * 0.01;
            const pixelMarker = L.rectangle([[pixelLat - 0.005, pixelLon - 0.005], [pixelLat + 0.005, pixelLon + 0.005]], { color: 'red', weight: 1 }).addTo(map);
            window.gridLayers.push(pixelMarker);
        }
    }
}

// Fetch Landsat data based on defined parameters
document.getElementById('fetchDataButton').addEventListener('click', function() {
    const leadTime = document.getElementById('leadTimeInput').value;
    const cloudCover = document.getElementById('cloudCoverInput').value;

    // Assuming lat/lon are defined, you might want to store the last marker position
    const lat = marker.getLatLng().lat;
    const lon = marker.getLatLng().lng;

    console.log(`Fetching data for lat: ${lat}, lon: ${lon}, lead time: ${leadTime} min, max cloud cover: ${cloudCover}%`);
    
    // Here you would call your API to get the Landsat data based on the parameters
});

// TLE data downloader
document.getElementById('downloadLandsat7').addEventListener('click', function() {
    downloadTLE('Landsat 7 TLE', `1 25682U 99020A   24277.23908774  .00002599  00000+0  53885-3 0  9991\n2 25682  97.8820 298.9174 0001602  80.8198 346.2761 14.60989188354973`);
});

document.getElementById('downloadLandsat8').addEventListener('click', function() {
    downloadTLE('Landsat 8 TLE', `1 39084U 13008A   24277.15394673  .00002416  00000+0  54632-3 0  9991\n2 39084  98.2190 345.4070 0001297  94.2279 265.9068 14.57103192619139`);
});

document.getElementById('downloadLandsat9').addEventListener('click', function() {
    downloadTLE('Landsat 9 TLE', `1 49260U 21088A   24277.18833824  .00002497  00000+0  56417-3 0  9996\n2 49260  98.2218 345.4377 0001367  90.8119 269.3236 14.57112007160412`);
});

function downloadTLE(name, data) {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
