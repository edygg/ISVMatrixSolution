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

app.controller('HomeController', ['$http', '$mdDialog', '$mdToast', function($http, $mdDialog, $mdToast) {

	var _self = this;
	this.rules = [];

	
	this.refreshRules = function(){
		$http.get('/api/rules', {timeout: 30000})
		.then(function(response) {
			_self.rules = response.data;
		}, function(){
			$mdToast.show($mdToast.simple().textContent("Ha ocurrido un error al cargar las reglas."));
		});
	}	


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
			$scope.columnName = $scope.columnName.replace(" ", "");
			if ($scope.columnName != ""){
				$mdDialog.hide({columnName: $scope.columnName, isReturnValue: $scope.isReturnValue});
			}
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


	this.postRules = function(){
		var confirm = $mdDialog.confirm()
			.title('Publicar Reglas')
			.textContent('¿Desea publicar estas reglas en el servidor?')
			.ariaLabel('Lucky day')
			.ok('Publicar')
			.cancel('Cancelar');
		$mdDialog.show(confirm).then(function() {
			console.log("PAPI");
			$http.post('/api/rules', _self.rules, {timeout: 30000})
			.then(function(response) {
				$mdToast.show($mdToast.simple().textContent("Reglas guardadas."));
				_self.refreshRules();
			}, function(error){
				$mdToast.show($mdToast.simple().textContent("Ha ocurrido un error al guardar las reglas."));
			})
		}, function() {
			// Cancelar
		});
	}


	this.testRule = function(ev){
		var _self = this;
		
		$mdDialog.show({
			controller: 'testRule',
			controllerAs: 'TR',
			templateUrl: '/templates/home/testRule.dialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true
		})
		.then(function(answer) {}, function() {});
	}


	this.refreshRules();


}]);
app.controller('testRule', ['$http', '$mdDialog', function($http, $mdDialog) {
	var _self = this;

	this.rule = {};

	$http.get('/api/rules/new')
		.then(function(response) {
			_self.rule = response.data
		})
		.catch(function(error) {
			$mdToast.show($mdToast.simple().textContent("Ha ocurrido un error al cargar la regla."));
		});


	this.result = {
		result: {
			tipoImpuesto: 'X3',
			nombreImpuesto: 'Ajuste de Movimientos',
			tipoISV: 'H1',
		}
	}


	this.hide = function(){
		$mdDialog.hide();
	};


	this.callEndpoint = function(){
		var _self = this;

		this.requestInProgress = true;
		console.log(this.rule);

		// Llamado a EndPoint
		$mdDialog.hide();
		$mdDialog.show({
			controller: DialogController,
			templateUrl: '/templates/home/testRuleResult.dialog.html',
			parent: angular.element(document.body),
			clickOutsideToClose: true
		})
		.then(function() {}, function() {});

	};


	this.requestInProgress = false;


	function DialogController($scope, $mdDialog) {
		$scope.result = _self;

		$scope.hide = function() {
			$mdDialog.hide();
		};

	}


}]);