'use strict';

/**
 * @ngdoc function
 * @name findMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findMeApp
 */

/*global google */

angular.module('findMeApp')
  .controller('MainCtrl', function ($scope, $cookieStore, $location, Places, Googlemap) {
    $scope.nickname = $cookieStore.get('nickname');
    if (!$scope.nickname) {
      $location.path('/login');
    }
    Places.setOwnLocation($scope.nickname);

    $scope.places = Places.places;

    $scope.selectPlace = function(place) {
      $scope.selectedPlace = place;
      Googlemap.panTo(place.coords);
    };
    
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
	function(position) { // success
	  console.log('Latitude: ' + position.coords.latitude + ', ' +
		      'Longitude: ' + position.coords.longitude);
	  // update my location in the cloud
	  Places.updateMyPosition(position);
	  Googlemap.centerMap(position);
	},
	function() { // error
	  console.log('geolocation failed');
	},
	{
	  enableHighAccuracy: true,
	  timeout: 30000,
	  maximumAge: 10000
	} ); // options
    } else {
      window.alert('Sorry, Geolocation is not supported by this browser!');
    }
    
    var markers = {};    
    
    Places.places.$on('change', function() {
      var places = Places.places.$getIndex();
      for (var i=0; i<places.length; i++) {
	var nickname = places[i];
	var info = Places.places[nickname];
	if (markers[nickname]) { // update
	  markers[nickname].setPosition(new google.maps.LatLng(info.coords.latitude, info.coords.longitude));
//	  console.log(nickname + ' updated to the map');
	} else { // create new marker
	  var newMarker = Googlemap.createMarker(nickname, info, nickname === $scope.nickname);
	  markers[nickname] = newMarker;
//	  console.log(nickname + ' added to the map');
	  Googlemap.centerMap(info);
	}
      }
    });

    $scope.markers = markers;

    // init the google map object on load
    $scope.$on('$viewContentLoaded', function() {
      Googlemap.init();
    });

    $scope.deletePlace = function(id) {
      Places.deletePlace(id);
      markers[id].setMap(null);
      delete markers[id];
    };

  });
