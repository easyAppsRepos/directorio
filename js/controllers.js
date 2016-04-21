angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,Comercios,Categorias) {
$scope.comercioDetalle={};
$scope.favAct='noFav';
   $scope.labelFav='Agregar a Favoritos';
$scope.numeroContacto='No especificado';
$scope.correoElectronico='No especificado';

  $scope.loginData = {};

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });



  $scope.closeLogin = function() {
    $scope.modal.hide();
  };


  $scope.login = function(idComercio) {

    Comercios.detalleComercio(idComercio,localStorage.getItem('seekUserId')).then(function(data){

     $scope.comercioDetalle=data[0];
     if(typeof data[0].numeroContacto !== 'undefined' && data[0].numeroContacto!==''){
          $scope.numeroContacto=data[0].numeroContacto;
        }
     if(typeof data[0].correoElectronico !== 'undefined' && data[0].correoElectronico!==''){
          $scope.correoElectronico=data[0].correoElectronico;
        }

        if(typeof data[0].fav !== 'undefined' && data[0].fav > 0){
          $scope.favAct='fav';
          $scope.labelFav='Favorito';
        }
        else{  
          $scope.favAct='noFav';
          $scope.labelFav='Agregar a Favoritos';
        }
   $scope.modal.show();
    console.log(data);


});

  

  };

$scope.addFav= function(idComercioP){

  if($scope.favAct=='noFav'){
              $scope.favAct='fav';
          $scope.labelFav='Favorito';
          
    console.log('agregaraFAv');
var userId=localStorage.getItem('seekUserId');
console.log(idComercioP)
console.log(userId);
Categorias.agregarFav(idComercioP,userId).then(function(data){

  console.log(data);

});

  }
  else{
    console.log('do nothing');
  }

}

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('CatDetailCtrl', function($scope, $stateParams, Categorias) {

  var cats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Hoteles',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  $scope.catIdF=$stateParams.catId;

Categorias.getSubCategoria($stateParams.catId).then(function(data){

  $scope.subCats=data;
  console.log(data);
});

//$scope.cat = cats[$stateParams.catId];


})


.controller('categoriasCtrl', function($scope,$state, $ionicModal,Categorias, $rootScope) {

$scope.goCategoria=function(id){



  console.log(id);
     $state.go('app.cat-detail', {catId: id});
}

Categorias.getCategorias().then(function(data){
  $rootScope.$broadcast('categorias', { cats: data });
   console.log(data);

     $scope.groups = [
{
  name: 'Categorias',
  items:data
}

  ];

  


});




  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
  

})

.controller('publicarComercioCtrl', function($scope, $cordovaCamera, $cordovaFileTransfer, Ubicacion, $window,$ionicModal,Comercios, $rootScope, $timeout, $ionicLoading, $q, $ionicPopup) {
$scope.propuesta={};
$scope.paises=[];
$scope.ciudades=[];
$scope.distritos=[];

  $scope.tipoE=true;
  $scope.propuesta.tipoE=true;


Ubicacion.getPaises().then(function(data){
  $scope.paises=data;
  console.log($scope.paises);
});


//tomar logo y funciones generales 
//para tomar imagen y subirla al servidor :D

function clearCache() {
    navigator.camera.cleanup();
}
 
var retries = 0;
function onCapturePhoto(fileURI,name) {

  console.log("En onCapturePhotoPP");
    var win = function (r) {
        clearCache();
        retries = 0;

          $ionicLoading.hide();
    }
 
    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
              $ionicLoading.hide();
        }
    }
 
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = 'logo_'+name;
    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI('http://www.seek-busines-services.com/API/subirFotoo.php'), win, fail, options);
}
 
function capturePhoto() {
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 100,
        destinationType: destinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}
 
function onFail(message) {
    alert('Failed because: ' + message);
}



    $scope.takePhoto = function () {
   var isOnline = true;
   if(isOnline){

    var options = {
      quality: 100,
      //destinationType: Camera.DestinationType.DATA_URL,
      destinationType: Camera.DestinationType.FILE_URI,
      correctOrientation: true,
 sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth:  200,
      targetHeight: 200,
      popoverOptions: CameraPopoverOptions
  };

      $cordovaCamera.getPicture(options).then(function (imageData) {
      //    $scope.imgURI = "data:image/jpeg;base64," + imageData;
      $scope.imgURI=imageData;

      console.log("idasidasdo");

      }, function (err) {
              console.log("En error");
                console.log(err);
       });
      } else{
                    $ionicPopup.alert({
              title: 'Error',
              content: 'Es necesaria conexión a internet'
            }).then(function(res) {
              console.log('necesaria conexion ainternet');
            });
      }

    
  }

