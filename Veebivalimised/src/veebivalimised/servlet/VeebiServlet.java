package veebivalimised.servlet;

import com.google.appengine.api.rdbms.AppEngineDriver;

import java.sql.*;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class VeebiServlet extends HttpServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        resp.setContentType("");
        resp.getWriter().println("HAI, WORLD");
        
    }
    
	
	// Allolev kood on kandideerimise sisestamiseks, Hardcoded isik kandideerib
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			  throws IOException {
		 	  PrintWriter out = resp.getWriter();
			  String Area = req.getParameter("Area");
		      String Party = req.getParameter("Party");
			  if (Area != "" && Party != ""){
				  Connection c = null;
				  try{
					  System.out.println("Alustan andmebaasiga ühendamist");
					  DriverManager.registerDriver(new AppEngineDriver());
				      c = DriverManager.getConnection("jdbc:google:rdbms://veebivalimiseddb:veebidb/kandidaat");
				      String statement ="INSERT INTO kandidaat (partei_ID, piirkond_ID, isik_ID) VALUES( ? , ? , ?)";
				      PreparedStatement stmt = c.prepareStatement(statement);
				      stmt.setString(1, Party);
				      stmt.setString(2, Area);
				      stmt.setString(3, "1");
				      int success = 2;
				      success = stmt.executeUpdate();
				      if (success == 0){
				    	  out.println("<html><head></head><body>Failure! Please contact Site Administrator</body></html>");
				      }
				  }
				  catch (SQLException e) {
					  e.printStackTrace();
					  System.out.println(e);
				  } 
				  finally {
					  if (c != null) 
					      try {
					    	  c.close();
					      }
					  	  catch (SQLException ignore) {
					      }
				  }
				  resp.setHeader("Refresh","0; url=/");
			  }
	}
}
			   
			  /*PrintWriter out = resp.getWriter();
			  
			    try {
			      DriverManager.registerDriver(new AppEngineDriver());
			      c = DriverManager.getConnection("jdbc:google:rdbms://veebivalimiseddb:veebidb/kandidaat");
			      String ID = req.getParameter("ID");
			      String name = req.getParameter("Nimi");
			      if (ID == "" || name == "") {
			        out.println("<html><head></head><body>You are missing either a message or a name! Try again! Redirecting in 3 seconds...</body></html>");
			      } else {
			      String statement ="INSERT INTO partei (ID, Nimi) VALUES( ? , ? )";
			      PreparedStatement stmt = c.prepareStatement(statement);
			      stmt.setString(1, ID);
			      stmt.setString(2, name);
			      int success = 2;
			      success = stmt.executeUpdate();
			      if(success == 1) {
			        out.println("<html><head></head><body>Success! Redirecting in 3 seconds...</body></html>");
			      } else if (success == 0) {
			        out.println("<html><head></head><body>Failure! Please try again! Redirecting in 3 seconds...</body></html>");
			      }
			     }
			    } catch (SQLException e) {
			        e.printStackTrace();
			    } finally {
			        if (c != null) 
			          try {
			            c.close();
			            } catch (SQLException ignore) {
			         }
			      } resp.setHeader("Refresh","3; url=/ParteiLoomine.jsp");
			  }*/
