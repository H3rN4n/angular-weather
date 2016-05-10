  'use strict'
  angular.module('weatherModule').controller('menuController',['$rootScope', 'placesFactory', function($rootScope, placesFactory) {
      var menu = this

      menu.places = placesFactory.getPlaces()

      var updatePlaces = function(){
        menu.places = placesFactory.getPlaces()
      }

      menu.addPlace = function(place, coords){
        if(!coords){
          placesFactory.addPlaceByName(place).then(function(response) {
            menu.places = placesFactory.getPlaces()
            menu.newPlace = ""
            $rootScope.$broadcast( "updatePlaces", menu.places );
          })
          
        }

        if(coords){
          placesFactory.addPlaceByCoords(coords).then(function(response) {
            menu.places = placesFactory.getPlaces()
            $rootScope.$broadcast( "updatePlaces", menu.places );
          })
          
        }
      }

      menu.removePlace = function(place){
        menu.places = placesFactory.removePlace(place)
        $rootScope.$broadcast( "updatePlaces", menu.places );
      }

    }])
