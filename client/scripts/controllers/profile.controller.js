angular
  .module('Root')
  .controller('ProfileCtrl', ProfileCtrl);
 
function ProfileCtrl($scope, $rootScope, $reactive, $state) {
  $reactive(this).attach($scope);
  this.logout = logout;

  function logout() {
    Meteor.logout((err) => {
      if (err) return; 
      $state.go('login');
    });
  }
}
