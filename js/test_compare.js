const map = L.map('map').setView([51.505, -0.09], 13);

const osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<\/a> contributors'
}).addTo(map);

map.createPane("left")
map.createPane("right")

const leftCircle = L.circle([51.505, -0.09], {
    pane: "left",
    radius: 1000,
    color: "#ff0000"
}).addTo(map);

const rightCircle = L.circle([51.505, -0.09], {
    pane: "right",
    radius: 1000,
    color: "#0000ff"
}).addTo(map);

const side_by_side = L.control.sideBySide(leftCircle, rightCircle).addTo(map);