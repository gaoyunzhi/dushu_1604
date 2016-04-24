angular
  .module('Root')
  .controller('ProfileCtrl', ProfileCtrl);
 
function ProfileCtrl($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state, $location) {
  $reactive(this).attach($scope);
  this.logout = logout;
  $scope.profile = {};
  $scope.needSaveRating = false;
  $scope.changeRating = changeRating;
  $scope.currentReviews = [];
  $scope.myProfile = {};

  Meteor.subscribe('users');
  Meteor.subscribe('reviews');
  $scope.$meteorSubscribe('users').then(function() {update();});
  $scope.$meteorSubscribe('reviews').then(function() {update();});

  update = function() {
    $scope.profile = Meteor.users.findOne({_id: $stateParams.id});
    if (!$scope.profile || _.isEmpty($scope.profile)) {
      return;
    }
    $scope.profile.score = $scope.profile.score && 
      $scope.profile.score.toFixed(2);
    $scope.profile.chatHref = "#/room/0/" + $scope.profile._id;
    if (_.isEmpty($scope.myProfile) &&
        $scope.profile._id == Meteor.userId() && $scope.profile.intro) {
      $scope.myProfile.goal = $scope.profile.goal;
      $scope.myProfile.topic = $scope.profile.topic;
      $scope.myProfile.intro = $scope.profile.intro;
    }
    
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
    var reviews = Reviews.find({reviewee: $scope.profile._id}).fetch();
    reviews.forEach(review => {
      var reviewerId = review.reviewer;
      var reviewer = Meteor.users.findOne({_id: reviewerId});
      if (!reviewer || reviewerId == Meteor.userId()) {
        return;
      }
      if (reviewer.score < 0 || !review.detail || review.detail.length < 3) {
        review.sortKey = [3, 0];
      } else {
        review.sortKey = [1, - reviewer.score * review.detail.length];
      }
      review.reviewerName = reviewer.username;
    })
    reviews = reviews.filter(review => review.sortKey);
    reviews.sort((r1, r2) => {
      if (r1.sortKey < r2.sortKey) {
        return -1;
      }
      if (r1.sortKey > r2.sortKey) {
        return 1;
      }
      return 0;
    });
    $scope.currentReviews = reviews;
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

  $scope.updateMyProfile = function() {
    if (_.isEmpty($scope.myProfile)) {
      return;
    }
    Meteor.call('updateMyProfile', $scope.myProfile);
  }

  Tracker.autorun(function() {
    update();
  });
  update();
}
