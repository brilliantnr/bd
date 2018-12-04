<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>게시판 메인 </title>
	<%-- <script src="${context}/resources/bootstrap.min.css"></script> --%>
	<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
	<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
	<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
	
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="http://getbootstrap.com/dist/js/bootstrap.min.js"></script>
	
	<script src="${context}/resources/app.js"></script>
	
</head>
<body>
	<!-- header -->
	<div id="pt_header" style="height: 118px; background: #32373b; width: 100%;"></div>

	<!-- contents -->
	<div id="wrapper" style="margin-top: 50px;">
		<div id="addBrd_container" class="container">
      <div class="row">
        <div class="col-md-12">
            <table class="table table-striped" style="text-align:center; border:1px solid #dddddd;">
              <thead>
                <tr>
                  <th colspan="2" style="background-color:#eeeeee; text-align: center;">게시글 작성</th>
                </tr>       
              </thead>
              
              <tbody>
                <tr>
                  <td style="width: 160px; text-align: center;">글제목</td>
                  <td><input type="text" class="form-control" id="input_title" maxlength="50"></td>
                </tr>
                <tr>
                  <td style="width: 160px; text-align: center;">작성자</td>
                  <td><input type="text" class="form-control" id="input_writer" maxlength="50"></td>
                </tr>
                <tr>
                  <td style="width: 160px; text-align: center;">비밀번호</td>
                  <td><input type="text" class="form-control" id="input_pw" maxlength="20"></td>
                </tr>
                <tr>  
                  <td style="width: 160px; text-align: center;">내용</td>
                  <td><textarea id="content" class="form-control" id="input_content" maxlength="2048" style="height:350px"></textarea></td>
                </tr> 
              </tbody>
            </table>
            <div id="btn_div" style="text-align: right;">
              	<button id="list_btn" class="btn btn-primary pull-left">목록가기</button>
                <button id="complete_btn" class="btn btn-primary pull-right">글쓰기 완료</button>
            </div>
            
            
              <!-- soap방식: <input type="submit" class="btn btn-primary pull-right" value="글쓰기"> -->
          </div>
         </div>
      </div>
	
	
	
	</div>
	
	<script>
	console.log("0. addBoard.jsp 진입");
	</script>
</body>
</html>