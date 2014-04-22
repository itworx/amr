angular.module('sociogram.controllers', [])

    .factory('Story', function() {
        return {id:'0'}
    })

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

        alert($stateParams.storyId);
        OpenFB.get('/' + $stateParams.storyId).success(function (result) {
            $scope.story = result;
            $scope.item = {};

            $scope.item.message = "@begadhakiky";
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

        $scope.share = function () {

//            $ionicModal.fromUrl("https://www.facebook.com/sharer/sharer.php?u="+$scope.story.link, function(modal) {
//                $scope.taskModal = modal;
//            }, {
//                scope: $scope,
//                animation: 'slide-in-up'
//            });
//
//            // Open our new task modal
//            $scope.showShare = function() {
//                $scope.taskModal.show();
//            };
//
//            showShare();

//            alert($scope.story.link);
//            OpenFB.post('/me/feed', $scope.story.link)
//                .success(function () {
//                    alert("shared");
//                    //$scope.status = "This item has been shared on OpenFB";
//                })
//                .error(function(data) {
//                    alert(data.error.message);
//                });
        };

        $scope.comment = function (storyId) {

            alert('you are commenting');
//            OpenFB.post('/'+storyId+'/comments', {message:storyId})
//                .success(function () {
//                    $scope.status = "Photo liked!";
//                })
//                .error(function(data) {
//                    alert(data.error.message);
//                });
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

            OpenFB.get('/begadhakiky/photos/uploaded', {//limit:1,
                fields:"name, source, likes.limit(1).summary(true), comments.limit(1).summary(true)"})
                .success(function (result) {

                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $scope.hide();
                    alert(data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });