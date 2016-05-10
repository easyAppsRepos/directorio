// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

//clave google maps:
// AIzaSyDgfZI6nqaGyhW5XX4OhHBP2uRt7bso6p0 
angular.module('starter', ['ionic', 'starter.controllers','ngCordova','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)




//PUSH FUNCIONANDO

 var push = PushNotification.init({
    "android": {
        "senderID": "332867885048"
    },
    "ios": {
        "alert": "true",
        "badge": "true",
        "sound": "true"
    },
    "windows": {}
});

push.on('registration', function(data) {
    
   //alert("alert1");
   //alert(data.registrationId);
   console.log('regsustr');
      localStorage.setItem('pushKeySK', data.registrationId);
   //localStorage.setItem('pushKeyGD', data.registrationId);



});

push.on('notification', function(data) {

  //alert('Tienes una notificacion: '+data.title);

console.log(data);
});

push.on('error', function(e) {
    console.log(e.message);

});
//push final 








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

     .state('registro', {
      url: '/registro',

          templateUrl: 'templates/registro.html',
          controller: 'loginPageCtrl'
        
      })


        .state('loginPage', {
      url: '/loginPage',

          templateUrl: 'templates/loginPage.html',
          controller: 'loginPageCtrl'
        
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
                  cache : false,
      url: '/publicarComercio',
      views: {
        'menuContent': {
          templateUrl: 'templates/publicarComercio.html',
          controller: 'publicarComercioCtrl'
        }
      }
    })

                .state('app.notificaciones', {
                  cache: false,
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
 // $urlRouterProvider.otherwise('/app/playlists');
  console.log(localStorage.getItem('seekUserId'));
  if(localStorage.getItem('seekUserId') == null || localStorage.getItem('seekUserId') == 'undefined' || localStorage.getItem('seekUserId') == undefined){

$urlRouterProvider.otherwise('/loginPage');

}
else{
  
      $urlRouterProvider.otherwise("/app/playlists");
  // $urlRouterProvider.otherwise("/login");


}




});
