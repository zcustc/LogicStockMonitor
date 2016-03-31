package com.logicmonitor.msp.dao;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
/**
 * class JdbcUtilsSingleton provide JDBC connection via singleton pattern 
 */

public final class JdbcUtilsSingleton {
	private static String url = "jdbc:mysql://localhost:8889/data?allowMultiQueries=true";
    private static String user = "root";
    private static String password = "123";

	private static JdbcUtilsSingleton instance = null;

	private JdbcUtilsSingleton() {
	}

	// creat one and only one JdbcUtilsSingleton instance
	public static JdbcUtilsSingleton getInstance() {
		if (instance == null) {
			synchronized (JdbcUtilsSingleton.class) {
				if (instance == null) {
					instance = new JdbcUtilsSingleton();
				}
			}
		}
		return instance;
	}

	static {
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			throw new ExceptionInInitializerError(e);
		}
	}

	public Connection getConnection() throws SQLException {
		return DriverManager.getConnection(url, user, password);
	}

	// close ResultSet, Statement, Connection 
	public void free(ResultSet rs, Statement st, Connection conn) {
		try {
			if (rs != null)
				rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if (st != null)
					st.close();
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				if (conn != null)
					try {
						conn.close();
					} catch (SQLException e) {
						e.printStackTrace();
					}
			}
		}
	}
}
