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
        $scope.updateLineChart = updateLineChart;
        $scope.updateBarChart = updateBarChart;
        $scope.resetChartButton = resetChartButton;
        $scope.changeY = changeY;
        $scope.changeChart = changeChart;
        $scope.changeOrder = changeOrder;
        var yAxis;
        var xAxis;
        $scope.history_price = [];
        // $scope.timeRangeArr = [];
        // $scope.monthHistoryPriceArr = [];
        // $scope.yearHistoryPriceArr = [];
        // $scope.monthHistoryPriceHighArr = [];
        // $scope.yearHistoryPriceHighArr = [];

        init();


        function init() {
            setInterval(updatePrice, 10000);
        }

        // update stock price in stock table page
        function updatePrice() {

            angular.forEach($scope.stockArr, function(item, index) {

                getPriceBySymbol(item.symbol).then(function() {

                    item.high = $scope.oneStock.high;
                    item.close = $scope.oneStock.close;



                });

            });
        }

        // get stock price by stock's symbol froms server
        function getPriceBySymbol(stockSymbol) {
            var deferred = $q.defer();

            // console.log("getting price for");
            // console.log(stockSymbol);

            if (stockSymbol) {
                $http.get('YahooRealtimeData', { responseType: 'json', params: { symbol: stockSymbol } }).then(
                    function(res) {
                        // console.log("Fetch price:");
                        // console.log(res.data);
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

            // console.log("new stock's symbol");
            console.log(stockSymbol);
            if (stockSymbol) {
                $http.get('getOneInfo', { responseType: 'json', params: { symbol: stockSymbol } }).then(
                    function(res) {
                        // console.log("Fetch company info:");
                        // console.log(res.data);
                        angular.merge($scope.oneStock, res.data);
                        deferred.resolve();

                    },
                    function(err) {
                        console.log("Fetch company info failure");
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
                    console.log(res);
                    // console.log("new stock has been added into database");
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
            $log.log("addStock");
            if (!(objectWithPropExists($scope.stockArr,'symbol', stockSymbol))) {

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
            // console.log(" deleteStock.");
            // console.log($scope.stockArr);
            $http.get('delOneStock', { params: { symbol: stockSymbol } }).then(
                function(res) {

                     // console.log("return from service");
                    removeByKey($scope.stockArr, {
                        key: 'symbol',
                        value: stockSymbol
                    });
                    // console.log("return from removeByKey.");
                    // console.log($scope.stockArr);
                },
                function(res) {
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
                    // $scope.isRealTime = true;
                    $scope.yahoo_company_price = res.data;
                    // console.log($scope.yahoo_company_price.price);
                },
                function(res) {
                    // $scope.isRealTime = false;
                    console.log("Returned info error.");
                }
            );
        };

        $scope.getPeriodCompanyStockInfo = function(symbolTimeRange) {
            $http.get('GetOneHistoryPrice', { responseType: 'json', params: { symbol: symbolTimeRange } }).then(
                function(res) {
                    $scope.history_price = res.data;
                    console.log($scope.history_price);
                    $scope.updateChart();

                },
                function(res) {
                    $scope.history_price = [];
                    console.log("Returned info error.");
                }
            );
        };

        function changeY() {
            $scope.resetChartButton();
            $scope.updateChart();
        }

        function changeChart() {
            $scope.resetChartButton();
            $scope.updateChart();
        }

        function changeOrder() {
            $scope.resetChartButton();
            $scope.updateChart();
        }

        function resetChartButton() {
            var chartType = document.getElementById('chartType0').value;
            if (chartType == 'Bar Chart') {
                $("#sortSelect0").show();
                $("#label_sortSelect0").show();
            } else {
                $("#sortSelect0").hide();
                $("#label_sortSelect0").hide();
            }
        }
        // };
        // $scope.StockView = {
        function updateChart() {
            console.log("updaye chart");
            var chartType = document.getElementById('chartType0').value;
            console.log(chartType);
            console.log("chartType");
            if (chartType == "Bar Chart") {
                updateBarChart();
            } else if (chartType == "Line Chart") {
                updateLineChart();
                // console.log(updateLineChart);
            }
        }

        function updateBarChart() {
            console.log("updateBarChart");

            if (document.getElementById('yAxisSelect0').value.indexOf("Price") != -1) {
                yAxis = "high";
            } else {
                yAxis = "price";
            }
            var sort = document.getElementById('sortSelect0').value;
            var sortType = 0;
            if (sort == 'Descending Order') {
                sortType = 'desc';
            } else {
                sortType = 'asc';
            }
            var sortValue = false;
            if (sort != 'Original Order') {
                sortValue = "price";
            } else {
                sortValue = "timestamp";
            }
            xAxis = Date.parse("timestamp")
            console.log(xAxis);
            var visualization = d3plus.viz()
                .container("#StockView")
                .data($scope.history_price)
                .type("bar")
                .id("name")
                .x(xAxis)
                .y(yAxis)
                .text("name")
                .order({
                    sort: sortType,
                    value: sortValue
                })
                .tooltip(["timestamp", "price", ])
                // .time("timestamp")
                .draw();
        }



        function updateLineChart() {
            console.log("updateLineChart");
            console.log("timestamp");
            xAxis = Date.parse("timestamp");
            console.log(xAxis);

            if (document.getElementById('yAxisSelect0').value.indexOf("Price") != -1) {
                yAxis = "high";
            } else {
                yAxis = "price";
            }
            var visualization = d3plus.viz()
                .container("#StockView")
                .data($scope.history_price)
                .type("line")
                .id("symbol")
                .x(xAxis)
                .y(yAxis)
                .text("name")
                .tooltip(["timestamp", "price"])
                // .time("timestamp")
                .draw();
        }

        // };

    }]);

})();
