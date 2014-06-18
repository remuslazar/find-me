'use strict';

/*global google */

angular.module('findMeApp')
  .service('Googlemap', function Googlemap($cookieStore) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var map;
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

    var infoWindow = new google.maps.InfoWindow();
    function createMarker(nickname, info, isOwnLocation) {
      if (!info.coords) {
	return;
      }
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
      return marker;
    }

    // exported functions for this service
    this.init = mapInit;
    this.centerMap = centerMap;
    this.createMarker = createMarker;
    this.panTo = function(coords) {
      if (!coords) { return; }
      map.panTo(new google.maps.LatLng(coords.latitude, coords.longitude));
    };
    
  });
