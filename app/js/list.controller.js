'use strict'
 angular.module('weatherModule').controller('listController',['$rootScope', 'placesFactory', 'geolocation', function($rootScope, placesFactory, geolocation){
    var list = this;

    list.active = 0;
    list.initialPlaces = ['Mendoza','Lima','San Francisco'];

    function addPlace(place, coords){

        if(!coords){
          placesFactory.addPlaceByName(place).then(function(response) {
            reloadPlaces()
          })
          menu.newPlace = ""
        } else {
          placesFactory.addPlaceByCoords(coords).then(function(response) {
            reloadPlaces({goTo: 0})
          })
        }
      }

    $rootScope.$on('updatePlaces', function(event, data) { 
      reloadPlaces();
    })

    var reloadPlaces = function(options){
      list.places = placesFactory.getPlaces();
      if(list.places.length && !options){
        list.active = list.places[list.places.length - 1].id;
      } else {
        list.active = options.goTo;
      }
      
    }

    list.initPlaces = function(){
      for (var i = 0; i < list.initialPlaces.length; i++) {
        placesFactory.addPlaceByName(list.initialPlaces[i])
      }

      geolocation.getLocation().then(function(data){
        list.myCoords = {lat:data.coords.latitude, long:data.coords.longitude}
        addPlace(null, list.myCoords)
      });

    }

  }])