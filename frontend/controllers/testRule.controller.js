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