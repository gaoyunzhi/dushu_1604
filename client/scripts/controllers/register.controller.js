angular
  .module('Root')
  .controller('RegisterCtrl', RegisterCtrl);
 
function RegisterCtrl($scope, $reactive, $state, $stateParams, $ionicLoading, $ionicPopup, $log) {
  $reactive(this).attach($scope);
 
  this.register = register;
  this.email = $stateParams.email;
  this.password = $stateParams.password;
  this.gotoLogin = gotoLogin;
  this.gotoChat = gotoChat;
  function register() {
    if (this.password_retype != this.password) {
      return handleError({reason: 'Password does not match'}); 
    }
    if (!this.name || !this.wechat_id) {
      return handleError({reason: 'WeChat ID and name is required'});
    }

    Accounts.createUser(
      {
        username: this.email, 
        password: this.password, 
        profile: {
          name: this.name,
          wechat_id: this.wechat_id,
        }
      }, 
      (err) => {
        if (err) {
          return handleError(err);
        }
        Meteor.call('welcome');
        $state.go('tab.chat');
      }
    );
  }
 
  function handleError(err) {
    $log.error('Register error ', err);
 
    $ionicPopup.alert({
      title: err.reason || 'Register failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }

  function gotoLogin() {
    $state.go('login');
  }

  function gotoChat() {
    $state.go('tab.chat')
  }
}