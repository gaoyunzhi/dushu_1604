angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {

  FIVE_MIN_MILLS = 5 * 60 * 1000;

  $reactive(this).attach($scope);

  hasNewMessage = function(room) {
    if (!Meteor.user() || !(new Set(room.users)).has(Meteor.user()._id)) {
      return false;
    }
    return (Session.set['lastseen' + room._id] || 0) < room.lastUpdated;
  }

  getLayerForRoom = function(room) {
    if (Meteor.user() && (new Set(room.users)).has(Meteor.user()._id) &&
      Date.now() - room.lastUpdated < FIVE_MIN_MILLS) {
      console.log(room.title, "layer1 room");
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
    return [3, -room.lastUpdated]; 
  }

  getUserLastSeen = function(user) {
    if (user.status && user.status.lastActivity) {
      return user.status.lastActivity
    } else if (user.status && user.status.lastLogin 
        && user.status.lastLogin.date) {
      return user.status.lastLogin.date;
    }
    return 0;
  }

  getLayerForUser = function(user) {
    return [
      Date.now() - getUserLastSeen(user) < FIVE_MIN_MILLS && user.score > 0 ? 2 : 3, 
      -getUserLastSeen(user)];
  }

  this.helpers({
    chatsInHelper() {
      var chats = [];
      Rooms.find({}).fetch().forEach(room => {
        chats.push({
          title: room.title, 
          subtitle: room.lastMessage,
          timestamp: room.lastUpdated,
          sortKey: getLayerForRoom(room),
          hasNewMessage: hasNewMessage(room),
          href: "#/room/" + room._id + '/0',
          titleClass: Date.now() - room.lastUpdated < FIVE_MIN_MILLS ? 
            "title-online" : "",
        })
      })
      Meteor.users.find({}).fetch().forEach(user => {
        if (Meteor.user() && user._id == Meteor.user()._id) {
          return;
        }
        chats.push({
          title: user.username, 
          subtitle: user.intro,
          timestamp: getUserLastSeen(user),
          sortKey: getLayerForUser(user),
          href: "#/room/0/" + user._id,
          titleClass: (user.status && user.status.online) ?
             "title-online" : "",
        })
      })
      $scope.chats = chats.sort((c1, c2) => {
        if (c1.sortKey[0] < c2.sortKey[0]) {
          return -1;
        }
        if (c1.sortKey[0] > c2.sortKey[0]) {
          return 1;
        }
        return c1.sortKey[1] - c2.sortKey[1];
      });
      return chats;
    },
  });
}