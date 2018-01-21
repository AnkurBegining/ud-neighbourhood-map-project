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