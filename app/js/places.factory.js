'use strict'
angular.module('weatherModule').factory('placesFactory',['$q', 'openWeatherService', 'panoramioService', function($q, openWeatherService, panoramioService){
    var places = [];
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

    getCityImage = function(obj){ //{coords, current, forecast}
      var coords = {};
      if(obj.current.data.coord){
        coords = obj.current.data.coord
      } else {
        coords = obj.current.data.list[0]['coord']
      }
      return panoramioService.getCityImage(coords).then(function(response){
        obj.cityImage = response
        return obj
      });
    },

    parseDataByCoords = function(obj){ //{coords, current, forecast, cityImage}

    console.log(obj);

      var deferred = $q.defer();

        if (obj.current.data.cod == 200 && obj.forecast.data.cod == 200){
          places.unshift({
            "id": 0,
            "img": obj.cityImage.data.photos[0]['photo_file_url'],
            "isCurrentLocation": true,
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
            "img": obj.cityImage.data.photos[0]['photo_file_url'],
            "isCurrentLocation": false,
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
        .then( getCityImage )
        .then( parseDataByCoords );
      },

      addPlaceByName: function(cityName){
        return getWeatherByName( cityName )
        .then( getForecastWeatherByName )
        .then( getCityImage )
        .then( parseDataByName );
      }

     }
  }])