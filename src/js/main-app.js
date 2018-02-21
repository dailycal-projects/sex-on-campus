require('../scss/main.scss');
const map_data = require('../data/data.json'); //loading in data.json as a data variable in js
const L = require('leaflet');
const MC = require('leaflet.markercluster')

window.$('.icon-facebook').click((e) => {
  e.preventDefault();
  const uri = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${uri}`);
});


window.$('.icon-twitter').click((e) => {
  e.preventDefault();
  const uri = window.location.href;
  const status = encodeURIComponent(`${window.tweetText} ${uri}`);
  window.open(`https://twitter.com/home?status=${status}`);
});

var map = L.map('map', { scrollWheelZoom:false })
            .setView([37.871470, -122.260363], 15); //'map' refers to map id

if ($(window).width() <= 650) {
  let m = $("#map").detach();
  $("#drag").after(m);
}

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Clustering
var markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      var markers = cluster.getAllChildMarkers();
      var html = '<div class="circle">' + markers.length + '</div>';
      return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(32, 32) });
    },
    // To disable clustering for now
    maxClusterRadius: 45
});

// for every line in the spreadsheet, add a point with the lat and long that has the pop message
map_data.events.map(d => {
  let i = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
  });

  let marker = L.marker([d.lat, d.long], {icon: i})
  marker.bindPopup(d.message)
  markers.addLayer(marker);
});

map.addLayer(markers)

let pinpoint = null; // Null if no point dragged; else, contains icon.
$("#drag").click(function() {
  if (pinpoint == null) {
    // From https://github.com/pointhi/leaflet-color-markers
    let coloredIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    pinpoint = L.marker(map.getBounds().getCenter(), {draggable: true, icon: coloredIcon, zIndexOffset: 100});
    pinpoint.addTo(map);

    if ($("textarea").val() != "") {
      $(".button").removeAttr("disabled");
    }
  }
});

// after unfocus of text field, check if it has information.
$("textarea").focusout(function() {
  if ($("textarea").val() != "" && pinpoint != null) {
    $(".button").removeAttr("disabled");
  } else {
    $(".button").attr("disabled", "true");
  }
})

$("#submit").click(function() {
  // Check if pinpoint exists and description is filled
  if (pinpoint == null || $("textarea").val() == "") {
    console.log("error"); // show error
    return;
  } else {

    $("input#location").val(pinpoint.getLatLng());

    $("form").hide();
    $("#completed").css({"display":"flex"});;
  }
})

$("#warning").click(function() {
  $("#warning").hide();
})
