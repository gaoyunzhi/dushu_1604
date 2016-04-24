angular
  .module('Root')
  .controller('ProfileCtrl', ProfileCtrl);
 
function ProfileCtrl($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  this.logout = logout;
  $scope.profile = {};
  $scope.needSaveRating = false;
  $scope.changeRating = changeRating;

  Meteor.subscribe('users');
  Meteor.subscribe('reviews');
  $scope.$meteorSubscribe('users').then(function() {update();});
  $scope.$meteorSubscribe('reviews').then(function() {update();});

  update = function() {
    $scope.profile = Meteor.users.findOne({_id: $stateParams.id});
    if (!$scope.profile) {
      return;
    }
    $scope.profile.score = $scope.profile.score.toFixed(2);
    $scope.profile.chatHref = "#/room/0/" + $scope.profile._id;
    
    loadMyRatingInfo();
    loadOthersRatingInfo();
  };

  loadMyRatingInfo = function() {
    if (!_.isEmpty($scope.rating)) {
      return;
    }
    var review = Reviews.findOne({reviewer: Meteor.userId(), reviewee: $scope.profile._id});
    if (!review) {
      return;
    }
    $scope.rating.rate = review.rate;
    $scope.rating.detail = review.detail;
  };

  loadOthersRatingInfo = function() {
    var reviews = Reviews.findOne({reviewee: $scope.profile._id});

  };

  $scope.rating = {};

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
    if (_.isEmpty($scope.rating) || !$scope.profile._id) {
      $scope.needSaveRating = false;
      return;
    }
    Meteor.call('changeRating', $scope.profile._id, $scope.rating);
    $scope.needSaveRating = false;
  }

  $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      if (element.textLength == 0) {
        element.style.height = '40px';
      } else {
        element.style.height = scrollHeight + "px"; 
      }   
  };

  Tracker.autorun(function() {
    update();
  });
  update();
}
