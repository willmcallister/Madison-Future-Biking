// Add all scripts to the JS folder

var map; 

var minimalBasemap;

var juxtapose = null;
var comparisonGroup = null;
var mainGroup = null;



// PopupContent constructor function
function PopupContent(feature){
    this.properties = feature.properties;

    this.Project_Na = this.properties.Project_Na
    this.COM_Link = this.properties.COM_Link;
    this.Engineerin = this.properties.Engineerin;

    var link = this.COM_Link;

    this.formatted = "<p><b>Project Name: </b>" + this.properties.Project_Na + 
    "</p><p><a href=\"" + link + "\">City of Madison Link</a></p>";
}


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
    var promises = [fetch("data/project_locations.geojson").then(function(r) {return r.json()}),
                    fetch("data/current_bike_paths.geojson").then(function(r) {return r.json()}), 
                    fetch("data/programmed_bike_paths.geojson").then(function(r) {return r.json()}),
                    fetch("data/planned_feasible_bike_paths.geojson").then(function(r) {return r.json()})
                    ];

    // run callback function to manipulate json data after data is loaded
    Promise.all(promises).then(callback); 


};

    
function callback(data) {

    comparisonGroup = L.layerGroup();
    mainGroup = L.layerGroup();

    // set layers as geojson objects
    var project_locations = L.geoJSON(data[0], { 
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng);
        }
        }),
        current_bike_paths = L.geoJSON(data[1], { 
        pane: "left"
        }),
        programmed_bike_paths = L.geoJSON(data[2], {
        pane: "right",
        color: "orange" 
        }),
        planned_feasible_bike_paths = L.geoJSON(data[3], {
        color: "yellow"
        });

    // assign a pane to each layer -- CAUSES ERRORS, NEED TO FIX
    //current_bike_paths.pane = "left";
    //programmed_bike_paths.pane = "right";

    // add layers to main map group
    mainGroup.addLayer(project_locations);


    // assign left and right side for comparison 
    // (hard coded now, will use user input later)
    var leftSide = current_bike_paths;
    var rightSide = programmed_bike_paths;

    // add layers to compare to comparison group
    comparisonGroup.addLayer(leftSide);
    comparisonGroup.addLayer(rightSide);

    // add leaflet side by side comparison of two layers to juxtapose control
    juxtapose = L.control.sideBySide(leftSide, rightSide);


    switchMap("mainMap"); // setup main map

};


function switchMap(val) {
    if(val === "mainMap"){
        // switch to main map
        // remove comparison group layer and control
        map.removeLayer(comparisonGroup);
        map.removeControl(juxtapose);

        // add main map group layer
        map.addLayer(mainGroup);
    }
    else {
        // switch to comparison map
        // remove main map group layer
        map.removeLayer(mainGroup);
        
        // add comparison group layer and control
        map.addLayer(comparisonGroup);
        map.addControl(juxtapose);
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

*/

// Attach pop-ups to each mapped feature
function pointToLayer(feature, latlng){

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
    var popupContent = new PopupContent(feature);
    
    // bind the pop-up to the circle marker 
    layer.bindPopup(popupContent.formatted, {
        offset: new L.Point(0,-options.radius)
    });
    
    

    return layer;
    
};



document.addEventListener('DOMContentLoaded',createMap);
