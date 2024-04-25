// Add all scripts to the JS folder

var map; 

/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
*/

/*
const clientId = 'APP_CLIENT_ID';
const redirectUri = 'REDIRECT_URI';
const signInButton = document.getElementById('sign-in');
// do this on a button click to avoid popup blockers
document.addEventListener('click', function(){
    window.open('https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id='+clientId+'&response_type=token&expiration=20160&redirect_uri=' + window.encodeURIComponent(redirectUri), 'oauth-window', 'height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes')
});
*/


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




function createMap(){

    map = L.map('map').setView([43.07, -89.4], 13);

    // set max bounds for the map -- MAY WANT TO ADJUST LATER
    map.setMaxBounds(map.getBounds().pad(1));

    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        minZoom: 11
    }).addTo(map);
    
    getData();

    /*
    const apiKey = "AAPK687ec9a6f43a4102a5643a782b2af43d0UZxfNN4IBEqL8Wr391f6Ky7kK5vTFQJLrG9WNeCBB8EpWm-wVGyoPHg6vs2lCa8";
    const myToken = "token=3NKHt6i2urmWtqOuugvr9WlJn6cDXqfbXhyEpx5B28XiZhV4GdvDEirP_IXrX0YUBJO9L2vRd7p_fgO6lFxSkLVSwHoX6ATgwiBSXwzWEsucmSuBlTp0YQMmj0JDcyB8tcY8W50xrKlR5Keel9HAtPsPAbsj-KawT-T2o7BGu7Vaj1g5-_9MLJ2zKNpNt7eljsp8UpL--x66oYtccV_EVFFf263Lnbbu-Qy5yJiOIvVEWGApQMQK3QsrgJ0fdhyx";

    const basemapEnum = "https://tiles.arcgis.com/tiles/HRPe58bUyBqyyiCt/arcgis/rest/services/madison_minimal_base/VectorTileServer/tile/{z}/{y}/{x}.pbf";

    L.esri.Vector.vectorBasemapLayer(basemapEnum, {
        token: myToken,
        version: 1
    }).addTo(map);
    */

};


// Import GeoJSON data and add to map with stylized point markers
function getData(){
    //load the data
    fetch("data/project_locations.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var attributes = processData(json);
            createSymbols(json, attributes);
        })
};


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


function createSymbols(data, attributes){
    
    console.log("creating symbol");
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature,latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
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


document.addEventListener('DOMContentLoaded',createMap);



//var map = L.map('map').setView([43.07, -89.4], 10);

/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

//testing, remove
L.tileLayer('https://tiles.arcgis.com/tiles/HRPe58bUyBqyyiCt/arcgis/rest/services/madison_minimal_base/VectorTileServer/tile/{z}/{y}/{x}.pbf',{
    attribution: 'Will\'s Custom VT'
}).addTo(map);
*/



