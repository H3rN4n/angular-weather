"use strict";angular.module("weatherModule",["geolocation","angularMoment","ui.bootstrap","ngTouch","ngAnimate"]),angular.module("weatherModule").controller("headerController",["$rootScope","$scope",function(e,t){e.showMenu={state:!1,"class":"ng-hide"},t.show=function(){e.showMenu.state?e.showMenu["class"]="animated slideOutUp":e.showMenu["class"]="animated slideInDown",e.showMenu.state=e.showMenu.state===!1}}]),angular.module("weatherModule").controller("listController",["$rootScope","placesFactory","geolocation",function(e,t,a){function r(e,a){a?t.addPlaceByCoords(a).then(function(e){o({goTo:0})}):(t.addPlaceByName(e).then(function(e){o()}),menu.newPlace="")}var n=this;n.active=0,n.initialPlaces=["Mendoza","Lima","San Francisco"],e.$on("updatePlaces",function(e,t){o()});var o=function(e){n.places=t.getPlaces(),n.places.length&&!e?n.active=n.places[n.places.length-1].id:n.active=e.goTo};n.initPlaces=function(){for(var e=0;e<n.initialPlaces.length;e++)t.addPlaceByName(n.initialPlaces[e]);a.getLocation().then(function(e){n.myCoords={lat:e.coords.latitude,"long":e.coords.longitude},r(null,n.myCoords)})}}]),angular.module("weatherModule").controller("menuController",["$rootScope","placesFactory",function(e,t){var a=this;a.places=t.getPlaces();a.addPlace=function(r,n){n||t.addPlaceByName(r).then(function(r){a.places=t.getPlaces(),a.newPlace="",e.$broadcast("updatePlaces",a.places)}),n&&t.addPlaceByCoords(n).then(function(r){a.places=t.getPlaces(),e.$broadcast("updatePlaces",a.places)})},a.removePlace=function(r){a.places=t.removePlace(r),e.$broadcast("updatePlaces",a.places)}}]),angular.module("weatherModule").directive("weatherMenu",[function(){return{restrict:"E",templateUrl:"./menu.html"}}]),angular.module("weatherModule").factory("openWeatherService",["$http",function(e){var t="af95bc4e30710dff7080cfb67eadba30",a="http://api.openweathermap.org/data/2.5/";return{getCurrentWeatherByCityName:function(r,n){return e({url:a+"weather",method:"GET",params:{q:r,appid:t,units:n||"metric"}})},getForecastWeatherByCityName:function(r,n){return e({url:a+"forecast/daily",method:"GET",params:{q:r,appid:t,units:n||"metric",cnt:6}})},getForecastWeatherByCoords:function(r,n){return e({url:a+"forecast/daily",method:"GET",params:{lat:r.lat,lon:r["long"],appid:t,units:n||"metric",cnt:6}})},getWeatherByCoords:function(r,n){return e({url:a+"find",method:"GET",params:{lat:r.lat,lon:r["long"],appid:t,units:n||"metric",cnt:2}})}}}]),angular.module("weatherModule").factory("placesFactory",["$q","openWeatherService",function(e,t){var a=[],r=1,n=function(e){return t.getWeatherByCoords(e).then(function(t){return{coords:e,current:t}})},o=function(e){return t.getForecastWeatherByCoords(e.coords).then(function(t){return e.forecast=t,e})},c=function(t){var r=e.defer();return 200==t.current.data.cod&&200==t.forecast.data.cod?(a.unshift({id:0,name:t.forecast.data.city.name,coords:t.coords,state:t.forecast.data.list[1].weather[0].description,min:t.forecast.data.list[1].temp.min,max:t.forecast.data.list[1].temp.max,current:t.current.data.list[1].main.temp,forecast:t.forecast.data.list}),r.resolve(a)):r.reject("Something was wrong"),r.promise},i=function(e){return t.getCurrentWeatherByCityName(e).then(function(t){return{cityName:e,current:t}})},s=function(e){return t.getForecastWeatherByCityName(e.cityName).then(function(t){return e.forecast=t,e})},l=function(t){var n=e.defer();return 200==t.current.data.cod&&200==t.forecast.data.cod?(a.push({id:r,name:t.current.data.name,coords:t.current.data.coord,state:t.forecast.data.list[0].weather[0].description,min:t.forecast.data.list[0].temp.min,max:t.forecast.data.list[0].temp.max,current:t.current.data.main.temp,forecast:t.forecast.data.list}),r++,n.resolve(a)):n.reject("Something was wrong"),n.promise};return{getPlaces:function(){return a},removePlace:function(e){return a=a.filter(function(t){return t.name!=e}),this.getPlaces()},addPlaceByCoords:function(e){return n(e).then(o).then(c)},addPlaceByName:function(e){return i(e).then(s).then(l)}}}]);