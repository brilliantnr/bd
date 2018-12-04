<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>상세 게시글 </title>
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
		<div class="container">
      <div class="row">
        <div class="col-md-12">
            <table class="table table-striped" style="text-align:center; border:1px solid #dddddd;">
              <thead>
                <tr>
                  <th colspan="2" style="background-color:#eeeeee; text-align: center;">게시글</th>
                </tr>       
              </thead>
              
              <tbody>
                <tr>
                  <td style="width: 160px; text-align: center;">글제목</td>
                  <td style="text-align: left;">값불러오기</td>
                </tr>
                <tr>
                  <td style="width: 160px; text-align: center;">작성자</td>
                  <td style="text-align: left;">값불러오기</td>
                </tr>
                <tr>
                  <td style="width: 160px; text-align: center;">비밀번호</td>
                  <td style="text-align: left;">값불러오기</td>
                </tr>
                <tr>  
                  <td style="width: 160px; text-align: center;">내용</td>
                  <td style="text-align: left;">값불러오기</td>
                </tr> 
              </tbody>
            </table>
              <!-- soap방식: <input type="submit" class="btn btn-primary pull-right" value="글쓰기"> -->
              <div id="btn_div" style="text-align: right;">
              	<button id="update_btn" class="btn btn-primary">수정</button>
               	<button id="delete_btn" class="btn btn-primary">삭제</button>
              </div>
             
          </div>
         </div>
      </div>
	
	
	
	</div>
	
	<script>
	console.log("0. addBoard.jsp 진입");
	</script>
</body>
</html>