angular
  .module('Root')
  .controller('ProfileCtrl', ProfileCtrl);
 
function ProfileCtrl($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  this.logout = logout;
  $scope.profile = {};
  $scope.needSaveRating = false;

  Meteor.subscribe('users');
  Meteor.subscribe('reviews');
  $scope.$meteorSubscribe('users').then(function() {update();});
  $scope.$meteorSubscribe('reviews').then(function() {update();});

  update = function() {
    $scope.profile = Meteor.users.findOne({_id: $stateParams.id});
    if (!$scope.profile) {
      return;
    }
    $scope.profile.chatHref = "#/room/0/" + $scope.profile._id;
  };

  $scope.rating = {};
  $scope.rating.rate = 3;

  $scope.$watchCollection('rating.detail', (newVal, oldVal) => {
    $scope.needSaveRating = true;
  });

  $scope.$watchCollection('rating.rate', (newVal, oldVal) => {
    changeRating();
  });


  function logout() {
    Meteor.logout((err) => {
      if (err) return; 
      $state.go('login');
    });
  }

  function changeRating() {
    console.log("changeRating");
    $scope.needSaveRating = false;
  }

  Tracker.autorun(function() {
    update();
  });
  update();
}
