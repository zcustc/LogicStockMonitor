package com.logicmonitor.msp.dao;

public class DaoException extends RuntimeException {

  /**
   * RuntimeException implementation class to catch DaoException
   */
  private static final long serialVersionUID = 1L;

  public DaoException() {
      // TODO Auto-generated constructor stub
  }

  public DaoException(String message) {
      super(message);
      // TODO Auto-generated constructor stub
  }

  public DaoException(Throwable cause) {
      super(cause);
      // TODO Auto-generated constructor stub
  }

  public DaoException(String message, Throwable cause) {
      super(message, cause);
      // TODO Auto-generated constructor stub
  }

}