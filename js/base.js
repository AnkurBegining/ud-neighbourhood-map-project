function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.2293105, lng: 72.6653764},
    zoom: 16
  });

var bounds = new google.maps.LatLngBounds();

var largeInfoWindow = new google.maps.InfoWindow();

var templeList = [
	{
		title: 'Swaminarayan Akshardham', 
		location: {lat: 23.2293087, lng: 72.6741314},
		index: 0
	},
 	
 	{
 		title: 'Ambaji temple', 
 		location: {lat: 23.2041136, lng: 72.6308771},
 		index: 1
 	},
 	
 	{
 		title: 'Dholeshwer Mahadev Temple', 
 		location: {lat: 23.181022, lng: 72.645094},
 		index: 2
 	},
 
 	{   title: 'BAPS Swaminarayan Hari Mandir', 
 		location: {lat: 23.2286087, lng: 72.6211846},
 		index: 3
 	},

 	{
 		title: 'Lord Shree Ayyappa Temple',
 		location: {lat: 23.1994422, lng: 72.645539},
 		index: 4
 	}
];
var markers = [];
/*
  init the marker to start: function used
*/
  function init() {
    // let's create marker from the place
    for (var i = 0; i < templeList.length; i++) {
      var marker = new google.maps.Marker({
        position: templeList[i].location,
        map: map,
        title: templeList[i].title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      // Push in the array
      markers.push(marker);

      bounds.extend(marker.position);

      marker.addListener('click', markerClickHandler);
    }
    map.fitBounds(bounds);
  }

  // Handles click event of marker
  var markerClickHandler = function ($this) {
    $this = this;
    populateInfoWindow(this, largeInfoWindow);
  };

  //refresh Marker based on Filter
  function refreshMarkers(markerList) {
    // hides all markers
    hideListing(markers);
    markerList().forEach(function (data) {
      markers[data.index].setMap(map);
    });
  }

  //Show details about single marker
  function showOnly(markerIndex) {
    // calls infowindow function
    populateInfoWindow(markers[markerIndex], largeInfoWindow);
    bounds.extend(markers[markerIndex].position);
    map.fitBounds(bounds);
  }

  // function to hide all the marker
  function hideListing(markers_l) {
    for (var i = 0; i < markers_l.length; i++) {
      markers_l[i].setMap(null);
    }
  }

// Info widow function
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;

      addLocationInfo(marker, infowindow);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function () {
        infowindow.setMarker = null;
      });

      // Animates on opening infowindow
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        // stops animation after some time
        setTimeout(function () {
          marker.setAnimation(null);
        }, 750);
      }
    }
  }

  /* 
    Fetching location info from 'foursquare api' to infowindow and adding it
  */
  function addLocationInfo(marker, infowindow) {
    // console.log(marker);
    var req_url = 'https://api.foursquare.com/v2/venues/search?v=20161016';
    var client_id = 'VQLXOOKU5ZIYY3JGLYKIPX2TL0WDYYR4LXUZG45VV1AX1IUB';
    var client_secret = '5VBPKH5XKXMJ1J0FTICPMUTYGLOPM0NP3WIHAX4DPAHQRFRB';
    var ll = marker.getPosition().lat() + ',' + marker.getPosition().lng();
    var query = marker.title;

    req_url += '&client_id=' + client_id + '&client_secret=' + client_secret + '&ll=' + ll + '&query=' + query;

    /*
      Get the details from the foursqure api
    */
    $.getJSON(req_url, function (data) {
      console.log(data);

      var place = data.response.venues[0];
      var markerHtml = '<strong>' + marker.title + '</strong><br>';

      try{
        if (place.categories.length) {
        markerHtml += '<strong>Category:</strong>' + place.categories[0].name + '<br>';
      }
      }
      catch(e){
       }
      try{
        markerHtml += '<strong>Address:</strong>';
        if (place.location.address !== undefined) {
          markerHtml += place.location.address + '<br>';
        }
        else{
          markerHtml += "Sorry we couldn't load this address" + '<br>';
        }
      }
      catch(e){
        console.log("Location couldn't be fetched");
      }
      
      try{
        markerHtml += place.location.city + ',' + place.location.country;
      }
      catch(e){
        markerHtml += "No information about city" + ',' + "No information about location";
        console.log("could not parse the information from the third party api");
      }
      

      infowindow.setContent(markerHtml);

    })
    /*
      if failing in loading then show the error
    */
      .fail(function () {
        infowindow.setContent("Sorry for the inconvience caused, there is error in loading the call");
      });

  }

  /*
    Making marker model
  */
  function MarkerListViewModel() {
    var self = this;
    self.listFilter = ko.observable('');
    self.markerList = templeList;

    /*
      Let's set based on filter value
    */
    self.markers = ko.computed(function () {
      var filter = self.listFilter();
      if (filter === '') {
        return self.markerList;
      } else {
        var tempList = self.markerList.slice();
        return tempList.filter(function (marker) {
          return marker.title.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        });
      }
    });

    self.filterList = function () {

    };

    /*
      Set the refreance based on filter
    */
    self.refreshMarkers = function () {
      refreshMarkers(self.markers);
    };
    self.itemClicked = function (markerIndex) {
      showOnly(markerIndex);
    };
  }
  $(document).ready(function () {
    // initialises markers
    init();

    // Knockoutjs initialisation
    var MLVM = new MarkerListViewModel();
    ko.applyBindings(MLVM);
    MLVM.listFilter.subscribe(function () {
      MLVM.refreshMarkers();
    });
    $('.sidebar-toggle').click(function () {
      $('.sliceBar').toggleClass('hiddenSlicebar');
    });
  });
}

/* 
mapLoadError shows error when google maps failed to load

*/
mapLoadError = function() {
  alert('Sorry for the inconvience caused: Google maps failed to load. Please try again ');
};