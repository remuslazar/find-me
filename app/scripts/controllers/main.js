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
  .controller('MainCtrl', function ($rootScope, $scope, $cookieStore, $location, Places, Googlemap, $routeParams, $timeout) {
    
    function geolocationInit() {
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
	    // try again in 10 seconds
	    $timeout(geolocationInit, 10000);
	  },
	  {
	    enableHighAccuracy: true,
	    timeout: 30000,
	    maximumAge: 10000
	  } ); // options
      } else {
	window.alert('Sorry, Geolocation is not supported by this browser!');
      }
    }
    
    function login() {
      $location.path('/login');
    }
    
    $scope.nickname = $cookieStore.get('nickname');
    var roomName = $routeParams.roomName;
    $scope.roomName = roomName;
    
    if (roomName) {
      $cookieStore.put('roomName', roomName);
    }
    
    if (!$scope.nickname || !roomName) {
      return login();
    }
    $rootScope.title = '['+$scope.nickname+'] ' + 'Find Me :: ' + roomName;
    
    $scope.selectPlace = function(place) {
      $scope.selectedPlace = place;
      Googlemap.panTo(place.coords);
    };
    
    var markers = {};
    $scope.markers = markers;
    
    function updatePlacesOnMap() {
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
    }
    
    function initView() {
      Googlemap.init();
      Places.setOwnLocation($scope.nickname, roomName);
      markers = {};
      updatePlacesOnMap();
      Places.places.$on('change', updatePlacesOnMap);
      $scope.places = Places.places;
      geolocationInit();
//      console.log('main view initialized now');
    }

    // init the google map object and start geolocating on load
    angular.element(document).ready(function () {
      initView();
    });

    $scope.deletePlace = function(id) {
      Places.deletePlace(id);
      markers[id].setMap(null);
      delete markers[id];
    };
    
    // filter only the places with available coordinates
    $scope.placeFilter = function(a) {
      return angular.isObject(a.coords);
    };
    $scope.login = login;
  });
