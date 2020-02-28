let map, infoWindow, pos;

function initMap() {
  map = new google.maps.Map(document.getElementById("googleMap"), {
    center: { lat: 37.5407, lng: -77.4360 },
    zoom: 12
  });
  infoWindow = new google.maps.InfoWindow();

  // let locations =

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);

      let marker = new google.maps.Marker({
        map: map,
        position: pos,
        title: "You are here",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
      });

    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter(center));
  }
  $.ajax({
    method: "GET",
    url: "api/companies"
  }).done(function (companies) {

    let markers = [];
    let infoWindows = [];

    for (let i = 0; i < companies.length; i++) {
      let lat = companies[i].Latitude;
      let lng = companies[i].Longitude;
      let webpage = companies[i].Website;
      if (webpage.length > 0) {
        if (webpage.substring(0, 4) !== "http") {
          webpage = "https://" + webpage
        }
        webpage = `<a href="${webpage}" target="_blank">Visit Website</a>`
      }

      infoWindows[i] = new google.maps.InfoWindow({
        content: companies[i].Facility + `<div>${companies[i].Contact}</div>` + companies[i].Address + `<br>` + webpage
          + `<br>` + `<a href="https://www.google.com/maps/dir/${pos.lat},${pos.lng}/${companies[i].Latitude},${companies[i].Longitude}" target="_blank">Get Directions</a>`
      });

      markers[i] = new google.maps.Marker({
        map: map,
        position: {
          lat: lat,
          lng: lng
        },
        title: companies[i].Facility
      });
      markers[i].addListener('click', function () {

        infoWindows[i].open(map, markers[i]);
      });
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

$.ajax({
  method: "GET",
  url: "api/companies"
}).done(function (companies) {

});

$(document).ready(function () {
  $("table").on("click", "tr", function (event) {
    let $headerRow = $(this)
      .closest("table")
      .find("thead tr:first"),
      $headerRowTds = $headerRow.find("th");

    let $row = $(this).closest("tr"),
      $tds = $row.find("td");

    $headerRowTds.each(function (i) {
      // let header = $(this).text();
      let selectedLID = $tds.eq(5).text();
      let selectedLat = $tds.eq(6).text();
      let selectedLon = $tds.eq(7).text();


    });
  });
});
