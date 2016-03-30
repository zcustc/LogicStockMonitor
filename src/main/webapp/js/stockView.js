//single movie view
//y axis: price//rating, record Num
//x axis: timestamp//sex, age and state, occupation
//year

//range : realtimeData, dailyData, weekyData
//stockInfo: symbol, timestamp, price, high


var StockView = {
    //store a specific movie's rating data
    price: null,
    selectedData: null,

    updateRange: function(rangeType) {
        this.price = [];
        if (rangeType == "realtimeData") {
            //get weekyData
        } else if (rangeType == "dailyData") {
            //get weekyData
        } else if (rangeType == "weekyData") {
            //get weekyData
        }
        this.updateChart();
    },

    updateChart: function() {
        var chartType = document.getElementById('chartType0').value;
        if (chartType == "Bar Chart") {
            this.updateBarChart();
        } else if (chartType == "Line Chart") {
            this.updateLineChart();
        }
    },
    updateBarChart: function() {
        var yAxis = document.getElementById('yAxisSelect0').value;
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
        var visualization = d3plus.viz()
            .container("#StockView")
            .data(this.selectedData)
            .type("bar")
            .id("timestamp")
            .x("timestamp")
            .y(yAxis)
            // .aggs({"price": "mean"})
            .order({
                sort: sortType,
                value: sortValue
            })
            .tooltip(["timestamp", "price"])
            .time("timestamp")
            .draw();
    },



    updateLineChart: function() {
        // var xAxis = document.getElementById('xAxisSelect0').value;
        // var yAxis = document.getElementById('yAxisSelect0').value;
        var visualization = d3plus.viz()
            .container("#StockView")
            .data(this.selectedData)
            .type("line")
            .id("timestamp")
            .x("timestamp")
            .y(yAxis)
            .text("time")
            // .aggs({"price": "mean"})
            .tooltip(["timestamp", "price"])
            .time("timestamp")
            .draw();
    }
    
};
