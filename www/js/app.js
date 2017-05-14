//AIzaSyBdMDakLVL3KOzkHUD-8cJo-Z2ys_WEqbo

function init() {
  gapi.client.setApiKey('AIzaSyBdMDakLVL3KOzkHUD-8cJo-Z2ys_WEqbo');
  gapi.client.load("youtube", "v3", function() {
      //yt api is ready
      console.log("readyy");
      var request = gapi.client.youtube.search.list(
        {
            part: "snippet",
            type: "video",
            q: "Alien: Convenant",
            maxResults: 3
        }
      );
      request.execute(function (response) {
          var videoId = response.items[0].id.videoId;
          console.log("videoId == " + videoId);
          var iframe = document.querySelector("iframe");
          //iframe.src = "http://www.youtube.com/embed/" + videoId;
      });
  });
}

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.last-articles', {
      url: '/last-articles',
      views: {
        'tab-last-articles': {
          templateUrl: 'templates/tab-last-articles.html',
          controller: 'lastArticlesCtrl'
        }
      }
    })
    .state('tab.last-article-detail', {
      url: '/last-articles/:articleId',
      views: {
        'tab-last-articles': {
          templateUrl: 'templates/tab-last-article-detail.html',
          controller: 'lastArticleDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
