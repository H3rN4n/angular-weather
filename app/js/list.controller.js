'use strict'
 angular.module('weatherModule').controller('listController',['$rootScope', 'placesFactory', 'geolocation', function($rootScope, placesFactory, geolocation){
    var list = this
    list.active = 0
    var initialPlaces = ['Mendoza','Lima','San Francisco']

    $rootScope.$on('updatePlaces', function(event, data) { 
      reloadPlaces();
    })

    var reloadPlaces = function(){
      list.places = placesFactory.getPlaces();
      if(list.places.length){
        list.active = list.places[list.places.length - 1].id;  
      }
      
    }

    list.initPlaces = function(){
      geolocation.getLocation().then(function(data){
        list.myCoords = {lat:data.coords.latitude, long:data.coords.longitude}
        list.addPlace(null, list.myCoords)
      });

      for (var i = 0; i < initialPlaces.length; i++) {
        placesFactory.addPlaceByName(initialPlaces[i])
      }

      reloadPlaces()

      list.addPlace = function(place, coords){

        if(!coords){
          placesFactory.addPlaceByName(place).then(function(response) {
            reloadPlaces()
          })
          menu.newPlace = ""
        } else {
          placesFactory.addPlaceByCoords(coords).then(function(response) {
            reloadPlaces()
          })
        }
      }
    }

  }])