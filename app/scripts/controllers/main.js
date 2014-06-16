'use strict';

/**
 * @ngdoc function
 * @name findMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findMeApp
 */

/*global google */
/*global Firebase */

angular.module('findMeApp')
  .controller('MainCtrl', function ($scope, $cookieStore, $location, PlacesDatastore) {
    $scope.nickname = $cookieStore.get('nickname');
    if (!$scope.nickname) {
      $location.path('/login');
    }

    $scope.places = PlacesDatastore.places;

    var map;
    $scope.mapIsInitialized = false;    
    var lastLocation = new google.maps.LatLng(52.520816, 13.410186); // berlin
    var lastPosition = $cookieStore.get('lastPosition');
    if (lastPosition && lastPosition.coords) {
      lastLocation = new google.maps.LatLng(lastPosition.coords.latitude, lastPosition.coords.longitude);
    }

    function centerMap(position) {
      if (!$scope.mapIsInitialized) {
	$scope.mapIsInitialized = true;
//	console.log('map setCenter');
	var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);     
	map.panTo(pos);
	$cookieStore.put('lastPosition', position);
      }
    }

    $scope.selectPlace = function(place) {
      $scope.selectedPlace = place;
      map.panTo(new google.maps.LatLng(place.coords.latitude, place.coords.longitude));
    };
    
    function showPosition(position) {
      console.log('Latitude: ' + position.coords.latitude + ', ' +
		  'Longitude: ' + position.coords.longitude);
      // update my location in the cloud
      PlacesDatastore.places.$child($scope.nickname).$set({
	coords: position.coords,
	timestamp: Firebase.ServerValue.TIMESTAMP
      });
      centerMap(position);
    }

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(showPosition, function() {
	console.log('geolocation failed');
      }, {enableHighAccuracy: true, timeout: 0, maximumAge: 30000 } );
    } else {
      window.alert('Sorry, Geolocation is not supported by this browser!');
    }
    
    function mapInit() {
      var mapOptions = {
	center: lastLocation,
	zoom: 14,
	mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    }
    mapInit();

    var markers = {};    
    var infoWindow = new google.maps.InfoWindow();

    function createMarker(nickname, info) {
      var pos = new google.maps.LatLng(info.coords.latitude, info.coords.longitude);
      var icon = {
	path: google.maps.SymbolPath.CIRCLE,
	fillOpacity: 0.5,
	strokeColor: '0099cc',
	strokeOpacity: 1.0,
	fillColor: '0099cc',
	strokeWeight: 2.0, 
	scale: 10 //pixels
      };
      var marker = new google.maps.Marker({
        map: map,
        position: pos,
        title: nickname === $scope.nickname ? 'My location' : nickname,
	draggable: false,
	animation: google.maps.Animation.DROP,
	icon: nickname === $scope.nickname ? icon : ''
      });
      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent('<h4>' + marker.title + '</h4>');
        infoWindow.open(map, marker);
      });
      return marker;
    }
    
    PlacesDatastore.places.$on('change', function() {
      var places = PlacesDatastore.places.$getIndex();
      for (var i=0; i<places.length; i++) {
	var nickname = places[i];
	var info = PlacesDatastore.places[nickname];
	if (markers[nickname]) { // update
	  markers[nickname].setPosition(new google.maps.LatLng(info.coords.latitude, info.coords.longitude));
//	  console.log(nickname + ' updated to the map');
	} else { // create new marker
	  var newMarker = createMarker(nickname, info);
	  newMarker.timestamp = info.timestamp;
	  markers[nickname] = newMarker;
//	  console.log(nickname + ' added to the map');
	  centerMap(info);
	}
      }
    });
    $scope.markers = markers;

  });
