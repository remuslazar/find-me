'use strict';

/*global google */

angular.module('findMeApp')
  .service('Googlemap', function Googlemap($cookieStore) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var map;
    var markers = [];

    var mapIsInitialized = false;    

    var lastLocation = new google.maps.LatLng(52.520816, 13.410186); // berlin
    var latlngbounds = new google.maps.LatLngBounds();
    var markersCount = 0;

    var lastPosition = $cookieStore.get('lastPosition');
    if (lastPosition && lastPosition.coords) {
      lastLocation = new google.maps.LatLng(lastPosition.coords.latitude, lastPosition.coords.longitude);
    }
    
    function centerMap(position) {
      if (!mapIsInitialized) {
	if (!(position && position.coords)) {
	  return;
	}
	mapIsInitialized = true;
//	console.log('map setCenter');
	var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	map.panTo(pos);
	$cookieStore.put('lastPosition', position);
      }
    }
    
    // Sets the map on all markers in the array.
    function setAllMap(map) {
      for (var i = 0; i < markers.length; i++) {
	markers[i].setMap(map);
      }
    }
    
    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setAllMap(null);
    }
    
    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
      clearMarkers();
      markers = [];
    }
    
    function mapInit() {
      var mapOptions = {
	streetViewControl: false,
	panControl: false,
	zoomControl: false,
	center: lastLocation,
	zoom: 14,
	mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    }

    var ownPosition;

    var infoWindow = new google.maps.InfoWindow();
    function createMarker(nickname, coords, isOwnLocation) {
      if (!coords) {
	return;
      }
      var pos = new google.maps.LatLng(coords.latitude, coords.longitude);

      if (isOwnLocation) {
	ownPosition = pos;
      }

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
        title: isOwnLocation ? 'My location' : nickname,
	draggable: false,
	animation: google.maps.Animation.DROP,
	icon: isOwnLocation ? icon : ''
      });
      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent('<h4>' + marker.title + '</h4>');
        infoWindow.open(map, marker);
      });
      latlngbounds.extend(pos);
      if (markersCount++) {
	map.fitBounds(latlngbounds);
      }
      markers.push(marker);
      return marker;
    }

    // exported functions for this service
    this.init = mapInit;
    this.centerMap = centerMap;
    this.createMarker = createMarker;
    this.deleteMarkers = deleteMarkers;
    this.panTo = function(coords) {
      if (!coords) { return; }
      map.panTo(new google.maps.LatLng(coords.latitude, coords.longitude));
    };

    this.distanceTo = function(coords) {
      if (!ownPosition) { return; }
      return google.maps.geometry.spherical.computeDistanceBetween(
	ownPosition,
	new google.maps.LatLng(coords.latitude, coords.longitude));
      };

    this.updatePosition = function(marker, coords, isOwnLocation) {
      var pos = new google.maps.LatLng(coords.latitude, coords.longitude);
      marker.setPosition(pos);
      if (isOwnLocation) {
	ownPosition = pos;
      }
    };
    
  });
