const map = L.map('map').setView([51.505, -0.09], 13);

const osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<\/a> contributors'
}).addTo(map);

map.createPane("left")
map.createPane("right")

var leftCircle = L.circle([51.505, -0.09], {
    //pane: "left",
    radius: 1000,
    color: "#ff0000"
}).addTo(map);

var rightCircle = L.circle([51.505, -0.09], {
    //pane: "right",
    radius: 1000,
    color: "#0000ff"
}).addTo(map);


leftCircle.pane = "left";
rightCircle.pane = "right";

const side_by_side = L.control.sideBySide(leftCircle, rightCircle).addTo(map);