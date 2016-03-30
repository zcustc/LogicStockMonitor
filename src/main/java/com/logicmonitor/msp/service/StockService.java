package com.logicmonitor.msp.service;

import java.util.ArrayList;
import java.util.List;

import com.logicmonitor.msp.YahooFetcher.DataFetcher;
import com.logicmonitor.msp.dao.StockDao;
import com.logicmonitor.msp.dao.impl.StockDaoJdbcImpl;
import com.logicmonitor.msp.domain.StockInfo;
import com.logicmonitor.msp.domain.StockPrice;

import yahoofinance.histquotes.HistoricalQuote;


public class StockService {
	DataFetcher fetchData;
	StockDao dao;
	List<String> strList;
	boolean FirstRun;
	public StockService() {
		//		super();
		fetchData = new DataFetcher();
		dao = new StockDaoJdbcImpl();
		strList = new ArrayList<String>();
		FirstRun = true;
	}
	//update stock price regularly 
	public void fetchAddtoDB(List<String> symbolList){
		RunnableFetchAddRealTime T1 = new RunnableFetchAddRealTime(symbolList,fetchData, dao);
		T1.start();
		RunnableFetchAddDaily T2 = new RunnableFetchAddDaily(symbolList,fetchData, dao);
		T2.start();
		RunnableFetchAddWeekly T3 = new RunnableFetchAddWeekly(symbolList,fetchData, dao);
		T3.start();
	}
	//add new stock to monitor
	public void fetchAddNewtoDB(String symbol){
		strList.add(symbol);
		RunnableFetchAddOneStockMonthLongDaily T1 = new RunnableFetchAddOneStockMonthLongDaily(symbol,fetchData, dao);
		T1.start();
		RunnableFetchAddOneStockYearLongWeekly T2 = new RunnableFetchAddOneStockYearLongWeekly(symbol,fetchData, dao);
		T2.start();
		RunnableFetchAddInfo T3 = new RunnableFetchAddInfo(symbol,fetchData, dao);
		T3.start();
		if (FirstRun == true) {
			FirstRun = false;
			this.fetchAddtoDB(strList);
		}
		//			List<StockPrice> myStockList = new ArrayList<StockPrice>();
		//			String[] list ={};
		//			List<HistoricalQuote> dailyQ = fetchData.getWeeklyDataFromYahoo(symbols, myStockList);
		//			for(HistoricalQuote dq: dailyQ) {
		//				double high = dq.getHigh();
		//			}
		//		dao.addToDBDAO();
	}


	class RunnableFetchAddOneStockYearLongWeekly implements Runnable {
		private Thread t;
		private String threadName;
		DataFetcher fetchData;
		String symbol;
		StockDao dao;
		StockPrice stockPrice;
		List<StockPrice> stockPriceList;
		public RunnableFetchAddOneStockYearLongWeekly (String symbol, DataFetcher fetchData, StockDao dao) {
			this.symbol = symbol;
			this.fetchData = fetchData;
			this.dao = dao;
			stockPriceList = new ArrayList<StockPrice>();
			threadName = "FetchAddOneStockYearLongWeekly";
//			System.out.println("Creating " +  threadName );
		}
		public void run() {
//			System.out.println("Running " +  threadName );
//			System.out.println("Thread: " + threadName + ", " );
			fetchData.getYearLongWeeklyDataFromYahoo(symbol, stockPriceList);
			for (StockPrice stockPrice : stockPriceList) {
//				System.out.println("Thread: " + threadName + ", " + stockPrice.getPrice());
				dao.addWeeklyData(stockPrice);
			}
		}

		public void start ()
		{
//			System.out.println("Starting " +  threadName );
			if (t == null)
			{
				t = new Thread (this, threadName);
				t.start ();
			}
		}

	}



