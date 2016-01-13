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

var southWest = L.latLng(39.50, -82.51),
  northEast = L.latLng(43.39, -72.26),
  bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
  layers: [imageryTopo],
  'zoomControl': false,
  'minZoom': 4,
  'maxBounds': bounds
}).setView([40.63, -77.84], 7);
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

$.getJSON("./data/finished.geojson", function(data) {
  $('#finishedDescr').append(" (" + data.features.length + " points)")
  finished = L.geoJson(data, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.Name + '<hr> <a href="' + feature.properties.Description + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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
  })
  map.addLayer(finished)
});
$.getJSON("./data/tobechecked.geojson", function(data) {
    $('#tobecheckedDescr').append(" (" + data.features.length + " points)")
  tobechecked = L.geoJson(data, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.Name + '<hr> <a href="' + feature.properties.Description + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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
$.getJSON("./data/tobepeerreviwed.geojson", function(data) {
  $('#tobepeerreviwedDescr').append(" (" + data.features.length + " points)")
  tobepeerreviwed = L.geoJson(data, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.Name + '<hr> <a href="' + feature.properties.Description + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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

$("#finished").click(function(){
    if(map.hasLayer(finished)){
      map.removeLayer(finished)
      $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
      $(this).find("i").attr('class', 'fa fa-eye-slash');
    } else {
      $.getJSON("./data/finished.geojson", function(data) {
        finished = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.Name + '<hr> <a href="' + feature.properties.Description + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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
        })
        map.addLayer(finished)
      });
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
      $.getJSON("./data/tobechecked.geojson", function(data) {
        tobechecked = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.Name + '<hr> <a href="' + feature.properties.Description + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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
      $.getJSON("./data/tobepeerreviwed.geojson", function(data) {
        tobepeerreviwed = L.geoJson(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.Name + '<hr> <a href="' + feature.properties.Description + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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
      $(this).removeAttr('style');
      $(this).find('i').attr('class', 'fa fa-times');
    }
});

$(".markers-legend").hover(function(){
  $(this).css('cursor', 'pointer');
  original = $(this).find("i").attr('class');
  $(this).css("background-position", "-144px -46px").css("padding-top", "8px").css("padding-left", "8px");
  $(this).find("i").attr('class', 'fa fa-eye-slash');
}, function(){
  $(this).removeAttr('style');
  $(this).find('i').attr('class', original);
})
