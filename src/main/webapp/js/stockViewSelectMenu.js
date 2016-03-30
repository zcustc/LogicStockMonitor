
//timestamp, StockID,price 

var StockViewSelectMenu = {
    changeRange: function(){
        this.resetChart();

        var rangeType = document.getElementById('rangeSelect0').value;

        if(rangeType == 'RealTime Data'){
            StockView.updateRange(realtimeData);
        }
        else if (rangeType == 'Monthly Data'){
            StockView.updateRange(dailyData);
        } else if (rangeType == 'Yearly Data'){
            StockView.updateRange(weeklyData);
        }
    },

    dataInit: function(){
        if(typeof stockInfo === 'undefined' || stockInfo.length == 0){
            alert("Invalid dataset!");
        }
        this.changeRange();
    },
    dataAdd: function(){
        var stockAdd = document.getElementById('stockAdd').value;
        
        //update view and retive data

        this.changeRange();
    },
    dataDel: function(){
        var stockDel = document.getElementById('stockDel').value;
        
        //update view and retive data
        
        this.changeRange();
    },

    changeY: function(){
        this.resetChart();
        StockView.updateChart();
    },

    changeChart : function(){
        this.resetChart();
        StockView.updateChart();
    },

    changeOrder : function(){
        this.resetChart();
        StockView.updateChart();
    },

    resetChart :function(){
        var chartType = document.getElementById('chartType0').value;

        if(chartType == 'Bar Chart' ){
            $("#sortSelect0").show();
            $("#label_sortSelect0").show();
        }
        else{
            $("#sortSelect0").hide();
            $("#label_sortSelect0").hide();
        }
    }
};


