angular.module('sociogram.controllers', [])

    .controller('AppCtrl', function ($scope, $state, OpenFB) {

        $scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
        };

        $scope.revokePermissions = function () {
            OpenFB.revokePermissions().then(
                function () {
                    $state.go('app.login');
                },
                function () {
                    alert('Revoke permissions failed');
                });
        };

    })

    .controller('LoginCtrl', function ($scope, $location, OpenFB) {

        $scope.facebookLogin = function () {

            OpenFB.login('email,read_stream,publish_stream').then(
                function () {
                    $location.path('/app/person/me/feed');
                },
                function () {
                    alert('OpenFB login failed');
                });
        };

    })

    .controller('ShareCtrl', function ($scope, $stateParams, OpenFB) {

        OpenFB.get('/' + $stateParams.storyId).success(function (result) {
            $scope.story = result;
            $scope.item = {};

            $scope.item.message = "#بجد_حقيقي";
            $scope.item.link = result.link;
        });


        $scope.share = function () {
            OpenFB.post('/me/feed', $scope.item)
                .success(function () {
                    $scope.status = "This item has been shared on OpenFB";
                })
                .error(function(data) {
                    alert(data.error.message);
                });
        };

    })

    .controller('CommentCtrl', function ($scope, $stateParams, OpenFB) {


        OpenFB.get('/' + $stateParams.storyId).success(function (result) {
            $scope.story = result;
            $scope.item = {};

        });

        $scope.comment = function () {
            OpenFB.post('/'+$stateParams.storyId+'/comments', $scope.item)
                .success(function () {
                    alert("Comment posted!");
                })
                .error(function(data) {
                    alert(data.error.message);
                });
        };


    })

    .controller('ProfileCtrl', function ($scope, OpenFB) {
        OpenFB.get('/me').success(function (user) {
            $scope.user = user;
        });
    })

    .controller('PersonCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId).success(function (user) {
            $scope.user = user;
        });
    })

    .controller('FriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/friends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })

    .controller('MutualFriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/mutualfriends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })

    .controller('StoryCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.storyId).success(function (result) {
            $scope.story = result;
        });

        $scope.like = function (storyId) {
            OpenFB.post('/'+storyId+'/likes')
                .success(function () {
                    alert("Photo liked!");
                })
                .error(function(data) {
                    alert(data.error.message);
                });
        };
    })

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, $ionicLoading) {

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function() {
            $scope.loading.hide();
        };

        function loadFeed() {
            $scope.show();

            OpenFB.get('/begadhakiky/photos/uploaded', {limit:3,
                fields:"name, source, likes.limit(1).summary(true), comments.limit(1).summary(true)"})
                .success(function (result) {

                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.next = result.paging.next;
                })
                .error(function(data) {
                    //$scope.hide();
                    alert(data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

        $scope.loadMore = function(){

            alert('I come here');
            alert($scope.next);
            OpenFB.get($scope.next)
                .success(function (result) {

                    $scope.hide();

                    angular.forEach(result.data, function(obj) {
                        $scope.items.push(obj);
                    });


                    console.log(result.data);
                    $scope.next = result.paging.next;
                })
                .error(function(data) {
                    //$scope.hide();
                    alert(data.error.message);
                });

        }


    });