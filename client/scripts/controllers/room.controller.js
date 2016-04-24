angular
  .module('Root')
  .controller('RoomCtrl', RoomCtrl);
 
function RoomCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  $scope.currentRoom = {};
  $scope.rightUserId = Meteor.userId();
  if (!_.isEmpty($location.search().user_id)) {
    Meteor.call('createRoom', $location.search().user_id);
  }

  Meteor.subscribe('rooms');
  Meteor.subscribe('messages');
  Meteor.subscribe('users');

  findRoom = function() {
    if ($location.search().user_id && Meteor.userId()) {
      var users = [$location.search().user_id, Meteor.userId()].sort();
      $scope.currentRoom = Rooms.findOne({users});
    }
    if ($location.search().id) {
      $scope.currentRoom = Rooms.findOne({_id: $location.search().id});
    }
  }

  update = function() {
    if (!$scope.currentRoom || !$scope.currentRoom._id) {
      findRoom();
    }
    if (!$scope.currentRoom || !$scope.currentRoom._id) {
      return;
    }
    $scope.currentRoom = Rooms.findOne({_id: $scope.currentRoom._id}); // update room
    if (!(new Set($scope.currentRoom.users)).has(Meteor.userId())) {
      $scope.rightUserId = $scope.currentRoom.users[0];
    }
    // console.log("all message", Messages.find({}).fetch());
    var messages = Messages.find({room: $scope.currentRoom._id}).fetch();
    messages.sort((m1, m2) => m1.timestamp - m2.timestamp);
    $scope.currentMessages = messages.map(message => {
      var calculatedMessage = _.clone(message);
      var userId = message.author;
      var author = Meteor.users.findOne({_id: userId});
      calculatedMessage.authorName = author && author.username;
      return calculatedMessage;
    });
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

  Tracker.autorun(function() {
    update();
  });
}