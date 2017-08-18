//the base maps
var imageryTopo = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WmsServer?", {
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer">USGS</a>'
});

var nationalMap = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WmsServer?", {
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer">USGS</a>'
});

var imagery = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WmsServer?", {
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer">USGS</a>'
});

var needsChecked = 0;
var needsReviewed = 0;
var finshed = 0;

var featureLayer = new L.esri.clusteredFeatureLayer({
          chunkedLoading: true,
          url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
          pointToLayer: function(feature, latlng) {
            if(feature.properties.EDITSTATUS === 0){ 
              return L.marker(latlng, {
                  icon: L.ExtraMarkers.icon({
                      icon: 'fa-exclamation fa-2x',
                      shape: 'square',
                      markerColor: 'red',
                      prefix: 'fa'
                   }),
               });
            } else if (feature.properties.EDITSTATUS === 1){
              return L.marker(latlng, {
                  icon: L.ExtraMarkers.icon({
                      icon: 'fa-times fa-2x',
                      markerColor: 'yellow',
                      shape: 'square',
                      prefix: 'fa'
                   }),
               });
            } else {
              return L.marker(latlng, {
                  icon: L.ExtraMarkers.icon({
                      icon: 'fa-check fa-2x',
                      shape: 'square',
                      markerColor: 'green-light',
                      prefix: 'fa'
                   }),
               });
            }
          },
          onEachFeature: function(feature, layer){
            if(feature.properties.EDITSTATUS === 0){ 
              needsChecked++;
              $('#tobecheckedCounter').text(" (" + needsChecked + " points)");
            } else if (feature.properties.EDITSTATUS === 1){
              needsReviewed++;
              $('#tobepeerreviwedCounter').text(" (" + needsReviewed + " points)");
            } else {
              finshed++;
              $('#finishedCounter').text(" (" + finshed  + " points)")
            }
            layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          }
        });
					 
var southWest = L.latLng(37.04, -89.29),
  northEast = L.latLng(42.49, -87.10),
  bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
  layers: [imageryTopo],
  'zoomControl': false,
  'minZoom': 4,
  'maxBounds': bounds
}).setView([40.63, -77.84], 7);

featureLayer.addTo(map);

//zoom custom position
L.control.zoom({
  position: 'topright'
}).addTo(map);

var basemaps = {
  "The National Map Base Layer": nationalMap,
  "The Nationap Map + Aerial Imagery": imageryTopo,
  "The National Map Imagery": imagery
}

L.control.layers(basemaps, null, {
  position: 'bottomleft'
}).addTo(map);

/*
  TODO: THIS STUFF BELOW NEEDS TO BE FIXED
*/

$("#finished").click(function(){
    if(map.hasLayer(finished)){
      map.removeLayer(finished)
      $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
      $(this).find("i").attr('class', 'fa fa-eye-slash');
    } else {
/*
      $.getJSON("./data/finished.json", function(data) {
        finished = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + '<hr> <a href="' + feature.properties.link + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          },
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
              icon: L.ExtraMarkers.icon({
                icon: 'fa-check fa-2x',
                shape: 'square',
                markerColor: 'green-light',
                prefix: 'fa'
              }),
            });
          }
        })
        map.addLayer(finished)

      });*/
//      $(this).removeAttr('style');
//      $(this).find('i').attr('class', 'fa fa-check');
    }
});
$("#tobechecked").click(function(){
    if(map.hasLayer(tobechecked)){
      map.removeLayer(tobechecked)
      $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
      $(this).find("i").attr('class', 'fa fa-eye-slash');
    } else {
/*
      $.getJSON("./data/tobechecked.json", function(data) {
        tobechecked = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + '<hr> <a href="' + feature.properties.link + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          },
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
              icon: L.ExtraMarkers.icon({
                icon: 'fa-exclamation fa-2x',
                shape: 'square',
                markerColor: 'red',
                prefix: 'fa'
              }),
            });
          }
        })
        map.addLayer(tobechecked)

      });*/
//      $(this).removeAttr('style');
//      $(this).find('i').attr('class', 'fa fa-exclamation');
    }
});
$("#tobepeerreviwed").click(function(){
    if(map.hasLayer(tobepeerreviwed)){
      map.removeLayer(tobepeerreviwed)
      $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
      $(this).find("i").attr('class', 'fa fa-eye-slash');
    } else {
/*
      $.getJSON("./data/tobepeerreviwed.json", function(data) {
        tobepeerreviwed = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + '<hr> <a href="' + feature.properties.link + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
          },
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
              icon: L.ExtraMarkers.icon({
                icon: 'fa-times fa-2x',
                markerColor: 'yellow',
                shape: 'square',
                prefix: 'fa'
              }),
            });
          }
        })
        map.addLayer(tobepeerreviwed)

      });*/
//      $(this).removeAttr('style');
//      $(this).find('i').attr('class', 'fa fa-times');
    }
});

// map.addLayer(markers);

 $(".markers-legend").hover(function(){
   $(this).css('cursor', 'pointer');
   original = $(this).find("i").attr('class');
   $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
   $(this).find("i").attr('class', 'fa fa-eye-slash');
 }, function(){
   $(this).removeAttr('style');
   $(this).find('i').attr('class', original);
 })
