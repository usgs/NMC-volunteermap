// JavaScript test file for overlay data for Interactive Challenge Maps// 

//Basemaps//
 var imageryTopo = L.tileLayer.wms('http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WmsServer?', {
  minZoom: '0',
   maxZoom: '13',
   layers: '0',
   attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer">USGS</a>'
 });

 var nationalMap = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WmsServer?", {
   minZoom : '0', 
   maxZoom : '13',	
   layers: '0',
   attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer">USGS</a>'
 });
 var usdaNAIP = L.esri.dynamicMapLayer({
	 url: "https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer", 
	 minZoom: '14', 
	 maxZoom: '19',
	 layers: '0', 
	 attribution: ' Map tiles by <a href="https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer"> USDA</a>'
 });
 
//Layer Groups for the basemaps so that they will control the zoom levels properly//
 var usda = L.layerGroup([nationalMap, usdaNAIP]);
 var national = L.layerGroup([imageryTopo,usdaNAIP]);

		
		
//add to Map capability//
 var map = L.map('map',{
	 layers: [national,usda],
	 'maxBounds': bounds 
 }) .setView([40.63, -77.84], 7);
 
 //Points pulled from database-- Queried //

 /*var challenge = L.esri.clusteredFeatureLayer({
	url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
	WHERE:"FTYPE='730' AND STATE='CO'",
	minZoom:'14',
	maxZoom:'19'
}).addTo(map);*/
	
 /*var courthouses = L.esri.featureLayer({
	 url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
	 where:"FTYPE='830' AND STATE = 'GA'"}
}).addTo(map); */

 var unedited_points = L.esri.clusteredFeatureLayer({
	 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0", 
	 WHERE:"EDITSTATUS='0'",
	 minZoom:'0',
	 maxZoom:'13',
	 icon: L.ExtraMarkers.icon({
	 icon:'fa-exclamation fa-2x',
	 shape: 'square',
	 markerColor:'red',
	 prefix: 'fa'
	 }),
	 onEachFeature: function(feature, layer){
         layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
        }
}).addTo(map);
 var unedited_PR = L.esri.clusteredFeatureLayer({
	 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0", 
	 WHERE:"EDITSTATUS='1'",
	 minZoom:'0',
	 maxZoom:'13',
	 icon: L.ExtraMarkers.icon({
	 icon: 'fa-times fa 2x',
	 markerColor: 'green-light',
	 shape: 'square',
	 prefix: 'fa'
	}), 
	onEachFeature: function(feature, layer){
         layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
        }
}).addTo(map);

//Variables//
 var targetId;
 var feature;
 var properties;
 var needsChecked = 0;
 var needsReviewed = 0;
 var finshed = 0;
 var popup;
 
// Create a function that should connect the data layers to the check boxes in the HTML This needs to be done 4 times for each check box?// 
function getRandom(RandomPoint) {
	document.getElementById("RandomPoint").innerHTML = myRandom();
	
};
function getPeer(PRPoints) {
	document.getElementById("PRPoints").innerHTML = myPeer();
};
/*
function myFunction(Courthouse) {
	document.getElementById("Courthouse").innerHTML = myFunction();
}; */
/*function getChallenge(Challenge) {
	document.getElementById("Challenge").innerHTML=myChallenge();
}; */

/* Code to randomize points */
function getRandom(RandomPoint) {
	document.getElementById("RandomPoint").innerHTML = Math.floor(Math.random() * 16743338);
	
};
function getPeer(PRPoints) {
	document.getElementById("PRPoints").innerHTML = Math.floor(Math.random() * 1000);
};

/*
function myFunction(Courthouse) {
	document.getElementById("Courthouse").innerHTML = myFunction();
}; */
if (typeof feature !== 'undefined'){
if(feature.properties.OBJECTID === targetId){
		var popups = L.popup().setLatLng([feature.geometry.coordinates[1]+0.00005, feature.geometry.coordinates[0]])
		var feature = ''
		.setContent(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>').openOn(map); 
		// Create a bounding box for the entire map// 
		var southWest = L.latLng(14.581656, -169.354212),
		northEast = L.latLng(661.492973, 174.987991),
		bounds = L.latLngBounds(southWest, northEast);
		//The below code generates a random number//.Corps/TNMCorps_Map_Challenge/MapServer/0" // Or whatever service you want
           query.where("OBJECTID = " + testId.toString());
           query.run(function(error, featureCollection, response){
           resolve(response.features);
           });
         } else {
          reject("nothing found");
		 }
         }; 
 
 //container for the base layers.. thought i made this on line 25 and 26//
 var baseMaps = {
	 "usda": usda,
	 "national":national
 };
 
 //container for data types //
 var datatypes ={
	 "unedited_points": unedited_points,
	 "unedited_PR": unedited_PR
 };
 
  map.zoomControl.setPosition('bottomright');
  
 //A layer control for the selectable layers.. I don't think i understand this completely//
 L.control.layers(baseMaps,datatypes).addTo(map);
 

