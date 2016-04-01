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
        $scope.updateBoxChart = updateBoxChart;
        $scope.updateBarChart = updateBarChart;
        // $scope.resetChartButton = resetChartButton;
        $scope.changeY = changeY;
        $scope.changeChart = changeChart;
        $scope.changeOrder = changeOrder;


        var xAxis;
        var yAxis;
        var visualization;
        // var margin = { top: 30, right: 20, bottom: 30, left: 50 };
        // width = 600 - margin.left - margin.right;
        // height = 270 - margin.top - margin.bottom;
        // var x = d3.time.scale().range([0, width]);
        // // var y = d3.scale.linear().range([height, 0]);
        // var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(100);
        // var yAxis = d3.svg.axis().scale(y).orient("left").ticks(500);

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
                    // console.log($scope.history_price);
                    // recent.sort(function(a, b) {
                    //     return new Date(a.start).getTime() - new Date(b.start).getTime()
                    // });
                    $scope.history_price.sort(function(a, b) {
                        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                    });
                    // console.log($scope.history_price);
                    angular.forEach($scope.history_price, function(item, index) {
                        item.index = index;
                        item.index = item.index.toString();
                        // console.log(item.index);
                        // console.log(item.timestamp);
                        //  console.log(item.high);
                        //   console.log("_________________________");
                        // item.timeDisplay = item.timestamp;
                        // item.timestamp = Date.parse(new Date(item.timestamp));
                        // var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                        // var date = new Date(item.timestamp);
                        // item.timestamp = date.toLocaleString('en-US', options);
                        // console.log(item.timestamp);
                    });
                    $scope.updateChart();
                },
                function(res) {
                    $scope.history_price = [];
                    console.log("Returned info error.");
                }
            );
        };

        function changeY() {
            // $scope.resetChartButton();
            $scope.updateChart();
        }

        function changeChart() {
            // $scope.resetChartButton();
            $scope.updateChart();
        }

        function changeOrder() {
            // $scope.resetChartButton();
            $scope.updateChart();
        }

        // function resetChartButton() {
        //     var chartType = document.getElementById('chartType0').value;
        //     if (chartType == 'Bar Chart') {
        //         $("#sortSelect0").show();
        //         $("#label_sortSelect0").show();
        //     } else {
        //         $("#sortSelect0").hide();
        //         $("#label_sortSelect0").hide();
        //     }
        // }
        // };
        // $scope.StockView = {
        function updateChart() {
            var chartType = document.getElementById('chartType0').value;
            console.log("chartType");
            if (chartType == "Bar Chart") {
                updateBarChart();
            } else if (chartType == "Line Chart") {
                updateLineChart();
                // console.log(updateLineChart);
            } else if (chartType == "Box Chart") {
                updateBoxChart();
            }
        }

        function updateBarChart() {
            // var sort = document.getElementById('sortSelect0').value;
            // var sortType = 0;
            // if (sort == 'Descending Order') {
            //     sortType = 'desc';
            // } else {
            //     sortType = 'asc';
            // }
            // var sortValue = false;
            // if (sort != 'Original Order') {
            //     sortValue = "price";
            // } else {
            //     sortValue = "timestamp";
            // }
            // console.log(visualization);
            if (typeof visualization !== "undefined") {
                var svg = document.getElementById("StockView");
                var svgParent = svg.parentNode;
                svgParent.removeChild(svg);
                svg = document.createElement("StockView"); // Create a <li> node
                svg.setAttribute("id", "StockView");
                svgParent.appendChild(svg);
            }
                        console.log($scope.history_price);
                //         .order({
                //     sort: sortType,
                //     value: sortValue
                // })

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
                .tooltip(["high", "low", "open", "close",  "timestamp","price"])
                .draw()
        }



        function updateLineChart() {

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
                .type("line") // visualization type
                .id("symbol") // key for which our data is unique on
                .y("high") // key to use for y-axis
                .x("timestamp") // key to use for x-axis
                .time({ "value": "timestamp" })
                .tooltip(["high", "low", "open", "close", "price", "timestamp"])
                .draw()
        }

        function updateBoxChart() {
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
                .type("box") // visualization type
                .id("symbol") // key for which our data is unique on
                .y("high") // key to use for y-axis
                .x({
                    "value": "index",
                    "label": "Date"
                }) // key to use for x-axis
                .tooltip(["high", "low", "open", "close", "price", "timestamp"])
                .time({ "value": "timestamp" })
                .ui([{
                    "label": "Visualization Type",
                    "method": "type",
                    "value": "box"
                }])
                .draw()
        }

    }]);

})();
