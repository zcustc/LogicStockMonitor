package com.logicmonitor.msp.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import javax.management.Query;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import com.logicmonitor.msp.YahooFetcher.DataFetcher;
import com.logicmonitor.msp.dao.StockDao;
import com.logicmonitor.msp.dao.impl.StockDaoJdbcImpl;
import com.logicmonitor.msp.domain.StockInfo;
import com.logicmonitor.msp.domain.StockPrice;
import com.logicmonitor.msp.service.StockService;

/**
 * Servlet implementation class OneCompanyStockInfo
 */
public class OneCompanyStockInfo extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public OneCompanyStockInfo() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		List<StockPrice> stockPriceList = new ArrayList<StockPrice>();
		int queryIdx = request.getQueryString().indexOf("=");
		String queryParameter = request.getQueryString().substring(queryIdx+1, request.getQueryString().length());
		String[] querys = queryParameter.split("_");
	System.out.println("HERE is do get");
		StockDao dao = new StockDaoJdbcImpl();
		if(querys.length > 0) {
			if(querys.length == 1) {
				System.out.println("HERE is real time");
				stockPriceList = dao.getRealTimeData(queryParameter);
				System.out.println(stockPriceList);
			} else if(querys[1].equals("Year")) {
				stockPriceList = dao.getWeeklyData(querys[2]);
			} else if(querys[1].equals("Month")) {
				stockPriceList = dao.getDailyData(querys[2]);
			}
		}
		Type listType = new TypeToken<List<StockPrice>>(){}.getType();
		response.getWriter().write(new Gson().toJson(stockPriceList, listType));
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonParser parser = new JsonParser();
		JsonObject obj = (JsonObject) parser.parse(request.getReader());				
		Gson gson = new Gson();

		if(!obj.toString().contains("add_company_symbol")){
			String jsonString = obj.getAsJsonPrimitive("data").getAsString();
			StockInfo companyInfo = gson.fromJson(jsonString, StockInfo.class);
			StockDaoJdbcImpl dao = new StockDaoJdbcImpl();
			String companySymbol = companyInfo.getSymbol();
			dao.delAllFromDBDAO(companySymbol.substring(0, companySymbol.length()));
			//			dao.delInfolFromDBDAO(companySymbol.substring(0, companySymbol.length()));
		}
		else {
			String companySymbol = obj.getAsJsonObject("data").get("add_company_symbol").getAsString();
			StockService stockService = new StockService();
			stockService.fetchAddNewtoDB(companySymbol);
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			StockDaoJdbcImpl dao = new StockDaoJdbcImpl();
			List<StockPrice> stockPriceList = new ArrayList<StockPrice>();
			stockPriceList = dao.getRealTimeData(companySymbol);
			Type listType = new TypeToken<List<StockPrice>>(){}.getType();
			response.getWriter().write(new Gson().toJson(stockPriceList, listType));
		}		

	}

}
