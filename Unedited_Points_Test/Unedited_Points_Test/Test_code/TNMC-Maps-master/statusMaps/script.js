imageryTopo = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WmsServer?", {
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer"<USGS</a<'
});

var southWest = L.latLng(11.232404, -185.885037),
  northEast = L.latLng(72.675988, -50.814728),
  bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
  layers: [imageryTopo],
  'zoomControl': false,
  'minZoom': 4,
  'maxBounds': bounds
}).setView([34.8138, -96.06445], 4);
50.970844, -179.515997
//zoom custom position
L.control.zoom({
  position: 'topright'
}).addTo(map);

//the base map
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer"<USGS</a<'
});

function getColor(d) {
  return d == 0 ? '#02984D' :
    d < 21 ? '#FFFFCC' :
    d < 65 ? '#FFEDA0' :
    d < 123 ? '#FED976' :
    d < 217 ? '#FEB24C' :
    d < 339 ? '#FD8D3C' :
    d < 474 ? '#f97b21' :
    d < 632 ? '#fc4e2a' :
    d < 917 ? '#E31A1C' :
    d < 1230 ? '#BD0026' :
    d < 1628 ? '#5d0e25' :
    d < 2006 ? '#2f1019' :
    '#aba9a1';
}

function gridStyle(feature) {
  return {
    weight: 5,
    fillColor: getColor(feature.properties.editedPts),
    color: "rgba(115, 118, 222, 0)",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.7,
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "rgba(0, 0, 0, 1)",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.5,
  });
  info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

var popup = L.popup();
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
  popup
    .setLatLng(e.latlng)
    .setContent("<a href='https://navigator.er.usgs.gov/edit?editor=potlatch2&lat="+e.latlng.lat+"&lon="+e.latlng.lng+"&zoom=13' target='_blank'>Help to edit this area!</a>")
    .openOn(map);
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

$.getJSON("./data/gridEditedPts.json", function(data) {
  geojson = L.geoJson(data, {
    style: gridStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);
});


//info on hover!!!
var info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function(props) {
  this._div.innerHTML = '<h4>Edited Points:</h4>' + (props ?
    '<p>Edits: ' + props.editedPts + '</p>' : '<i>Hover over an area.</i>');
};

info.addTo(map);

info._container.remove();

document.getElementById('layerControl').appendChild(info.onAdd(map));

$('#alaska').click(function() {
  map.panTo(new L.LatLng(62.527582, -150.693390));
});

$('#hawaii').click(function() {
  map.panTo(new L.LatLng(19.952809, -155.780060));
});

$('#puertorico').click(function() {
  map.panTo(new L.LatLng(18.232978, -65.565530));
});

$('#contiguos').click(function() {
  map.panTo(new L.LatLng(39.985630, -100.419952));
});

$("#navigate").click(function() {
  $("#navigateTo").collapse('toggle');
});

$("#legendToggle").click(function() {
  $(".my-legend").collapse('toggle');
});

$(document).on('click',function(){
	$('#navigateTo').collapse('hide');
})
