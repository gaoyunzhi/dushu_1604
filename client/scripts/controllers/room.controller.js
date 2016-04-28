angular
  .module('Root')
  .controller('RoomCtrl', RoomCtrl);


function RoomCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  $scope.update = function() {};
  $scope.currentRoom = {};
  $scope.data = {};
  $scope.rightUserId = Meteor.userId();
  if (!_.isEmpty($stateParams.user_id) && $stateParams.user_id != '0') {
    Meteor.call('createRoom', $stateParams.user_id);
  }

  Meteor.subscribe('rooms');
  Meteor.subscribe('messages');
  Meteor.subscribe('users');
  $scope.$meteorSubscribe('users').then(function() {$scope.update();});
  $scope.$meteorSubscribe('messages').then(function() {$scope.update();});
  $scope.$meteorSubscribe('rooms').then(function() {$scope.update();});

  this.helpers({
      currentMessagesInHelper() {
        console.log("currentMessagesInHelper", Session.get('currentMessagesInHelper') || []);
        return Session.get('currentMessagesInHelper') || [];
      },
  });

  findRoom = function() {
    if ($stateParams.user_id && Meteor.userId() && $stateParams.user_id != '0') {
      var users = [$stateParams.user_id, Meteor.userId()].sort();
      $scope.currentRoom = Rooms.findOne({users});
    }
    if ($stateParams.id && $stateParams.id != '0') {
      $scope.currentRoom = Rooms.findOne({_id: $stateParams.id});
    }
  }

  $scope.update = function() {
    if (!$scope.currentRoom || !$scope.currentRoom._id) {
      findRoom();
    }
    if (!$scope.currentRoom || !$scope.currentRoom._id) {
      return;
    }
    $scope.currentRoom = Rooms.findOne({_id: $scope.currentRoom._id}); // update room
    if (!$scope.data.newTitle) {
      $scope.data.newTitle = $scope.currentRoom.title;
    }
    if (!(new Set($scope.currentRoom.users)).has(Meteor.userId())) {
      $scope.rightUserId = $scope.currentRoom.users[0];
    }
    var messages = Messages.find({room: $scope.currentRoom._id}).fetch();
    messages.sort((m1, m2) => m1.timestamp - m2.timestamp);
    $scope.currentMessages = messages.map(message => {
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
    if ($scope.currentMessages.length >= 1) {
      Session.set['lastseen' + $scope.currentRoom._id] = 
        $scope.currentMessages[$scope.currentMessages.length-1].timestamp;
    }
    Session.set('currentMessagesInHelper', $scope.currentMessages);
    // console.log($scope.currentMessages);
  }
  
  $scope.getMessageClass = function(message) {
    if (message.author == $scope.rightUserId) {
      return 'message-right';
    }
    return 'message-left';
  }

  let isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  this.sendMessage = sendMessage
  this.inputUp = inputUp;
  this.inputDown = inputDown;
  this.closeKeyboard = closeKeyboard;

  function sendMessage() {
    if (_.isEmpty(this.message) || !$scope.currentRoom._id) return;
    
    Meteor.call('newMessage', this.message, $scope.currentRoom._id);
    $scope.rightUserId = Meteor.userId(); // put my message on the right side.
    delete this.message;
  }

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
  
  function expand() {
    $scope.autoExpand('TextArea');
  }

  function inputUp () {
    if (isIOS) {
      this.keyboardHeight = 216;
    }
 
    $timeout(function() {
      $ionicScrollDelegate.$getByHandle('roomScroll').scrollBottom(true);
    }, 300);
  }
 
  function inputDown () {
    if (isIOS) {
      this.keyboardHeight = 0;
    }
 
    $ionicScrollDelegate.$getByHandle('roomScroll').resize();
  }
 
  function closeKeyboard () {
    // cordova.plugins.Keyboard.close();
  }

  $scope.gotoLogin = function() {
    $state.go('login');
  }

  $scope.gotoRegister = function() {
    $state.go('register');
  }

  $scope.updateTitle = function() {
    if (!$scope.data.newTitle) {
      return;
    }
    Meteor.call('updateRoom', $scope.currentRoom._id, $scope.data.newTitle);
  }

  Tracker.autorun(function() {
    $scope.update();
  });

  setInterval($scope.update,1000);
  $scope.update();
}