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
 
 
 // Create the Data layers // 
 var Challenge = L.esri.FeatureLayer({
	url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Unedited_Status_Map/MapServer/0",
	query.where("FTYPE=730" AND STATE = "CO"),
)};
 var courthouses = L.esri.FeatureLayer({
	 url: "https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer",
	 query.where("FTYPE=830"AND STATE = "GA"),
)};
//Do I need two variables for the Unedited Points map? Considering that I want standard points EDITSTATUS = 0 and PR points EDITSTATUS = 1 
 var unedited_points=L.esri.FeatureLayer({
	 url:"https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer", 
	 query.where(EDUTSTATUS = "0"),
	 query.where(EDITSTATUS = "1"),
)};
 
//add to Map capability// 
 var map = L.map('map',{
	 layers: [national,usda],
	 'maxBounds': bounds 
 }) .setView([40.63, -77.84], 7);
 
 //container for the base layers.. thought i made this on line 25 and 26//
 var baseMaps = {
	 "national":national,
	 "usda": usda
 };
 
 //A layer control for the selectable layers.. I don't think i understand this completely//
 L.control.layers(national,usda,Challenge,courthouses,unedited_points).addTo(map);
 
