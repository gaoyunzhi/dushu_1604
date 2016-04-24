angular
  .module('Root')
  .controller('ProfileCtrl', ProfileCtrl);
 
function ProfileCtrl($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  this.logout = logout;
  $scope.profile = {};

  Meteor.subscribe('users');
  Meteor.subscribe('reviews');
  $scope.$meteorSubscribe('users').then(function() {update();});
  $scope.$meteorSubscribe('reviews').then(function() {update();});

  update = function() {
    $scope.profile = Meteor.users.findOne({_id: $stateParams.id});
  };

  $scope.rating = {};
  $scope.rating.rate = 3;
  $scope.rating.max = 5;

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
  };

  function logout() {
    Meteor.logout((err) => {
      if (err) return; 
      $state.go('login');
    });
  }

  Tracker.autorun(function() {
    update();
  });
  update();
}
