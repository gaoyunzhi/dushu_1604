angular
  .module('Root')
  .config(config);
 
function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('chat', {
      url: '/chat',
      templateUrl: 'client/templates/chat.html',
      resolve: {
        users() {
          return Meteor.subscribe('users');
        },
        rooms() {
          return Meteor.subscribe('rooms');
        }
      },
      controller: 'ChatCtrl as chat'
    })
    .state('room', {
      url: '/room/:id/:user_id',
      templateUrl: 'client/templates/room.html',
      controller: 'RoomCtrl as room',
      resolve: {
        users() {
          return Meteor.subscribe('users');
        },
        rooms() {
          return Meteor.subscribe('rooms');
        },
        messages() {
          return Meteor.subscribe('messages');
        }
      },
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
    })
    .state('profile', {
      url: '/profile/:id',
      templateUrl: 'client/templates/profile.html',
      controller: 'ProfileCtrl as profile',
      resolve: {
        users() {
          return Meteor.subscribe('users');
        },
        reviews() {
          return Meteor.subscribe('reviews');
        },
      }  
    });
 
  $urlRouterProvider.otherwise('chat');
}
