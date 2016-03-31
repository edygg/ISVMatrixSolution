app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
  /* >>>>>>>>>>>>>>>>>> Router Paths >>>>>>>>>>>>>>>>>>> */

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/templates/home/index.html',
      controller: 'HomeController',
      controllerAs: 'homeCtrl',
    });

  /* <<<<<<<<<<<<<<<<<< Router Paths <<<<<<<<<<<<<<<<<<< */

  /* >>>>>>>>>>>>>>>>>> Theming >>>>>>>>>>>>>>>>>> */

  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('red', {
      'default': '400'
    });
  /* <<<<<<<<<<<<<<<<<< Theming <<<<<<<<<<<<<<<<<< */
}]);
