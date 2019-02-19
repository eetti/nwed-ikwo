angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('key_pad', function($scope, $cordovaToast, $state, $stateParams, $ionicHistory) {

    $scope.number = '';
    $scope.canErase = false;
    $scope.pinDotVisible = {};
    $scope.success = null;
    var numberOfHymns = 366;

    $scope.keyboardSettings = {
        showLetters: false,
        roundButtons: true,
        width: '80%',
        theme: 'opaque-white',
        resizeContent: {
            enable: true,
            element : "ion-content",
        },

        action: function(number) {
            var a = $scope.number;
            if (((a += number) <= numberOfHymns) && $scope.number.length < 3)  {
                $scope.number += number;
                $scope.pinDotVisible[$scope.number.length] = true;
                $scope.canErase = false;
                $scope.success = null;
            } else {
                $cordovaToast.show('highest number of hymns available is ' + numberOfHymns + ' ' + a + ' is invalid', 'short', 'center').then(function(success) {
                    console.log("The toast was shown");
                }, function(error) {
                    console.log("The toast was not shown due to " + error);
                });
            }
        },

        // used to be Clear
        // now backspace
        leftButton: {
            html: '<i class="icon ion-backspace"></i>',
            action: function() {
                $scope.doErase();
            },
            style: {
                color: '#fff',
                bgColor: 'transparent',
                activeBgColor: 'rgba(0, 0, 0, 0.50)',
                borderColor: '#fff'
            }
        },

        // Submit login
        rightButton: {
            html: '<i class="icon ion-log-in"></i>',
            action: function() {
                $scope.go();
            },
            style: {
                color: '#fff',
                bgColor: 'transparent',
                activeBgColor: 'rgba(0, 0, 0, 0.50)',
                borderColor: '#fff'
            }
        }
    }

    $scope.doErase = function() {
        $scope.pinDotVisible[$scope.number.length] = false;
        $scope.number = $scope.number.slice(0, -1);
        if ($scope.number.length == 0) $scope.canErase = false;
    }

    $scope.showKeyboard = function() {
        $scope.keyboardVisible = true;
    }
    $scope.showKeyboard();


    $scope.hideKeyboard = function() {
        $scope.keyboardVisible = false;
    }

    $scope.go = function() {
        var c = $scope.number;

        c = parseInt(c);
        //alert(c);
        if (isNaN(c)) {
            $scope.showToast('Please enter a number', 'short', 'bottom');
            return null;
        }
        if (c != '' && c != 0 && c != '0') {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.ertti', { name: c }); //state initialized
        } else {
            $scope.showToast('Please enter a valid number', 'short', 'bottom');
        }
    };


    
})

