// ---SPECS-------------------------

describe('weatherModule', function () {
    var $scope,
    controller;

    beforeEach(module('weatherModule'));

    beforeEach(inject(function ($controller, $rootScope) {
            $scope = $rootScope.$new();
            
            controller = $controller('listController', {
            	scope : $scope
            });

        }));


    describe('listController', function () {
        

        it('should have initialPlaces', function () {
            expect(controller.initialPlaces).toBeDefined();
        });

        it('init process should be run add inital places', function () {
            controller.initPlaces();
            $scope.$apply();
            console.log(controller.places);
            expect(controller.places).toBeDefined();
        });

        /*it('should have one place geolocated ', function () {
            //$rootScope.$apply();
            //controller.initPlaces();
            //expect(controller.places[1]).toBeDefined();
        });

        it('addPlace should have add a new element on list.places ', function () {
            //expect(controller.initialPlaces).toBeDefined();
        });

        it('placeAdd should be change slide active position', function () {
            //expect(controller.initialPlaces).toBeDefined();
        });*/

        /*it('watches the name and updates the counter', function () {
            expect(scope.counter).toBe(0);
            scope.name = 'Batman';
            scope.$digest();
            expect(scope.counter).toBe(1);
        });*/
    });

    /*describe('CtrlHttp', function () {

        var $httpBackend,
            expectedUrl = '/someUrl?key1=value1',
            promise,
            successCallback,
            errorCallback,
            httpController;

        beforeEach(inject(function ($rootScope, $controller, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            successCallback = jasmine.createSpy();
            errorCallback = jasmine.createSpy();
            httpController = $controller('CtrlHttp', {
                '$scope': scope
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('returns http requests successfully and resolves the promise', function () {
            var data = '{"translationKey":"translationValue"}';
            expect(httpController).toBeDefined();
            $httpBackend.expectGET(expectedUrl).respond(200, data);
            promise = scope.getHttp();
            promise.then(successCallback, errorCallback);

            $httpBackend.flush();

            expect(successCallback).toHaveBeenCalledWith(angular.fromJson(data));
            expect(errorCallback).not.toHaveBeenCalled();
        });

        it('returns http requests with an error and rejects the promise', function () {
            $httpBackend.expectGET(expectedUrl).respond(500, 'Oh no!!');
            promise = scope.getHttp();
            promise.then(successCallback, errorCallback);

            $httpBackend.flush();

            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        });
    });*/
    
});