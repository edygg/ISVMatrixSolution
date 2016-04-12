app.controller('testRule', ['$http', '$mdDialog', function($http, $mdDialog) {
	var _self = this;

	this.rule = {
		columns: {
			tipoEmpresa: '',
			tamanoProducto: '',
			periodoFical: '',
			consulta1: ''
		}
	};


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

		console.log(_self);

		$scope.result = _self;

		$scope.hide = function() {
			$mdDialog.hide();
		};

	}


}]);