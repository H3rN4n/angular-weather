'use strict'
angular.module('weatherModule', ['geolocation', 'angularMoment', 'ui.bootstrap', 'ngTouch', 'ngAnimate'])
'use strict'
angular.module('weatherModule').controller('headerController',
  ['$rootScope',
   '$scope',
   function($rootScope, $scope) {
    $rootScope.showMenu = {
      'state': false,
      'class': 'ng-hide'
    };

    $scope.show = function() {
      if(!!$rootScope.showMenu.state) {
        $rootScope.showMenu.class = 'animated slideOutUp';
      } else {
        $rootScope.showMenu.class = 'animated slideInDown';
      }
      $rootScope.showMenu.state = $rootScope.showMenu.state === false ? true: false;
    };
  }])
//})()

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
            reloadPlaces()
          })
        }
      }

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
        addPlace(null, list.myCoords)
      });

      for (var i = 0; i < list.initialPlaces.length; i++) {
        placesFactory.addPlaceByName(list.initialPlaces[i])
      }

      reloadPlaces()
    }

  }])
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

'use strict'
  angular.module('weatherModule').directive('weatherMenu', [function(){
    return {
      restrict: 'E',
      templateUrl: './menu.html'
    }
  }])
'use strict'
 angular.module('weatherModule').factory('openWeatherService',['$http', function($http){
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
  }])
'use strict'
angular.module('weatherModule').factory('placesFactory',['$q', 'openWeatherService', function($q, openWeatherService){
    var places = []
    var index = 1

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

    /*BY COORDS*/
    var getWeatherByCoords = function(coords) {
      return openWeatherService.getWeatherByCoords(coords).then(function(response){
        return {'coords': coords, 'current': response}
      });
    },

    getForecastWeatherByCoords = function(obj) { //{coords, current}
      return openWeatherService.getForecastWeatherByCoords(obj.coords).then(function(response){
        obj.forecast = response
        return obj
      });
    },

    parseDataByCoords = function(obj){ //{coords, current, forecast}

      var deferred = $q.defer();

        if (obj.current.data.cod == 200 && obj.forecast.data.cod == 200){
          places.unshift({
            "id": 0,
            "name": obj.forecast['data']['city']['name'],
            "coords":  obj.coords,
            "state": obj.forecast['data']['list'][1]['weather'][0]['description'],
            "min": obj.forecast['data']['list'][1]['temp']['min'],
            "max": obj.forecast['data']['list'][1]['temp']['max'],
            'current': obj.current['data']['list'][1]['main']['temp'],
            'forecast': obj.forecast['data']['list']
          })
          deferred.resolve(places);
        } else {
          deferred.reject('Something was wrong');
        }

      return deferred.promise;
    }

    /*END BY COORDS*/

    /*BY NAME*/
    var getWeatherByName = function(cityName) {
      return openWeatherService.getCurrentWeatherByCityName(cityName).then(function(response){
        return {'cityName': cityName, 'current': response}
      });
    },

    getForecastWeatherByName = function(obj) { //{cityName, current}
      return openWeatherService.getForecastWeatherByCityName(obj.cityName).then(function(response){
        obj.forecast = response
        return obj
      });
    },

    parseDataByName = function(obj){ //{cityName, current, forecast}
      
      var deferred = $q.defer();

        if (obj.current.data.cod == 200 && obj.forecast.data.cod == 200){
          places.push({
            "id": index,
            "name": obj.current.data.name,
            "coords": obj.current.data.coord,
            "state": obj.forecast.data.list[0]['weather'][0]['description'],
            "min": obj.forecast.data.list[0]['temp']['min'],
            "max": obj.forecast.data.list[0]['temp']['max'],
            'current': obj.current.data.main.temp,
            'forecast': obj.forecast.data.list
          })
          index++;
          deferred.resolve(places);
        } else {
          deferred.reject('Something was wrong');
        }

      return deferred.promise;
    }

    /*END BY NAME*/

    return {
      getPlaces: function(){return places},
      removePlace: function(placeName){
        places = places.filter(function(obj){
           return obj.name != placeName
        })
        return this.getPlaces()
      },

      addPlaceByCoords: function(coords){
        return getWeatherByCoords( coords )
        .then( getForecastWeatherByCoords )
        .then( parseDataByCoords );
      },

      addPlaceByName: function(cityName){
        return getWeatherByName( cityName )
        .then( getForecastWeatherByName )
        .then( parseDataByName );
      }

     }
  }])