$scope.seleccionarFoto=function(){


}


//fin funciones camara.

$scope.actualizarCiudad=function(idPais){

  //console.log(idPais);
  Ubicacion.getCiudades(idPais).then(function(data){
  $scope.ciudades=data;
  console.log($scope.ciudades);
});

}

$scope.actualizarDistrito=function(idCiudad){

  //console.log(idPais);
  Ubicacion.getDistritos(idCiudad).then(function(data){
  $scope.distritos=data;
  console.log($scope.distritos);
});

}



$rootScope.$on('propuestaCategoria', function(event, args) {

 $scope.propuesta.idCategoria=args.idCat;
 $scope.propuesta.idSubCategoria=args.idSub;
})

$scope.addComercio=function(){

if(typeof $scope.propuesta.nombreComercio=='undefined'){

  alert("Debes especificar un nombre");
  return true;
}

if(typeof $scope.propuesta.descripcionNegocio=='undefined'){

  alert("Debes especificar una descripcion");
  return true;
}

if(typeof $scope.propuesta.idCiudad=='undefined'){

  alert("Debes especificar una ciudad");
  return true;
}



    $ionicLoading.show({
      template: 'Cargando...'
    });

console.log( Object.keys($scope.propuesta).length);
var comercio={};

comercio=$scope.propuesta;

if($scope.propuesta.tipoE){comercio.idTipoActividad=0}
if($scope.propuesta.tipoP){comercio.idTipoActividad=1}

comercio.idUsuario=parseInt(localStorage.getItem('seekUserId'));
comercio.idPais= typeof $scope.propuesta.idPais == 'undefined' ? -1 :parseInt($scope.propuesta.idPais);
comercio.idCiudad= typeof $scope.propuesta.idCiudad == 'undefined' ? -1 :parseInt($scope.propuesta.idCiudad);
comercio.idDistrito= typeof $scope.propuesta.idDistrito == 'undefined' ? -1 :parseInt($scope.propuesta.idDistrito);
comercio.idCategoria=typeof $scope.propuesta.idCategoria == 'undefined' ? -1 :parseInt($scope.propuesta.idCategoria);
comercio.idSubCategoria=typeof $scope.propuesta.idSubCategoria == 'undefined' ? -1 :parseInt($scope.propuesta.idSubCategoria);

comercio.correoElectronico=typeof $scope.propuesta.correoElectronico == 'undefined' ? '' : $scope.propuesta.correoElectronico;
comercio.pagWeb=typeof $scope.propuesta.pagWeb == 'undefined' ? '' : $scope.propuesta.pagWeb;
comercio.numeroContacto=typeof $scope.propuesta.numeroContacto == 'undefined' ? '' : $scope.propuesta.numeroContacto;
comercio.identificacionComercio=typeof $scope.propuesta.identificacionComercio == 'undefined' ? '' : $scope.propuesta.identificacionComercio;


comercio.idTipoIdentificacion=0;


console.log(comercio);
Comercios.publicarComercio(comercio).then(function(data){
  console.log(data);
if(data.status==200){
onCapturePhoto($scope.imgURI,data.data);
}
else{
  $ionicLoading.hide();
}
});



}
  
$scope.cambTipo=function(tipo){
if(tipo>0){
	$scope.tipoP=true;
	$scope.tipoE=false;
  $scope.propuesta.tipoP=true;
  $scope.propuesta.tipoE=false;
	$scope.labelNombre='Nombre de la persona';
}
else{$scope.tipoE=true;
	$scope.tipoP=false;
    $scope.propuesta.tipoP=false;
  $scope.propuesta.tipoE=true;
	$scope.labelNombre='Nombre de la empresa';
}

}
$scope.labelNombre='Nombre de la empresa';


})

.controller('notificacionesCtrl', function($scope, $ionicModal) {



})



