function initMap() {

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.2293105, lng: 72.6653764},
    zoom: 13
  });
}