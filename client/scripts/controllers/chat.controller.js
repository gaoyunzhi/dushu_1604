angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  FIVE_MIN_MILLS = 5 * 60 * 1000;

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
      var layer = getLayerForRoom(room, covered_user);
      var otherUserId = getTheOther(room);
      if (otherUserId) {
        covered_user.add(otherUserId);
      }
      chats.push({
        title: room.title, 
        subtitle: room.lastMessage,
        timestamp: room.lastUpdated,
        sortKey: layer,
        href: "#/room?id=" + room._id
      })
    })
    $scope.raw_users.forEach(user => {
      if (user._id in covered_user) {
        return;
      }
      var layer = getLayerForUser(user);
      chats.push({
        title: user.username, 
        subtitle: user.intro,
        sortKey: layer,
        href: "#/room?user_id=" + user._id
      })
    })
    chats.sort((c1, c2) => {
      if (c1.sortKey < c2.sortKey) {
        return -1;
      }
      if (c1.sortKey > c2.sortKey) {
        return 1;
      }
      return 0;
    });
    $scope.chats = chats;
  };

  getTheOther = function(room) {
    if (!room.users.size == 2) {
      return;
    }
    room.users.forEach(userId => {
      if (userId != Meteor.user()._id) {
        return userId;
      }
    })
  }

  getLayerForRoom = function(room) {
    if (Meteor.user()._id in room.users &&
      Date.now() - room.lastUpdated < FIVE_MIN_MILLS) {
      user = Meteor.users.find({_id: room.lastUpdatedUser});
      if (user && user.score > 0) {
        return [1, -room.lastUpdated];
      }
    }
    if (Date.now() - room.lastUpdated < FIVE_MIN_MILLS) {
      var allPositiveRating = room.users.every(userId => {
        user = Meteor.users.find({_id: userId});
        return user && user.score > 0;
      });
      if (allPositiveRating) {
        return [2, -room.lastUpdated];
      }
    }
    return [4, 0]; // we can always inprove later
  }

  getLayerForUser = function(user) {
    if (user.status.online && user.score > 0) {
      return [3, -user.score];
    }
    return [4, 0];
  }
}