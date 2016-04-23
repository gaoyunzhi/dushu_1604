angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  console.log(1);
  console.log(Meteor.users.find({}).fetch());
  $scope.$meteorSubscribe('users').then(function() {
      $scope.users = $scope.$meteorCollection(Accounts);
      console.log(2);
      console.log(Meteor.users.find({}).fetch());
      console.log($scope.users);
    
      $scope.getText = function(message) {
        return Text.findOne(message.text_id);
      };

      $scope.getAuthor = function(text) {
        if (!text) {
          return;
        }
        var user = Meteor.users.findOne(text.user_id);
        return {name: user.profile.name, wechat_id: user.profile.wechat_id};
      };
  });
}