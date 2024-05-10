// Add all scripts to the JS folder

(function(){

var map;


var juxtapose;
var comparisonGroup;
var projectGroup;

var existingPaths;
var exisitingPathsRight;
var bikeComparisonLayers;

var comparedLayer = null;

var currentMap;


var pathStatus = ["Platted for Construction", "Programmed - Funded",
    "Planned - Feasible", "Planned - Obstacles", "Conceptual"];


// PopupContent constructor function
function PopupContent(feature){
    this.properties = feature.properties;

    this.prj_name = this.properties.prj_name
    this.com_web = this.properties.com_web;
    this.eng_draw = this.properties.eng_draw;
    this.prj_displa = this.properties.prj_displa;
    this.prj_stat = this.properties.prj_stat;



    var overlayPhoto;

    var name = this.prj_name;
    switch(name){
        case 'segoe_rd_sheobygan_ave_reconstruction':
            overlayPhoto = 'Segoe.png';
            break;
        case 'tancho_drive_bike_path':
            overlayPhoto = 'tancho151.png';
            break;
        case 'davies_street_and_dempsey_road_reconstruction':
            overlayPhoto = 'dempsey_upclose.png';
            break;
        case 'atwood_avenue_reconstruction':
            overlayPhoto = 'atwood.png';
            break;
        case 'lakeside_cycletrack_connection':
            overlayPhoto = 'lakesidegilson.png';
            break;
        case 'uw_arboretum_mccaffrey_bike_entrance':
            overlayPhoto = 'uwarbseminole.png';
            break;
        case 'west_towne_path_phase_3':
            overlayPhoto = 'westtowne.png';
            break;
        case 'hammersley_road_resurfacing_phase_1':
            overlayPhoto = 'hammersley_phase2.png';
            break;
        case 'cannonball_path_phase_6':
            overlayPhoto = 'cannonballph6.png';
            break;
        case 'autumn_ridge_bridge':
            overlayPhoto = 'AutumnRidgeBridge.png';
            break;
        case 'autumn_ridge_path':
            overlayPhoto = 'AutumnRidgePath.png';
            break;
    }


    var photoImg = `<img src="data/infrastructure_mockups/${overlayPhoto}"` + '" height="240px" width="400px"/>';

    this.formatted = "<p><b>Project Name: </b>" + this.properties.prj_displa + 
    "</p><p>" + this.properties.com_web + "</p><p>" + this.properties.eng_draw + 
    "</p><p>Project Status: " + this.properties.prj_stat + "</p></br>" + photoImg;
}



function createMap(){
    map = L.map('map').setView([43.08, -89.39], 12);

    // set max bounds for the map -- MAY WANT TO ADJUST LATER
    map.setMaxBounds(map.getBounds().pad(2));


    // add control placeholders
    addControlPlaceholders(map);

    // create container for buttons
    var container = L.DomUtil.create('div', 'mapSelectionButtons');

    //disable any mouse event listeners for the container
    L.DomEvent.disableClickPropagation(container);

    // add button at bottom of map
    addFloatingButton(map,'Project Map',()=>{switchMap("projectMap");},'projectMapBtn', container);
    addFloatingButton(map,'Comparison Map',()=>{ switchMap("comparisonMap"); },'comparisonMapBtn', container);


    // create dropdown for comparison layer choice
    addDropdown();


    //create legend for comparison layer
    createLegend();

    
    new L.basemapsSwitcher([
    {
        layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            minZoom: 11,
            label: 'minimal basemap'
        }).addTo(map), //DEFAULT MAP
        //icon: './assets/images/img1.PNG',
        name: 'Minimal Base'
    },
    {
        layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            minZoom: 11,
            maxZoom: 19,
            label: 'satellite'
        }),
        //icon: './assets/images/img2.PNG',
        name: 'Satellite'
    },
    ], { position: 'topright' }).addTo(map);
    

    // create panes for leaflet sideBySide
    map.createPane("left");
    map.createPane("right");

    map.getPane('left').style.zIndex = 400;
    map.getPane('right').style.zIndex = 400;

    map.createPane("top");
    map.getPane('top').style.zIndex = 1000;


    // fetch local geojson data through promises as json
    var promises = [fetch("data/projects/project_locations.geojson").then(function(r) {return r.json()}),
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
            color: "#5B7C99",
            weight: 1.7
        }),
        existing_bike_paths_right = L.geoJSON(data[1], { 
            pane: "right",
            color: "#5B7C99",
            weight: 1.7
        })
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


    existingPaths = existing_bike_paths;
    existingPathsRight = existing_bike_paths_right;

    bikeComparisonLayers = [platted_bike_paths, programmed_bike_paths, planned_feasible_bike_paths,
        planned_obstacles_bike_paths, conceptual_bike_paths];
    

    // create group layers for each map
    projectGroup = L.layerGroup()
        .addLayer(project_locations);

    
    comparisonGroup = L.layerGroup() // add existing bike paths to left and right panes
        .addLayer(existing_bike_paths)
        .addLayer(existing_bike_paths_right);
    

    changeBikeLayer(bikeComparisonLayers[0]); // setup juxtapose with first comparison layer

    switchMap("projectMap"); // setup main map

};