	class RunnableFetchAddOneStockMonthLongDaily implements Runnable {
		private Thread t;
		private String threadName;
		DataFetcher fetchData;
		String symbol;
		StockDao dao;
		StockPrice stockPrice;
		List<StockPrice> stockPriceList;
		public RunnableFetchAddOneStockMonthLongDaily (String symbol, DataFetcher fetchData, StockDao dao) {
			this.symbol = symbol;
			this.fetchData = fetchData;
			this.dao = dao;
			stockPriceList = new ArrayList<StockPrice>();

			threadName = "FetchAddOneStockYearLongWeekly";
//			System.out.println("Creating " +  threadName );
		}
		public void run() {
//			System.out.println("Running " +  threadName );
//			System.out.println("Thread: " + threadName + ", " );
			fetchData.getMonthLongDailyDataFromYahoo(symbol, stockPriceList);
			for(StockPrice stockPrice : stockPriceList) {		
//				System.out.println("Thread: " + threadName + ", " + stockPrice.getPrice());
				dao.addDailyData(stockPrice);
			}
		}

		public void start ()
		{
//			System.out.println("Starting " +  threadName );
			if (t == null)
			{
				t = new Thread (this, threadName);
				t.start ();
			}
		}

	}	



	class RunnableFetchAddOneStockRealTime implements Runnable {
		private Thread t;
		private String threadName;
		DataFetcher fetchData;
		String symbol;
		StockDao dao;
		StockPrice stockPrice;
		public RunnableFetchAddOneStockRealTime (String symbol, DataFetcher fetchData, StockDao dao) {
			this.symbol = symbol;
			this.fetchData = fetchData;
			this.dao = dao;
			stockPrice = new StockPrice();
			threadName = "FetchAddOneStockRealTime";
//			System.out.println("Creating " +  threadName );
		}
		public void run() {
//			System.out.println("Running " +  threadName );
			int i = 0;

			while(true) {
//				System.out.println("Thread: " + threadName + ", " + i);
				fetchData.getOneRealTimeDataFromYahoo(symbol , stockPrice);
//				System.out.println("Thread: " + threadName + ", " + i + stockPrice.getPrice());
				dao.addRealTimeData(stockPrice);     
				i++;
				try {
					Thread.sleep(10000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

			//			System.out.println("Thread " +  threadName + " exiting.");
		}

		public void start ()
		{
//			System.out.println("Starting " +  threadName );
			if (t == null)
			{
				t = new Thread (this, threadName);
				t.start ();
			}
		}

	}


	class RunnableFetchAddInfo implements Runnable {
		private Thread t;
		private String threadName;
		DataFetcher fetchData;
		String symbol;
		StockDao dao;
		StockInfo stkInfo;
		public RunnableFetchAddInfo (String symbol, DataFetcher fetchData, StockDao dao) {
			this.symbol = symbol;
			this.fetchData = fetchData;
			this.dao = dao;
			stkInfo = new StockInfo ();
			threadName = "FetchAddInfo";
//			System.out.println("Creating " +  threadName );
		}
		public void run() {
//			System.out.println("Running " +  threadName );
//			System.out.println("Thread: " + threadName + ", " );
			fetchData.getStockInfoFromYahoo(symbol , stkInfo);
//			System.out.println("Thread: " + threadName + ", " + stkInfo.getStockExchange());
			dao.addStockInfo(stkInfo);
//			System.out.println("Thread " +  threadName + " exiting.");
		}

		public void start ()
		{
//			System.out.println("Starting " +  threadName );
			if (t == null)
			{
				t = new Thread (this, threadName);
				t.start ();
			}
		}

	}

	class RunnableFetchAddRealTime implements Runnable {
		private Thread t;
		private String threadName;
		DataFetcher fetchData;
		List<String> symbolList;

		StockDao dao;
		List<StockPrice> stockPriceList;
		public RunnableFetchAddRealTime (List<String> symbolList, DataFetcher fetchData, StockDao dao) {
			this.symbolList = symbolList;
			this.fetchData = fetchData;
			this.dao = dao;

			stockPriceList = new ArrayList<StockPrice> ();
			threadName = "FetchAddRealTime";
//			System.out.println("Creating " +  threadName );
		}
		public void run() {
//			System.out.println("Running " +  threadName );
			int i = 0;
			while(true) {
//				System.out.println("Thread: " + threadName + ", " + i);
				fetchData.getRealTimeDataFromYahoo(symbolList , stockPriceList);
				for (StockPrice stockPrice : stockPriceList ) {
//					System.out.println("Thread: " + threadName + ", " + i + stockPrice.getPrice());
					//dao.delRealTimeData(stockPrice.getSymbol());
					dao.addRealTimeData(stockPrice);
				}
				i++;
				try {
					Thread.sleep(2000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

			//			System.out.println("Thread " +  threadName + " exiting.");
		}

		public void start ()
		{
//			System.out.println("Starting " +  threadName );
			if (t == null)
			{
				t = new Thread (this, threadName);
				t.start ();
			}
		}

	}


	class RunnableFetchAddWeekly implements Runnable {
		private Thread t;
		private String threadName;
		DataFetcher fetchData;
		List<String> symbolList;
		StockDao dao;
		List<StockPrice> stockPriceList;
		public RunnableFetchAddWeekly (List<String> symbolList, DataFetcher fetchData, StockDao dao) {
			this.symbolList = symbolList;
			this.fetchData = fetchData;
			this.dao = dao;

			stockPriceList = new ArrayList<StockPrice> ();
			threadName = "FetchAddWeekly";
//			System.out.println("Creating " +  threadName );
		}
		public void run() {
//			System.out.println("Running " +  threadName );
			int i = 0;
			while(true) {
//				System.out.println("Thread: " + threadName + ", " + i);
				fetchData.updateWeeklyDataFromYahoo(symbolList , stockPriceList);
				for (StockPrice stockPrice : stockPriceList ) {
//					System.out.println("Thread: " + threadName + ", " + i + stockPrice.getPrice());
					//dao.delWeeklyData(stockPrice.getSymbol());
					dao.addWeeklyData(stockPrice);
				}
				
				i++;
				try {
					Thread.sleep(604800000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

			//			System.out.println("Thread " +  threadName + " exiting.");
		}

		public void start ()
		{
//			System.out.println("Starting " +  threadName );
			if (t == null)
			{
				t = new Thread (this, threadName);
				t.start ();
			}
		}

	}


	class RunnableFetchAddDaily implements Runnable {
		private Thread t;
		private String threadName;
		DataFetcher fetchData;
		List<String> symbolList;
		StockDao dao;
		List<StockPrice> stockPriceList;
		public RunnableFetchAddDaily (List<String> symbolList, DataFetcher fetchData, StockDao dao) {
			this.symbolList = symbolList;
			this.fetchData = fetchData;
			this.dao = dao;

			stockPriceList = new ArrayList<StockPrice> ();
			threadName = "FetchAddDaily";
//			System.out.println("Creating " +  threadName );
		}
		public void run() {
//			System.out.println("Running " +  threadName );
			int i = 0;
			while(true) {
//				System.out.println("Thread: " + threadName + ", " + i);
				fetchData.updateDailyDataFromYahoo(symbolList , stockPriceList);
				for (StockPrice stockPrice : stockPriceList ) {
//					System.out.println("Thread: " + threadName + ", " + i + stockPrice.getPrice());
					//dao.delDailyData(stockPrice.getSymbol());
					dao.addDailyData(stockPrice);
				}
				i++;
				try {
					Thread.sleep(86400000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
			//			System.out.println("Thread " +  threadName + " exiting.");
		}

		public void start ()
		{
//			System.out.println("Starting " +  threadName );
			if (t == null)
			{
				t = new Thread (this, threadName);
				t.start ();
			}
		}

	}

}