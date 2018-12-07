"use strict"
var app = app || {};

app=(()=>{
	var init =x=>{
		console.log('step1 : app.init 진입');
		$.extend((()=>{
			sessionStorage.setItem('context',x);
			return{ 
			ctx : ()=>{return sessionStorage.getItem('context');}
			}
		})());
		$('#wrapper').empty();
		$('#wrapper').append($('<div/>').attr({id : 'contents'}));
		
		app.service.init();
	};
	return {init : init};
})();

app.service=(()=>{
	var init=()=>{
		console.log('step2 : app.service.init 진입'); 
		app.page.listBrd();
		list({pageNum:1});
	};
	var list=x=>{
		$('tbody').empty();
		$('#pagination').remove();
		/*
		console.log('#### app.service.list 진입 ####');
		console.log('--list x.pageNum : '+x.pageNum);
		console.log('--list x.keyword : '+x.keyword);
		*/
		$.getJSON($.ctx()+'/board/list/'+x.pageNum+'/'+x.keyword,d=>{
			$.each(d.list,(i,j)=>{
				if(j.checkdelete=="Y"){
					j.title="원글이 삭제되었습니다";
					j.writer="";
					j.regidate="";
				}else{
					var transTime=x=>{
						let year=new Date(x).getFullYear();
						let month=new Date(x).getMonth()+1;
						let day=new Date(x).getDate();
						/*let hour=new Date(x).getHours();
						let min=new Date(x).getMinutes();
						let sec=new Date(x).getSeconds();*/
						let result=year+"-"+(month<10?"0"+month:month)+"-"+(day<10? "0"+day :day)
								/*	+" "+(hour < 10 ? "0" + hour : hour) + ":"
			                        + (min < 10 ? "0" + min : min) + ":" 
			                        + (sec < 10 ? "0" + sec : sec);*/
						return result; 
					};
					j.regidate = transTime(j.regidate);
				};

				/* NO에 역순 rownum 넣기 */
				let listNum = d.rowCount - j.rownum + 1;
				let $seq_num = j.num ;
				/* 리스트 구성 
				 * NO의 id = seqNum
				 * */
				$('<tr/>').append(
						$('<td/>').attr({id:"num_"+$seq_num}).addClass("center").html(listNum),
						$('<td/>').addClass("ellipsis").append($('<a href="#"/>').attr({id:"title_"+j.num}).html(j.title).click(e=>{
									$.getJSON($.ctx()+"/board/detail/"+$('#num_'+j.num).html(),d=>{
										console.log("detail 넘어가는 값 : "+$seq_num);
										detail({seqNum : $seq_num, listNum : listNum});
									});
						})
						),
						$('<td/>').addClass("center ellipsis").html(j.writer),
						$('<td/>').addClass("center").html(j.regidate)
				).appendTo($('#tbody_list'));
				
				/* 원글 삭제시 a태그 비활성화 */
				if(j.checkdelete=="Y"){
					$('#title_'+j.num).css({ 'pointer-events': 'none', 'color': 'black'});
				};
			});

			/* 페이지네이션  구성 시작 */
			$('<div/>').attr({id:"pagination", style:"text-align: center;"}).addClass("clearfix").appendTo("#list_row");
			$('<ul/>').addClass("pagination").attr({id:'pg_ul', style:"margin-left: auto;margin-right: auto;"}).appendTo("#pagination");
			
			let prev = (d.existPrev)? '': 'disabled';
			let next = (d.existNext)? '':'disabled';
			
			/* 처음버튼 */
			$('<li/>').append(
					$('<button/>').addClass("btn btn-default").attr({type:"button", style:"float: left;"}).append(
							$('<span/>').html("처음").addClass("glyphicon glyphicon-chevron-left "))).click(e=>{
								e.preventDefault();
								console.log("처음버튼 ");
								list({pageNum: 1, keyword:d.keyword}); 
							}).appendTo('#pg_ul');
	
			/* 이전버튼 */
			$('<li/>').addClass(prev).append(
					$('<a href="#"/>').append(
							$('<span/>').addClass("glyphicon glyphicon-chevron-left "))).click(e=>{
								if(prev==''){
									e.preventDefault();
									console.log("d.preBlock : "+d.preBlock);
									list({pageNum: d.preBlock, keyword:d.keyword});
								};
							}).appendTo('#pg_ul');
	
			//페이지 숫자
			for(let i=d.beginPage; i<=d.endPage;i++){
				$('<li/>').append($('<a href="#"/>').attr({id:"a"+i}).html(i))
				.click(e=>{
					//페이지 클릭이벤트
					app.service.list({pageNum:i, keyword:d.keyword});
				})
				.appendTo('#pg_ul');
				$('#a'+x.pageNum).css('background-color',"#ddd");
			};
			
			//다음버튼
			$('<li/>').addClass(next).append(
					$('<a href="#"/>').append(
							$('<span/>').addClass("glyphicon glyphicon-chevron-right "))).click(e=>{
								if(next==''){
									e.preventDefault();
									console.log("d.nextBlock : "+d.nextBlock);
									app.service.list({pageNum: d.nextBlock, keyword:d.keyword});
								};
							}).appendTo('#pg_ul');
			
			/* 마지막페이지버튼 */
			$('<li/>').append(
					$('<button/>').addClass("btn btn-default").attr({type:"button"}).append(
							"마지막",
							$('<span/>').addClass("glyphicon glyphicon-chevron-right "))).click(e=>{
								e.preventDefault();
								console.log("마지막버튼 ");
								list({pageNum: d.lastPage, keyword:d.keyword}); 
							}).appendTo('#pg_ul');
		});
	};
	var add=()=>{
		$('#wrapper').html(app.page.inputBrd());
		app.page.fileUpload();
		
		/* 입력 즉시 공백체크 */
		app.valid.blankValid();
		
		/* 글자수 세기 */
		$('#count_geul').html("0");
		app.fn.countText(); 
		
		// add 완료 버튼
		$('#complete_btn').click(e=>{
			let $title = $('#input_title').val().replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;").trim(); //태그입력방지
			let $content= $('#input_content').val().replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;"); //태그입력방지
			let $writer = $('#input_writer').val().trim();
			let $pw = $('#input_pw').val();
			
			/*let $title = $('#input_title').val().replace(/(<([^>]+)>)/ig,"").trim(); //태그입력방지
			let $content= $('#input_content').val().replace(/(<([^>]+)>)/ig,""); //태그입력방지
		 	*/
			console.log("$title : "+$title);
			console.log("$writer : "+$writer);
			console.log("$pw : "+$pw);
			
			/* 유효성 검사 */
			let $isValid= app.valid.isValid();
			if($isValid){
				console.log("유효성 검사 통과");
				$.ajax({
		             url : $.ctx()+'/board/add',
		             method : 'post',
		             contentType : 'application/json',
		             data : JSON.stringify({
		            	 title : $title,
		            	 content :$content,
		            	 writer :$writer, 
		            	 pw : $pw,
		             }),
		             success : d=>{
		            	alert('게시글 입력 완료 ');
		            	$('#wrapper').empty();
		         		$('#wrapper').append($('<div/>').attr({id : 'contents'}));
		            	app.page.listBrd();
		         		list({pageNum:1});
		             }
		           });
				
			};
		});
	};
	var update=x=>{
		console.log("=====update 페이지 진입 ===== ");
		$('#wrapper').html(app.page.inputBrd());
		
		console.log("id가져오기");
		let seq = $('#input_title');
		
		$('#input_title').val(x.title);
		$('#input_writer').val(x.writer);
		$('#input_content').html(x.content);
		
		/* 입력 즉시 공백체크 */
		app.valid.blankValid(); 
		
		/* 글자수 세기 */
		$('#count_geul').html(x.content.length);
		app.fn.countText(); 
		
		//수정 완료 버튼
		$('#complete_btn').click(e=>{
			let $title = $('#input_title').val().replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;").trim(); //태그입력방지
			let $content= $('#input_content').val().replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;"); //태그입력방지
			let $writer = $('#input_writer').val().trim();
			let $pw = $('#input_pw').val();
			
			/* 유효성 검사 */
			let v = app.valid.isValid();
			if(v){
				 $.ajax({
		             url : $.ctx()+'/board/update',
		             method : 'put',
		             contentType : 'application/json',
		             data : JSON.stringify({
		            	 num : x.num,
		            	 title : $title,
		            	 content :$content,
		            	 writer :$writer, 
		            	 pw : $pw,
		             }),
		             success : d=>{
		            	alert('게시글 입력 완료 ');
		            	$('#wrapper').empty();
		         		$('#wrapper').append($('<div/>').attr({id : 'contents'}));
		            	app.page.listBrd();
		         		list({pageNum:1});
		             }
		           });
			}
		});
	};
	
	var detail=x=>{
		$('#wrapper').html(app.page.detailBrd());
		var $seqNum = x.seqNum;
		$.getJSON($.ctx()+'/board/detail/'+$seqNum,d=>{
			$('#td_content1').html(x.listNum);
			$('#td_content2').html(d.detail.title);
			$('#td_content3').html(d.detail.writer);
			$('#td_content4').html(d.detail.content);
		});
		
		// 수정 버튼 클릭시 =========================================================
		$('#update_btn').click(e=>{
			console.log("update_btn 클릭");
			validation({seqNum:$seqNum, move:"updateBrd"});
		});
		$('#delete_btn').click(e=>{
			console.log("delete_btn 클릭");
			validation({seqNum:$seqNum, move:"deleteBrd"});
		});
		
	};
	var validation=x=>{
		/* @param x.seqNum
		 * @param x.move
		*/
		console.log('validation 진입========');
		
		let pwInput = prompt("비밀번호를 입력하세요 ","비밀번호");
		let $seqNum = x.seqNum;
		console.log("arti_num : "+$seqNum);
		
		$.ajax({
             url : $.ctx()+'/board/valid/'+pwInput,
             method : 'post',
             contentType : 'application/json',
             data : JSON.stringify({
            	 pwInput :pwInput,
            	 num : $seqNum
             }),
             success : d=>{
					console.log('auth :: '+d.auth);
					if(d.auth===false){
						alert('비밀번호 확인해주세요');
					}else{
						if(x.move=='updateBrd'){
							console.log('비밀번호 일치, 수정페이지로 이동');
							update({num : $seqNum,
								  title : d.retrieveInfo.title,
								 writer : d.retrieveInfo.writer,
								content : d.retrieveInfo.content });
							/*console.log("d.retrieveInfo.title : "+d.retrieveInfo.title);
							console.log("d.retrieveInfo.writer : "+d.retrieveInfo.writer);
							console.log("d.retrieveInfo.content : "+d.retrieveInfo.content);*/
							
						}else if(x.move=='deleteBrd'){
							alert('비밀번호 일치');
							$.ajax({
					             url : $.ctx()+'/board/delete',
					             method : 'put',
					             contentType : 'application/json',
					             data : JSON.stringify({
					            	 num : $seqNum
					             }),
					             success : d=>{
					            	alert('삭제완료');
					            	 
					            	//메인화면으로 이동 
					            	$('#wrapper').empty();
					          		$('#wrapper').append($('<div/>').attr({id : 'contents'}));
					             	app.page.listBrd();
					          		app.service.list({pageNum:1});
					             }
					           });
						}
						
						
					}
				}
           });
	};
	
	return{init:init,
			list:list,
			add:add,
			detail:detail,
			validation:validation
			};
})();

