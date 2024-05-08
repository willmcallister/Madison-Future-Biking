// Add all scripts to the JS folder

var map;
var imageMap;

var minimalBasemap;
var esriWorldImagery;

var juxtapose = null;
var comparisonGroup = null;
var mainGroup = null;

var popupMap = null;



// PopupContent constructor function
function PopupContent(feature){
    this.properties = feature.properties;

    this.Project_Na = this.properties.Project_Na
    this.COM_Link = this.properties.COM_Link;
    this.Engineerin = this.properties.Engineerin;

    var link = this.COM_Link;


    var photoImg;

    if(this.Project_Na === "Sheboygan/Segoe Redesign")
        photoImg = '<img src="data/infrastructure_mockups/575_Segoe.png" height="240px" width="400px"/>';
    else if(this.Project_Na === "Autumn Ridge Path") {
        // photoImg = '<img src="data/infrastructure_mockups/575_AutumnRidgeBridge.svg" height="240px" width="400px"/>';


        photoImg = '<div id="popup-map-autumn" class="popup-map"></div>';

    
    }
    else
        photoImg = '<p>Image Coming Soon...</p>';

        

    this.formatted = "<p><b>Project Name: </b>" + this.properties.Project_Na + 
    "</p><p><a href=\"" + link + "\">City of Madison Link</a></p>" + "</br>"+ photoImg;
}

function createPopupMap(){
    console.log("popup map function");
    if(!popupMap){
        console.log('creating map');

        popupMap = L.map('popup-map-autumn', { 
            minZoom: -3, 
            maxZoom: 2, 
            center: [0, 0], 
            zoom: 1, maxBoundsViscosity: 1, 
            crs: L.CRS.Simple});
        
        var image = L.imageOverlay('/data/infrastructure_mockups/575_AutumnRidgeBridge.png', [[0,0],[742,1151]]);
        image.addTo(popupMap);
        popupMap.setMaxBounds(new L.LatLngBounds([0,0], [742,1151]));
    }

    console.log(popupMap);

    return;
}


function createMap(){

    createImageMap(); //create this map first


    map = L.map('map').setView([43.07, -89.4], 13);

    // set max bounds for the map -- MAY WANT TO ADJUST LATER
    map.setMaxBounds(map.getBounds().pad(2));

    map.on('popupopen', function(e){
        createPopupMap();
    })


    // add control placeholders
    addControlPlaceholders(map);

    // create container for buttons
    var container = L.DomUtil.create('div', 'mapSelectionButtons');

    //disable any mouse event listeners for the container
    L.DomEvent.disableClickPropagation(container);

    // add button at bottom of map
    addFloatingButton(map,'Project Map',()=>{switchMap("projectMap");},'projectMapBtn', container);
    addFloatingButton(map,'Comparison Map',()=>{ switchMap("comparisonMap"); },'comparisonMapBtn', container);   
    
    // Change the position of the Zoom Control to a newly created placeholder.
    //map.zoomControl.setPosition('horizontalcenterbottom');



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
        minZoom: 11
    }).addTo(map);

    esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        minZoom: 11,
        maxZoom: 19
    })//.addTo(map);

    
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


    switchMap("projectMap"); // setup main map

    
};


function switchMap(val) {
    if(val === "projectMap"){
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
        offset: new L.Point(0,-options.radius),
        minWidth: "500px"
    });

    return layer;
};


function createImageMap() {
    // Using leaflet.js to pan and zoom a big image.
    imageMap = L.map('image-map', {
        minZoom: 1,
        maxZoom: 2,
        center: [0, 0],
        zoom: 1,
        maxBoundsViscosity: 1,
        crs: L.CRS.Simple
        
        });
        //zoom 2 full size image is 2302px * 1484px
        //zoom 1 1151 * 742
    
        var image= L.imageOverlay("/data/infrastructure_mockups/575_AutumnRidgeBridge.png", [[0,0],[742,1151]]); //initial size at zoom 1 )
        image.addTo(imageMap);
        // tell leaflet that the map is exactly as big as the image
        imageMap.setMaxBounds(new L.LatLngBounds([0,0], [742,1151]));  // prevent panning outside the image area.
        //Note the viscosity setting keeps the image from being dragged outside this

    return;
};


function addFloatingButton(mapObject, textForButton, onClickFunction, elementID, container) {
    
    // Create the button element with basic dom manipulation
    let buttonElement = document.createElement('button');

    // Set the innertext and class of the button
    buttonElement.innerHTML = textForButton;
    buttonElement.className = 'leaflet-floating-button';
    buttonElement.value = elementID.substring(0, elementID.length-3);
    buttonElement.id = elementID;


    //buttonElement.properties = "onclick=switchMap('comparisonMap')";

    

    // Add this leaflet control
    var buttonControl = L.Control.extend({
        options: {
        // if you wish to edit the position of the button, change the position here and also make the corresponding changes in the css attached below
        position: 'horizontalcenterbottom'
        },

        onAdd: function () {
        container.appendChild(buttonElement);
        return container;
        }
    });

    // Add the control to the mapObject
    mapObject.addControl(new buttonControl());

    // The user defined on click action added to the button
    buttonElement.onclick = onClickFunction;
};


// Create additional Control placeholders
function addControlPlaceholders(map) {
    var corners = map._controlCorners,
      l = 'leaflet-',
      container = map._controlContainer;

    function createCorner(hSide, vSide) {
      var className = l + hSide + ' ' + l + vSide;

      corners[hSide + vSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('horizontalcenter', 'top');
    createCorner('horizontalcenter', 'bottom');
  }


  function testFunction() {
    console.log("test worked");
  }


document.addEventListener('DOMContentLoaded',createMap);
