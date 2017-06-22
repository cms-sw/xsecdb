(function(angular) {
    'use strict';
    angular.module('staticSelect', [])
	.controller('ExampleController', ['$scope', function($scope){
		    $scope.keys = {
			searchKeys: [{'key':'------'}, {'key':'process_name'},{'key':'cross_section'},{'key':'total_uncertainty'}],
		    };
		    $scope.input_data={'selected_value':$scope.keys.searchKeys[0].key};
	
		    $scope.forceUnknownOption = function() {
			$scope.data.singleSelect = 'nonsense';
		    };
		}]);
})(window.angular);