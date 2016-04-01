(function() {

    'use strict';

    var app = angular.module("StockMonitor", []);
    app.controller("myController", ['$scope', '$http', '$location', '$q', '$log', function($scope, $http, $location, $q, $log) {

        var vm = this;
        $scope.stockArr = [];
        $scope.newSymbol = '';
        $scope.oneStock = {};
        $scope.addStock = addStock;
        $scope.deleteStock = deleteStock;
        $scope.updateChart = updateChart;

        var visualization;

        $scope.history_price = [];

        init();


        function init() {
            setInterval(updatePrice, 10000);
        }

        // update stock price in stock table page
        function updatePrice() {

            angular.forEach($scope.stockArr, function(item, index) {

                getPriceBySymbol(item.symbol).then(function() {
                    item.high = $scope.oneStock.high;
                    item.low = $scope.oneStock.low;
                    item.open = $scope.oneStock.open;
                    item.close = $scope.oneStock.close;
                    item.price = $scope.oneStock.price;
                });

            });
        }

        // get stock price by stock's symbol froms server
        function getPriceBySymbol(stockSymbol) {
            var deferred = $q.defer();
            if (stockSymbol) {
                $http.get('YahooRealtimeData', { responseType: 'json', params: { symbol: stockSymbol } }).then(
                    function(res) {
                        angular.merge($scope.oneStock, res.data);
                        deferred.resolve();

                    },
                    function(err) {
                        console.log("Fetch price failure");
                        deferred.reject();
                    }
                );
            }
            return deferred.promise;
        }


        // get stock info by stock's symbol from server
        function getInfoBySymbol(stockSymbol) {
            var deferred = $q.defer();
            if (stockSymbol) {
                $http.get('getOneInfo', { responseType: 'json', params: { symbol: stockSymbol } }).then(
                    function(res) {
                        angular.merge($scope.oneStock, res.data);
                        deferred.resolve();

                    },
                    function(err) {
                        deferred.reject();
                    }
                );

            }
            return deferred.promise;

        }



        // add new stock entry in database
        function addStockDB(stockSymbol) {

            var deferred = $q.defer();
            $http.get('addOneStockToService', { params: { symbol: stockSymbol } }).then(
                function(res) {
                    deferred.resolve();
                },
                function(err) {
                    console.log("add company failure");
                    deferred.reject();
                }
            );

            return deferred.promise;

        }



        function objectWithPropExists(array1, propName, propVal) {
            for (var i = 0, k = array1.length; i < k; i++) {
                if (array1[i][propName] === propVal) return true;
            }
            return false;
        }


        // add new stock in stock table page
        function addStock(stockSymbol) {
            if (!(objectWithPropExists($scope.stockArr, 'symbol', stockSymbol))) {

                addStockDB(stockSymbol).then(function() {
                    getInfoBySymbol(stockSymbol).then(function() {
                        getPriceBySymbol(stockSymbol).then(function() {
                            $scope.stockArr.push($scope.oneStock);
                            $scope.oneStock = {};
                        });
                    });
                });

            } else {
                window.alert("You aleary subscribed to this company, how about try something else :P");
            }
        }

        function removeByKey(array, params) {
            array.some(function(item, index) {
                if (array[index][params.key] === params.value) {
                    // found it!
                    array.splice(index, 1);
                    return true; // stops the loop
                }
                return false;
            });
            return array;
        }

        function deleteStock(stockSymbol) {
            console.log(" deleteStock.");
            // console.log($scope.stockArr);
            $http.get('delOneStock', { params: { symbol: stockSymbol } }).then(
                function(res) {

                    removeByKey($scope.stockArr, {
                        key: 'symbol',
                        value: stockSymbol
                    });
                },
                function(err) {
                    console.log("Returned info error.");
                }
            );
        }


        var intervalTimer;


        $scope.getOneRealtimeCompanyStock = function(symbol) {
            intervalTimer = setInterval(sendYahooRequest(symbol), 10000);
        };
        var sendYahooRequest = function(symbol) {

            $http.get('YahooRealtimeData', { responseType: 'json', params: { symbol: symbol } }).then(
                function(res) {
                    $scope.yahoo_company_price = res.data;
                },
                function(res) {
                    console.log("Returned info error.");
                }
            );
        };

        $scope.getPeriodCompanyStockInfo = function(symbolTimeRange) {
            $http.get('GetOneHistoryPrice', { responseType: 'json', params: { symbol: symbolTimeRange } }).then(
                function(res) {
                    $scope.history_price = res.data;
                    $scope.history_price.sort(function(a, b) {
                        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                    });
                    angular.forEach($scope.history_price, function(item, index) {
                        item.index = index;
                        item.index = item.index.toString();
                    });
                    $scope.updateChart();
                },
                function(err) {
                    $scope.history_price = [];
                    console.log("Returned info error.");
                }
            );
        };

        function changeY() {
            $scope.updateChart();
        }


        function updateChart() {
            if (typeof visualization !== "undefined") {
                var svg = document.getElementById("StockView");
                var svgParent = svg.parentNode;
                svgParent.removeChild(svg);
                svg = document.createElement("StockView"); // Create a <li> node
                svg.setAttribute("id", "StockView");
                svgParent.appendChild(svg);
            }
            visualization = d3plus.viz()
                .container("#StockView")
                .data($scope.history_price)
                .type("bar")
                .id("index") // key for which our data is unique on
                .y("high") // key to use for y-axis
                .x({
                    value: "timestamp",
                    label: "Date"
                }) //// key to use for x-axis
                .time({ "value": "timestamp" })
                .tooltip(["high", "low", "open", "close", "timestamp", "price"])
                .ui([{
                    label: "Visualization Type",
                    method: "type",
                    value: ["bar", "scatter", "line"]
                }])
                .color("high")
                .draw()

        }

    }]);

})();
