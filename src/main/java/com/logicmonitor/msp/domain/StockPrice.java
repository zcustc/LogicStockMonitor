package com.logicmonitor.msp.domain;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class StockPrice{
	//	sample input
	//	symbol: INTC
	//	name: Intel Corporation
	//	currency: USD
	//	stockExchange: NasdaqNM
	//	quote: Ask: 32.25, Bid: 32.24, Price: 32.2485, Prev close: 33.62
	//	stats: EPS: 2.019, PE: 16.65, PEG: 1.74
	//	dividend: Pay date: Mon Dec 01 06:00:00 CET 2014, Ex date: Tue Aug 05 06:00:00 CEST 2014, Annual yield: 2.68%
	//	history: null
	//quote
	String symbol = "";
	BigDecimal price = new BigDecimal(0);
	BigDecimal high = new BigDecimal(0);
	BigDecimal low = new BigDecimal(0);
	BigDecimal open = new BigDecimal(0);
	BigDecimal close = new BigDecimal(0);
	long volume = 0;
	//stats
	BigDecimal pe = new BigDecimal(0);
	BigDecimal eps = new BigDecimal(0);
	BigDecimal peg = new BigDecimal(0);

	Timestamp timestamp;



	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public BigDecimal getHigh() {
		return high;
	}

	public void setHigh(BigDecimal high) {
		this.high = high;
	}

	public BigDecimal getLow() {
		return low;
	}

	public void setLow(BigDecimal low) {
		this.low = low;
	}

	public void setClose(BigDecimal close) {
		this.close = close;
	}




	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public BigDecimal getOpen() {
		return open;
	}

	public void setOpen(BigDecimal open) {
		this.open = open;
	}

	public BigDecimal getClose() {
		return close;
	}

	public void setPrevClose(BigDecimal close) {
		this.close = close;
	}

	public BigDecimal getPe() {
		return pe;
	}

	public void setPe(BigDecimal pe) {
		this.pe = pe;
	}

	public BigDecimal getEps() {
		return eps;
	}

	public void setEps(BigDecimal eps) {
		this.eps = eps;
	}

	public BigDecimal getPeg() {
		return peg;
	}

	public void setPeg(BigDecimal peg) {
		this.peg = peg;
	}

	public Timestamp getTimestamp() {	
		return timestamp;
	}

	public void setTimestamp(Timestamp timestamp) {
		this.timestamp = timestamp;
	}

	public String toString() {
		return symbol + " " + price + " "+ high + " " + low + " " + open + " "+ close + " "+ volume + " "+ pe +" "+ eps + " "+ peg ;
	}
	public long getVolume() {
		return volume;
	}

	public void setVolume(long volume) {
		this.volume = volume;
	}


}



