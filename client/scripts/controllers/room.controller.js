angular
  .module('Root')
  .controller('RoomCtrl', RoomCtrl);

function RoomCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $state) {
  $reactive(this).attach($scope); // need this for helpers to work
  if (!_.isEmpty($stateParams.user_id) && $stateParams.user_id != '0') {
    Meteor.call('createRoom', $stateParams.user_id);
  } // create room when not exist, this is async
  $scope.currentRoom = {};
  $scope.input = {};
  $scope.rightUserId = Meteor.userId();

  $scope.generateRoomQuery = function(stateParams) {
    if (stateParams.user_id && Meteor.userId() && stateParams.user_id != '0') {
      return {users: [stateParams.user_id, Meteor.userId()].sort()};
    }
    if (stateParams.id && stateParams.id != '0') {
      return {_id: stateParams.id};
    }
  };

  $scope.getCurrentMessages = function(messages) {
    messages.sort((m1, m2) => m1.timestamp - m2.timestamp);
    return messages.map(message => {
      var calculatedMessage = _.clone(message);
      var userId = message.author;
      var author = Meteor.users.findOne({_id: userId});
      calculatedMessage.authorName = author && author.username;
      calculatedMessage.authorScore = author && author.score;
      if (calculatedMessage.authorScore) {
        calculatedMessage.authorScore = calculatedMessage.authorScore.toFixed(2)
      }
      calculatedMessage.profileHref = 
        author && "#/profile/" + author._id;
      return calculatedMessage;
    });
  }

  this.helpers({
    currentRoomInHelper() {
      var roomQuery = $scope.generateRoomQuery($stateParams);
      $scope.currentRoom = Rooms.findOne(roomQuery) || {};
      return Rooms.findOne(roomQuery) || {};
    },

    currentMessagesInHelper() {
      var roomQuery = $scope.generateRoomQuery($stateParams);
      var room = Rooms.findOne(roomQuery) || {};
      if (_.isEmpty(room)) { return []; }
      var messages = Messages.find({room: room._id}).fetch();
      $scope.currentMessages = $scope.getCurrentMessages(messages, room);
      return $scope.getCurrentMessages(messages, room);
    },
  });

  $scope.getMessageClass = function(message) {
    if (message.author == $scope.rightUserId) {
      return 'message-right';
    }
    return 'message-left';
  }

  $scope.sendMessage = function() {
    if (_.isEmpty($scope.input.newMessage) || !$scope.currentRoom._id) return;
    Meteor.call('newMessage', $scope.input.newMessage, $scope.currentRoom._id);
    $scope.rightUserId = Meteor.userId(); // put my message on the right side.
    delete $scope.input.newMessage;
  };

  $scope.$watchCollection('currentMessages', (newVal, oldVal) => {
    if (oldVal && newVal && oldVal.length && newVal.length) {
      if (oldVal[oldVal.length-1].timestamp == 
        newVal[newVal.length-1].timestamp) {
        return;
      }
    }
    $ionicScrollDelegate.$getByHandle('roomScroll').scrollBottom();
  });

  $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      if (element.textLength == 0) {
        element.style.height = '40px';
      } else {
        element.style.height = scrollHeight + "px"; 
      }   
  };

  $scope.inputUp = function() {
    $timeout(function() {
      $ionicScrollDelegate.$getByHandle('roomScroll').scrollBottom(true);
    }, 100);
  };
 
  $scope.inputDown = function () {
    $ionicScrollDelegate.$getByHandle('roomScroll').resize();
  }

  $scope.gotoLogin = function() {
    $state.go('login');
  }

  $scope.gotoRegister = function() {
    $state.go('register');
  }

  $scope.updateTitle = function() {
    if (!$scope.input.newTitle) {
      return;
    }
    Meteor.call('updateRoom', $scope.currentRoom._id, $scope.input.newTitle);
  }

  // when render and rerender, scroll to the bottom
  Tracker.afterFlush(function () {
    $ionicScrollDelegate.$getByHandle('roomScroll').scrollBottom(true);
  });

  $scope.updateRightUserId = function() {
    if ($scope.currentRoom && $scope.currentRoom.users &&
      !(new Set($scope.currentRoom.users)).has(Meteor.userId())) {
      $scope.rightUserId = $scope.currentRoom.users[0];
    }
  };
  
  $scope.updateLastSeen = function() {
    if ($scope.currentMessages && $scope.currentMessages.length >= 1 &&
      $scope.currentRoom) {
      Session.set['lastseen' + $scope.currentRoom._id] = 
        $scope.currentMessages[$scope.currentMessages.length-1].timestamp;
      console.log("updateLastSeen", $scope.currentRoom.title);
    }
  };

  $scope.fillInTitle = function() {
    if (!$scope.input.newTitle) {
      $scope.input.newTitle = $scope.currentRoom && $scope.currentRoom.title;
    }
  }

  Tracker.autorun(function() {
    $scope.updateRightUserId();
    $scope.updateLastSeen();
    $scope.fillInTitle();
  });
}