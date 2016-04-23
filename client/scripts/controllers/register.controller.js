angular
  .module('Root')
  .controller('RegisterCtrl', RegisterCtrl);

 
function RegisterCtrl($scope, $reactive, $state, $stateParams, $ionicLoading, $ionicPopup, $log) {
  MIN_DIFFERENT_CHAR = 30;
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
    if (!this.name || !this.topic || !this.goal || !this.intro) {
      return handleError({reason: 'All fields are required'});
    }
    intro = generate_intro(this);
    different_char = (new Set(intro.split(''))).size
    if (different_char < MIN_DIFFERENT_CHAR) {
      return handleError({reason: '我们是一个深度交流的平台，请完善自我介绍'});
    }

    Accounts.createUser(
      {
        username: this.name, 
        password: this.password, 
        email: this.email,
        topic: this.topic,
        goal: this.goal,
        intro: this.intro,
      }, 
      (err) => {
        if (err) {
          return handleError(err);
        }
        $state.go('chat');
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
    $state.go('chat')
  }
}