// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.directives', 'ngCordova', 'ngStorage', 'ion-digit-keyboard'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
      StatusBar.hide();
    }
  });
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    addObject: function(key, value) {
      $window.localStorage[key].push(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '[]');
    }
  }
}])

.config(function($ionicConfigProvider) {
  // remove back button previous title text
  // use unicode em space characters to increase touch target area size of back button

  //$ionicConfigProvider.backButton.previousTitleText(false).text('&emsp;&emsp;');
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: !0,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.keypad', {
    url: "/keypad",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/key_pad.html",
        controller: 'key_pad'
      }
    }
  })

  .state('app.ertti', {
    url: "/hymn/:name",
    params: {name: null},
    views: {
      'menuContent': {
            templateUrl: function(urlattr){
            //return 'templates/hymn/efik/' + urlattr.name + '.html';
            return 'templates/hymnal-hymn.html';
        },
        controller: 'hymnCtrl'
      }
    }
  })

.state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html"
      }
    }
  })

  .state('app.bookmark', {
    url: "/bookmark",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/bookmark.html",
        controller : 'BookmarkCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/keypad');
});
