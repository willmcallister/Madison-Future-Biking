// Add all scripts to the JS folder

var map;
var imageMap;

var minimalBasemap;
var esriWorldImagery;

var juxtapose;
var comparisonGroup;
var projectGroup;

var juxtaposeCreated = false;
var currentMap;

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

    /*
    new L.basemapsSwitcher([
    {
        layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            minZoom: 11,
            label: 'minimal basemap'
        }).addTo(map), //DEFAULT MAP
        icon: './assets/images/img1.PNG',
        name: 'Minimal Base'
    },
    {
        layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            minZoom: 11,
            maxZoom: 19,
            label: 'satellite'
        }),
        icon: './assets/images/img2.PNG',
        name: 'Satellite'
    },
    ], { position: 'topright' }).addTo(map);
    */

    
    minimalBasemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            minZoom: 11,
            label: 'minimal basemap'
        }).addTo(map);

        esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            minZoom: 11,
            maxZoom: 19,
            label: 'satellite'
        });
        

    // create panes for leaflet sideBySide
    map.createPane("left");
    map.createPane("right");

    map.getPane('left').style.zIndex = 400;
    map.getPane('right').style.zIndex = 400;

    map.createPane("top");
    map.getPane('top').style.zIndex = 1000;


    // fetch local geojson data through promises as json
    var promises = [fetch("data/project_locations.geojson").then(function(r) {return r.json()}),
                    fetch("data/bike_paths/existing_bike_paths.geojson").then(function(r) {return r.json()}), 
                    fetch("data/bike_paths/programmed_bike_paths.geojson").then(function(r) {return r.json()}),
                    fetch("data/bike_paths/planned_feasible_bike_paths.geojson").then(function(r) {return r.json()}),
                    fetch("data/bike_paths/planned_obstacles_bike_paths.geojson").then(function(r) {return r.json()}),
                    fetch("data/bike_paths/conceptual_bike_paths.geojson").then(function(r) {return r.json()}),
                    fetch("data/bike_paths/platted_bike_paths.geojson").then(function(r) {return r.json()})
                    ];

    // run callback function to manipulate json data after data is loaded
    Promise.all(promises).then(callback); 


};

    
function callback(data) {

    // set layers as geojson objects
    var project_locations = L.geoJSON(data[0], { 
        pane: "top",
        zIndex: 1000,
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng);
        }
        }),
        existing_bike_paths = L.geoJSON(data[1], { 
            //pane: "left"
        }),
        existing_bike_paths_right = L.geoJSON(data[1], { 
            pane: "right"
        }),
        programmed_bike_paths = L.geoJSON(data[2], {
            pane: "right",
            color: "orange" 
        }),
        planned_feasible_bike_paths = L.geoJSON(data[3], {
            pane: "right",
            color: "orange"
        }),
        planned_obstacles_bike_paths = L.geoJSON(data[4], {
            pane: "right",
            color: "orange"
        }),
        conceptual_bike_paths = L.geoJSON(data[5], {
            pane: "right",
            color: "orange"
        }),
        platted_bike_paths = L.geoJSON(data[6], {
            pane: "right",
            color: "orange"
        });


    // create group layers for each map
    projectGroup = L.layerGroup()
        .addLayer(project_locations);

    comparisonGroup = L.layerGroup() // add existing bike paths to left and right panes
        .addLayer(existing_bike_paths)
        .addLayer(existing_bike_paths_right);


    var comparisonLayer = programmed_bike_paths; // selected by user input

    // add layer to compare to comparison group
    comparisonGroup.addLayer(comparisonLayer); 


    // add leaflet side by side comparison of two layers to juxtapose control
    juxtapose = L.control.sideBySide(existing_bike_paths, comparisonLayer);
    
    //juxtapose created
    juxtaposeCreated = true;

    switchMap("projectMap"); // setup main map

    
};


function switchMap(val) {
    if(val === "projectMap"){
        // if map already has project group on it, return (no need to run this func)
        if(map.hasLayer(projectGroup))
            return;
        
        // switch to main map

        // move slider all the way to the right (to prevent layer visibility errors)
        if(currentMap === 'compare_map'){
            //console.log(document.querySelector(".leaflet-sbs-divider"));
            console.log("moved slider");
            document.querySelector(".leaflet-sbs-range").value = 1;
        }

        // focus project map button
        document.getElementById("projectMapBtn").style.backgroundColor = '#6DC75C';
        // unfocus comparison map button
        document.getElementById("comparisonMapBtn").style.backgroundColor = '#CEEFC8';

        // remove comparison group layer and control
        map.removeLayer(comparisonGroup);
        map.removeControl(juxtapose);

        // add main map group layer
        map.addLayer(projectGroup);

        currentMap = 'project_map';
    }
    else {
        // if map already has comparison group on it, return (no need to run this func)
        if(map.hasLayer(comparisonGroup))
            return;
        
        // switch to comparison map

        // focus comparison map button
        document.getElementById("comparisonMapBtn").style.backgroundColor = '#6DC75C';
        // unfocus project map button
        document.getElementById("projectMapBtn").style.backgroundColor = '#CEEFC8';

        // remove main map group layer
        map.removeLayer(projectGroup);
        
        // add comparison group layer and control
        map.addLayer(comparisonGroup);
        map.addControl(juxtapose);

        currentMap = 'compare_map';
    }
};    


// Attach pop-ups to each mapped feature
function pointToLayer(feature, latlng){

    // create marker options
    var options = {
        radius: 20,
        fillColor: "#FED85E",
        color: "#E7C350",
        weight: 4,
        opacity: 1,
        fillOpacity: 0.8,
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


document.addEventListener('DOMContentLoaded',createMap);