.controller('BookmarkCtrl', function($scope, $state, $stateParams, $ionicBackdrop, $cordovaToast, $localStorage, $ionicPopup, $ionicModal, $timeout, $localstorage) {

    $scope.bookmarks = $localstorage.getObject('post');
    $scope.edit = 0;
    $scope.newHymn = {}
    var numberOfHymns = 366;

    $ionicModal.fromTemplateUrl('templates/bookModal.html', {
        scope: $scope,
        backdropClickToClose: false
    }).then(function(modal) {
        $scope.book = modal;
    });

    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Don\'t eat that!',
            template: 'It might taste good'
        });
        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };

    $scope.showPopup = function() {
        // alert("in");
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="newHymn.number">',
            title: 'Enter Hymn Number',
            subTitle: 'Please enter a valid number',
            scope: $scope,
            buttons: [
                { text: 'Cancel' }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.newHymn.number) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.newHymn.number;

                        }
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            console.log('Tapped!', res);
            $scope.add();
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 30000);
    };


    $scope.go = function(a) {
        var c = a;
        if (c != '' && c != 0 && c != '0') {
            $state.go('app.ertti', { name: c });
        } else {
            $cordovaToast.show('highest number of hymns available is ' + numberOfHymns + ' ' + c + ' is invalid', 'short', 'center').then(function(success) {
                console.log("The toast was shown");
            }, function(error) {
                console.log("The toast was not shown due to " + error);
            });
        }
    };

    $scope.reorder = function(item, fromIndex, toIndex) {
        var b = [];
        b = $localstorage.getObject('post');
        b.splice(fromIndex, 1);
        b.splice(toIndex, 0, item);
        $scope.bookmarks = b;
        $localstorage.setObject('post', b);
    };

    $scope.add = function() {
        var a = $scope.newHymn.number;
        var b = [];
        b = $localstorage.getObject('post');
        //alert(a);

        if (a <= numberOfHymns && a != 0) {
            var addToArray = true;
            for (var i = 0; i < b.length; i++) {
                if (b[i] === a) {
                    addToArray = false;
                }
            } //end for loop
        }
        if (addToArray) {
            b.push(a);
            $localstorage.setObject('post', b);
            $scope.bookmarks = $localstorage.getObject('post');
            $scope.showToast('Bookmark added', 'short', 'bottom');
            $timeout(function() {
                $scope.close();
            }, 200);
        } //end if
        else if (!addToArray) {
            $scope.showToast('Bookmark exists', 'short', 'bottom');
        } else {
            $scope.showToast('invalid', 'short', 'bottom');
        }

    };

    $scope.addBookmark = function() {

        $scope.book.show();
        //$ionicBackdrop.retain();

    };

    $scope.close = function() {
        $scope.book.hide();
        $ionicBackdrop.release();
    };

    $scope.delete = function(a) {
        var b = [];
        b = $localstorage.getObject('post');
        var index = b.indexOf(a);
        b.splice(index, 1);
        $localstorage.setObject('post', b);
        $scope.bookmarks = $localstorage.getObject('post');

    };

    $scope.removeAll = function(a) {

        var b = [];
        b = $localstorage.getObject('post');
        b.length = 0;
        $localstorage.setObject('post', b);
        $scope.bookmarks = $localstorage.getObject('post');
        $scope.edit = 0;
    };

    $scope.toggleEdit = function() {
        var a = $scope.edit;
        if (a == 0) {
            $scope.edit = 1;
        } else {
            $scope.edit = 0;
        }

    };

    $scope.listCanSwipe = false;

    $scope.showToast = function(message, duration, location) {
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function(error) {
            console.log("The toast was not shown due to " + error);
        });
    };

})

.controller('hymnCtrl', function($scope, $state, $stateParams, $cordovaToast, $localStorage, $localstorage) {

    $scope.number = $stateParams.name;
    $scope.bookmarks = $localstorage.getObject('post');

    $scope.reverse = function(a) {
        a = parseInt(a);
        var c = a - 1;
        if (c != '' && c != 0 && c != '0') {
            $state.go('app.ertti', { name: c });
        }
    }

    $scope.advance = function(a) {
        a = parseInt(a);
        var c = a + 1;
        if (c != '' && c != 0 && c != '0' && c != 367) {
            $state.go('app.ertti', { name: c });
        }
    }

    $scope.isBookmarked = function(a) {

        var b = [];
        b = $localstorage.getObject('post');
        $scope.bookmarks = b;
        var addToArray = false;
        for (var i = 0; i < $scope.bookmarks.length; i++) {
            if ($scope.bookmarks[i] === a) {
                addToArray = true;
            }
        }
        return addToArray;
    };

    $scope.toggleBookmark = function(a) {

        var b = [];
        b = $localstorage.getObject('post');
        $scope.bookmarks = b;

        var addToArray = true;
        for (var i = 0; i < b.length; i++) {
            if (b[i] === a) {
                addToArray = false;
            }
        }
        if (addToArray) {
            b.push(a);
            $localstorage.setObject('post', b);
            $scope.showToast('Bookmark added', 'short', 'bottom');
        } else if (!addToArray) {
            var index = b.indexOf(a);
            b.splice(index, 1);
            $localstorage.setObject('post', b);
            $scope.showToast('Bookmark removed', 'short', 'bottom');
        }
    };

    $scope.info = function(a) {
        return true;
    };

    $scope.showToast = function(message, duration, location) {
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function(error) {
            console.log("The toast was not shown due to " + error);
        });
    };
});