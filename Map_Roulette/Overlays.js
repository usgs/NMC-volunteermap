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
 
 //Bound Box for The Map//
var southWest = L.latLng(14.581656, -169.354212),
			northEast = L.latLng(661.492973, 174.987991),
			bounds = L.latLngBounds(southWest, northEast);
 
   //add to Map capability//
 var map = L.map('map',{
	 layers: [national,usda],
	 'maxBounds':bounds
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

//variables for function for local scope//
 var un_points = L.esri.clusteredFeatureLayer({
	 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0", 
	 where:"EDITSTATUS ='0'",
	 minZoom:'0',
	 maxZoom:'13',
	onEachFeature: function(feature, layer){
         layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
	},
	 pointToLayer: function(feature, latlng) {
     return L.marker(latlng, {
	 icon: L.ExtraMarkers.icon({
	 icon: 'fa-exclamation fa 2x',
	 markerColor: 'red',
	 shape: 'square',
	 prefix: 'fa'
	 }),
	 });
	 }
}).addTo(map);

 var un_PR = L.esri.clusteredFeatureLayer({
	 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0", 
	 where:"EDITSTATUS ='1'",
	 minZoom:'0',
	 maxZoom:'13',
	onEachFeature: function(feature, layer){
         layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
	},
	 pointToLayer: function(feature, latlng) {
     return L.marker(latlng, {
	 icon: L.ExtraMarkers.icon({
	 icon: 'fa-times fa 2x',
	 markerColor: 'green-light',
	 shape: 'square',
	 prefix: 'fa'
	 }),
	 });
	 }
}).addTo(map);


//Variables//
 var targetId;
 var feature;
 var properties;
 var properties1;
 var needsChecked = 0;
 var needsReviewed = 0;
 var finshed = 0;
 var popup;
 var math; 
 var floor; 
 
 //Function for Buttons //
/*function getRandom(unedited_points) {
	document.getElementById("RandomPoint").innerHTML = Math.floor(Math.random() * 16743338);
};*/

/*function getPeer(unedited_PR) {
	document.getElementById("PRPoints").innerHTML = Math.floor(Math.random() * 1719336);
};*/

// function and variables//
/*getRandom(unedited_points);
getPeer(unedited_PR);*/
 
 //Variables for Global scope// 
  var unedited_points = L.esri.clusteredFeatureLayer({
	 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0", 
	 where:"EDITSTATUS='0'",
	 minZoom:'0',
	  maxZoom:'13',
	onEachFeature: function(feature, layer){
         layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
	},
	 pointToLayer: function(feature, latlng) {
     return L.marker(latlng, {
	 icon: L.ExtraMarkers.icon({
	 icon: 'fa-exclamation fa 2x',
	 markerColor: 'red',
	 shape: 'square',
	 prefix: 'fa'
	 }),
	 })
	 }
}).addTo(map);

 var unedited_PR = L.esri.clusteredFeatureLayer({
	 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0", 
	 where:"EDITSTATUS='1'",
	 minZoom:'0',
	 maxZoom:'13',
	onEachFeature: function(feature, layer){
         layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
	},
	 pointToLayer: function(feature, latlng) {
     return L.marker(latlng, {
	 icon: L.ExtraMarkers.icon({
	 icon: 'fa-times fa 2x',
	 markerColor: 'green-light',
	 shape: 'square',
	 prefix: 'fa'
	 }),
	 })
	 }
}).addTo(map);

// Create a function that should connect the data layers to the check boxes in the HTML This needs to be done 4 times for each check box? May not need these// 
/*function getRandom(RandomPoint) {
	document.getElementById("RandomPoint").innerHTML = myRandom();
	
};
function getPeer(PRPoints) {
	document.getElementById("PRPoints").innerHTML = myPeer();
}; */
/*
function myFunction(Courthouse) {
	document.getElementById("Courthouse").innerHTML = myFunction();
}; */
/*function getChallenge(Challenge) {
	document.getElementById("Challenge").innerHTML=myChallenge();
}; */
/*
function myFunction(Courthouse) {
	document.getElementById("Courthouse").innerHTML = myFunction();
}; */
//Functions for the buttons  for standard and peer review  points// 
getRandom(unedited_points);
getPeer(unedited_PR);

function myFunction() {
	getRandomFeature().then(function(test) {
		/*console.log("Mug Man! : ",test)
		console.log("Map Man :" , map)
		console.log("LAYER MAN :" , featureLayer)*/
		map.setView([test[0].geometry.y, test[0].geometry.x],18)
		targetId =test[0].attributes.OBJECTID;
		console.log(featureLayer.getFeature(testid));
	});
}

function getPeer() {
	getPeer().then(function(test) {
		/*console.log("Mug Man! : ",test)
		console.log("Map Man :" , map)
		console.log("LAYER MAN :" , featureLayer)*/
		map.setView([test[0].geometry.y, test[0].geometry.x],18)
		targetId =test[0].attributes.OBJECTID;
		console.log(featureLayer.getFeature(testid));
	});
}


function getRandom(unedited_points){
 return new Promise(function(resolve,reject){
	 let query = new L.esri.Tasks.query({
		 url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0"
	 });
	 where: "EDITSTATUS in '0'"
	 query.ids(function(error,featureCollection,response){
		 if(featureCollection.length > 0){
			 testid =featureCollection[math.floor(math.random()*featureCollection.length)]
			 let finalQuery = new L.esri.Tasks.query({
				 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0"
			 });
			 query.where("OBJECTID=" +testId.toString())
			 query.run(function(error,featureCollection,response){
				 resolve(response.features);
			 });
		 } else {
				 reject("nothing found")
			 }
		 
	 })
 })
};


function getPeer(unedited_PR){
 return new Promise(function(resolve,reject){
	 let query = new L.esri.Tasks.query({
		 url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0"
	 });
	 where: "EDITSTATUS in '1'"
	 query.ids(function(error,featureCollection,response){
		 if(featureCollection.length > 0){
			 testid =featureCollection[math.floor(math.random()*featureCollection.length)]
			 let finalQuery = new L.esri.Tasks.query({
				 url:"https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0"
			 });
			 query.where("OBJECTID=" +testId.toString())
			 query.run(function(error,featureCollection,response){
				 resolve(response.features);
			 });
		 } else {
				 reject("nothing found")
		 }
	 })
 })
};


/*function getPeer(unedited_PR){ //open 
	return new Promise(function(resolve, reject) { //open
    let query = new L.esri.Tasks.query({
       url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0" // Or whatever service you want
    });
    query.where("EDITSTATUS in ('0')")
    query.ids(function(error, featureCollection, response){
        if(featureCollection.length > 0){
          testId = featureCollection[Math.floor(Math.random()*featureCollection.length)]
          let finalQuery = new L.esri.Tasks.query({
              url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0" // Or whatever service you want
          });
          query.where("OBJECTID = " + testId.toString())
          query.run(function(error, featureCollection, response){
            resolve(response.features);
          });
        } else {
          reject("nothing found")
        }
    })
  }).addTo(map); */

/*function getPeer(unedited_PR){
	return new Promise(function(resolve, reject) {
    let query = new L.esri.Tasks.query({
       url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0" // Or whatever service you want
    });
    query.where("EDITSTATUS in ('1')")
    query.ids(function(error, featureCollection, response){
        if(featureCollection.length > 0){
          testId = featureCollection[Math.floor(Math.random()*featureCollection.length)]
          let finalQuery = new L.esri.Tasks.query({
              url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0" // Or whatever service you want
          });
          query.where("OBJECTID = " + testId.toString())
          query.run(function(error, featureCollection, response){
            resolve(response.features);
          });
        } else {
          reject("nothing found")
        }
    })
  }).addTo(map);*/
  
 //container for the base layers.. thought i made this on line 25 and 26//
 var baseMaps = {
	 "usda": usda,
	 "national":national
 };
 
 //container for data types //
 /*var datatypes ={
	 "unedited_points": unedited_points,
	 "unedited_PR": unedited_PR
 };*/
 
  map.zoomControl.setPosition('bottomright');
  
 //A layer control for the selectable layers.//
 L.control.layers(baseMaps).addTo(map);