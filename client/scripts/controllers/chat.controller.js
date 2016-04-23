angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  5_MIN_MILLS = 5 * 60 * 1000;

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
    var chats = [];
    var covered_user = new Set();
    $scope.raw_rooms.forEach(room => {
      var layer = getLayer(room);
      chats.push({
        title: room.title, 
        subtitle: room.lastMessage,
        sortKey: [layer, -room.lastUpdated]
      })
    })
    console.log($scope.chats, $scope.raw_users, $scope.raw_rooms);
  };

  getLayer = function(room) {
    if (Meteor.user()._id in room.users &&
      Date.now() - room.lastUpdated < 5_MIN_MILLS) {
      return [1, -room.lastUpdated];
    }
    if (Date.now() - room.lastUpdated < 5_MIN_MILLS) {
      var allPositiveRating = room.users.every(userId => {
        user = Meteor.users.find({_id, userId});
        return user.score > 0;
      });
      if (allPositiveRating) {
        return [2, -room.lastUpdated];
      }
    }
    return [4, 0]; // we can always inprove later
  }
}