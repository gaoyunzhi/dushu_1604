angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  FIVE_MIN_MILLS = 5 * 60 * 1000;

  $reactive(this).attach($scope);
  $scope.chats = [];

  Meteor.subscribe('rooms');
  Meteor.subscribe('users');
  $scope.$meteorSubscribe('users').then(function() {updateChats();});
  $scope.$meteorSubscribe('rooms').then(function() {updateChats();});

  updateChats = function() {
    console.log("updateChats");
    var chats = [];
    var covered_user = new Set();
    Rooms.find({}).fetch().forEach(room => {
      var layer = getLayerForRoom(room);
      var otherUserId = getTheOther(room);
      if (otherUserId) {
        covered_user.add(otherUserId);
      }
      chats.push({
        title: room.title, 
        subtitle: room.lastMessage,
        timestamp: room.lastUpdated,
        sortKey: layer,
        href: "#/room?id=" + room._id,
        titleClass: Date.now() - room.lastUpdated < FIVE_MIN_MILLS ? 
          "title-online" : "",
      })
    })
    Meteor.users.find({}).fetch().forEach(user => {
      if (covered_user.has(user._id)) {
        return;
      }
      if (Meteor.user() && user._id == Meteor.user()._id) {
        return;
      }
      var layer = getLayerForUser(user);
      chats.push({
        title: user.username, 
        subtitle: user.intro,
        sortKey: layer,
        href: "#/room?user_id=" + user._id,
        titleClass: user.status.online ? "title-online" : "",
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
    if (!(new Set(room.users)).has(Meteor.userId())) {
      return;
    }
    return _.find(room.users, userId => {
      if (Meteor.user() && userId != Meteor.user()._id) {
        return userId;
      }
    })
  }

  getLayerForRoom = function(room) {
    if (Meteor.user() && Meteor.user()._id in room.users &&
      Date.now() - room.lastUpdated < FIVE_MIN_MILLS) {
      user = Meteor.users.findOne({_id: room.lastUpdatedUser});
      if (user && user.score > 0) {
        return [1, -room.lastUpdated];
      }
    }
    if (Date.now() - room.lastUpdated < FIVE_MIN_MILLS) {
      var allPositiveRating = room.users.every(userId => {
        user = Meteor.users.findOne({_id: userId});
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
  
  Tracker.autorun(function() {
    updateChats();
  });

  updateChats();
}