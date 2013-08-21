// Generated by CoffeeScript 1.6.3
(function() {
  var controllers, victoryAngular;

  controllers = {
    settingProfile: function($scope, $state) {
      $scope.something = $state;
      return victory.setup.all();
    }
  };

  victoryAngular = angular.module('victoryAngular', ['ui.state']);

  victoryAngular.config(function($stateProvider) {
    $stateProvider.state('route1', {
      url: '/route1',
      templateUrl: "/views/login.html",
      controller: controllers.settingProfile
    });
    $stateProvider.state('index', {
      url: '',
      templateUrl: "/views/login.html",
      controller: controllers.settingProfile
    });
    return $stateProvider.state('index-2', {
      url: '/',
      templateUrl: "/views/login.html",
      controller: controllers.settingProfile
    });
  });

}).call(this);
