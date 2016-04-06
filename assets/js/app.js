var app = angular.module('ISVMatrixSolution', ['ngMaterial', 'ui.router', 'ngMessages']);

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

app.controller('HomeController', ['$http', '$mdDialog', function($http, $mdDialog) {


	this.rules = [{
		columns: {
			c1: 'column 1',
			c2: 'column 2'
		},
		result: {
			r1: 'result 1',
			r2: 'result 2',
		}
	},{
		columns: {
			c1: 'A 1',
			c2: 'B 2'
		},
		result: {
			r1: 'C 1',
			r2: 'D 2',
		}
	}];


	this.newColumnDialog = function(ev){
		var _self = this;
		
		$mdDialog.show({
			controller: DialogController,
			templateUrl: '/templates/home/addColumn.dialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true
		})
		.then(function(answer) {
			if (answer){
				$.each(_self.rules, function(index, value) {
					if (answer.isReturnValue){
						value.result[answer.columnName] = "";
					} else {
						value.columns[answer.columnName] = "";
					}
				});
			}
		}, function() {});
	}


	function DialogController($scope, $mdDialog) {

		$scope.columnName = "";

		$scope.isReturnValue = false;

		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function(answer) {
			$mdDialog.hide({columnName: $scope.columnName, isReturnValue: $scope.isReturnValue});
		};
	}


	this.deleteRule = function(index){
		//			>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>		FALTA DIALOGO DE CONFIRMACION
		console.log(index);
		this.rules.splice(index, 1);
	}

	this.copyRule = function(index, rule){
		this.rules.splice(index, 0, rule);
	}


}]);
