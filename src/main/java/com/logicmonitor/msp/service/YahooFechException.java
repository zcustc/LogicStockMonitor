package com.logicmonitor.msp.service;

/**
 * RuntimeException implementation class to catch YahooFechException
 */

public class YahooFechException extends RuntimeException{
	private static final long serialVersionUID = 1L;

	  public YahooFechException()  {
	      // TODO Auto-generated constructor stub
	  }

	  public YahooFechException(String message) {
	      super(message);
	      // TODO Auto-generated constructor stub
	  }

	  public YahooFechException(Throwable cause) {
	      super(cause);
	      // TODO Auto-generated constructor stub
	  }

	  public YahooFechException(String message, Throwable cause) {
	      super(message, cause);
	      // TODO Auto-generated constructor stub
	  }
}
