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
        $scope.alert = false;
        $scope.marketClose = false;
        $scope.predicate = 'id';

        var visualization;

        $scope.history_price = [];

        init();

        $scope.order = function(x) {
            $scope.myOrderBy = x;
        }

        //set update frequency
        // function init() {
        //     setInterval(updatePrice, 5000);
        // }
        function init() {
            var d = new Date();
            var n = d.getDay();
            var h = d.getHours();
            if (n == 6 || n == 7 || h > 13 || h < 6) {
                updatePrice();
                $scope.marketClose = true;
                // console.log("Market is closed!");
            } else {
                $scope.marketClose = false;
                setInterval(updatePrice, 5000);
            }

        }

        // update stock price in stock table page
        function updatePrice() {
            angular.forEach($scope.stockArr, function(item, index) {
                console.log("updating price");
                getPriceBySymbol(item.symbol).then(function() {
                    item.high = $scope.oneStock.high;
                    item.low = $scope.oneStock.low;
                    item.open = $scope.oneStock.open;
                    item.close = $scope.oneStock.close;
                    item.price = $scope.oneStock.price;
                    item.volume = $scope.oneStock.volume;
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
                        // console.log("update price to front");
                        // console.log($scope.stockArr);
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


        //check if the stock already subscribed 
        function objectWithPropExists(array1, propName, propVal) {
            for (var i = 0, k = array1.length; i < k; i++) {
                if (array1[i][propName] === propVal) return true;
            }
            return false;
        }


        // add new stock in stock table page
        function addStock(stockSymbol) {
            if (!(objectWithPropExists($scope.stockArr, 'symbol', stockSymbol))) {
                $scope.alert = false;
                addStockDB(stockSymbol).then(function() {
                    getInfoBySymbol(stockSymbol).then(function() {
                        getPriceBySymbol(stockSymbol).then(function() {
                            $scope.stockArr.push($scope.oneStock);
                            $scope.oneStock = {};
                            $scope.getPeriodCompanyStockInfo('A_Week_' + stockSymbol);
                            // console.log($scope.stockArr);
                        });
                    });
                });

            } else {
                $scope.alert = true;
            }
        }

        //remove one stock from page
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

        //delete one stock form db
        function deleteStock(stockSymbol) {
            removeByKey($scope.stockArr, {
                key: 'symbol',
                value: stockSymbol
            });
            $http.get('delOneStock', { params: { symbol: stockSymbol } }).then(
                function(res) {
                    console.log("delete stock from db success!");
                },
                function(err) {
                    console.log("Returned info error.");
                }
            );
        }


        $scope.getPeriodCompanyStockInfo = function(symbolTimeRange) {
            $http.get('GetOneHistoryPrice', { responseType: 'json', params: { symbol: symbolTimeRange } }).then(
                function(res) {
                    $scope.history_price = res.data;
                    $scope.history_price.sort(function(a, b) {
                        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                    });
                    angular.forEach($scope.history_price, function(item, index) {
                        item.index = index.toString();
                    });
                    $scope.updateChart();
                },
                function(err) {
                    $scope.history_price = [];
                    console.log("Returned info error.");
                }
            );
        };


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
                .margin("10px 20px")
                .messages("Loading Data...")
                .id(["index", "symbol"]) // key for which our data is unique on
                .y("high") // key to use for y-axis
                .x({
                    value: "timestamp",
                    label: "Date"
                }) //// key to use for x-axis
                .time("timestamp") //{ "format": "%Y-%m-%d", "value": "timestamp" }
                .tooltip(["high", "low", "open", "close", "timestamp", "price"])
                .ui([{
                    label: "Visualization Type",
                    method: "type",
                    value: ["bar", "scatter", "line"]
                }])
                .height(500)
                .color("high")
                .format({
                    "text": function(text, params) {
                        if (text === "price") {
                            return "price";
                        } else {
                            return d3plus.string.title(text, params);
                        }

                    },
                    "number": function(number, params) {
                        var formatted = d3plus.number.format(number, params);
                        if (params.key === "price" || params.key === "high" || params.key === "low" || params.key === "open" || params.key === "close") {
                            return "$" + formatted + " USD";
                        } else {
                            return formatted;
                        }

                    }
                })
                .title("Logic Stock Monitor")
                .title({
                    "sub": "realtime stock monitor system"
                })
                .footer({
                    "link": "https://www.linkedin.com/in/miajia",
                    "value": "Click here to find me"
                })
                .draw()
        }

    }]);

})();
