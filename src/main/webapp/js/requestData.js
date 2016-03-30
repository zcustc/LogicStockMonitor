'use strict';

//stockInfo: symbol, timestamp, price, high

//var stockInfo = [];
var app = angular.module("StockMonitor", []);
app.controller("myController", ['$scope', '$http', '$location', function($scope, $http, $location){
	
	var intervalTimer;
	
	$scope.stock_companies;
	$scope.isRealTime = false;
	
	$scope.getCompaniesInfo = function() {
		$http.get('AllCompaniesInfo', {responseType: 'json'}).then(
			function(res) {
				$scope.stock_companies = res.data;
				console.log("success request.");
			},
			function(res) {
				console.log("Returned info error.");
			}
		);
		
	};
	
	
	$scope.company_info;
	$scope.history_price;
	
	$scope.getRealtimeCompanyStockInfo = function(symbol) {
		intervalTimer = setInterval(function(){ sendRequest(symbol) }, 998);
	}
	var sendRequest = function(symbol){

		$http.get('OneCompanyStockInfo', {responseType: 'json', params: {symbol: symbol}}).then(
			function(res) {
				$scope.isRealTime = true;
				$scope.company_info = res.data;
				for(var i=0; i<$scope.stock_companies.length; i++) {
					if($scope.stock_companies[i].symbol == symbol){
						$scope.company_info.concat($scope.stock_companies[i]);
						break;
					}
				}
			},
			function(res) {
				$scope.isRealTime = false;
				$scope.company_info = [];
				console.log("Returned info error.");
			}
		);
	}
	
	$scope.getPeriodCompanyStockInfo = function(symbol){
		clearInterval(intervalTimer);
		$http.get('OneCompanyStockInfo', {responseType: 'json', params: {symbol: symbol}}).then(
			function(res) {
				$scope.isRealTime = false;
				$scope.history_price = res.data;
			},
			function(res) {
				$scope.history_price = [];
				console.log("Returned info error.");
			}
		);
	}
	
	$scope.delete_status = false;
	
	$scope.deleteCompany = function(CompanyInfo){
		$http.post('OneCompanyStockInfo', {responseType: 'json', data: JSON.stringify(CompanyInfo) }).then(
			function(res) {
				$scope.delete_status = true;
			},
			function(res) {
				$scope.delete_status = false;
				console.log("Returned info error.");
			}
		);
		$scope.getCompaniesInfo();
	}
	
	$scope.add_status = false;
	$scope.addCompany = function(CompanyInfo){
		$http.post('OneCompanyStockInfo', {responseType: 'json', data: {add_company_symbol: $scope.addCompanySymbol} }).then(
			function(res) {
				$scope.history_price = res.data;
				$scope.delete_status = true;
			},
			function(res) {
				$scope.delete_status = false;
				console.log("Returned info error.");
			}
		);
	$scope.getCompaniesInfo();
	}
}]);