function changeBikeLayer(inputLayer) {
    oldLayer = comparedLayer;
    
    // remove old layer from comparison group
    if(oldLayer){
        console.log("removing juxtapose");
        comparisonGroup.removeLayer(oldLayer);
        map.removeControl(juxtapose);
        juxtapose = null;
    }
    // add layer to compare to comparison group
    comparisonGroup.addLayer(inputLayer); 

    comparedLayer = inputLayer; // store which layer is currently being compared

    console.log("left comparison: " + existingPaths);
    console.log("right comparison: " + inputLayer);
    // add leaflet side by side comparison of two layers to juxtapose control
    juxtapose = L.control.sideBySide(existingPaths, inputLayer);

    if(oldLayer){
        console.log("adding new juxtapose");
        map.addControl(juxtapose);
    }

    return;
}


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

        // hide bike layer dropdown and legend
        toggleBikeElements();

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

        //show map dropdown and legend
        toggleBikeElements();

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

    console.log("ran");

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


function addDropdown(){
    // create container for buttons
    var container = L.DomUtil.create('div', 'comparisonDropdown');
    container.innerHTML = "Select Bike Layer to Compare<br>";
    container.id = "bike-dropdown-div";

    //disable any mouse event listeners for the container
    L.DomEvent.disableClickPropagation(container);
    

    // array of options to be added -- pathStatus

    //Create dropdown
    var dropdownElement = document.createElement('select');
    dropdownElement.className = 'bike-dropdown';
    dropdownElement.id = "bike-dropdown";
    dropdownElement.onchange = function(){changeBikeLayer(bikeComparisonLayers[pathStatus.indexOf(this.value)]);};


    //Create and append the options
    for (var i = 0; i < pathStatus.length; i++) {
        var option = document.createElement("option");
        option.value = pathStatus[i];
        option.text = pathStatus[i];
        dropdownElement.appendChild(option);
    }


    // Add this leaflet control
    var dropdownControl = L.Control.extend({
        options: {
        // if you wish to edit the position of the button, change the position here and also make the corresponding changes in the css attached below
        position: 'horizontalcentertop'
        },

        onAdd: function () {
        container.appendChild(dropdownElement);
        return container;
        }
    });

    // Add the control to the mapObject
    map.addControl(new dropdownControl());
};


function toggleBikeElements(){
    var dropdown = document.getElementById("bike-dropdown-div");
    if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
    
    var legend = document.getElementById("bike-legend-div");
    if (legend.style.display === "none") {
        legend.style.display = "block";
    } else {
        legend.style.display = "none";
    }
    
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
        // position button - uses css
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


function createLegend(){    
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            container.innerHTML = '<p class="bike-legend"><b>Bike Path Status</b></p>';
            container.id = "bike-legend-div";
            
            // Add an <svg> element to the legend for existing bike routes
            var svg1 = '<svg id="attribute-legend-existing" class="legend-svgs" width="160px" height="20px">';
            svg1 += '<line x1="0" y1="10" x2="25" y2="10" style="stroke:#5B7C99;stroke-width:12" />';
            //text string            
            svg1 += '<text id="existing-path-text" x="35" y="' + 15 + '">'
            + "Existing Bike Paths" + '</text>';
            svg1 += '</svg>';

            // Add an <svg> element to the legend for selected bike routes
            var svg2 = '<svg id="attribute-legend-selected" class="legend-svgs" width="160px" height="20px">';
            svg2 += '<line x1="0" y1="10" x2="25" y2="10" style="stroke:orange;stroke-width:12" />';
            //text string            
            svg2 += '<text id="selected-path-text" x="35" y="' + 15 + '">'
            + "Selected Bike Paths" + '</text>';
            svg2 += '</svg>';


            // add legend svgs to container
            container.insertAdjacentHTML('beforeend',svg1);
            container.insertAdjacentHTML('beforeend',svg2);

            return container;
        }
    });
    
    map.addControl(new LegendControl());
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

})();
