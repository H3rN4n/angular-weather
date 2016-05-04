(function(){

 'use strict'
  var app = angular.module('belatrix', [])

  app.controller('listController', function(){
    var list = this
    list.names = [
      {"name": 'Hernan'},
      {"name": 'Nico'},
      {"name": 'Santiago'},
      {"name": 'Ana'}
    ]

    list.removeName = function(name){
      list.names = list.names.filter(function(obj){
         return obj.name != name
      })
    }

    list.addName = function(name){
      var isNameExist = list.names.filter(function(obj){
         return obj.name == name
      })
      if (!isNameExist.length && name) {
        list.names.push({"name": name})
        list.newName = ""
      }else {
        alert("You can't add a duplicate name")
      }
    }
  })
})()
