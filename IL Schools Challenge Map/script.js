//the base maps
var imageryTopo = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryTopo/MapServer/WmsServer?", {
  layers: 0,
  attribution: " USGS Hybrid Tile, USGS Image Only Dynamic Map, USGS ImageTopo Tile",
});

var nationalMap = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WmsServer?", {
  layers: 0,
  attribution: " USGS Topo Basemap Tile, USGS Topo Dynamic Map",
});

var imagery = L.tileLayer.wms("http://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WmsServer?", {
  layers: 0,
  attribution: " USGS Image Only Dynamic Map, USGS Image Only Tile",
});


var basemaps = {
  "The National Map Base Layer": nationalMap,
  "The Nationap Map + Aerial Imagery": imageryTopo,
  "The National Map Imagery": imagery
}

/*
 Here is where you set the boundaries
 HINT: Depending on how these challenge things are set up you could just use the same file that's supplying
    the feature data to the map to also send it the boundaries so you only need to update one file later on
 HINT: read above hint for Title
*/

var southWest = L.latLng(11.232404, -185.885037),
  northEast = L.latLng(72.675988, -50.814728),
  bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
  layers: [imageryTopo],
  'zoomControl': false,
  'minZoom': 4,
  'maxBounds': bounds,

}).setView([34.8138, -96.06445], 4);
50.970844, -179.515997
//zoom custom position
L.control.zoom({
  position: 'topright'
}).addTo(map);
L.control.layers(basemaps, null, {
  position: 'bottomright'
}).addTo(map);

//typeahead set-up
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
    // an array that will be populated with substring matches
    matches = [];
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });
    cb(matches);
  };
};

//nice progress bar
var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');

function updateProgressBar(processed, total, elapsed, layersArray) {
  if (elapsed > 100) {
    // if it takes more than a second to load, display the progress bar:
    progress.style.display = 'block';
    progressBar.style.width = Math.round(processed / total * 100) + '%';
  }

  if (processed === total) {
    // all markers processed - hide the progress bar:
    progress.style.display = 'none';
  }
}

//style points
function Style(feature) {
  return {
    fillColor: "#d17700",
    stroke: 1,
    opacity: 1,
    color: "#831212",
    fillOpacity: 1,
    weight: 1,
    radius: 5
  };
}

//geojson call from list
var gotDate;
var geojson;
$('#userlayers li').click(function() {
  var url = this.id;
  console.log(url);
  if (geojson !== undefined) {
    map.removeLayer(geojson);
  }
  if ($('#statedEdited li').length) {
    $('#statedEdited').empty();
  }
  if ($('#earnedBadges li').length) {
    $('#earnedBadges').empty();
  }
  $.getJSON("./data/" + url + ".json", function(data) {
    geojson = L.geoJson(data, {
      pointToLayer: function(feature, latlgn) {
        return L.circleMarker(latlgn, Style(feature)).bindPopup("<a href='" + feature.properties.OSM_LINK + "' target='_blank'>Point Information</a>");
      }
    });
    map.addLayer(geojson);
    map.fitBounds(geojson.getBounds());
    $("#searchinput").val(""); //this clears the search box
    $("#volunteerName").html("<p>" + url + "<p>");
    
    //testing nesting using d3
    d3.json("./data/" + url + ".json", function(json) {
      var stateName = d3.nest()
        .key(function(d, i) {
          return d.properties.NAME;
        })
        .entries(json.features);
      for (key in stateName) {
        if (stateName.hasOwnProperty(key)) {
          var value = stateName[key];
          var states = "<li id='states'>" + value.key + " - " + value.values.length + "</li>"
          $('#statedEdited').append(states);
        }
      }
    });
    
    var countList = $('#earnedBadges li').length;
    console.log(countList);
    $('#earnedBadges li').click(function() {
      var badge = $(this).html();
      var badgeID = "'#" + badge + "'";
      $("#badgeModal").modal('show')
      $('#badge').attr('src', './assets/img/' + $(this).html() + '.png');
    });
  });
});

//geojson call from search box
$('#searchBoxBtn').click(function() {
  var url = $('#searchinput').val();
  console.log(url);
  if (geojson !== undefined) {
    map.removeLayer(geojson);
  }
  if ($('#statedEdited li').length) {
    $('#statedEdited').empty();
  }
  if ($('#earnedBadges li').length) {
    $('#earnedBadges').empty();
  }
  $.getJSON("./data/" + url + ".json", function(data) {
    geojson = L.geoJson(data, {
      pointToLayer: function(feature, latlgn) {
        return L.circleMarker(latlgn, Style(feature)).bindPopup("<a href='" + feature.properties.OSM_LINK + "' target='_blank'>Point Information</a>");
      }
    });
    map.addLayer(geojson);
    map.fitBounds(geojson.getBounds());
    $("#searchinput").val(""); //this clears the search box
    $("#volunteerName").html("<p>" + url + "<p>");

    $("#volunteerNameSidebar").html(url);
    //testing nesting using d3
    d3.json("./data/" + url + ".json", function(json) {
      var stateName = d3.nest()
        .key(function(d, i) {
          return d.properties.NAME;
        })
        .entries(json.features);
      console.log(stateName);
      for (key in stateName) {
        if (stateName.hasOwnProperty(key)) {
          var value = stateName[key];
          var states = "<li>" + value.key + " - " + value.values.length + "</li>"
          $('#statedEdited').append(states);
        }
      }
    });
    
    $('#earnedBadges li').click(function() {
      var badge = $(this).html();
      var badgeID = "'#" + badge + "'";
      $("#badgeModal").modal('show')
      $('#badge').attr('src', './assets/img/' + $(this).html() + '.png');
    });
  });
});

//show #progress div when making ajax loads
$(document).ajaxStart(function() {
  $("#progress").show();
});

$(document).ajaxComplete(function() {
  $("#progress").hide();
});

//add x button to clear the search field
$("#searchinput").keyup(function() {
  $("#searchclear").toggle(Boolean($(this).val()));
});
$("#searchclear").toggle(Boolean($("#searchinput").val()));
$("#searchclear").click(function() {
  $("#searchinput").val('');
  $(this).hide();
});
