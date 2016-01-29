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

//Create list of users automatic
var users = {};

$.ajax({
  url: "./data/users.json",
  async: false,
  dataType: 'json',
  success: function(data) {
    users = data
  }
});


var suma = 0;
var o = '';
for (var i = 0; i < users.length; i++) {
  o += '<li  id="' + users[i].UserName + '">' +
    '<a class="users" href="#' + users[i].UserName + '"> ' + users[i].UserName + ' - ' + users[i].TotalUniqueNodes + '</a>' +
    '</li>';
};

$('#userlayers').append(o);



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

var sourceArr = [];

for (var i = 0; i < users.length; i++) {
  sourceArr.push(users[i].UserName);
}

$('#searchinput').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
}, {
  name: 'sourceArr',
  source: substringMatcher(sourceArr)
});


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
        return L.circleMarker(latlgn, Style(feature)).bindPopup("<a href='" + feature.properties.link + "' target='_blank'>Point Information</a>");
      }
    });
    map.addLayer(geojson);
    map.fitBounds(geojson.getBounds());
    $("#searchinput").val(""); //this clears the search box
    $("#volunteerName").html("<p>" + url + "<p>");
    for (var i = 0; i < users.length; i++) {
      if (users[i].UserName == url) {
        gotDate = users[i].date;
      }
    };
    for (var i = 0; i < users.length; i++) {
      if (users[i].UserName == url) {
        gotTotalEdits = users[i].TotalUniqueNodes;
      }
    }
    $("#volunteerNameSidebar").html(url);
    $("#totalEdits").html("Total Edits: " + gotTotalEdits);
    $("#since").html("Volunteer since: " + gotDate);
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
    for (var i = 0; i < users.length; i++) {
      if (users[i].UserName == url) {
        var edits = users[i].TotalUniqueNodes;
        if (users[i].TotalUniqueNodes > 6000) {
          $.extend(users[i], {
            tier: "11"
          });
          $('#earnedBadges').append("<li>Squadron of Biplane Spectators</li><li>Ring of Reconnaissance Rocketeers</li><li>Flock of Winged Witnesses</li><li>Family of Floating Photogrammetrists</li><li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 5000 && users[i].TotalUniqueNodes < 5999) {
          $.extend(users[i], {
            tier: "10"
          });
          $('#earnedBadges').append("<li>Ring of Reconnaissance Rocketeers</li><li>Flock of Winged Witnesses</li><li>Family of Floating Photogrammetrists</li><li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 4000 && users[i].TotalUniqueNodes < 4999) {
          $.extend(users[i], {
            tier: "9"
          });
          $('#earnedBadges').append("<li>Flock of Winged Witnesses</li><li>Family of Floating Photogrammetrists</li><li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 3000 && users[i].TotalUniqueNodes < 3999) {
          $.extend(users[i], {
            tier: "8"
          });
          $('#earnedBadges').append("<li>Family of Floating Photogrammetrists</li><li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 2000 && users[i].TotalUniqueNodes < 2999) {
          $.extend(users[i], {
            tier: "7"
          });
          $('#earnedBadges').append("<li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 1000 && users[i].TotalUniqueNodes < 1999) {
          $.extend(users[i], {
            tier: "6"
          });
          $('#earnedBadges').append("<li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 500 && users[i].TotalUniqueNodes < 999) {
          $.extend(users[i], {
            tier: "5"
          });
          $('#earnedBadges').append("<li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 200 && users[i].TotalUniqueNodes < 499) {
          $.extend(users[i], {
            tier: "4"
          });
          $('#earnedBadges').append("<li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 100 && users[i].TotalUniqueNodes < 199) {
          $.extend(users[i], {
            tier: "3"
          });
          $('#earnedBadges').append("<li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 50 && users[i].TotalUniqueNodes < 99) {
          $.extend(users[i], {
            tier: "2"
          });
          $('#earnedBadges').append("<li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 24 && users[i].TotalUniqueNodes < 49) {
          $.extend(users[i], {
            tier: "1"
          });
          $('#earnedBadges').append("<li>Order of the Surveyor's Chain</li>")
        }
      }
    }
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
        return L.circleMarker(latlgn, Style(feature)).bindPopup("<a href='" + feature.properties.link + "' target='_blank'>Point Information</a>");
      }
    });
    map.addLayer(geojson);
    map.fitBounds(geojson.getBounds());
    $("#searchinput").val(""); //this clears the search box
    $("#volunteerName").html("<p>" + url + "<p>");
    for (var i = 0; i < users.length; i++) {
      if (users[i].UserName == url) {
        gotDate = users[i].date;
      }
    }
    for (var i = 0; i < users.length; i++) {
      if (users[i].UserName == url) {
        gotTotalEdits = users[i].TotalUniqueNodes;
      }
    }
    $("#volunteerNameSidebar").html(url);
    $("#totalEdits").html("Total Unique Edits: " + gotTotalEdits);
    $("#since").html("Volunteer since: " + gotDate);
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
    for (var i = 0; i < users.length; i++) {
      if (users[i].UserName == url) {
        var edits = users[i].TotalUniqueNodes;
        if (users[i].TotalUniqueNodes > 6000) {
          $.extend(users[i], {
            tier: "11"
          });
          $('#earnedBadges').append("<li>Squadron of Biplane Spectators</li><li>Ring of Reconnaissance Rocketeers</li><li>Flock of Winged Witnesses</li><li>Family of Floating Photogrammetrists</li><li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 5000 && users[i].TotalUniqueNodes < 5999) {
          $.extend(users[i], {
            tier: "10"
          });
          $('#earnedBadges').append("<li>Ring of Reconnaissance Rocketeers</li><li>Flock of Winged Witnesses</li><li>Family of Floating Photogrammetrists</li><li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 4000 && users[i].TotalUniqueNodes < 4999) {
          $.extend(users[i], {
            tier: "9"
          });
          $('#earnedBadges').append("<li>Flock of Winged Witnesses</li><li>Family of Floating Photogrammetrists</li><li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 3000 && users[i].TotalUniqueNodes < 3999) {
          $.extend(users[i], {
            tier: "8"
          });
          $('#earnedBadges').append("<li>Family of Floating Photogrammetrists</li><li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 2000 && users[i].TotalUniqueNodes < 2999) {
          $.extend(users[i], {
            tier: "7"
          });
          $('#earnedBadges').append("<li>Theodolite Assemblage</li><li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 1000 && users[i].TotalUniqueNodes < 1999) {
          $.extend(users[i], {
            tier: "6"
          });
          $('#earnedBadges').append("<li>Alidade Alliance</li><li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 500 && users[i].TotalUniqueNodes < 999) {
          $.extend(users[i], {
            tier: "5"
          });
          $('#earnedBadges').append("<li>Stadia Board Society</li><li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 200 && users[i].TotalUniqueNodes < 499) {
          $.extend(users[i], {
            tier: "4"
          });
          $('#earnedBadges').append("<li>Circle of the Surveyor's Compass</li><li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 100 && users[i].TotalUniqueNodes < 199) {
          $.extend(users[i], {
            tier: "3"
          });
          $('#earnedBadges').append("<li>Pedometer Posse</li><li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 50 && users[i].TotalUniqueNodes < 99) {
          $.extend(users[i], {
            tier: "2"
          });
          $('#earnedBadges').append("<li>Society of the Steel Tape</li><li>Order of the Surveyor's Chain</li>")
        } else if (users[i].TotalUniqueNodes > 25 && users[i].TotalUniqueNodes < 49) {
          $.extend(users[i], {
            tier: "1"
          });
          $('#earnedBadges').append("<li>Order of the Surveyor's Chain</li>")
        }
      }
    }
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

//collapse and show sidebar
$('#sidebar').slideReveal({
  trigger: $("#showSidebar, #closePanel"),
  width: 320,
  push: false,
  top: 50,
});
