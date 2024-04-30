// Add all scripts to the JS folder

var map; 

var minimalBasemap;


// PopupContent constructor function
function PopupContent(properties, attribute){
    this.properties = properties;
    this.attribute = attribute;
    this.Project_Na = this.properties.Project_Na
    this.COM_Link = this.properties.COM_Link;
    this.Engineerin = this.properties.Engineerin;

    var link = this.COM_Link;

    this.formatted = "<p><b>Project Name: </b>" + this.properties.Project_Na + 
    "</p><p><a href=\"" + link + "\">City of Madison Link</a></p>";
}

/* Stackoverflow code for loading geojson once when checkbox ticked
   then storing the geojson so it doesn't load each time
async function getGeojson(checkbox, layerName) {
    if (layers[layerName]) {
        if (checkbox.checked) layers[layerName].addTo(map);
        else map.removeLayer(layers[layerName]);
        return;
    }

    const response = await fetch(`data/${layerName}.geojson`);
    const geojson = await response.json();
    return geojson;
}

var layers = {};

const togglejsonLayer = async (checkbox, layerName) => {
    
    console.log("layers: " + layers);
    
    const geojsonData = await getGeojson(checkbox, layerName);
    const geojson = L.geoJSON([geojsonData], { });

    const checkId = checkbox.id;
    if (checkbox.checked) {
        layers[layerName] = geojson;
        layers[layerName].addTo(map);
    } else map.removeLayer(layers[layerName]);
};
*/

function createMap(){

    map = L.map('map').setView([43.07, -89.4], 13);

    // set max bounds for the map -- MAY WANT TO ADJUST LATER
    map.setMaxBounds(map.getBounds().pad(2));

    /* panes for hierarchy testing
    map.createPane('top');
    map.createPane('middle');
    map.createPane('bottom');

    map.getPane('top').style.zIndex = 380;
    map.getPane('middle').style.zIndex = 360;
    map.getPane('bottom').style.zIndex = 340;
    */

    // set basemap
    minimalBasemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        minZoom: 11,
    }).addTo(map);

    
    // create panes for leaflet sideBySide
    map.createPane("left");
    map.createPane("right");


    // fetch local geojson data through promises as json
    var promises = [fetch("data/current_bike_paths.geojson").then(function(r) {return r.json()}), 
                    fetch("data/programmed_bike_paths.geojson").then(function(r) {return r.json()})
                    ];

    // run callback function to manipulate json data after data is loaded
    Promise.all(promises).then(callback); 

    function callback(data) {

        // set layers as geojson objects
        var current_bike_paths = L.geoJSON(data[0], { 
                pane: "left"
            }),
            programmed_bike_paths = L.geoJSON(data[1], {
                pane: "right",
                color: "orange" 
            });


        // assign a pane to each layer -- ERRORS
        //current_bike_paths.pane = "left";
        //programmed_bike_paths.pane = "right";

        // testing pane printing
        //console.log(current_bike_paths.pane);
        //console.log(programmed_bike_paths.pane);
        

        // add selected layers to map
        current_bike_paths.addTo(map);
        programmed_bike_paths.addTo(map);


        // leaflet side by side compare of two layers
        L.control.sideBySide(current_bike_paths, programmed_bike_paths).addTo(map);
    }


};

    
    
/*

// Create an array of the attributes to keep track of their order (for the slider)
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    console.log("processing data");

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        attributes.push(attribute);
    };


    return attributes;
};



// Attach pop-ups to each mapped feature
function pointToLayer(feature, latlng, attributes){
    
    // attribute for scaling the proportional symbols
    var attribute = attributes[0];

    // create marker options
    var options = {
        radius: 8,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    
    //create circle marker layer
    var layer = L.circleMarker(latlng, options);
    
    
    
    // create popup content
    var popupContent = new PopupContent(feature.properties, attribute);
    
    // bind the pop-up to the circle marker 
    layer.bindPopup(popupContent.formatted, {
        offset: new L.Point(0,-options.radius)
    });
    

    return layer;
};

*/

document.addEventListener('DOMContentLoaded',createMap);
