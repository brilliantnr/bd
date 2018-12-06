<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%-- <%@ page session="false" %> --%>
<!DOCTYPE html>
<html>
<head>
	<title>게시판 메인 </title>
	<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
	<script src="${context}/resources/app.js"></script>
	<script src="${context}/resources/app.css"></script>
</head>
<body>
	<!-- header -->
	<div id="pt_header" style="height: 118px; background: #32373b; width: 100%;"></div>

	<!-- contents -->
	<div id="wrapper" style="margin-top: 80px; margin-bottom: 50px;"></div>
	
	
	
	<script>
	console.log("0. home.jsp 진입");
	app.init('${context}');
	</script>
</body>
</html>
