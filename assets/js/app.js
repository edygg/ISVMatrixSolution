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
		var _self = this;
		if (_self.rules.length > 1){
			var confirm = $mdDialog.confirm()
				.title('Eliminar Regla')
				.textContent('¿Desea eliminar esta regla?')
				.ariaLabel('Lucky day')
				.ok('Eliminar')
				.cancel('Cancelar');
			$mdDialog.show(confirm).then(function() {
				_self.rules.splice(index, 1);
			}, function() {});
		} else {
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.body))
					.clickOutsideToClose(true)
					.title('No Se Puede Eliminar Regla')
					.textContent('No se puede elminar porque debe de existir al menos una regla')
					.ariaLabel('Alert Dialog Demo')
					.ok('Aceptar')
					.targetEvent()
			);
		}
	}


	this.copyRule = function(index, rule){
		this.rules.splice(index, 0, jQuery.extend(true, {}, rule));
	}


	this.printRules = function(){
		console.log(this.rules);
	}


	this.addRule = function(){
		var newRule = {
			columns: {},
			result: {}
		};
		Object.keys(this.rules[0].columns).forEach(function(column){
			newRule.columns[column] = "";
		});
		Object.keys(this.rules[0].result).forEach(function(column){
			newRule.result[column] = "";
		});
		this.rules.push(newRule);
	}


	this.deleteColumn = function(columnName, columnType){
		var _self = this;

		if (columnType == 'result' && Object.keys(_self.rules[0].result).length < 2 ){
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.body))
					.clickOutsideToClose(true)
					.title('No Se Puede Eliminar Columna')
					.textContent('No se puede elminar porque debe de existir al menos una columna de valor de retorno.')
					.ariaLabel('Alert Dialog Demo')
					.ok('Aceptar')
					.targetEvent()
			);
		} else if (columnType == 'column' && Object.keys(_self.rules[0].columns).length < 2 ){
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.body))
					.clickOutsideToClose(true)
					.title('No Se Puede Eliminar Columna')
					.textContent('No se puede elminar porque debe de existir al menos una columna de valor de consulta.')
					.ariaLabel('Alert Dialog Demo')
					.ok('Aceptar')
					.targetEvent()
			);
		} else {
			var confirm = $mdDialog.confirm()
				.title('Eliminar Columna')
				.textContent('¿Desea eliminar esta columna?')
				.ariaLabel('Lucky day')
				.ok('Eliminar')
				.cancel('Cancelar');
			$mdDialog.show(confirm).then(function() {
				if (columnType == 'result'){
					$.each(_self.rules, function(index, value) {
						delete value.result[columnName];
					});
				} else {
					$.each(_self.rules, function(index, value) {
						delete value.columns[columnName];
					});
				}
			}, function() {});
		}



	}


}]);



