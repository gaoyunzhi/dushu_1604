angular
  .module('Root')
  .controller('AdminViewCtrl', AdminViewCtrl);
 
function AdminViewCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log) {
  $reactive(this).attach($scope);
  Meteor.subscribe('allMessages');
  
  $scope.$meteorSubscribe('allMessages').then(function() {
      // This swill get you the articles from the local collection
      $scope.messages = $scope.$meteorCollection(Messages);
      $scope.messages.sort((m1, m2) => m1.timestamp - m2.timestamp);
      // then you need to get the related Categories for the articles
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

  $scope.$watchCollection('messages', (oldVal, newVal) => {
    let animate = newVal && (!oldVal || oldVal.length !== newVal.length);
    $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
  });
}