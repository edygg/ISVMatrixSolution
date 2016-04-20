app.controller('testRule', ['$http', '$mdDialog', function($http, $mdDialog) {
	var _self = this;

	this.rule = {};
	this.result = {};

	$http.get('/api/rules/new', {timeout: 30000})
		.then(function(response) {
			_self.rule = response.data
		}, function(error) {
			$mdToast.show($mdToast.simple().textContent("Ha ocurrido un error al cargar la regla."));
		});


	this.hide = function(){
		$mdDialog.hide();
	};


	this.callEndpoint = function(){
		this.requestInProgress = true;
		$http.post('/api/rules/get_result', _self.rule.columns, {timeout: 30000})
		.then(function(response) {
			_self.result = response.data;
			$mdDialog.hide();
			$mdDialog.show({
				controller: DialogController,
				templateUrl: '/templates/home/testRuleResult.dialog.html',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			}).then(function() {}, function() {});
			this.requestInProgress = false;
		}, function(error) {
			$mdToast.show($mdToast.simple().textContent("Ha ocurrido un error al cargar la regla."));
		});
	};


	function DialogController($scope, $mdDialog) {
		$scope.result = _self;

		$scope.empty = function(){
			return jQuery.isEmptyObject(_self.result);
		}

		$scope.hide = function() {
			$mdDialog.hide();
		};
	}


}]);