.controller('BusquedaCtrl', function($scope, $ionicModal,$rootScope, Categorias, Ubicacion,Busqueda) {
 $scope.paises=[];
  $scope.ciudades=[];
$scope.etiquetas={};
$scope.etiquetasItem=[];
$scope.enBusqueda=true;
  $scope.resultadosBusqueda=[];

 $scope.modalClasses = ['slide-in-up', 'slide-in-down', 'fade-in-scale', 'fade-in-right', 'fade-in-left', 'newspaper', 'jelly', 'road-runner', 'splat', 'spin', 'swoosh', 'fold-unfold'];

$scope.categoriaSeleccionada='Seleccionar categoria';
$scope.subcategoriaSeleccionada='Seleccionar Sub-categoria';

Ubicacion.getPaises().then(function(data){
  $scope.paises=data;
  console.log($scope.paises);
});

$rootScope.$on('subcategorias', function(event, args) {

$scope.idCat=args.id;
Categorias.getSubCategoria(args.id).then(function(data){
  $scope.subCategorias=data;
  console.log($scope.subCategorias);
});
    // do what you want to do
});


$rootScope.$on('categorias', function(event, args) {
console.log('oncategorias');
    $scope.cats = args.cats;
    // do what you want to do
});

$scope.actualizarDistrito=function(idCiudad){

  //console.log(idPais);
  Ubicacion.getDistritos(idCiudad).then(function(data){
  $scope.distritos=data;
  console.log($scope.distritos);
});

}


$scope.actualizarCiudad=function(idPais){

  //console.log(idPais);
  Ubicacion.getCiudades(idPais).then(function(data){
  $scope.ciudades=data;
  console.log($scope.ciudades);
});

}
$scope.subCategorias=[];

$scope.setSubcategoria=function(subCatNombre,idSub){
$scope.subcategoriaSeleccionada=subCatNombre;
$scope.idSubCategoria=idSub;
  $rootScope.$broadcast('propuestaCategoria', { idCat: $scope.idCat, idSub: idSub});


   $scope.modal.hide();
     $scope.modal.remove();

}

$scope.salirBusqueda=function(){
  $scope.etiquetasItem=[];
$scope.enBusqueda=true;
//$scope.$applyAsync();

}

$scope.buscar=function(){

  var paramsBusqueda={};

if(!($scope.etiquetas.input==undefined ||$scope.etiquetas.input=='' )){
$scope.etiquetasItem.push($scope.etiquetas.input);
palabraEnviar="";
var str = $scope.etiquetas.input;
var res = str.split(" ");
for(var g=0;g<res.length;g++){

 if(res[g].length>3){
  if(palabraEnviar==''){palabraEnviar+=res[g]}
    else{
      palabraEnviar+=" "+res[g]}
}
}
console.log(palabraEnviar);
if(palabraEnviar!==''){
paramsBusqueda.palabra=palabraEnviar;}
}

if(!($scope.idCategoria==undefined ||$scope.idCategoria=='undefined' )){
$scope.etiquetasItem.push($scope.categoriaSeleccionada);
paramsBusqueda.categoria=$scope.idCategoria;
}

if(!($scope.idSubCategoria==undefined ||$scope.idSubCategoria=='undefined' )){
$scope.etiquetasItem.push($scope.subcategoriaSeleccionada);
paramsBusqueda.subCat=$scope.idSubCategoria;
}

if(!($scope.etiquetas.cercania==undefined ||$scope.etiquetas.cercania==false )){
$scope.etiquetasItem.push('Cercania');
paramsBusqueda.cercania=true;
}

if(!($scope.etiquetas.pais==undefined ||$scope.etiquetas.pais=='' )){
$scope.etiquetasItem.push('Pais');
paramsBusqueda.pais=$scope.etiquetas.pais;
}

if(!($scope.etiquetas.ciudad==undefined ||$scope.etiquetas.ciudad=='' )){
$scope.etiquetasItem.push('Ciudad');
paramsBusqueda.ciudad=$scope.etiquetas.ciudad;
}

if(!($scope.etiquetas.distrito==undefined ||$scope.etiquetas.distrito=='' )){
$scope.etiquetasItem.push('Distrito');
paramsBusqueda.distrito=$scope.etiquetas.distrito;
}

Busqueda.buscarComercio(paramsBusqueda).then(function(data){
  $scope.resultadosBusqueda=data;
console.log(data);
})

console.log(paramsBusqueda);
$scope.enBusqueda=false;
$scope.$applyAsync();


}


$scope.setCategoria=function(cat,catId){
$scope.categoriaSeleccionada=cat;
$scope.idCategoria=catId;
 $rootScope.$broadcast('propuestaCategoria', { idCat: catId, idSub: -1});
  $rootScope.$broadcast('subcategorias', { id: catId });
   $scope.modal.hide();
     $scope.modal.remove();

}

  $scope.openModal = function(animation, modalHtml) {
    $ionicModal.fromTemplateUrl(modalHtml, {
      scope: $scope,
      animation: animation
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

   $scope.closeModal = function() {
    $scope.modal.hide();
     $scope.modal.remove();

  };

    //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
 console.log("destruyendo modal");
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });


})
.controller('loginPageCtrl', function($scope,$window,$rootScope, $state,$ionicPopup,$timeout,Usuarios,$ionicLoading) {

$scope.cerrar=function(){

        $window.localStorage['seekUserId']=undefined;
        $window.localStorage['seekUserName']=undefined;
        $window.localStorage['seekUserEmail']=undefined;
        console.log(window.localStorage);

}

  $scope.registrarUsuario=function(registro){

 $ionicLoading.show({
      template: 'Cargando...'
    });

    if(registro==undefined || registro.nombre==undefined || registro.nombre=='' ||registro.correo == undefined  || registro.correo=='' || registro.pass1 == undefined  || registro.pass1=='' || registro.pass2 == undefined || registro.pass2=='') 
    {
      $ionicLoading.hide();
      alert("Todos los campos deben ser rellenados");

      return true;
    }
    else{
        if(registro.pass1!==registro.pass2){
             $ionicLoading.hide();
    alert('contrasena no conciden');
    return true;
        }

        else{
          //registrar
    
         Usuarios.registrarUsuario(registro).then(function(data){
          if(data.status==400){
               $ionicLoading.hide();
            alert("Correo electronico en uso");
          }
             if(data.status==200){
                 $ionicLoading.hide();
              alert("Registro Exitoso")}

})

        }
    }



  }


var log;
$scope.signIn=function(user){

   $ionicLoading.show({
      template: 'Cargando...'
    });

console.log($window.localStorage);

      Usuarios.logUsuario(user).then(function(data){
        console.log(data.data);
      if(data.length<1){
        $ionicLoading.hide();
        alert("Credenciales invalidas")
      }
      if(data.length>0){
        $rootScope.$broadcast('userName', { name: data[0].nombreUser });
        console.log(data[0].idUser);
        console.log(data[0].nombreUser);
        $window.localStorage['seekUserId']=data[0].idUser;
        $window.localStorage['seekUserName']=data[0].nombreUser;
        $window.localStorage['seekUserEmail']=user.correo;
       // alert("exito");
       $ionicLoading.hide();
        $state.go('app.playlists');
      }

      });




}

})
.controller('PlaylistsCtrl', function($scope, $state, Categorias, $rootScope) {

$rootScope.$on('userName', function(event, args) {
  console.log('asdsad222333');
 console.log(args.name);
 $scope.nombreUser=args.name;

});


$scope.nombreUser=localStorage.getItem('seekUserName');

$scope.pops=[];

Categorias.getCategoriasPopulares().then(function(data){

$scope.pops=data;
});

Categorias.getFavs(localStorage.getItem('seekUserId')).then(function(data){
$scope.favs=data;
console.log(data);
console.log(localStorage.getItem('seekUserId'));
});


$scope.abrirBusqueda = function(){
 $state.go('app.busqueda');
  console.log("buscando");
}


})


.controller('SubCatDetailCtrl', function($scope, $stateParams,Categorias) {

Categorias.getComercio($stateParams.subCatId).then(function(data){
   $scope.comercios=data;
})
//
  
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.directive('headerShrink', function($document) {
  var fadeAmt;

  var shrink = function(header, content, amt, max) {
    amt = Math.min(44, amt);
    fadeAmt = 1 - amt / 44;
    ionic.requestAnimationFrame(function() {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
      for(var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;
      
      var header = $document[0].body.querySelector('.bar-header');
      var headerHeight = header.offsetHeight;
      
      $element.bind('scroll', function(e) {
        var scrollTop = null;
        if(e.detail){
          scrollTop = e.detail.scrollTop;
        }else if(e.target){
          scrollTop = e.target.scrollTop;
        }
        if(scrollTop > starty){
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  } 
})

.factory('Comercios', function($http, $q) {
return {
    publicarComercio: function(comercio) {
      return  $http.post('http://www.seek-busines-services.com/API/guardarComercio.php',comercio)
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                          console.log(response);

                            return response.data;
                        } else {
                            // invalid response
                                   // console.log(response);
                            return response;
                        }

                    }, function(response) {
                        // something went wrong
                                console.log(response);
                        return $q.reject(response.data);
                    });
    },
        detalleComercio: function(comercio,idY) {
      return  $http.post('http://www.seek-busines-services.com/API/detalleComercio.php',{idCategoria:comercio, idUsuario:idY})
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                          console.log(response);

                            return response.data;
                        } else {
                            // invalid response
                                   // console.log(response);
                            return response;
                        }

                    }, function(response) {
                        // something went wrong
                                console.log(response);
                        return $q.reject(response.data);
                    });
    }
  }
})

.factory('Categorias', function($http, $q) {
  // Might use a resource here that returns a JSON array

  return {
    all: function() {

         return getCategorias();

    },

 getComercio:function(idSub){
var paramC={};
  if(idSub<0){
paramC.idCategoria=parseInt(idSub)*-1;
  }
  else{
paramC.idSubCategoria=idSub;
  }
      return  $http.post('http://www.seek-busines-services.com/API/getComercios.php',paramC)
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                          console.log(response.data);
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });


    },

    getSubCategoria:function(idCat){
      return  $http.post('http://www.seek-busines-services.com/API/getSubCategorias.php',{idCategoria:idCat})
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                          console.log(response.data);
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });


    },

        getCategoriasPopulares: function() {
                return  $http.post('http://www.seek-busines-services.com/API/getCategoriasPopulares.php')
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                          console.log(response.data);
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });
     },
      agregarFav: function(idComercio,idUser) {
                return  $http.post('http://www.seek-busines-services.com/API/addFav.php',{idUsuario:idUser,idComercio:idComercio})
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                          console.log(response.data);
                            return response.data;
                        } else {
                            // invalid response
                            console.log(response.data);
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        console.log(response);
                        return $q.reject(response.data);
                    });
     },
        getFavs: function(idUser) {
                return  $http.post('http://www.seek-busines-services.com/API/getFavs.php',{idUsuario:idUser})
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                          console.log(response.data);
                            return response.data;
                        } else {
                            // invalid response
                            console.log(response.data);
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        console.log(response);
                        return $q.reject(response.data);
                    });
     },

    getCategorias: function() {
                return  $http.post('http://www.seek-busines-services.com/API/index.php')
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                          console.log(response.data);
                            return response.data;
                        } else {
                            // invalid response
                            return $q.reject(response.data);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data);
                    });
     }
  };
})

