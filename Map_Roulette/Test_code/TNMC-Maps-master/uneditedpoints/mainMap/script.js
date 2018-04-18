//the base maps
var imageryTopo = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WmsServer?", {
  layers: 0
});

var nationalMap = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WmsServer?", {
  layers: 0
});

var imagery = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WmsServer?", {
  layers: 0
});

var southWest = L.latLng(50.970844, -179.515997),
  northEast = L.latLng(70.966128, -125.464475),
  bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
  'zoomControl': false,
  'minZoom': 4,
  layers: [nationalMap]
}).setView([34.8138, -96.06445], 4);

var basemaps = {
  "The National Map Base Layer": nationalMap,
  "The Nationap Map + Aerial Imagery": imageryTopo,
  "The National Map Imagery": imagery
}

L.control.layers(basemaps, null, {
  position: 'topleft'
}).addTo(map);


//Create list of states automatic
var suma = 0;
var o = '';
for (var i = 0; i < states.length; i++) {
  o += '<li  id="' + states[i].Postal + '">' +
    '<a class="users" href="#' + states[i].State + '"> ' + states[i].State + ' - ' + states[i].Postal + '</a>' +
    '</li>';
};
$('#statelayers').append(o);

//nice progress bar
var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');

function updateProgressBar(processed, total, elapsed, layersArray) {
  if (elapsed > 50) {
    // if it takes more than a second to load, display the progress bar:
    progress.style.display = 'block';
    progressBar.style.width = Math.round(processed / total * 100) + '%';
  }

  if (processed === total) {
    // all markers processed - hide the progress bar:
    progress.style.display = 'none';
  }
}

var pointStyle = {
  radius: 5,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}

//create cluster variables
var all = new L.markerClusterGroup({
  chunkedLoading: true,
  chunkProgress: updateProgressBar,
  showCoverageOnHover: false
});
var filtered = new L.markerClusterGroup({
  chunkedLoading: true,
  chunkProgress: updateProgressBar,
  showCoverageOnHover: false
});

//create key variables that will used. Does it need to be global variables? Will test later.
var url;
var geoJson;
var filtered;
console.log(geoJson);
//load state data
$('#statelayers li').click(function() {
  url = this.id;
  stateName = $(this).text();
  $.getJSON("../data/" + url + ".json", function(data) {
    //reset the state of all buttons
    $(".filter").removeClass('active');
    //clear any filtered layer if present
    filtered.clearLayers();
    //clear any all layer if present
    all.clearLayers();
    //add a header with the state name
    $("#selectedState").html("<p>Unedited Points in " + stateName + "");
    //remove dissabled class from filters
    $('.filter, #all, #reset').removeClass("disabled");
    geoJson = L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        var popupContent = '<a href="http://navigator.er.usgs.gov/edit?node=' + feature.properties.OSM_ID + '" target="_blank">Edit this point</a>';
        var customIcon = L.icon({
          iconUrl: '../assets/img/icon/' + feature.properties.FCode + '.png',
          iconSize: [24, 24],
        });
        return L.marker(latlng, {
          icon: customIcon
        }).bindPopup(popupContent);
      }
    });
    all.addLayer(geoJson).addTo(map);
    map.fitBounds(geoJson.getBounds());
    console.log(data);
    console.log(all);
    console.log(url);
  });
});

//add "all" layer to the map, this layer is the geoJson without any filter
$('#all').click(function() {
  map.addLayer(all);
});

$('.filter').click(function() {
  toBeFiltered = this.id;
  map.removeLayer(all);
  if ($(this).hasClass("active")) {
    $.getJSON("../data/" + url + ".json", function(data) {
      geoJson = L.geoJson(data, {
        filter: function(feature, layer) {
          return feature.properties.Feature == "" + toBeFiltered + "";
        },
        pointToLayer: function(feature, latlng) {
          var popupContent = '<a href="http://navigator.er.usgs.gov/edit?node=' + feature.properties.OSM_ID + '" target="_blank">Edit this point</a>';
          var customMarker = L.icon({
            iconUrl: '../assets/img/icon/' + feature.properties.FCode + '.png',
            iconSize: [24, 24],
          });
          return L.marker(latlng, {
            icon: customMarker
          }).bindPopup(popupContent);
        }
      });
      filtered.addLayer(geoJson);
      map.removeLayer(filtered);
    });
  } else {
    $.getJSON("../data/" + url + ".json", function(data) {
      geoJson = L.geoJson(data, {
        filter: function(feature, layer) {
          return feature.properties.Feature == "" + toBeFiltered + "";
        },
        pointToLayer: function(feature, latlng) {
          var popupContent = '<a href="http://navigator.er.usgs.gov/edit?node=' + feature.properties.OSM_ID + '" target="_blank">Edit this point</a>';
          var customMarker = L.icon({
            iconUrl: '../assets/img/icon/' + feature.properties.FCode + '.png',
            iconSize: [24, 24],
          });
          return L.marker(latlng, {
            icon: customMarker
          }).bindPopup(popupContent);
        }
      });
      filtered.addLayer(geoJson).addTo(map);
    });
  }
});

//reset button and add all features button
$("#reset, #all").click(function() {
  $(".filter").removeClass('active');
  $("button").find('span').removeClass('glyphicon glyphicon-ok');
  filtered.clearLayers();
  all.addTo(map);
});

//add checkmark to each filter
$(".filter").click(function() {
  if ($(this).children().hasClass('glyphicon glyphicon-ok')) {
    $(this).find('span').removeClass('glyphicon glyphicon-ok');
  } else {
    $(this).find('span').addClass('glyphicon glyphicon-ok');
  }
});
