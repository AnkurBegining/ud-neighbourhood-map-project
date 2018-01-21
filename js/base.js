function initMap() {

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.2293105, lng: 72.6653764},
    zoom: 13
  });
}

var markerList = [
	{
		title: 'Swaminarayan Akshardham', 
		location: {lat: 23.2293087, lng: 72.6741314}
	},
 	
 	{
 		title: 'Ambaji temple', 
 		location: {lat: 23.2041136, lng: 72.6308771}
 	},
 	
 	{
 		title: 'Dholeshwer Mahadev Temple', 
 		location: {lat: 23.181022, lng: 72.645094}
 	},
 
 	{   title: 'BAPS Swaminarayan Hari Mandir', 
 		location: {lat: 23.2286087, lng: 72.6211846}
 	}
];


function Marker(data) {
   this.title = data.title;
   this.location = data.location;
}

function MarkerListViewModel() {
  var self = this;

  console.log("From marker");

  self.listFilter = ko.observable('');

  // console.log(self.listFilter());
 
  self.markerList = markerList;
 
  // self.markers = ko.observableArray(markerList);
  self.markers = ko.computed(function () {
    var filter = self.listFilter();


    if (filter === '') {
      console.log(filter);
      return self.markerList
    } else {
      var tempList = self.markerList.slice();

      console.log("New List");
      console.log("Filter "+filter);
      return tempList.filter(function (marker) {
        console.log(marker);
        console.log(" Res "+marker.title.indexOf(filter))
        return marker.title.toLowerCase().indexOf(filter.toLowerCase()) > -1
      })
    }
  });

  self.filterList = function () {

  }
}

ko.applyBindings(new MarkerListViewModel()); 