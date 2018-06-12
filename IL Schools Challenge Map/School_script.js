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

//var service = L.mapServer.wms("https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer?f=jsapi")

var featureLayer = new L.esri.clusteredFeatureLayer({
          url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0"
/*
          onEachFeature: function(featureClicked){ 
            featureClicked.on("click", function(test, testA){
                            console.log("HITS : " , test) 
                          })
          }
*/
        });

featureLayer.eachFeature(function(layer){ 
  console.log('ayer: ', layer)
})
							 
var southWest = L.latLng(37.04, -89.29),
  northEast = L.latLng(42.49, -87.10),
  bounds = L.latLngBounds(southWest, northEast);


/*
var markers = new 
L.MarkerClusterGroup ({showCoverageOnHover:false});
function populate () {
	for (var i =0; i < editStatus.length; i++) {
		var a = editStatus[i];
		var title = a[2];
	var marker = new L.Marker(new.LLatLng(a[0], a[1]),{ icon: tobepeerreviwed  , title: title });
		markers.addLayer(marker);
	}
		}
populate();
*/
var filtered = L.markerClusterGroup({
	chunkedLoading: true, 
	zoomToBoundsOnClick: false
})
/*
data.addLayer(tobechecked).addTo(map),
data.addLayer(tobepeerreviwed).addTo(map),
data.addLayer(finished).addTo(map);
*/
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

var data = {
	"Finished" : "Finished",
	"Needs to be Peer Reviewed": "PeerReview",
	"Needs to be Checked": "NeedCheck", 
}
var edit_status_lists = {
    "needsChecked": [],
    "needsReviewd": [],
    "finshed": []
}
/*
var grouping = editStatusArray["needsChecked","needsReviewd",  "finshed"]
*/
/*
$.getJSON("./data/Schools.json", function(data) {
  console.log("YAY THIS POS WORKS! " , data)
  for(var feature_index = 0; feature_index < data.features.length; feature_index ++){
    if(data.features[feature_index].properties.EDITSTATUS === 0){
      edit_status_lists.needsChecked.push(data.features[feature_index])
    } else if (data.features[feature_index].properties.EDITSTATUS === 1){
      edit_status_lists.needsReviewd.push(data.features[feature_index])
    }else {
      edit_status_lists.finshed.push(data.features[feature_index])
    }
  }
 $('#finishedDescr').append(" (" + edit_status_lists.finshed.length + " points)")
$('#tobecheckedDescr').append(" (" + edit_status_lists.needsChecked.length + " points)");
$('#tobepeerreviwedDescr').append(" (" + edit_status_lists.needsReviewd.length + " points)");

var needsCheckedPoints = L.geoJson(edit_status_lists.needsChecked, {
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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
});
*\
var tobeReviewed = L.geoJson(edit_status_lists.needsReviewd, {
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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
});

var finished = L.geoJson(edit_status_lists.finshed, {
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15"+ '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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
});

map.addLayer(needsCheckedPoints)
map.addLayer(tobeReviewed)
map.addLayer(finished)

});



/*
  finished = L.geoJson(data, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.name + '<hr> <a href="' + feature.properties.link + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
    },
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {
        icon: L.ExtraMarkers.icon({
          icon: 'fa-check fa-2x',
          shape: 'square',
          markerColor: 'yellow',
          prefix: 'fa'
        }),
      }); 
    }
  });
  map.addLayer(finished)
});*/
/*$.getJSON("./data/tobechecked.json", function(data) {
    $('#tobecheckedDescr').append(" (" + data.features.length + " points)")
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
});
$.getJSON("./data/tobepeerreviwed.json", function(data) {
  $('#tobepeerreviwedDescr').append(" (" + data.features.length + " points)")
  tobepeerreviwed = L.geoJson(data, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.name + '<hr> <a href="' + feature.properties.link + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
    },
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {
        icon: L.ExtraMarkers.icon({
          icon: 'fa-times fa-2x',
          markerColor: 'green-light',
          shape: 'square',
          prefix: 'fa'
        }),
      });
    }
  })
  map.addLayer(tobepeerreviwed)
});
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
      $(this).removeAttr('style');
      $(this).find('i').attr('class', 'fa fa-check');
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
      $(this).removeAttr('style');
      $(this).find('i').attr('class', 'fa fa-exclamation');
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
      $(this).removeAttr('style');
      $(this).find('i').attr('class', 'fa fa-times');
    }
});

// map.addLayer(markers);

// $(".markers-legend").hover(function(){
//   $(this).css('cursor', 'pointer');
//   original = $(this).find("i").attr('class');
//   $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
//   $(this).find("i").attr('class', 'fa fa-eye-slash');
// }, function(){
//   $(this).removeAttr('style');
//   $(this).find('i').attr('class', original);
// })
