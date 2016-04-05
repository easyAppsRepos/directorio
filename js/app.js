// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
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
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

        .state('app.busqueda', {
      url: '/busqueda',
      views: {
        'menuContent': {
          templateUrl: 'templates/busqueda.html',
          controller: 'BusquedaCtrl'
        }
      }
    })

                .state('app.publicarComercio', {
      url: '/publicarComercio',
      views: {
        'menuContent': {
          templateUrl: 'templates/publicarComercio.html',
          controller: 'publicarComercioCtrl'
        }
      }
    })

                .state('app.notificaciones', {
      url: '/notificaciones',
      views: {
        'menuContent': {
          templateUrl: 'templates/notificaciones.html',
          controller: 'notificacionesCtrl'
        }
      }
    })

        .state('app.cat-detail', {
      url: '/playlists/:catId',
      views: {
        'menuContent': {
          templateUrl: 'templates/cat-detail.html',
          controller: 'CatDetailCtrl'
        }
      }
    })

                .state('app.subCat-detail', {
      url: '/subCats/:subCatId',
      views: {
        'menuContent': {
          templateUrl: 'templates/subCat-detail.html',
          controller: 'SubCatDetailCtrl'
        }
      }
    })





  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
