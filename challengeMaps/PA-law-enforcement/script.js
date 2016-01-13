//the base maps
var imageryTopo = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WmsServer?", {
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer"<USGS</a>'
});

var nationalMap = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WmsServer?", {
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer"<USGS</a<'
});

var imagery = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WmsServer?", {
  layers: 0,
  attribution: 'Map tiles by <a href="http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer"<USGS</a<'
});

var southWest = L.latLng(39.50, -81.01),
  northEast = L.latLng(42.39, -74.26),
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

var addPoints = function(layer, url, icon, markerColor) {
  $.getJSON(url, function(data) {
    layer = L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.Name + '<hr> <a href="' + feature.properties.Description + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
      },
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: L.AwesomeMarkers.icon({
            icon: icon,
            markerColor: markerColor,
            prefix: 'fa'
          }),
        });
      }
    }).addTo(map)
    console.log(layer)
  });
};

addPoints("finishedLayer", "./data/finished.geojson", 'fa-check fa-2x', 'green');
addPoints("tobecheckedLayer", "./data/tobechecked.geojson", 'fa-exclamation fa-2x', 'orange');
addPoints("tobepeerreviwedLayer", "./data/tobepeerreviwed.geojson", 'fa-times fa-2x', 'purple');

//Legend toggle
$(".markers-legend").hover(
  function() {
    original = $(this).find('i').attr('class');
    $(this).css("background-position", "-612px 0").css("padding-top", "8px").css("padding-left", "8px");
    $(this).find("i").attr('class', 'fa fa-eye-slash');
    console.log(original)
  }, function() {
    $(this).removeAttr('style');
    $(this).find("i").attr('class', original);
  }
);
$(".markers-legend").click(function(){
    thisLayer = this.id
});
