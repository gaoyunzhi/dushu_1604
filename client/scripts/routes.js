angular
  .module('Root')
  .config(config);
 
function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'client/templates/tabs.html'
    })
    .state('tab.chat', {
      url: '/chat',
      params: {post: null, other: null},
      views: {
        'tab-chat': {
          templateUrl: 'client/templates/chat.html',
          controller: 'ChatCtrl as chat'
        }
      }, 
      resolve: {
        messages() {
          return Meteor.subscribe('allMessages');
        },
        text() {
          return Meteor.subscribe('text');
        }
      }
    })
    .state('tab.profile', {
      url: '/profile',
      views: {
        'tab-profile': {
          templateUrl: 'client/templates/profile.html',
          controller: 'ProfileCtrl as profile',
        }
      },
      resolve: {
        user() {
          if (!Meteor.user()) {
            throw 'AUTH_REQUIRED';
          }
          return Meteor.user();
        },
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'client/templates/login.html',
      controller: 'LoginCtrl as logger'
    })
    .state('admin_view', {
      url: '/adminview',
      templateUrl: 'client/templates/admin_view.html',
      controller: 'AdminViewCtrl as adminView',
      resolve: {
        user() {
          if (Meteor.isClient) return;
          if (!Meteor.user() || Meteor.user().username !== Meteor.settings.admin.email) {
            throw 'AUTH_REQUIRED';
          }
          return Meteor.user();
        },
      }
    })
    .state('register', {
      url: '/register',
      params: {email: null, password: null},
      templateUrl: 'client/templates/register.html',
      controller: 'RegisterCtrl as register'
    });
 
  $urlRouterProvider.otherwise('tab/chat');
}
