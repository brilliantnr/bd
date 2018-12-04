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
		<div id="contents">
			<div id="container" class="container">
				<div id="list_row" class="row">
					<div id="list_col" class="col-md-12">
						<div id="list_tbl" class="table-responsive">
							<table id="board_table" class="table table-bordred table-striped">
								<thead id="board_thead">
									<tr>
									<th id="title_num" style="width:10%"><span>NO</span></th>
									<th style="width:60%"><span>제목</span></th>
									<th style="width:15%"><span>작성자</span></th>
									<th><span>작성일자</span></th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							
							</table>
						</div>
					</div>
					<div id="btn_col" class="col-md-12">
						<div class="col-xs-8 col-xs-offset-2">
							<div id="in_gr" class="input-group">
								<div id="search_bt_div" class="input-group-btn search-panel">
									<button id="drop_btn" type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle">
										<span id="search_concept">제목</span>
										<span class="caret"></span>
									</button>
									<ul class="dropdown-menu" role="menu" id="drop_ul">
										<li><a href="#">제목</a></li>
										<li><a href="#">내용</a></li>
									</ul>
								</div>
							<input type="hidden" id="search_param" name="search_param" value="all">
							<input type="text" id="input_keyword" name="x" placeholder="Search.." class="form-control">
							<span class="input-group-btn" id="in_gr_bt">
								<button class="btn btn-default" id="search_btn" type="button">
									<span class="glyphicon glyphicon-search"></span>
								</button>
							</span>
							</div>
						</div>
					
					<button id="write_btn" class="btn btn-default">글쓰기</button>
					</div>
					<div id="pagination" style="text-align: center;" class="clearfix">
						<ul class="pagination" id="pg_ul" style="margin-left: auto;margin-right: auto;">
						<!-- 
							<li class="disabled"><a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a></li>이전버튼
							<li><a href="#">1</a></li>
							<li><a href="#">2</a></li>
							<li><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></li>다음버튼
						 -->	
						</ul>
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