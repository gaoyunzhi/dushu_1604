angular
  .module('Root')
  .controller('ProfileCtrl', ProfileCtrl);
 
function ProfileCtrl($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  this.logout = logout;

  Meteor.subscribe('users');
  Meteor.subscribe('reviews');
  update = function() {
    $scope.profile = Meteor.users.findOne({_id: $location.search().id});
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
}
