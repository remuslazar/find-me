'use strict';

/**
 * @ngdoc function
 * @name findMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findMeApp
 */

angular.module('findMeApp')
  .controller('MainCtrl', function ($scope, Settings, $location, Places, Googlemap, $timeout) {

    var geolocationWatchId;
    
    function geolocationInit() {
      if (navigator.geolocation) {
	geolocationWatchId = navigator.geolocation.watchPosition(
	  function(position) { // success
	     console.log('Latitude: ' + position.coords.latitude + ', ' +
	     		'Longitude: ' + position.coords.longitude);
	    // update my location in the cloud
	    Places.updateMyPosition(position);
	    Googlemap.centerMap(position);
	    $scope.gpsPosition = position;
	  },
	  function(err) { // error
	    console.log('geolocation failed: '+err.code);
	    navigator.geolocation.clearWatch(geolocationWatchId);
	    // try again in 10 seconds
	    $timeout(function() {
	      geolocationInit();
	    }, 10000);
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
      $scope.gpsPosition = null;
      Googlemap.init();
      Places.setOwnLocation(Settings.data.nickname, Settings.data.roomName);
      markers = {};
      
      // listen to data changes
      Places.places.$on('child_added', function(childSnapshot) {
	var name = childSnapshot.snapshot.name;
	var info = childSnapshot.snapshot.value;
	console.log('new device: '+name+' added');
	Places.places.$child(name).$child('coords').$on('value', function(dataSnapshot) {
	  console.log('rt update for "'+name+'" received');
	  var coords = dataSnapshot.snapshot.value;
	  if (coords) {
	    if (!markers[name]) { // create a marker on the fly
	      markers[name] = Googlemap.createMarker(name, coords, name === Settings.data.nickname);
	      Googlemap.centerMap(info);
	    }
	    // we know that this particalar marker exists because we created it before
	    Googlemap.updatePosition(markers[name],
				     coords,
				     name === Settings.data.nickname);
	  } else { // no data means that the user has been deleted
	    console.log('"'+name+'" has gone away now!');
	    if (markers[name]) { // cleanup the marker if exists
	      Googlemap.deleteMarker(markers[name]);
	      delete markers[name];
	    }
	  }
	});
      });
      
      Places.initPresenceSystem();
      geolocationInit();
      $scope.places = Places.places;
    }

    // init the google map object and start geolocating on load
    angular.element(document).ready(function () {
      initView();
    });

    $scope.deletePlace = function(id) {
      Places.deletePlace(id);
    };

    $scope.deletePath = function(id) {
      Googlemap.deletePath(id);
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
