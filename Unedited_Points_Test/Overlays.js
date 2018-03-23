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
   layers: 0,
   attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer">USGS</a>'
 });
 var usdaNAIP = L.esri.dynamicMapLayer({
	 url: "https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer", 
	 minZoom: '14', 
	 maxZoom: '19',
	 layers: 0, 
	 attribution: ' Map tiles by <a href="https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer"> USDA</a>'
 });
 
//Layer Groups for the basemaps so that they will control the zoom levels properly//
 var national = L.layerGroup([imageryTopo,usdaNAIP]);
 var usda = L.layerGroup([nationalMap, usdaNAIP]);
 
// Create a bounding box for the entire map// 
 var southWest = L.latLng(14.581656, -169.354212),
		northEast = L.latLng(661.492973, 174.987991),
		bounds = L.latLngBounds(southWest, northEast);
//add to Map capability// 

 var map = L.map('map',{
	 layers: [national,usda],
	 'maxBounds': bounds 
 }) .setView([40.63, -77.84], 7);

 // Create the Data layers // 
 var challenge = L.esri.featureLayer({
	url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
	where:{"FTYPE:730" : "STATE:'CO'"}
}).addTo(map);
	
 /*var courthouses = L.esri.featureLayer({
	 url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
	 where: {"FTYPE=830": "STATE = 'GA'"}
}).addTo(map); */

 var unedited_points=L.esri.featureLayer({
	 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0", 
	 where:"EDITSTATUS:'0'"
}).addTo(map);
 var unedited_PR=L.esri.featureLayer({
	 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0", 
	 where:"EDITSTATUS:'1'"
}).addTo(map);

// Create a function that should connect the data layers to the check boxes in the HTML This needs to be done 4 times for each check box?// 
function getRandom(RandomPoint) {
	document.getElementById("RandomPoint").innerHTML = myFunction();
};
function getPeer(PRPoints) {
	document.getElementById("PRPoints").innerHTML = myFunction();
};
/*
function myFunction(Courthouse) {
	document.getElementById("Courthouse").innerHTML = myFunction();
}; */
function getChallenge(Challenge) {
	document.getElementById("Challenge").innerHTML=myfunction();
};

/*add to Map capability// 
 var map = L.map('map',{
	 layers: [national,usda],
	 'maxBounds': bounds 
 }) .setView([40.63, -77.84], 7);*/
 
 //container for the base layers.. thought i made this on line 25 and 26//
 var baseMaps = {
	 "national":national,
	 "usda": usda
 };
 
 //A layer control for the selectable layers.. I don't think i understand this completely//
 L.control.layers(national,usda,Challenge,unedited_points).addTo(map);
 
