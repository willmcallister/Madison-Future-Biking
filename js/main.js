// Add all scripts to the JS folder

var map = L.map('map').setView([43.07, -89.4], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
