angular.module('starter.controllers', [])

.controller('ManejaCtrl', ['$scope', '$ionicModal', '$rootScope',
    function($scope, $ionicModal, $rootScope) {
        $scope.refresh = function() {
            if (!$rootScope.sessionUser) {
                return [];
            }
            var Viaje = Parse.Object.extend("Viaje");
            var query = new Parse.Query(Viaje);
            query.include('creadoPor');
            query.notEqualTo('creadoPor', $rootScope.sessionUser);

            query.find({
                success: function(results) {
                    // Do something with the returned Parse.Object values
                    $scope.viajes = results.map(function(v) {
                        return v._toFullJSON([]);
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                    $scope.$broadcast('scroll.refreshComplete');
                }
            });
        };

        // login modal
        $ionicModal.fromTemplateUrl('templates/facebook-modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.modal = modal;
        }).then(function(modal) {
            if (!$rootScope.sessionUser) {
                $scope.openModal();
            }
            //auto appear/dissapear
            $scope.$watch(function() {
                return $rootScope.sessionUser;
            }, function(newVal, oldVal) {
                $scope.refresh();
                if (!$rootScope.sessionUser) {
                    $scope.openModal();
                } else {
                    $scope.modal.hide();
                }
            });
        });

        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.$on('$ionicView.enter', function(e) {
            $scope.refresh();
        });



    }
])

.controller('ViajeManejaDetailController', ['$scope', '$stateParams',
    function($scope, $stateParams) {
        console.log($stateParams.viajeId);

        $scope.refresh = function() {
            var Viaje = Parse.Object.extend("Viaje");
            var query = new Parse.Query(Viaje);
            query.include('creadoPor');
            //query.notEqualTo('creadoPor', $rootScope.sessionUser);

            query.get($stateParams.viajeId, {
                success: function(results) {
                    // Do something with the returned Parse.Object values
                    $scope.viaje = results._toFullJSON([]);
                    $scope.$broadcast('scroll.refreshComplete');
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                    $scope.$broadcast('scroll.refreshComplete');
                }
            });
        };
        $scope.refresh();


    }
])

.controller('tomaController', function($scope, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    // $scope.$on('$ionicView.enter', function(e) {
    // });

    $scope.formToma = {
        precioPorPersona: 5000
    };

    $scope.pedirViaje = function() {
        console.log('viaje creado con parametros:');
        console.log($scope.formToma);
        if ($scope.formToma.inicio && $scope.formToma.destino && $scope.formToma.timestamp && $scope.formToma.pasajeros && $scope.formToma.precioPorPersona) {
            Parse.Cloud.run('publicarViaje', $scope.formToma, {
                success: function() {
                    $scope.formToma = {};
                    $state.go('tab.misViajes');
                },
                error: function(error) {
                    console.log(error);
                }
            });
        } else {
            alert("tienes que llenar todos los campos");
        }

    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})
    .controller('fbpop', function($scope) {


    })
    .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })

.controller('loginModalController', function($scope, $rootScope, SessionService) {
    $scope.credenciales = {
        signup: {},
        login: {}
    };
    $scope.login = function() {
        SessionService.login($scope.credenciales.login.email, $scope.credenciales.login.password).then(function(resp) {
            //$scope.modal.hide();
        }, function(err) {});
    }

    $scope.signup = function() {
        SessionService.signup(
            $scope.credenciales.signup.nombreCompleto,
            $scope.credenciales.signup.telefono,
            $scope.credenciales.signup.email,
            $scope.credenciales.signup.password
        ).then(function(resp) {
            //$scope.modal.hide();
        }, function(err) {});
    };
})

.controller('misViajesController', function($scope, $rootScope, SessionService) {
    // results.map(function(v) {
    //     return v._toFullJSON([]);
    // });
    $scope.misViajes = {
        yoTomo: [],
        yoManejo: [],
        yoPostuleParaManejar: []
    };

    $scope.refresh = function() {
        var Viaje = Parse.Object.extend("Viaje");

        Parse.Cloud.run('misViajes', {}, {
            success: function(results) {
                $scope.misViajes.yoManejo = results.yoManejo.map(function(v) {
                    return v._toFullJSON([]);
                });
                $scope.misViajes.yoTomo = results.yoTomo.map(function(v) {
                    return v._toFullJSON([]);
                });
                $scope.misViajes.yoPostuleParaManejar = results.yoPostuleParaManejar.map(function(v) {
                    return v._toFullJSON([]);
                });
                console.log($scope.misViajes);


                $scope.$broadcast('scroll.refreshComplete');

            },
            error: function(error) {
                console.log(error);
                $scope.$broadcast('scroll.refreshComplete');
            }
        });
    };

    $scope.$on('$ionicView.enter', function(e) {
        $scope.refresh();
    });

})
    .controller('misViajesDetailController', ['$scope', '$stateParams', '$rootScope',
        function($scope, $stateParams, $rootScope) {
            $scope.refresh = function() {
                var Viaje = Parse.Object.extend("Viaje");
                var query = new Parse.Query(Viaje);
                query.include('creadoPor');
                //query.notEqualTo('creadoPor', $rootScope.sessionUser);

                query.get($stateParams.viajeId, {
                    success: function(results) {
                        // Do something with the returned Parse.Object values
                        $scope.viaje = results._toFullJSON([]);
                        $scope.$broadcast('scroll.refreshComplete');
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                });
            };
            $scope.refresh();

            $scope.cancelar = function() {
                Parse.Cloud.run('cancelarViaje', {}, {
                    success: function(results) {
                        $scope.$broadcast('scroll.refreshComplete');
                        console.log(results);

                    },
                    error: function(error) {
                        console.log(error);
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                });
            }
        }
    ])

.controller('tabsController', function($scope, SessionService) {
    $scope.badges = {
        maneja: '',
        toma: '',
        misViajes: '',
        perfil: ''
    }

})

.controller('perfilController', function($scope, $rootScope, SessionService, $state) {
    // $scope.$on('$ionicView.enter', function(e) {
    //     if (rootScope.sessionUser){
    //           $scope.user = $rootScope.sessionUser.toJSON();
    //         }
    //         else{
    //           $scope.user = {}
    //         }
    // });
    $scope.$watch(function() {
        return $rootScope.sessionUser;
    }, function(newVal, oldVal) {
        console.log('perfil updated');
        if ($rootScope.sessionUser) {
            $scope.user = $rootScope.sessionUser.toJSON();
        } else {
            $scope.user = {}
        }
    });
    //$scope.user = Parse.User.current();
    $scope.logout = function() {
        $state.go('tab.maneja');
        SessionService.logout();

    };
});