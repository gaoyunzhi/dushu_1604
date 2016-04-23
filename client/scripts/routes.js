angular
  .module('Root')
  .config(config);
 
function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('chat', {
      url: '/chat',
      params: {post: null, other: null},
      templateUrl: 'client/templates/chat.html',
      resolve: {
        messages() {
          return Meteor.subscribe('allMessages');
        },
        text() {
          return Meteor.subscribe('text');
        }
      },
      controller: 'ChatCtrl as chat'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'client/templates/login.html',
      controller: 'LoginCtrl as logger'
    })
    .state('register', {
      url: '/register',
      params: {email: null, password: null},
      templateUrl: 'client/templates/register.html',
      controller: 'RegisterCtrl as register'
    });
 
  $urlRouterProvider.otherwise('chat');
}
