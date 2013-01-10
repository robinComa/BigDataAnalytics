angular.module('i18nFilter', []).filter('i18n', ['$rootScope', function($rootScope) {
    return function (input) {
        return $rootScope.i18n.get(input);
    };
}]);