// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'parse-angular'])

.run(function($ionicPlatform, $rootScope) {
    //Parse
    Parse.initialize("ymlx91oRYAy3EzaZSTDE3vmJXkFLklpE4AAxIb0L", "swvdlAvpnUnw5UNn0pbagswgVxa6HFS8Lxc7cIcx");
    $rootScope.sessionUser = Parse.User.current();

    //Ionic
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})
    .service('SessionService', ['$rootScope',
        function($rootScope) {
            this.signup = function(name, tel, username, password) {
                return new Promise(function(resolve, reject) {
                    var user = new Parse.User();
                    user.set("username", username);
                    user.set("password", password);
                    user.set("nombreCompleto", name);
                    user.set("telefono", tel);

                    user.signUp(null, {
                        success: function(user) {
                            // Hooray! Let them use the app now.
                            console.log("user logged in!");
                            $rootScope.sessionUser = Parse.User.current();
                            resolve();
                        },
                        error: function(user, error) {
                            // Show the error message somewhere and let the user try again.
                            alert("Error: " + error.code + " " + error.message);
                            reject();
                        }
                    });
                });
            };

            this.login = function(username, password) {
                return new Promise(function(resolve, reject) {
                    Parse.User.logIn(username, password, {
                        success: function(user) {
                            // Do stuff after successful login.
                            console.log('user logged in');
                            $rootScope.$apply(function() {
                                $rootScope.sessionUser = user;
                            });
                            resolve();
                        },
                        error: function(user, error) {
                            // The login failed. Check error to see why.
                            alert("Error: " + error.code + " " + error.message);
                            reject();
                        }
                    });
                });
            };

            this.logout = function() {
                Parse.User.logOut();
                $rootScope.sessionUser = Parse.User.current();
                console.log('User Logged out');
            }

        }
    ])

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.maneja', {
        url: '/maneja',
        views: {
            'tab-maneja': {
                templateUrl: 'templates/tab-maneja.html',
                controller: 'ManejaCtrl'
            }
        }
    })
        .state('tab.maneja-viaje-detail', {
            url: '/maneja/:viajeId',
            views: {
                'tab-maneja': {
                    templateUrl: 'templates/viaje-maneja-detail.html',
                    controller: 'ViajeManejaDetailController'
                }
            }
        })

    .state('tab.toma', {
        url: '/toma',
        views: {
            'tab-toma': {
                templateUrl: 'templates/tab-toma.html',
                controller: 'tomaController'
            }
        }
    })

    .state('tab.misViajes', {
        url: '/misViajes',
        views: {
            'tab-mis-viajes': {
                templateUrl: 'templates/tab-mis-viajes.html',
                controller: 'misViajesController'
            }
        }
    })
        .state('tab.misViajes-detail', {
            url: '/misViajes/:viajeId',
            views: {
                'tab-mis-viajes': {
                    templateUrl: 'templates/mis-viajes-detail.html',
                    controller: 'misViajesDetailController'
                }
            }
        })

    .state('tab.perfil', {
        url: '/perfil',
        views: {
            'tab-perfil': {
                templateUrl: 'templates/tab-perfil.html',
                controller: 'perfilController'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/maneja');

})
.directive('myDateTimePicker', function ($ionicPopup) {
  return {
    restrict: 'E',
    template: '<input class="my-date-time-picker" type="text" readonly="readonly" ng-model="formatted_datetime" ng-click="popup()" placeholder="{{placeholder}}">',
    scope: {
      'title': '@',
      'dateModel': '=ngModel',
      'placeholder': '@'
    },
    controller : function($scope, $filter, $ionicPopup) {
      $scope.tmp = {};
      $scope.tmp.newDate = $scope.dateModel || Date.now();
      
      $scope.onTimeSet = function(newDate, oldDate) {
        console.log('Selected Date from Old date', oldDate, ' to ', newDate);
      };

      $scope.popup = function() {
        $ionicPopup.show({
          template: '<div class="my-date-time-picker"><datetimepicker data-ng-model="tmp.newDate" data-on-time-set="onTimeSet"></datetimepicker></div>',
          title: $scope.title,
          scope: $scope,
          buttons: [
            {text: 'Cancel'},
            {
              text: '<b>Choose</b>',
              type: 'button-positive',
              onTap: function(e) {
                //$scope.$apply(function() { //error: apply already in progress
                  $scope.dateModel = $scope.tmp.newDate;
                  $scope.formatted_datetime = $filter('date')($scope.tmp.newDate, 'medium');
                //});
              }
            } //second button
          ] //buttons array
        }); //ionicpopup.show
      }; //scope.popup();
    }
  };
});