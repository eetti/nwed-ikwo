angular.module('starter.directives',[])
.directive('keypad', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        templateUrl: 'img/keypad.svg',
        scope: {
          data: "=",
          updateFn: '='
        },
        link: function (scope, element, attrs) {
            // scope.data.text = "000";
            var regions = element[0].querySelectorAll('text');
            // console.log(regions);
            // angular.forEach(regions, function (path, key) {
            //     var regionElement = angular.element(path);
            //     regionElement.attr("region", "");
            //     regionElement.attr("dummy-data", "dummyData");
            //     regionElement.attr("hover-region", "hoverRegion"); //<--- Add this
            //     $compile(regionElement)(scope);
            // })
        }
    }
}]);
