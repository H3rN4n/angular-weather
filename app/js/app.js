(function(){

 'use strict'
  var weatherModule = angular.module('weatherModule', ['geolocation', 'angularMoment', 'ui.bootstrap', 'ngTouch'])

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
      getWeatherByCoords: function(coords, units){
    		return $http({
            url: apiUrl + "find",
            method: "GET",
            params: {'lat': coords.lat, 'lon': coords.long, 'appid': apiKey, 'units': units || 'metric', 'cnt': 2}
         });
    	}
    }
  })

  weatherModule.factory('placesFactory', function(openWeatherService){
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
        return openWeatherService.getWeatherByCoords(coords)
         .then(function(response){
           var currentWeather = response
           return openWeatherService.getForecastWeatherByCityName(currentWeather.data.list[1]['name'])
            .then(function(response){
              var forecast = response
              places.unshift({
                "id": 0,
                "name": forecast.data.city.name,
                "coords": forecast.data.city.coord,
                "state": forecast.data.list[1]['weather'][0]['description'],
                "min": forecast.data.list[1]['temp']['min'],
                "max": forecast.data.list[1]['temp']['max'],
                'current': currentWeather.data.list[1]['main']['temp'],
                'forecast': forecast.data.list
              })
            })
           return places
      })
      },
      addPlaceByName: function(placeName){
        if (placeName &&!isDuplicate(placeName)) {
          return openWeatherService.getForecastWeatherByCityName(placeName)
           .then(function(response){
             var forecast = response
             return openWeatherService.getCurrentWeatherByCityName(placeName)
              .then(function(response){
                var currentWeather = response
                places.push({
                  "id": index,
                  "name": forecast.data.city.name,
                  "coords": forecast.data.city.coord,
                  "state": forecast.data.list[0]['weather'][0]['description'],
                  "min": forecast.data.list[0]['temp']['min'],
                  "max": forecast.data.list[0]['temp']['max'],
                  'current': currentWeather.data.main.temp,
                  'forecast': forecast.data.list
                })
                index++
              })
             return places
           })
        }else if(!placeName){
          alert("Please insert a place")
          return places
        }else{
          alert("You can't add a duplicate place")
          return places
        }
      }
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

  weatherModule.controller('listController', function(placesFactory, geolocation){
    var list = this
    var initialPlaces = ['Buenos Aires','Mendoza','Lima','San Francisco']

    list.initPlaces = function(){
      geolocation.getLocation().then(function(data){
        list.myCoords = {lat:data.coords.latitude, long:data.coords.longitude};
        list.addPlace(null, list.myCoords);
      });

      for (var i = 0; i < initialPlaces.length; i++) {
        placesFactory.addPlaceByName(initialPlaces[i])
        list.places = placesFactory.getPlaces()
      }
    }

    list.addPlace = function(place, coords){
      if(!coords){
        placesFactory.addPlaceByName(place).then(function(response) {
          list.places = placesFactory.getPlaces()
        })
        list.newPlace = ""
      }

      if(coords){
        placesFactory.addPlaceByCoords(coords).then(function(response) {
          list.places = placesFactory.getPlaces()
        })
      }

    }

    list.removePlace = function(place){
      list.places = placesFactory.removePlace(place)
    }
  })
})()
