<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="java.sql.*" %>
<%@ page import="com.google.appengine.api.rdbms.AppEngineDriver" %>

<html>
  <body id="ParteiLoomine">

<%
Connection c = null;
c = DriverManager.getConnection("jdbc:google:rdbms://veebivalimiseddb:veebidb/partei");
ResultSet rs = c.createStatement().executeQuery("SELECT ID, Nimi FROM partei"); %>

<table style="border: 1px solid black">
<tbody>
<tr>
<th width="35%" style="background-color: #CCFFCC; margin: 5px">Name</th>
<th style="background-color: #CCFFCC; margin: 5px">Message</th>
<th style="background-color: #CCFFCC; margin: 5px">ID</th>
</tr> <%
while (rs.next()){
    int ID = rs.getInt("ID");
    String Nimi = rs.getString("Nimi");
%>

<tr>
<td><%= ID %></td>
<td><%= Nimi %></td>
<td>Lihtsalt</td>
</tr>

<% }
c.close(); %>

</tbody>
</table>
<br />
No more messages!
<p><strong>Sign the guestbook!</strong></p>
<form action="/ParteiLoomine" method="post">
    <div>ID <input type="text" name="ID"></input></div>
    <div>Nimi: <input type = "text" name="Nimi"></div>
    <div><input type="submit" value="Post Application" /></div>
    <input type="hidden" name="guestbookName" />
  </form>
  </body>
</html>