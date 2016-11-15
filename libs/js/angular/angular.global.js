var globalApp = angular.module('globalApp', []);

globalApp.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q) {
        return {
            'request': function (config) {
//              if ($('.mark')[0] && $('.mark').is(':hidden')) {
//                  $('.mark').show();
//              } else {
//                  $('<div class="mark"><i class="fa fa-spin fa-spinner"></i></div>').appendTo('body');
//              }
//              config.url = common.baseUrl + config.url;
//              var obj = {}; obj['a'] = 1; obj.a = 1;
//              if (config.method.toLowerCase() == 'get') {
//                  config.params = ((config.params || {})['_'] = Math.random());
//              }
                return config || $q.when(config);
            },
            'requestError': function (rejection) {
                return rejection;
            },
            'response': function (response) {
                //$('.mark').hide();
//              if (!response.data.state && response.data.message == 'unauthorized') {
//                  window.location.href = 'login.html';
//              }
                return response || $q.when(response);
            },
            'responseError': function (response) {
//              $.alert(response.status + ' - ' + response.statusText + '<br/>请求路径：<br/>' + response.config.url, '请求错误');
                //$('.mark').hide();
                return $q.reject(response);
            }
        };
    });
}]);

globalApp.directive('dkgrid', function ($http, $compile) {
    return function (scope, element, attrs) {
        scope.columns = [];
        scope.models = [];
        $http.get(attrs.api).success(function (response) {
            if (response.state && response.data) {
                for (var key in response.data[0]) {
                    scope.columns.push(key);
                }
                scope.models = response.data;
                $compile(element.contents())(scope);
            }
        })
        var html = '<div class="bs-example"><table class="table"><thead><tr><th>行号</th><th ng-repeat="m in columns" ng-bind="m"></th></tr></thead><tbody>';
        html += '<tr ng-repeat="m in models track by $index"><td ng-bind="$index + 1"></td><td ng-repeat="c in columns" ng-bind="m[c]"></td></tr></tbody></table></div>';
        element[0].innerHTML = html;
    }
})