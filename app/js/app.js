(function(){
 'use strict'
  var weatherModule = angular.module('weatherModule', ['geolocation', 'angularMoment', 'ui.bootstrap', 'ngTouch','ngAnimate'])

  weatherModule.factory('flikrService', function(){
      var apiUrl = "https://api.flickr.com/services/rest/"
      var apiKey = "7727dfc8d38ca43ff2d91ddc3d1e37f7"
      return {
        getPlaceImages: function(placeName){
          return $http({
              url: apiUrl,
              method: "GET",
              params: {'method': 'flickr.places.find',
                       'appid': apiKey,
                       'query': placeName,
                       'format': 'json'
              }
           });
        }
      }
  })

  weatherModule.factory('openWeatherService', function($http){
    var apiKey = 'af95bc4e30710dff7080cfb67eadba30'
    var apiUrl = 'http://api.openweathermap.org/data/2.5/'

    return {
    	getCurrentWeatherByCityName: function(cityName, units){
    		return $http({
            url: apiUrl + "weather",
            method: "GET",
            params: {'q': cityName, 'appid': apiKey, 'units': units || 'metric'}
         });
    	},
      getForecastWeatherByCityName: function(cityName, units){
    		return $http({
            url: apiUrl + 'forecast/daily',
            method: "GET",
            params: {'q': cityName, 'appid': apiKey, 'units': units || 'metric', 'cnt': 6}
         });
    	},
      getForecastWeatherByCoords: function(coords, units){
    		return $http({
            url: apiUrl + 'forecast/daily',
            method: "GET",
            params: {'lat': coords.lat, 'lon': coords.long, 'appid': apiKey, 'units': units || 'metric', 'cnt': 6}
         });
    	},
      getWeatherByCoords: function(coords, units){
    		return $http({
            url: apiUrl + "find",
            method: "GET",
            params: {'lat': coords.lat, 'lon': coords.long, 'appid': apiKey, 'units': units || 'metric', 'cnt': 2}
         });
    	}
    }
  })

  weatherModule.factory('placesFactory', function($q, openWeatherService){
    var places = []
    var index = 1;

    var isDuplicate = function(placeName){
      var result = places.filter(function(obj){
        return obj.name == placeName
      })
      if(!result.length){
        result = false
      } else {
        result = true
      }
      return result
    }

    return {
      getPlaces: function(){return places},
      removePlace: function(placeName){
        places = places.filter(function(obj){
           return obj.name != placeName
        })
        return this.getPlaces()
      },

      addPlaceByCoords: function(coords){
        return $q.all([
                openWeatherService.getWeatherByCoords(coords),
                openWeatherService.getForecastWeatherByCoords(coords)
            ]).then(function(data) {
                places.unshift({
                  "id": 0,
                  "name": data[1]['data']['city']['name'],
                  "coords":  data[1]['data']['city']['coord'],
                  "state": data[1]['data']['list'][1]['weather'][0]['description'],
                  "min": data[1]['data']['list'][1]['temp']['min'],
                  "max": data[1]['data']['list'][1]['temp']['max'],
                  'current': data[0]['data']['list'][1]['main']['temp'],
                  'forecast': data[1]['data']['list']
                })
            }, function(reason) {
                console.log('error')
            });
      },

      addPlaceByName: function(placeName){
        if (placeName &&!isDuplicate(placeName)) {
          return $q.all([
                  openWeatherService.getCurrentWeatherByCityName(placeName),
                  openWeatherService.getForecastWeatherByCityName(placeName)
              ]).then(function(data) {
                  places.push({
                    "id": index,
                    "name": data[0]['data']['name'],
                    "coords": data[0]['data']['coord'],
                    "state": data[1]['data']['list'][0]['weather'][0]['description'],
                    "min": data[1]['data']['list'][0]['temp']['min'],
                    "max": data[1]['data']['list'][0]['temp']['max'],
                    'current': data[0]['data']['main']['temp'],
                    'forecast': data[1]['data']['list']
                  })
                  index++
              }, function(reason) {
                  console.log('error')
              });
        }else if(!placeName){
          alert("Please insert a place")
          return places
        }else{
          alert("You can't add a duplicate place")
          return places
        }
      },

    //   addPlaceByName: function(placeName){
    //     if (placeName &&!isDuplicate(placeName)) {
    //       return openWeatherService.getForecastWeatherByCityName(placeName)
    //        .then(function(response){
    //          var forecast = response
    //          return openWeatherService.getCurrentWeatherByCityName(placeName)
    //           .then(function(response){
    //             var currentWeather = response
    //             places.push({
    //               "id": index,
    //               "name": forecast.data.city.name,
    //               "coords": forecast.data.city.coord,
    //               "state": forecast.data.list[0]['weather'][0]['description'],
    //               "min": forecast.data.list[0]['temp']['min'],
    //               "max": forecast.data.list[0]['temp']['max'],
    //               'current': currentWeather.data.main.temp,
    //               'forecast': forecast.data.list
    //             })
    //             index++
    //           })
    //          return places
    //        })
    //     }else if(!placeName){
    //       alert("Please insert a place")
    //       return places
    //     }else{
    //       alert("You can't add a duplicate place")
    //       return places
    //     }
    //   }
     }
  })

  weatherModule.controller('headerController', function($rootScope, $scope) {
  	$rootScope.showMenu = {
      'state': false,
      'class': 'ng-hide'
    };

  	$scope.show = function() {
  		if($rootScope.showMenu.state === true) {
  			$rootScope.showMenu.class = 'animated slideOutUp';
  		} else {
  			$rootScope.showMenu.class = 'animated slideInDown';
  		}
  		$rootScope.showMenu.state = $rootScope.showMenu.state === false ? true: false;
  	};
  })

  weatherModule.directive('weatherMenu', function(){
    return {
      restrict: 'E',
      templateUrl: './menu.html'
    }
  })

  weatherModule.controller('menuController', function($rootScope, placesFactory) {
    var menu = this

    menu.places = placesFactory.getPlaces()

    var updatePlaces = function(){
      menu.places = placesFactory.getPlaces()
    }

    menu.addPlace = function(place, coords){
      if(!coords){
        placesFactory.addPlaceByName(place).then(function(response) {
          menu.places = placesFactory.getPlaces()
        })
        menu.newPlace = ""
        $rootScope.$broadcast( "updatePlaces", menu.places );
      }

      if(coords){
        placesFactory.addPlaceByCoords(coords).then(function(response) {
          menu.places = placesFactory.getPlaces()
        })
        $rootScope.$broadcast( "updatePlaces", menu.places );
      }
    }

    menu.removePlace = function(place){
      menu.places = placesFactory.removePlace(place)
      $rootScope.$broadcast( "updatePlaces", menu.places );
    }

  })

  weatherModule.controller('listController', function($rootScope, placesFactory, geolocation){
    var list = this
    list.active = 0
    var initialPlaces = ['Mendoza','Lima','San Francisco']

    $rootScope.$on('updatePlaces', function(event, data) { reloadPlaces() })

    var reloadPlaces = function(){
      list.places = placesFactory.getPlaces()
    }

    list.initPlaces = function(){
      geolocation.getLocation().then(function(data){
        list.myCoords = {lat:data.coords.latitude, long:data.coords.longitude}
        list.addPlace(null, list.myCoords)
      });

      for (var i = 0; i < initialPlaces.length; i++) {
        placesFactory.addPlaceByName(initialPlaces[i])
        reloadPlaces()
      }

      list.addPlace = function(place, coords){
        if(!coords){
          placesFactory.addPlaceByName(place).then(function(response) {
            reloadPlaces()
          })
          menu.newPlace = ""
        }

        if(coords){
          placesFactory.addPlaceByCoords(coords).then(function(response) {
            reloadPlaces()
          })
        }
      }
    }

  })
})()