app.valid=(()=>{
	var checkPassword=x=>{
		//
		console.log("--checkPassword----");
		let pattern1 = /[0-9]/;	// 숫자 
		let pattern2 = /[a-zA-Z]/;	// 문자 
		let pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;	// 특수문자
		
		if(!pattern1.test(x) || !pattern2.test(x) || !pattern3.test(x) || x.length<4 ){
			alert("비밀번호는 4자리 이상 문자, 숫자, 특수문자로 구성하여야 합니다.(20자 이내)");
			$('#input_pw').focus();
			return false;
		}else{
			return true;
		};
	};
	var isValid=()=>{
		let vd = false;
		
		blankValid();//공백체크
		
		let $title = $.trim($('#input_title').val());
		let $writer=$.trim($('#input_writer').val());
		let $pw=$.trim($('#input_pw').val());
		let $content=$.trim($('#input_content').val());
		
		console.log("-----$title : "+$title);
		console.log("-----$writer : "+$writer);
		console.log("-----$pw : "+$pw);
		console.log("-----$content : "+$content);
		
		
		
		//글자수 
		var getByteLength = function(s,b,i,c){
			  for(b=i=0; c=s.charCodeAt(i++); b+=c>>11?3:c>>7?2:1);
			  return b;
			};
			
		let $contentByte = getByteLength($content);
		console.log("$contentByte : "+$contentByte);
		console.log("$title.length : "+$title.length);
		console.log("$writer.length : "+$writer.length);
		
		if($title.length>=99){
			alert("제목은 100자 이내로 가능합니다.");
		};
		if($writer.length>=20){
			alert("작성자는 20자 이내로 가능합니다.");
		};
		
		//$.trim() : 앞뒤의 빈칸 제거
		if($title===''||$title===null){
			alert("제목을 입력하세요");
			$('#input_title').focus();
			vd= false;
		}else  
		if($writer===''||$writer===null){
			alert("작성자를 입력하세요");
			$('#input_writer').focus();
			vd= false;
		}else 
		if($pw===''||$pw==null){
			alert("비밀번호를 입력하세요");
			$('#input_pw').focus();
			vd= false;
		}else 
		if($content===''||$content==null){
			alert("내용을 입력하세요");
			$('#input_content').focus();
			vd= false;
		}else {
			vd = checkPassword($pw);
			
		};
		/*if(check_pw===true && !($title==='' || $writer==='' || $pw ==='' || $content ==='')){
			console.log("44444 check_pw : "+check_pw);
			vd=true;
		};*/
		return vd;
	};
	var blankValid=()=>{
		/*$('#input_title').keyup(function(){
			$title = $(this).val()
		});
		*/
		//작성자 : 20글자 이하 영문대소문자, 한글
		$('#input_writer').keyup(function(event){
			if (!(event.keyCode >=37 && event.keyCode<=40)) {
                var inputVal = $(this).val();
                $(this).val($(this).val().replace(/[^a-zA-Z가-힣]/gi,'')); //_(underscore), 영어, 숫자만 가능
            }
		});
		
		/*//password : _(underscore), 영어, 숫자만 가능
		$('#input_pw').keyup(function(event){
			if (!(event.keyCode >=37 && event.keyCode<=40)) {
                var inputVal = $(this).val();
                $(this).val($(this).val().replace(/[^\w~@\#$%<>^&*\()\-=+_\']/gi,'')); //영문대소문자, 숫자, 특수기호 ~!@#$%^&*()_+-=
            }
		});*/
		
		
	};
	return {
		isValid:isValid,
		blankValid:blankValid
	};
})();

