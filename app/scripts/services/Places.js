'use strict';

/*global Firebase */

angular.module('findMeApp')
  .service('Places', function Places($firebase) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var firebaseUrl = 'https://find-me.firebaseio.com/';
    var ref = new Firebase(firebaseUrl + 'places');
    var ownLocationRef;

    this.setOwnLocation = function(nickname, roomName) {
      ownLocationRef = ref.child(roomName).child(nickname);
      this.places = $firebase(ref).$child(roomName);
      var myConnectionsRef = ownLocationRef.child('connections');
      var lastOnlineRef = ownLocationRef.child('lastOnline');

      var connectedRef = new Firebase(firebaseUrl + '.info/connected');
      connectedRef.on('value', function(snap) {
	if (snap.val() === true) {
	  console.log('connected');
	  // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
	  // add this device to my connections list
	  // this value could contain info about the device or a timestamp too
	  var con = myConnectionsRef.push(true);
	  
	  // when I disconnect, remove this device
	  con.onDisconnect().remove();
	  
	  // when I disconnect, update the last time I was seen online
	  lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
	}
      });
    };
    this.updateMyPosition = function(newPosition) {
      $firebase(ownLocationRef).$update({
	coords: newPosition.coords,
	timestamp: Firebase.ServerValue.TIMESTAMP
      });

    };

    this.deletePlace = function(id) {
//      console.log('deleting id: '+id);
      this.places.$remove(id);
    };

  });
