angular.module('begadhakiky', ['ionic', 'openfb', 'sociogram.controllers'])

    .run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB) {

        OpenFB.init('800832283261975');

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            if( window.plugins && window.plugins.AdMob ) {
                var admob_ios_key = 'ca-app-pub-1435204346149710/9160317582';
                var admob_android_key = 'ca-app-pub-1435204346149710/9888674387';
                var adId = (navigator.userAgent.indexOf('Android') >=0) ? admob_android_key : admob_ios_key;
                var am = window.plugins.AdMob;

                am.createBannerView(
                    {
                        'publisherId': adId,
                        'adSize': am.AD_SIZE.BANNER,
                        'bannerAtTop': false
                    },
                    function() {
                        am.requestAd(
                            { 'isTesting':false },
                            function(){
                                am.showAd( true );
                            },
                            function(){ alert('failed to request ad'); }
                        );
                    },
                    function(){ alert('failed to create banner view'); }
                );
            } else {
                alert('AdMob plugin not available/ready.');
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
                $state.go('app.login');
                event.preventDefault();
            }
        });

        $rootScope.$on('OAuthException', function() {
            $state.go('app.login');
        });

    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: "AppCtrl"
            })

            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login.html",
                        controller: "LoginCtrl"
                    }
                }
            })

            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent': {
                        templateUrl: "templates/logout.html",
                        controller: "LogoutCtrl"
                    }
                }
            })

            .state('app.profile', {
                url: "/profile",
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile.html",
                        controller: "ProfileCtrl"
                    }
                }
            })

            .state('app.share', {
                url: "/share/:storyId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/share.html",
                        controller: "ShareCtrl"
                    }
                }
            })

            .state('app.comment', {
                url: "/comment/:storyId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/comment.html",
                        controller: "CommentCtrl"
                    }
                }
            })

            .state('app.friends', {
                url: "/person/:personId/friends",
                views: {
                    'menuContent': {
                        templateUrl: "templates/friend-list.html",
                        controller: "FriendsCtrl"
                    }
                }
            })
            .state('app.mutualfriends', {
                url: "/person/:personId/mutualfriends",
                views: {
                    'menuContent': {
                        templateUrl: "templates/mutual-friend-list.html",
                        controller: "MutualFriendsCtrl"
                    }
                }
            })
            .state('app.person', {
                url: "/person/:personId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/person.html",
                        controller: "PersonCtrl"
                    }
                }
            })
            .state('app.feed', {
                url: "/person/:personId/feed",
                views: {
                    'menuContent': {
                        templateUrl: "templates/feed.html",
                        controller: "FeedCtrl"
                    }
                }
            })
            .state('app.story', {
                url: "/story/:storyId",
                views: {
                    'menuContent':{
                        templateUrl:"templates/story.html",
                        controller:"StoryCtrl"
                    }
                }
            });

        // fallback route
        $urlRouterProvider.otherwise('/app/person/me/feed');

    });