.factory('Usuarios', function($http, $q) {
return {

  logUsuario:function(user){
      return  $http.post('http://www.seek-busines-services.com/API/logUsuario.php',user)
                    .then(function(response) {
            
                     
                        if (typeof response.data === 'object') {
                          console.log(response);
                            return response.data;
                        } else {
                            // invalid response
                             console.log(response);
                            return response;
                        }

                    }, function(response) {
                        // something went wrong
                         console.log(response);
                        return response;
                    });

  },
    registrarUsuario: function(usuario) {
      return  $http.post('http://www.seek-busines-services.com/API/registrarUsuario.php',usuario)
                    .then(function(response) {
            
                     
                        if (typeof response.data === 'object') {
                          console.log(response);
                            return response.data;
                        } else {
                            // invalid response
                             console.log(response);
                            return response;
                        }

                    }, function(response) {
                        // something went wrong
                         console.log(response);
                        return response;
                    });
    }
  }
})
.factory('Busqueda', function($http, $q) {
return {

  buscarComercio:function(busquedaParams){
      return  $http.post('http://www.seek-busines-services.com/API/buscarComercio.php',busquedaParams)
                    .then(function(response) {
            
                     
                        if (typeof response.data === 'object') {
                          console.log(response);
                            return response.data;
                        } else {
                            // invalid response
                             console.log(response);
                            return response;
                        }

                    }, function(response) {
                        // something went wrong
                         console.log(response);
                        return response;
                    });

  }
  }
})

.factory('Ubicacion', function($http, $q) {
return {

  getPaises:function(){
      return  $http.post('http://www.seek-busines-services.com/API/getPaises.php')
                    .then(function(response) {
            
                     
                        if (typeof response.data === 'object') {
                          console.log(response);
                            return response.data;
                        } else {
                            // invalid response
                             console.log(response);
                            return response;
                        }

                    }, function(response) {
                        // something went wrong
                         console.log(response);
                        return response;
                    });

  },

    getCiudades:function(idPais){
      return  $http.post('http://www.seek-busines-services.com/API/getCiudades.php',{idPais:idPais})
                    .then(function(response) {
            
                     
                        if (typeof response.data === 'object') {
                          console.log(response);
                            return response.data;
                        } else {
                            // invalid response
                             console.log(response);
                            return response;
                        }

                    }, function(response) {
                        // something went wrong
                         console.log(response);
                        return response;
                    });

  },

      getDistritos:function(idCiudad){
      return  $http.post('http://www.seek-busines-services.com/API/getDistritos.php',{idCiudad:idCiudad})
                    .then(function(response) {
            
                     
                        if (typeof response.data === 'object') {
                          console.log(response);
                            return response.data;
                        } else {
                            // invalid response
                             console.log(response);
                            return response;
                        }

                    }, function(response) {
                        // something went wrong
                         console.log(response);
                        return response;
                    });

  }

  }
});




