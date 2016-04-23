angular
  .module('Root')
  .controller('RoomCtrl', RoomCtrl);
 
function RoomCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  $scope.room = {};
  $scope.message = [];
  if (!Meteor.user()) {
    return;
  }
  $scope.rightUserId = Meteor.user()._id;
  if (!_.isEmpty($location.search().user_id)) {
    Meteor.call('createRoom', $location.search().user_id);
  }
  $scope.$meteorSubscribe('rooms').then(function() {
    update();
  });
  $scope.$meteorSubscribe('messages').then(function() {
    update();
  });

  findRoom = function() {
    if ($location.search().user_id) {
      var users = [$location.search().user_id, Meteor.user()._id].sort();
      $scope.room = Rooms.find({users});
    }
    if ($location.search().id) {
      $scope.room = Rooms.find({_id: $location.search().id});
    }
  }

  update = function() {
    if (!$scope.room || !$scope.room.id) {
      findRoom();
    }
    if (!$scope.room || !$scope.room.id) {
      return;
    }
    $scope.room = Rooms.find({_id: $scope.room.id}); // update room
    if (!Meteor.user()._id in $scope.room.users) {
      $scope.rightUserId = $scope.room.users[0];
    }
    var messages = Messages.find({room: $scope.room._id});
    messages.sort((m1, m2) => m1.timestamp - m2.timestamp);
    $scope.messages = messages;
  }

  $scope.getMessageClass = function(message) {
    if (message.author == $scope.rightUserId) {
      return 'message-right';
    }
    return 'message-left';
  }

  let isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  this.sendMessage = sendMessage
  this.getAuthor = getAuthor
  this.inputUp = inputUp;
  this.inputDown = inputDown;
  this.closeKeyboard = closeKeyboard;

  function getAuthor(message) {
    var userId = message.author;
    return User.find({_id: userId});
  }

  function sendMessage() {
    if (_.isEmpty(this.message) || $scope.room._id) return;
 
    Meteor.call('newMessage', this.message, $scope.room._id);
 
    delete this.message;
  }

  $scope.$watchCollection('messages', (newVal, oldVal) => {
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
    cordova.plugins.Keyboard.close();
  }

  $scope.gotoLogin = function() {
    $state.go('login');
  }

  $scope.gotoRegister = function() {
    $state.go('register');
  }
}