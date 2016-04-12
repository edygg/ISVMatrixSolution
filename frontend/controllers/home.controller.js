app.controller('HomeController', ['$http', '$mdDialog', function($http, $mdDialog) {


	this.rules = [{
		columns: {
			clasificacionTributaria: '1',
			contribuyente: 'CONTRIBUYENTE',
			tipoPersona: 'NATURAL',
			tipoEmpresa: 'PEQUEÑA EMPRESA',
			tipoImpuesto: 'GRAVADO',
			ubicacion: 'LOCAL',
			tipoArticulo: 'BIEN TANGIBLE',
			tipoInventario: ''
		},
		result: {
			renta: 'N/A',
			retencionIVA: 'B5'
		}
	},{
		columns: {
			clasificacionTributaria: '3',
			contribuyente: 'CONTRIBUYENTE',
			tipoPersona: 'NATURAL',
			tipoEmpresa: 'GRAN EMPRESA',
			tipoImpuesto: 'GRAVADO',
			ubicacion: 'LOCAL',
			tipoArticulo: 'SERVICIO',
			tipoInventario: 'ALQUILER/ARRENDAMIENTO'
		},
		result: {
			renta: 'N/A',
			retencionIVA: 'B5'
		}
	},{
		columns: {
			clasificacionTributaria: '7',
			contribuyente: 'CONTRIBUYENTE',
			tipoPersona: 'JURIDICO',
			tipoEmpresa: 'PEQUEÑA EMPRESA',
			tipoImpuesto: 'GRAVADO',
			ubicacion: 'LOCAL',
			tipoArticulo: 'DONACIÓN',
			tipoInventario: ''
		},
		result: {
			renta: 'N/A',
			retencionIVA: 'N/A'
		}
	},{
		columns: {
			clasificacionTributaria: '9',
			contribuyente: 'CONTRIBUYENTE',
			tipoPersona: 'JURIDICO',
			tipoEmpresa: 'GRAN EMPRESA',
			tipoImpuesto: 'GRAVADO',
			ubicacion: 'LOCAL',
			tipoArticulo: 'BIEN INTANGIBLE',
			tipoInventario: ''
		},
		result: {
			renta: 'R4',
			retencionIVA: 'N/A'
		}
	},{
		columns: {
			clasificacionTributaria: '10',
			contribuyente: 'NO CONTRIBUYENTE',
			tipoPersona: 'NATURAL',
			tipoEmpresa: 'EXCLUIDO',
			tipoImpuesto: 'N/A',
			ubicacion: 'NO DOMICILIADO',
			tipoArticulo: 'SERVICIO',
			tipoInventario: 'ALQUILER/ARRENDAMIENTO'
		},
		result: {
			renta: 'R2',
			retencionIVA: 'N/A'
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
			console.log("Publicar Reglas...");
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


}]);