/* 처음으로 리스트 버튼
*/
$(document).on("click","#list_btn",function(){
	$('#wrapper').empty();
	$('#wrapper').append($('<div/>').attr({id : 'contents'}));
	app.page.listBrd();
 	app.service.list({pageNum:1});
});


app.fn=(()=>{
	var countText=()=>{
		$('#input_content').keyup(e=>{
			console.log("keyup--------22-------");
			let $content = $('#input_content').val();
			$('#count_geul').html($content.length);
			if($content.length>2000){
				alert("최대 2,000자 입력 가능합니다.");
			}
		});
	};
	return {countText:countText};
})();



// 페이지 구성 =============================================================================================================
app.page=(()=>{
	var fisrt=()=>{

		$('#wrapper').empty();
 		$('#wrapper').append($('<div/>').attr({id : 'contents'}));
    	app.page.listBrd();
 		app.service.list({pageNum:1});
	};
	var listBrd=()=>{
		/*  */
		let list_compo = $('<div/>').attr({id:"container"}).addClass("container").appendTo('#contents');
		$('<div/>').attr({id:"list_row"}).addClass("row").appendTo("#container");
		
		/* 리스트   */
		$('<div/>').attr({id:"list_col"}).addClass("col-md-12").appendTo($('#list_row'));
			$('<div/>').attr({id:"list_tbl"}).addClass("table-responsive").appendTo($('#list_col'));
				$('<table/>').attr({id:"board_table"}).addClass("table table-list table-bordred table-striped").appendTo('#list_tbl');
					$('<thead/>').attr({id:"board_thead"}).appendTo('#board_table');
						$('<th/>').addClass("th-num").append($('<span/>').html("NO")).appendTo('#board_thead');
						$('<th/>').addClass("th-title").append($('<span/>').html("제목")).appendTo('#board_thead');
						$('<th/>').addClass("th-writer").append($('<span/>').html("작성자")).appendTo('#board_thead');
						$('<th/>').addClass("th-regidate").append($('<span/>').html("작성일자")).appendTo('#board_thead');
					$('<tbody>').attr({id:"tbody_list"}).appendTo('#board_table');
		
		/* ================검색 및버튼  ================*/
		$('<div/>').attr({id:"btn_col"}).addClass("col-md-12").appendTo($('#list_row'));
		
		
		/*			+'<button id="list_btn" class="btn btn-primary pull-left">목록가기</button>'*/
		$('<button/>').attr({id:"list_btn"}).html("목록보기").addClass("btn btn-default pull-left").appendTo($('#list_row'));
		//글쓰기
		$('<button/>').attr({id:"write_btn"}).html("글쓰기").addClass("btn btn-default pull-right").appendTo('#list_row')
		.click(e=>{
			console.log('글쓰기 버튼 클릭');
			app.service.add();
		});
		
		//검색set
		$('<div/>').addClass("col-xs-8 col-xs-offset-2").append(
				$('<div/>').attr({id:"in_gr"}).addClass("input-group")
				).appendTo('#btn_col');
		$('<div/>').attr({id:"search_bt_div"}).addClass("input-group-btn search-panel").appendTo("#in_gr");
		$('<button>').attr({ id:"drop_btn", 'type':"button", 'data-toggle':"dropdown"}).addClass("btn btn-default dropdown-toggle").appendTo("#search_bt_div");
		$('<span/>').attr({id:"search_concept"}).html("제목").appendTo("#drop_btn");
		$('<span/>').addClass("caret").appendTo("#drop_btn");
		
		$('<ul/>').addClass("dropdown-menu").attr({'role':"menu",id:"drop_ul"}).appendTo("#search_bt_div");
		$('<li/>').append($('<a/>').attr({href:"#"}).html("제목")).appendTo("#drop_ul");
		$('<li/>').append($('<a/>').attr({href:"#"}).html("내용")).appendTo("#drop_ul");
		
		$('<input/>').attr({type:"hidden",id:"search_param", name:"search_param", value:"all"}).appendTo("#in_gr");
		$('<input/>').attr({type:"text",id:"input_keyword", name:"x", placeholder:"Search.."}).addClass("form-control").appendTo("#in_gr");
		$('<span/>').addClass("input-group-btn").attr({id:"in_gr_bt"}).appendTo("#in_gr");
		$('<button>').addClass("btn btn-default").attr({id:"search_btn",type:"button"}).click(e=>{
			/* search 버튼 이벤트 */
			console.log("서치 버튼 클릭");
			let $search_concept = $('#search_concept').html();
			let $input_keyword = $('#input_keyword').val();
			console.log("말머리 선택 : "+$search_concept);
			console.log("검색 조건 : "+$input_keyword);
			
			if($input_keyword===''){
				alert("검색어를 입력해주세요");
			}else{
				//검색어 입력 완료시
				app.service.list({pageNum:1, keyword:$input_keyword});
			};
		}).appendTo("#in_gr_bt");
		$('<span/>').addClass("glyphicon glyphicon-search").appendTo("#search_btn");
		//bootstrap.min.js
		$(document).ready(function(e){
		    $('.search-panel .dropdown-menu').find('a').click(function(e) {
				e.preventDefault();
				var param = $(this).attr("href").replace("#","");
				var concept = $(this).text();
				$('.search-panel span#search_concept').text(concept);
				$('.input-group #search_param').val(param);
			});
		});
		//bootstrap.min.js 끝
		
		

		return list_compo;
	};
	var inputBrd=()=>{
		let inputBrdPage = '<div id="inputBrd_container" class="container">'
		      +'<div class="row">'
		        +'<div class="col-md-12">'
		            +'<table class="table table-striped" style="text-align:center; border:1px solid #dddddd;">'
		              +'<thead>'
		                +'<tr>'
		                  +'<th colspan="3" style="background-color:#eeeeee; text-align: center;">게시글 작성</th>'
		                +'</tr>       '
		              +'</thead>'
		              +''
		              +'<tbody>'
		                +'<tr>'
		                  +'<td style="width: 160px; text-align: center;">글제목</td>'
		                  +'<td colspan="2" >'
		                  	+'<div>'
		                  		+'<input type="text" class="form-control" id="input_title" maxlength="99" style="white-space: pre-wrap;">'
		                    +'</div>'
		                    +'</td>'
		                +'</tr>'
		                +'<tr>'
		                  +'<td style="width: 160px; text-align: center;">작성자</td>'
		                  +'<td>'
		                  	+'<div class="ellipsis">'
		                  		+'<input type="text" class="form-control" id="input_writer" maxlength="20" >'
		                  	+'</div >'
		                  +'</td>'
		                  +'<td style="font-size: 0.9em; text-align: left;width: 480px;">20글자 이하 영문대소문자, 한글로 입력하세요</td>'
		                +'</tr>'
		                +'<tr>'
		                  +'<td style="width: 160px; text-align: center;">비밀번호</td>'
		                  +'<td><input type="password" class="form-control" id="input_pw" maxlength="20"></td>'
		                  +'<td style="font-size: 0.9em; text-align: left;width: 480px;">비밀번호는 4자리 이상 문자, 숫자, 특수문자로 구성하여야 합니다.(20자 이내)</td>'
		                +'</tr>'
		                +'<tr>  '
		                  +'<td style="width: 160px; text-align: center;">내용</td>'
		                  +'<td colspan="2" >'
	                  	  	+'<div>'
			                  +'<textarea class="form-control" id="input_content" style="white-space: pre-wrap; height:350px">'
			                  +'</textarea>'
			                  +'<div style="margin: 10px 16px 10px; font-size: 13px; color: #999; line-height: 22px; text-align: right;">'
			                  +'<span style="position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;">현재 입력한 글자수</span>'
			                  +'<strong id="count_geul" style="font-weight: 400;"></strong>'
			                  +'/'
			                  +'<span style="position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;">전체 입력 가능한 글자수</span>'
			                  +'<span style="font-size: 13px; color: #999; line-height: 22px; text-align: right;">2000</span>'
			                  +'</div>'
			                  +'</div>'
		                  +'</td>'
		                +'</tr> '
		              +'</tbody>'
		              
		            +'</table>'
		            +'<div id="btn_div" style="text-align: right;">'
		              	+'<button id="list_btn" class="btn btn-primary pull-left">목록가기</button>'
		                +'<button id="complete_btn" class="btn btn-primary pull-right">글쓰기 완료</button>'
		            +'</div>'
		            +''
		              +'<!-- soap방식: <input type="submit" class="btn btn-primary pull-right" value="글쓰기"> -->'
		          +'</div>'
		         +'</div>'
		      +'</div>';
		
		
		/*$('<div/>').css("margin: -3px 16px 10px; font-size: 13px; color: #999; line-height: 22px; text-align: right;").append(
				$('<span/>').css("position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;").html("현재 입력한 글자수"),
				$('<strong/>').attr({id:"count_hangeul"}).css("font-weight: 400;"),
				"/",
				//html("/"),
				$('<span/>').css("position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;").html("전체 입력 가능한 글자수"),
				$('<span/>').css("font-size: 13px; color: #999; line-height: 22px; text-align: right;").html("300")
				
		).appendTo($('#input_content'));*/
		/*<div style="margin: -3px 16px 10px; font-size: 13px; color: #999; line-height: 22px; text-align: right;">
			<span style="position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;">현재 입력한 글자수</span>
			<strong id="count_hangeul" style="font-weight: 400;">0</strong>
			/
			<span style="position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;">전체 입력 가능한 글자수</span>
			<span style="font-size: 13px; color: #999; line-height: 22px; text-align: right;">300</span>
		</div>*/
		
		
		
		
		
		//$('#inputBrd_container').appendTo('#contents');
	      return inputBrdPage;
	};
	var detailBrd=()=>{
		/*$('<button/>').attr({id:"update_btn"}).addClass("btn btn-primary").html("수정").appendTo('#btn_div');
		$('#update_btn').click(e=>{
			alert("수정 버튼 클릭");
		});*/
		let detailPage = '<div class="container">'
		      +'<div class="row">'
		        +'<div class="col-md-12">'
		            +'<table class="table table-striped" style="text-align:center; border:1px solid #dddddd;">'
		              +'<thead>'
		                +'<tr>'
		                  +'<th colspan="2" style="background-color:#eeeeee; text-align: center;">게시글</th>'
		                +'</tr>       '
		              +'</thead>'
		              +''
		              +'<tbody>'
		              +'<tr>'
		              +'<td id="td1" style="width: 160px; text-align: center;">NO</td>'
		              +'<td id="td_content1" style="text-align: left;"></td>'
		            +'</tr>'
		            +'<tr>'
		            +'<td id="td2" style="width: 160px; text-align: center;">글제목</td>'
		              +'<td id="td_content2" style="text-align: left;white-space: pre-wrap;word-break:break-all;"></td>'
		            +'</tr>'
		            +'<tr>'
		            +'<td id="td3" style="width: 160px; text-align: center;">작성자</td>'
		              +'<td id="td_content3" style="text-align: left;"></td>'
		            +'</tr>'
		            +'<tr>'
		            +'<td id="td4" style="width: 160px; text-align: center;">내용</td>'
		              +'<td id="td_content4" style="text-align: left; white-space: pre-wrap;word-break:break-all;"></td>'
		            +'</tr>'
		              +'</tbody>'
	            +'</table>'
	              +'<div id="btn_div" style="text-align: right;">'
	                +'<button id="list_btn" class="btn btn-primary pull-left">목록가기</button>'
	                +'<button id="update_btn" class="btn btn-primary">수정</button>'
	                +'<button id="delete_btn" class="btn btn-primary">삭제</button>'
	              +'</div>'
	          +'</div>'
	         +'</div>'
	      +'</div>';
		
		
		return detailPage;
	};
	var fileUpload =()=>{
		/*이미지 업로드*/
		/*var profile;
		$('<label/>').addClass('bold').html("프로필 사진 업로드").attr({style:"padding-top:20px;padding-bottom:5px"}).appendTo($('#add_form_middle'));
		$('<div/>').addClass('imgup_con').append(
				$('<form/>').attr({enctype:'multipart/form-data',id:'imgup_form'}).append(
						$('<div/>').addClass('imgup_prev').append(
								$('<div/>').attr({id:'targetLayer',style:'opacity: 0.7;'}),
								//$('<img/>').addClass('icon_choose_image').attr({src:$.img()+'/hyeri/upimageicon.png',style:'opacity:0.5'}),
								$('<div/>').addClass('imgup').append(
										$('<input/>').attr({type:"file",name:'find_img',id:'find_img'}).addClass('inputFile')
										.change(function(a) {
											let ck = (this.files[0].name.match(/jpg|gif|png|jpeg/i)) ? true : false;
											if(ck){
												profile=this.files[0].name;
												hyeri.func.iu(this);
											}else{
												alert("gif,png,jpg,jpeg 파일만 업로드 할 수 있습니다.");
											}
										})	
								)
						)
						
				)
		).appendTo($('table'));*/
		
	};
	return{fisrt:fisrt, listBrd:listBrd, inputBrd:inputBrd, detailBrd:detailBrd, fileUpload:fileUpload };
})();









/*//바이트 수 계산
var getByteLength = function(s,b,i,c){
	  for(b=i=0; c=s.charCodeAt(i++); b+=c>>11?3:c>>7?2:1);
	  return b;
	};*/
	/* console.log(getByteLength("1234567890") + " Bytes");
		console.log(getByteLength("안녕하세요") + " Bytes");*/
	