angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  $scope.raw_rooms = [];
  $scope.raw_users = [];
  $scope.chats = [];
  $scope.$meteorSubscribe('users').then(function() {
      $scope.raw_users = Meteor.users.find({}).fetch();
  });
  $scope.$meteorSubscribe('rooms').then(function() {
      $scope.raw_rooms = Rooms.find({}).fetch();
  });

  $scope.$watchCollection('raw_users', (newVal, oldVal) => {
    updateChats();
  });

  updateChats = function() {
    covered_user = new Set();
    $scope.raw_rooms.forEach(room => {
      chat
    })
    console.log($scope.chats, $scope.raw_users, $scope.raw_rooms);
  };
}