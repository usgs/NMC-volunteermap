
// JavaScript test file for overlay data for Interactive Challenge Maps// 
//Variables//
var targetId; // pointing to GLOBALID
var feature;
var properties;
var popup;
var Math;
var floor;
var getFeature;
var unedited_points = '0';
var unedited_PR = '1';

//Basemaps//
var imageryTopo = L.tileLayer.wms('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer', {
  minZoom: '0',
  maxZoom: '19',
  attribution: 'Map tiles by <a href="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer">USGS</a>'
});

var nationalMap = L.tileLayer.wms("https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer", {
  minZoom: '0',
  maxZoom: '19',
  attribution: 'Map tiles by <a href="https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer">USGS</a>'
});

/*
var usdaNAIP = L.esri.dynamicMapLayer({
  url: "https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer",
  minZoom: '14',
  maxZoom: '19',
  attribution: ' Map tiles by <a href="https://gis.apfo.usda.gov/arcgis/rest/services/Base_Maps/Base_Map/MapServer"> USDA</a>'
});
*/

//Layer Groups for the basemaps so that they will control the zoom levels properly//
var usda = L.layerGroup([nationalMap/*, usdaNAIP*/]);
var national = L.layerGroup([imageryTopo/*, usdaNAIP*/]);

//Bound Box for The Map//
var southWest = L.latLng(14.581656, -169.354212),
  northEast = L.latLng(661.492973, 174.987991),
  bounds = L.latLngBounds(southWest, northEast);

//add to Map capability//
var map = L.map('map', {
  layers: [national, usda],
  'maxBounds': bounds
}).setView([40.63, -77.84], 7);

//variables for function for local scope//
var un_points = L.esri.clusteredFeatureLayer({
  url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
  where: "EDITSTATUS ='0'",
  minZoom: '0',
  maxZoom: '13',
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15" + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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
  url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
  where: "EDITSTATUS ='1'",
  minZoom: '0',
  maxZoom: '13',
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15" + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
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

//Variables for Global scope//
var uneditedFeatureLayer = L.esri.clusteredFeatureLayer({
  url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
  where: "EDITSTATUS='0'",
  minZoom: '0',
  maxZoom: '13',
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15" + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
  },
  pointToLayer: function(feature, latlng) {
    if (feature.properties.GLOBALID === targetId) {
      var popup = L.popup().setLatLng([feature.geometry.coordinates[1] + 0.00005, feature.geometry.coordinates[0]])
        .setContent(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15" + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>').openOn(map);
    }
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

var editedFeatureLayer = L.esri.clusteredFeatureLayer({
  url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0",
  where: "EDITSTATUS='1'",
  minZoom: '0',
  maxZoom: '13',
  //New popup code//
  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15" + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>');
  },
  pointToLayer: function(feature, latlng) {
      if (feature.properties.GLOBALID === targetId) {
          var popup = L.popup().setLatLng([feature.geometry.coordinates[1] + 0.00005, feature.geometry.coordinates[0]])
            .setContent(feature.properties.NAME + '<hr> <a href="https://edits.nationalmap.gov/tnmcorps/?loc=' + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + ",15" + '" target=_blank style="color:#fffbfb;text-align:center">Link to point.</a>').openOn(map);
    }
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

function getRandom() {
  getRandomFeature().then(function(test) {
    map.setView([test[0].geometry.y, test[0].geometry.x], 18)
    targetId = test[0].attributes.GLOBALID;
  })
};

function getPeer() {
  getPeerFeature().then(function(test) {
    map.setView([test[0].geometry.y, test[0].geometry.x], 18)
    targetId = test[0].attributes.GLOBALID;
  })
};

function getRandomFeature() {
  return new Promise(function(resolve, reject) {
    let query = new L.esri.Tasks.query({
      url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0"
    });
    // where is a function
    query.where("EDITSTATUS = '0'");
    query.ids(function(error, featureCollection, response) {
      if (featureCollection.length !== 0) {
        testId = featureCollection[Math.floor(Math.random() * featureCollection.length)];
        console.log("ID: ", testId)
        let finalQuery = new L.esri.Tasks.query({
          url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0"
        });
        // where is a function
        query.where( "OBJECTID=\'" + testId.toString()+"\'");
        query.run(function(error, featureCollection, response) {
          resolve(response.features);
        });
      } else {
        reject("nothing found");
      }

    });
  });
}


function getPeerFeature() {
  return new Promise(function(resolve, reject) {
    let query = new L.esri.Tasks.query({
      url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0"
    });
    query.where("EDITSTATUS ='1'");
    query.ids(function(error, featureCollection, response) {
      if (featureCollection.length > 0) {
        testId = featureCollection[Math.floor(Math.random() * featureCollection.length)];
        let finalQuery = new L.esri.Tasks.query({
          url: "https://edits.nationalmap.gov/arcgis/rest/services/TNMCorps/TNMCorps_Map_Challenge/MapServer/0"
        });
        query.where("OBJECTID=\'" + testId.toString()+"\'");
        query.run(function(error, featureCollection, response) {
          resolve(response.features);
        });
      } else {
        reject("nothing found");
      }
    });
  });
}

//container for the base layers.. thought i made this on line 25 and 26//
var baseMaps = {
  "usda": usda,
  "national": national
};

map.zoomControl.setPosition('bottomright');

//A layer control for the selectable layers.//
L.control.layers(baseMaps).addTo(map);
