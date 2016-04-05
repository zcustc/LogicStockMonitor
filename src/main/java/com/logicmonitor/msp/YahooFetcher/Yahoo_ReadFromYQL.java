package com.logicmonitor.msp.YahooFetcher;

// requires JDOM API: http://www.jdom.org/
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Timestamp;
import java.util.Iterator;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
//import org.w3c.dom.Document;
//import org.w3c.dom.Element;
//import org.w3c.dom.Node;
//import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.logicmonitor.msp.domain.StockPrice;

// inspired by http://cynober.developpez.com/tutoriel/java/xml/jdom/#LIII-A
public class Yahoo_ReadFromYQL {

	public static void main(String[] args) throws IOException {
			StockPrice ms = null;
			//
			// 1. Retrieve the XML file
			//
			String symbol = "GOOG";
			String startDate = "2014-04-01";
			String endDate = "2014-04-15";
			String prefix = "http://query.yahooapis.com/v1/public/yql?q=";
			String query = "select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22" +symbol + "%22%20and%20startDate%20%3D%20%22" + startDate +"%22%20and%20endDate%20%3D%20%22" + endDate + "%22";
			//			String query = "select * from yahoo.finance.historicaldata where symbol = \"^GOOG\" and startDate = \"2014-04-01\" and endDate = \"2014-04-15\"";
			String suffix = "&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
			String urlName = prefix + query + suffix;
			//			String urlName = prefix + query.replaceAll(" ", "%20") + suffix;
			URL url = new URL(urlName);
			URLConnection urlConn = url.openConnection();
			InputStreamReader inputStreamReader = new InputStreamReader(urlConn.getInputStream());
			BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
			final StringBuffer buffer = new StringBuffer();
			String line;
			while ((line = bufferedReader.readLine()) != null) {
				buffer.append(line);
			}
			bufferedReader.close();
			inputStreamReader.close();
			//			URL url = new URL(urlName);
			//			URLConnection urlCon = url.openConnection();
			//			InputStream inStrm = urlCon.getInputStream();

			//
			// 2. Parse XML file
			//
			try {
				StockPrice sp = new StockPrice();
				SAXBuilder sxb = new SAXBuilder();
				Document document = sxb.build(new ByteArrayInputStream(buffer.toString().getBytes()));
				Element query0 = document.getRootElement();
				Element results = query0.getChild("results");
				List quotes = results.getChildren();
				Iterator i = quotes.iterator();
				while (i.hasNext()) {
				    Element quote = (Element) i.next();
				    System.out.print(" "+quote.getChild("Date").getText()); 
				    System.out.print(" "+quote.getChild("Open").getText()); 
				    System.out.print(" "+quote.getChild("High").getText()); 
				    System.out.print(" "+quote.getChild("Low").getText()); 
				    System.out.print(" "+quote.getChild("Close").getText()); 
				    System.out.print(" "+quote.getChild("Volume").getText()); 
				    System.out.println(" "+quote.getChild("Adj_Close").getText()); 
				}
			} catch (JDOMException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	}
}

//			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//			DocumentBuilder builder;
//			try {
//				builder = factory.newDocumentBuilder();
//				Document document = builder.parse(inStrm);
//				NodeList nl = document.getDocumentElement().getElementsByTagName("quote");
//				if (nl != null && nl.getLength() > 0) {
//					for (int i = 0; i < nl.getLength(); i++) {
//						Node node = nl.item(i);
//						if (node instanceof Element) {
//							ms = new StockPrice();
//							//								String content = node.getLastChild().getTextContent().trim();
//							switch (node.getNodeName()) {
//							case "Date":
//								ms.setTimestamp(Timestamp.valueOf(node.getAttributes().
//										getNamedItem("Symbol").getNodeValue()));
//								break;
//							case "Open":
//								ms.setOpen(new BigDecimal(node.getAttributes().getNamedItem("Open").getNodeValue()));
//								break;
//							case "Close":
//								ms.setClose(new BigDecimal(node.getAttributes().getNamedItem("Close").getNodeValue()));
//								break;
//							case "High":							
//								ms.setHigh(new BigDecimal(node.getAttributes().getNamedItem("High").getNodeValue()));
//								break;
//							case "Low":
//								ms.setLow(new BigDecimal(node.getAttributes().getNamedItem("Low").getNodeValue()));
//								break;
//							case "Volume":
//								ms.setVolume(Long.parseLong(node.getAttributes().getNamedItem("Volume").getNodeValue()));
//								break;
//							}
//						}
//
//					}
//				}
//			} catch (YahooFetchException e) {
//				e.printStackTrace();
//			} catch (ParserConfigurationException e1) {
//				e1.printStackTrace();
//			} catch (SAXException e) {
//				e.printStackTrace();
//			} catch (IOException e) {
//				e.printStackTrace();
//			}
//			System.out.println(ms);
//
//			//				
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//}

