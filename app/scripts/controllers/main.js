'use strict';

/**
 * @ngdoc function
 * @name findMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findMeApp
 */

angular.module('findMeApp')
  .controller('MainCtrl', function ($scope, Settings, $location, Places, Googlemap) {
    
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
//	    $timeout(geolocationInit, 10000);
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
    
    if (!Settings.areValid()) {
      return login();
    }
    
    $scope.selectPlace = function(place) {
      $scope.selectedPlace = place;
      Googlemap.panTo(place.coords);
    };
    
    var markers = {};
    
    function initView() {
      Googlemap.init();
      Places.setOwnLocation(Settings.data.nickname, Settings.data.roomName);
      Googlemap.deleteMarkers();
      markers = {};

      Places.places.$on('child_added', function(childSnapshot) {
	var name = childSnapshot.snapshot.name;
	var info = childSnapshot.snapshot.value;
	console.log('new device: '+name+' added');
	markers[name] = Googlemap.createMarker(name, info.coords, name === Settings.data.nickname);
	Googlemap.centerMap(info);
	Places.places.$child(name).$child('coords').$on('value', function(dataSnapshot) {
	  console.log('rt update for "'+name+'" received');
	  var coords = dataSnapshot.snapshot.value;
	  if (coords) {
	    if (markers[name]) {
	      Googlemap.updatePosition(markers[name],
				       coords,
				       name === Settings.data.nickname);
	    }
	  } else {
	    console.log('"'+name+'" has gone away now!');
	    if (markers[name]) {
	      Googlemap.deleteMarker(markers[name]);
	      delete markers[name];
	    }
	  }
	});
      });

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
    };
    
    // filter only the places with available coordinates
    $scope.placeFilter = function(a) {
      return angular.isObject(a.coords);
    };
    $scope.login = login;

    $scope.distanceTo = function(coords) {
      return Googlemap.distanceTo(coords);
    };

    // make the settings service available to the view
    $scope.settings = Settings;
  });
