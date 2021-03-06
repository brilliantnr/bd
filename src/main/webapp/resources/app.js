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
	}; //init() END =========================================================================================================
	var list=x=>{
		$('tbody').empty();
		$('#pagination').remove();
		
		/* 엑셀 다운로드 */
		$('<div/>').append(
				$('<button/>').attr({id:"excel_btn"}).html("엑셀 다운로드").addClass("btn btn-default pull-right")
				.click(e=>{
					$.getJSON($.ctx()+'/excel/down/'+x.keyword,d=>{
						console.log("d.dataList.title : "+d.dataList.title);
					});
				})
		).appendTo($('#container'));
		
		
		$.getJSON($.ctx()+'/board/list/'+x.pageNum+'/'+x.keyword,d=>{
			let $rowCount= d.rowCount;  //1.총row수
			let $replyTotal =d.replyTotal; //2.총reply수
			let $articleCountBf =d.articleCountBf; //3.전page원글수
			let temp=0;//4.
			
			$.each(d.list,(i,j)=>{
				let $seq_num = j.num;
				let $parent = j.parent;
				let $ord = j.ord;
				let $depth = j.depth;
				let $checkdelete = j.checkdelete;//삭제여부
				
				let listNum;
				if($parent!=null ||$checkdelete=="Y"){
					//답글 case
					listNum="[답글]  ";
				}else{
					//원글 case
					listNum = $rowCount - $replyTotal - $articleCountBf - temp;
					temp++;
					
					console.log("원글 "
							+" listNum "+listNum
							+"="+" 총row수 "+$rowCount
							+"-"+" 총reply수 "+$replyTotal
							+"-"+" 전page원글수 "+$articleCountBf
							+"-"+" temp "+temp
					);//console
				};
				
				/* 댓글수 표기 */
				$.getJSON($.ctx()+'/board/countCmt/'+$seq_num,d=>{
					$("#count_cmt"+$seq_num).html("[ "+d+" ]");
				});
				
				if(j.checkdelete=="Y"){
					//삭제체크된 글
					j.title="원글이 삭제되었습니다";
					j.writer="";
					j.regidate="";
					$('#count_cmt'+$seq_num).attr({style:"visibility: hidden;"});
				}else{
					//정상
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
				
				/* ============================
				 * 리스트 구성 
				 * "num_"+$seq_num
				 * #num_130 
				 * #parent_130  에 name:$parent
				 * #depth_130 에 name:$depth
				 * ============================*/
				
				$('<tr/>').append(
						$('<td/>').attr({id:"num_"+$seq_num}).addClass("center").html(listNum),
						$('<td/>').addClass("ellipsis").append(
								$('<div/>').attr({style:"white-space: nowrap; text-overflow: ellipsis;overflow: hidden;width: 90%;float: left;"}).append(
									$('<img/>').attr({name:"reply_img",style:"margin-left:"+(25*$depth)+"px"}),
									$('<span/>').attr({id:"parent_"+$seq_num, name:$parent}),
									$('<span/>').attr({id:"ord_"+$seq_num, name:$ord}),
									$('<span/>').attr({id:"depth_"+$seq_num, name:$depth}),
									$('<a href="#"/>').addClass("ellipsis").attr({id:"title_"+j.num}).html(j.title).click(e=>{
										$.getJSON($.ctx()+"/board/detail/"+$seq_num,d=>{
											/* detail 페이지로 넘어가기 */
											console.log("----detail 넘어가는 값 : 1.$seq_num:  "+$seq_num);
											console.log("----detail 넘어가는 값 : 2.listNum :  "+listNum);
											console.log("----detail  : 3.$parent :  "+$parent);
											console.log("----detail  : 4.$ord	 :  "+$ord);
											console.log("----detail  : 5.$depth  :  "+$depth);
											
											detail({seqNum : $seq_num
													, listNum : listNum
													/*, parent:$parent
													, ord:$ord
													, depth:$depth*/
												});
										});
									})
							),
							$('<div/>').attr({style:"float: left;"}).append(
									$('<a/>').attr({id:"count_cmt"+$seq_num ,name:"count_cmt"}).addClass("count_cmt")
									)
								),
						$('<td/>').addClass("center ellipsis").html(j.writer),
						$('<td/>').addClass("center").html(j.regidate)
				).appendTo($('#tbody_list'));
				
				//원글 삭제시 댓글표시도 숨기기
				if(j.checkdelete=="Y"){
					$('#count_cmt'+$seq_num).attr({style:"visibility: hidden;"});
				}
				
				if(!$parent=='undefined'){
					$('[name="reply_img"]').attr({src:$.ctx()+"/resources/icon_reply.png"});
				};
				
				/* 원글 삭제시 a태그 비활성화 */
				if(j.checkdelete=="Y"){
					$('#title_'+j.num).css({ 'pointer-events': 'none', 'color': 'black'});
				};
			});

			/* 페이지네이션  구성 시작 */
			$('<div/>').attr({id:"pagination", style:"text-align: center;"}).addClass("clearfix").appendTo("#btn_col");
			$('<ul/>').addClass("pagination").attr({id:'pg_ul', style:"margin-left: auto;margin-right: auto;"}).appendTo("#pagination");
			
			let prev = (d.existPrev)? '': 'disabled';
			let next = (d.existNext)? '':'disabled';
			
			/* 처음버튼 */
			$('<li/>').addClass(prev).append(
					$('<button/>').addClass("btn btn-default").attr({type:"button", style:"float: left;"}).append(
							$('<span/>').addClass("fas fa-angle-double-left"))).click(e=>{
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
							/*"마지막",*/
							$('<span/>').addClass("fas fa-angle-double-right"))).click(e=>{
								//<i class="fas fa-angle-double-right"></i>
								e.preventDefault();
								console.log("마지막버튼 ");
								list({pageNum: d.lastPage, keyword:d.keyword}); 
							}).appendTo('#pg_ul');
			
		});
	};//list() END =========================================================================================================
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
	};//ADD() END =========================================================================================================
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
			let $writer = $('#input_writer').val().replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;").trim();
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
	}; //update() END =========================================================================================================
	
	var detail=x=>{
		/* ============================
		 * 상세페이지  
		 * @ seqNum
		 * @ listNum
		 * ============================*/
		var $seqNum = x.seqNum;
		console.log("--3333333 detail=x.seqNum-"+$seqNum);
		$('#seqNum').attr({name:$seqNum});
		
		$('#wrapper').html(app.page.detailBrd());
		$('<ul/>').addClass("cmlist").attr({id:"cmt_list"}).appendTo($('#cmt_div'));
		
		//기본정보 고정시키기 START
		$.getJSON($.ctx()+'/board/detail/'+$seqNum,d=>{
			console.log("'/board/detail/'+$seqNum : "+$seqNum);
			let $depth = d.detail.depth;
			let $ord = d.detail.ord;
			console.log("---getJSON---$ord------"+$ord);
			let $parent = d.detail.parent;
			
			$('#seqNum').attr({name:$seqNum});
			$('#depth').attr({name:$depth});
			$('#ord').attr({name:$ord});
			$('#parent').attr({name:$parent});
			
			$('#td_content1').html(x.listNum);
			$('#td_content2').html(d.detail.title);
			$('#td_content3').html(d.detail.writer);
			$('#td_content4').html(d.detail.content);
			
		});
		//기본정보 고정시키기 END
		
		
		/* 댓글 입력창 START */
		//기존 댓글 리스트 START
		$.getJSON($.ctx()+'/board/listCmt/'+$seqNum,d=>{
			$.getJSON($.ctx()+'/board/detail/'+$seqNum,d=>{
				console.log("'/board/detail/'+$seqNum : "+$seqNum);
				let $depth = d.detail.depth;
				let $ord = d.detail.ord;
				console.log("---getJSON---$ord------"+$ord);
				let $parent = d.detail.parent;
				
				$('#seqNum').attr({name:$seqNum});
				$('#depth').attr({name:$depth});
				$('#ord').attr({name:$ord});
				$('#parent').attr({name:$parent});
				
				$('#td_content1').html(x.listNum);
				$('#td_content2').html(d.detail.title);
				$('#td_content3').html(d.detail.writer);
				$('#td_content4').html(d.detail.content);
				
			});
			$.each(d.listCmt,(i,j)=>{
				var $cmt_no = j.cmt_no;
				var $cmt_writer = j.cmt_writer;
				var $cmt_pw = j.cmt_pw;
				var $cmt_content = j.cmt_content;
				$cmt_writer.replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;").trim();
				$cmt_content.replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;");
				
				/*댓글 화면 */
					let $cmt_li=$('<li/>').attr({id:$cmt_no}).append(
							$('<div/>').attr({style:"padding-top: 10px;"}).append(
								$('<div/>').attr({style:"height: 20px;"}).append(
										$('<i/>').addClass("fas fa-user"),
										$('<span/>').attr({style:"margin: 0 0 0px 10px;"}).text(j.cmt_writer),
										$('<p/>').attr({style:"float: right;margin: 0;padding-top: 3px;"}).append(
												$('<a href="#"/>').html("수정").click(e=>{
			/* ==detail에서 댓글 수정 버튼 클릭  ==================================== 댓글 수정 버튼 클릭 ==================================== */
													var pwInput = prompt("비밀번호를 입력하세요 ","비밀번호");
													$.ajax({
														 url : $.ctx()+'/board/validcmt/'+pwInput,
														 method : 'post',
											             contentType : 'application/json',
											             data : JSON.stringify({
											            	 pwInput :pwInput, 
											            	 num : $seqNum,
											            	 cmt_no:$cmt_no
											             }),
											             success:d=>{
											            	 if(d.auth===false){
																	alert('비밀번호 확인해주세요');
																}else{
 /* ==detail에서 댓글 수정 화면 START  =============================================== detail에서 댓글 수정 화면 START  ==================================== */
																	console.log("댓글 수정 $cmt_no : "+$cmt_no);
																	
																	let cmtBox = $('<table/>').addClass("cminput").append(
																			$('<tbody/>').append(
																				$('<tr/>').append(
																					$('<td colspan="4"/>').append(
																							$('<div/>').append(
																									"작성자 : ",
																									$('<input>').attr({id:"update_writer", maxlength:"20"}).val($cmt_writer)
																									.keyup(function(event){
																							            if($(this).val().length>=20){
																							            	console.log("작성자는 20자 이내로 가능합니.update_writer.keyup : ");
																							    			alert("작성자는 20자 이내로 가능합니다. (수정)");
																							    			$(this).focus();
																							    		};
																									})
																									)
																							),
																					$('<td colspan="4"/>').append(
																							$('<div/>').append(
																									"비밀번호 : ",
																									$('<input>').attr({id:"update_pw",type:"password" , maxlength:"20"})
																									.keyup(function(event){
																										console.log("!!!! cmtUpdateValid.update_pw.keyup : ");
																										if($(this).val().length>=20){
																											alert("비밀번호는 20자 이내로 가능합니다. (수정)");
																											$(this).focus();
																										};
																									})
																									
																									)
																							)
																						)
																					,
																				$('<tr/>').append(	
																					$('<td colspan="7"/>').addClass("i2").append(
																						$('<div/>').addClass("comm_write_wrap border-sub skin-bgcolor").append(  //style="white-space: pre-wrap; height:350px"
																							$('<textarea/>').text($cmt_content).attr({id:"update_content", style:"white-space: pre-wrap; overflow: hidden; line-height: 20px; height: 80px;"}).addClass("autosize textarea m-tcol-c")
																							.keyup(
																									function(event){
																										let $content = $('#update_content').val();
																										$('#update_count_geul').html($content.length);
																										console.log("$content.length : "+$content.length);
																										if($content.length>300){
																											alert("최대 300자 입력 가능합니다.");
																										}
																									}
																									/*,function(element){
																										 $('#update_content').style.height = "5px";
																										 $('#update_content').style.height = ($('#update_content').scrollHeight)+"px";
																											}*/
																									/*,app.fn.autoGrow()*/
																									)
																							,
																							$('<div/>').attr({style:"margin: 10px 16px 10px; font-size: 13px; color: #999; line-height: 22px; text-align: right;"}).append(
																									$('<span/>').attr({style:"position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;"}).html("현재 입력한 글자수"),
																									$('<strong/>').attr({id:"update_count_geul", style:"font-weight: 400;"}).html("0"),
																									"/",
																									$('<span/>').attr({style:"position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;"}).html("전체 입력 가능한 글자수"),
																									$('<span/>').attr({style:"font-size: 13px; color: #999; line-height: 22px; text-align: right;"}).html("300자")
																									)
																							)
																					),
																					$('<td/>').addClass("i3").append(
																							$('<div/>').addClass("cmt_btn u_cbox_btn_upload _submitBtn").attr({style:"text-align: center;"}).append(
																									$('<a/>').attr({href:"#",style:" font-size: 13px; font-weight: bold; line-height: 130px; text-align: center;display: block;width: 100%; height: 100%;"}).addClass("u_cbox_txt_upload _submitCmt").html("수정")
																									.click(e=>{
																										//댓글 수정 테이블에서 수정완료버튼 클릭
																										let $seqNum = $('#seqNum').attr('name');
																										let $content= $('#update_content').val().replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;"); //태그입력방지
																										let $writer = $('#update_writer').val().replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;").trim();
																										let $pw = $('#update_pw').val();
																										
																										/* 유효성 검사 */
																										let v = app.valid.cmtUpdateValid({
																											/*$seqNum:$seqNum,
																											$content:$content,
																											$writer:$writer,
																											$pw:$pw*/
																											});
																										console.log("let v = app.valid.cmtUpdateValid();");
																										if(v){
																											 $.ajax({
																									             url : $.ctx()+'/board/updateComment',
																									             method : 'put',
																									             contentType : 'application/json',
																									             data : JSON.stringify({
																									            	 num : $seqNum,
																									            	 cmt_no: $cmt_no,
																									            	 cmt_content :$content,
																									            	 cmt_writer :$writer, 
																									            	 cmt_pw : $pw,
																									             }),
																									             success : d=>{
																									            	alert('댓글 수정 완료 ');
																									            	
																									            	$('#wrapper').empty();
																									         		$('#wrapper').append($('<div/>').attr({id : 'contents'}));
																									         		$('#wrapper').html(app.page.detailBrd());
																									         		app.service.detail({seqNum:$seqNum });
																									             }
																									           });
																										}
																									}
																								)
																						)
																					)
																				)
																			)
																	);

																	/*app.valid.cmtValid(); 
																	$('#update_count_geul').html("0");*/
																	//app.fn.countCmt(); 

																	/*$('#update_content').keyup(e=>{
																		let $content = $('#update_content').val();
																		console.log("2222222222$content : "+$content);
																		$('#update_count_geul').html($content.length);
																		console.log("$('#update_count_geul').html($content.length); "+$content.length);
																		if($content.length>300){
																			alert("최대 300자 입력 가능합니다.");
																		}
																	});*/
																	
																	$('#'+$cmt_no).empty();
																	$('#'+$cmt_no).append(cmtBox);
																
/*																		$('#wrapper').empty();
																		$('#wrapper').append($('<div/>').attr({id : 'contents'}));*/
																	
/* ==detail에서 댓글 수정 화면   END  ===================== END ========================== detail에서 댓글 수정 화면   END  ==================================== */
																};
											             }
													});
													
													$.ajax({
														url: $.ctx()+'/board/updateCmt',
														method: 'PUT',
														contentType:'application/json',
														data: JSON.stringify({
															num:$seqNum,
															/*cmt_writer:
															cmt_pw:,
															cmt_content:*/
															})
													});
												}),
												$('<a href="#"/>').html("삭제").attr({style:"margin-left: 10px;"}).click(e=>{
													/* 삭제 버튼 클릭 */
													var pwInput = prompt("비밀번호를 입력하세요 ","비밀번호");
													$.ajax({
														 url : $.ctx()+'/board/validcmt/'+pwInput,
														 method : 'post',
											             contentType : 'application/json',
											             data : JSON.stringify({
											            	 pwInput :pwInput,
											            	 num : $seqNum,
											            	 cmt_no:$cmt_no
											             }),
											             success:d=>{
											            	 if(d.auth===false){
																	alert('비밀번호 확인해주세요');
																}else{
																	alert('비밀번호 일치,삭제');
																	console.log("삭제 $cmt_no : "+$cmt_no);
																	 $.ajax({
															             url : $.ctx()+'/board/deleteComment',
															             method : 'delete',
															             contentType : 'application/json',
															             data : JSON.stringify({
															            	 num : $seqNum,
															            	 cmt_no: $cmt_no,
															            	 /*cmt_content :$content,
															            	 cmt_writer :$writer, 
															            	 cmt_pw : $pw,*/
															             }),
															             success : d=>{
															            	alert('댓글 삭제 완료 ');
															            	$('#'+$cmt_no).empty();
																			$('#'+$cmt_no).append('<div style="margin:20px 0 20px 0;">작성자에 의해 삭제된 댓글입니다.</div>');
															            	
															            	
															             }
															           });
																};
											             }
													});
													
													$.ajax({
														url: $.ctx()+'/board/updateCmt',
														method: 'PUT',
														contentType:'application/json',
														data: JSON.stringify({
															num:$seqNum,
															/*cmt_writer:
															cmt_pw:,
															cmt_content:*/
															
														})
													});//-------0000-------
													
													//삭제끝
												})
												)
										
								),
								$('<p/>').attr({style:"padding-left: 40px;padding: 10px 0px 10px 50px; margin: 3px 0 0 0; line-height: 15px; text-align: left; word-break: break-all; word-wrap: break-word;"}).append(
									$('<span/>').attr({style:"white-space: pre-line;  line-height: 22px;"}).text(j.cmt_content)
									)
								)).appendTo($('#cmt_list'));
					$('<li>').attr({style:"height: 1px; padding: 0; overflow: hidden; font: 0/0 arial; border-bottom-width: 1px; border-bottom-style: dotted;"}).appendTo($('#cmt_list'));
			
		})
		});
		
		
		//기존 댓글 리스트 END
		var cmt = app.page.cmtTable();
		cmt.appendTo($('#cmt_div'));
		
		app.valid.blankValid(); 
		$('#count_geul').html("0");
		app.fn.countCmt(); 
		/* 댓글 입력창 END */
		
		// detail -> 해당 글 수정
		$('#update_btn').click(e=>{
			console.log("update_btn 클릭");
			validation({seqNum:$seqNum, move:"updateBrd"});
		});
		// detail -> 해당 글 삭제
		$('#delete_btn').click(e=>{
			console.log("delete_btn 클릭");
			validation({seqNum:$seqNum, move:"deleteBrd"});
		});
		// detail -> 해당 글에 대한 답글 입력
		$('#reply_btn').click(e=>{
			let $depth = $('#depth').attr('name');
			let $ord = $('#ord').attr('name');
			let $parent = $('#parent').attr('name');
			let push_parent = '';
			let push_ord='';
			
			$.getJSON($.ctx()+'/board/chkOrd/'+$seqNum,d=>{
				let $lastOrd = d.lastOrd;
				if($lastOrd==null){
					$lastOrd=0;
				};
				push_ord=parseInt($lastOrd)+1;

				console.log("d.lastOrd : "+$lastOrd);
				console.log("parseInt($lastOrd)+1; : "+(parseInt($lastOrd)+1));
				console.log("------1111-제이슨후-push_ord--"+push_ord);	
				
				console.log("======= "+$seqNum+" 현 게시물에서 답글 버튼 클릭 후 ===");
				console.log("===$parent : "+$parent);
				console.log("===$ord : "+$ord);  // undefined	
				console.log("===$depth : "+$depth);
				//getJSON 리스트
				
				if($parent=='0'){
					console.log("0이니까 최초 답글. parent에 $seqNum 입력할거야 "+$seqNum);
					
					if(typeof $ord=='undefined'){
						console.log("111111$ord 가 undefined 이야");
						$ord = 0;
					};
					push_parent = $seqNum;
					
					
					//push_ord = parseInt($ord)+1;
					
					console.log("------1111-$parent=='0'-push_ord--: "+push_ord);	
					console.log("------1111-$parent=='0'-push_parent-- : "+push_parent);	
					app.service.reply({parent:push_parent,ord:push_ord, depth:$depth});	
					
				}else{
					console.log("parent 있으니까  $parent 입력할거야 "+$parent);
					push_parent = $parent;
					push_ord=$ord;
					app.service.reply({parent:push_parent,ord:push_ord, depth:$depth});
				};
				
				
			});
			
		});
		
	};//detail() END =========================================================================================================
	var reply=x=>{
		/*@param ; 
		 * parent
		 * ord
		 * depth
		 *   */
		console.log("-------------app.page.reply 진입");
		
		let $parent =x.parent;
		let $depth = x.depth;
		let $ord=x.ord;
		
		/*console.log("$parent : "+$parent);
		console.log("$depth : "+$depth);
		console.log("$ord : "+$ord);*/
		
		$('#wrapper').html(app.page.inputBrd());
		//
		
		//app.page.fileUpload();
		/*   add()와 동일  start    */
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
			
			console.log("$title : "+$title);
			console.log("$writer : "+$writer);
			console.log("$pw : "+$pw);
			
			/* 유효성 검사 */
			let $isValid= app.valid.isValid();
			if($isValid){
				$.ajax({
		             url : $.ctx()+'/board/addReply',
		             method : 'post',
		             contentType : 'application/json',
		             data : JSON.stringify({
		            	 title : $title,
		            	 content :$content,
		            	 writer :$writer, 
		            	 pw : $pw,
		            	 parent:$parent,
		            	 ord:$ord,
		            	 depth:$depth
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
		
		
		
	};////reply() END =========================================================================================================
	
	var validation=x=>{
		/* @param seqNum
		 * @param move
		*/
		console.log('validation 진입========');
		console.log('x.move : '+x.move);
		if(x.move==='deleteBrd'){
			alert("삭제 하시겠습니까?");
		}else if(x.move==='updateBrd'){
				alert("수정 하시겠습니까?");
		};
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
	}; //validation() END =========================================================================================================
	
	return{init:init,
			list:list,
			add:add,
			reply:reply,
			detail:detail,
			validation:validation
			};
})();

app.valid=(()=>{
	var checkPassword=x=>{
		console.log("----app.valid.checkPassword 진입----");
		//비밀번호
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
	};//checkPassword() END =========================================================================================================
	var cmtValid=()=>{
		console.log("----app.valid.cmtValid 진입----");
		let vd = false;
		//blankValid();//공백체크
		
		let $writer=$.trim($('#input_writer').val());
		let $pw=$.trim($('#input_pw').val());
		let $content=$.trim($('#input_content').val());
		
		//글자수 
		var getByteLength = function(s,b,i,c){
			  for(b=i=0; c=s.charCodeAt(i++); b+=c>>11?3:c>>7?2:1);
			  return b;
			};
		let $contentByte = getByteLength($content);
	
		if($writer===''||$writer===null){
			console.log("111111111");
			alert("작성자를 입력하세요");
			$('#input_writer').focus();
			vd= false;
		}else if($pw===''||$pw==null){
			alert("비밀번호를 입력하세요");
			$('#input_pw').focus();
			vd= false;
		}else if($content===''||$content==null){
			alert("내용을 입력하세요");
			$('#input_content').focus();
			vd= false;
		}else if($content.length>300){
			alert("내용을 글자수에 맞춰 입력하세요");
			$('#input_content').focus();
			vd= false;	
		}else {
			vd = checkPassword($pw);
		};
		return vd;
	};
	//cmValid() END =========================================================================================================
	var cmtUpdateValid=()=>{
		

		//=========== 댓글 수정 유효성 검사 START =========================
		console.log("----app.valid.cmtUpdateValid 진입----");
		let vd = false;
		//blankValid();//공백체크
		let $writer=$.trim($('#update_writer').val());
		let $pw=$.trim($('#update_pw').val());
		let $content=$.trim($('#update_content').val());
		
		console.log("!!!! cmtUpdateValid.$writer : "+$writer);
		console.log("!!!! cmtUpdateValid.$pw : "+$pw);
		console.log("!!!! cmtUpdateValid.$content : "+$content);
		
		//글자수 
		/*var getByteLength = function(s,b,i,c){
			  for(b=i=0; c=s.charCodeAt(i++); b+=c>>11?3:c>>7?2:1);
			  return b;
			};
		let $contentByte = getByteLength($content);
		console.log("!!!! cmtUpdateValid.$contentByte : "+$contentByte);*/
	/*
	 *페이지 생성시 바로 keyup으로 옮김
	 *
		$('#update_writer').keyup(function(event){
			console.log("!!!! cmtUpdateValid.update_writer.keyup : ");
            if($writer.length>=20){
            	console.log("!!!! cmtUpdateValid.update_writer.keyup : ");
    			alert("작성자는 20자 이내로 가능합니다. (수정)");
    			$(this).focus();
    		};
		});
		
		$('#update_pw').keyup(function(event){
			console.log("!!!! cmtUpdateValid.update_pw.keyup : ");
			if($(this).val().length>=20){
				alert("비밀번호는 20자 이내로 가능합니다. (수정)");
				$(this).focus();
			};
		});
		*/
		
		if($writer===''||$writer===null){
			console.log("111111111");
			alert("작성자를 입력하세요");
			$('#update_writer').focus();
			vd= false;
		}else if($pw===''||$pw==null){
			alert("비밀번호를 입력하세요");
			$('#update_pw').focus();
			vd= false;
		}else if($content===''||$content==null){
			alert("내용을 입력하세요");
			$('#update_content').focus();
			vd= false;
		}else if($content.length>300){
			alert("내용을 글자수에 맞춰 입력하세요");
			$('#update_content').focus();
			vd= false;
			//내용 과다 777777777777777777777777777777777777
		}else {
			vd = checkPassword($pw);
		};
		return vd;
	};
	var isValid=()=>{
		console.log("----app.valid.isValid 진입----");
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
		
		/*//password : _(underscore), 영어, 숫자만 가능
		$('#input_pw').keyup(function(event){
			if (!(event.keyCode >=37 && event.keyCode<=40)) {
                var inputVal = $(this).val();
                $(this).val($(this).val().replace(/[^\w~@\#$%<>^&*\()\-=+_\']/gi,'')); //영문대소문자, 숫자, 특수기호 ~!@#$%^&*()_+-=
            }
		});*/
		
		//$.trim() : 앞뒤의 빈칸 제거
		// null 체크 = 
		if($title===''||$title==null){
			alert("제목을 입력하세요");
			$('#input_title').focus();
			vd= false;
		}else  
		if($writer===''||$writer==null){
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
	}; //isValid() END =========================================================================================================
	var blankValid=()=>{
		console.log("----app.valid.blankValid 진입----");
		console.log("55555555555555");
		$('#input_title').keyup(function(event){
			if($(this).val().length>=99){
				alert("제목은 100자 이내로 가능합니다.");
				$('#input_title').focus();
			};
		});
		
		//작성자 : 20글자 이하 영문대소문자, 한글
		$('#input_writer').keyup(function(event){
			$(this).val().substr(0,60);
			/*if (!(event.keyCode >=37 && event.keyCode<=40)) {
                var inputVal = $(this).val();
                $(this).val($(this).val().replace(/[^a-zA-Z가-힣]/gi,'')); //_(underscore), 영어, 숫자만 가능
            };*/
            if($(this).val().length>=20){
    			alert("작성자는 20자 이내로 가능합니다.");
    			$(this).focus();
    		};
		});
		
		$('#input_pw').keyup(function(event){
			if($(this).val().length>=20){
				alert("비밀번호는 20자 이내로 가능합니다.");
				$('#input_pw').focus();
			};
		});
		
		/*//password : _(underscore), 영어, 숫자만 가능
		$('#input_pw').keyup(function(event){
			if (!(event.keyCode >=37 && event.keyCode<=40)) {
                var inputVal = $(this).val();
                $(this).val($(this).val().replace(/[^\w~@\#$%<>^&*\()\-=+_\']/gi,'')); //영문대소문자, 숫자, 특수기호 ~!@#$%^&*()_+-=
            }
		});*/

		/*//작성자 : 20글자 이하 영문대소문자, 한글
		$('#input_writer').keyup(function(event){
            if($(this).val().length> $(this).attr('maxlength')){
    			alert("dd 작성자는 "+$(this).atrr('maxlength')+"자 이내로 가능합니다.");
    			$(this).val($(this).val().substr(0, $(this).atrr('maxlength')));
    			$(this).focus();
    		};
		});*/
		
	}; //blankValid() END =========================================================================================================
	return {
		isValid:isValid,
		blankValid:blankValid,
		cmtValid:cmtValid,
		cmtUpdateValid:cmtUpdateValid
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
	var autoGrow=(element)=>{
		 element.style.height = "5px";
		 element.style.height = (element.scrollHeight)+"px";
	};
	/**/
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
	var countCmt=()=>{
		$('#input_content').keyup(e=>{
			let $content = $('#input_content').val();
			$('#count_geul').html($content.length);
			if($content.length>300){
				alert("최대 300자 입력 가능합니다.");
			}
		});
	};
	return {countText:countText
		,countCmt:countCmt
		,autoGrow:autoGrow};
})();



// 페이지 구성 =============================================================================================================
app.page=(()=>{
	/* 댓글 입력창 구현 화면 */
	var cmtTable =()=>{
		let cmtBox = $('<table/>').addClass("cminput").append(
				$('<tbody/>').append(
					$('<tr/>').append(
						$('<td/>').append(
								$('<div/>').append(
										"작성자 : ",
										$('<input>').attr({id:"input_writer", maxlength:"20"})
										)
								),
						$('<td/>').append(
								$('<div/>').append(
										"비밀번호 : ",
										$('<input>').attr({id:"input_pw", type:"password",maxlength:"20"})
										)
								)
							)
						,
					$('<tr/>').append(	
						$('<td colspan="2"/>').addClass("i2").append(
							$('<div/>').addClass("comm_write_wrap border-sub skin-bgcolor").append(
								$('<textarea/>').attr({id:"input_content", style:"border-color: white;overflow: hidden; line-height: 14px; height: 80px;"}).addClass("autosize textarea m-tcol-c"),
								$('<div/>').attr({style:"margin: 10px 16px 10px; font-size: 13px; color: #999; line-height: 22px; text-align: right;"}).append(
										$('<span/>').attr({style:"position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;"}).html("현재 입력한 글자수"),
										$('<strong/>').attr({id:"count_geul", style:"font-weight: 400;"}),
										"/",
										$('<span/>').attr({style:"position: absolute; clip: rect(0 0 0 0); width: 1px; height: 1px;margin: -1px; overflow: hidden;"}).html("전체 입력 가능한 글자수"),
										$('<span/>').attr({style:"font-size: 13px; color: #999; line-height: 22px; text-align: right;"}).html("300자")
										)
								)
						),
						$('<td/>').addClass("i3").append(
								$('<div/>').addClass("cmt_btn u_cbox_btn_upload _submitBtn").attr({style:"text-align: center;"}).append(
										$('<a/>').attr({href:"#",style:" font-size: 13px; font-weight: bold; line-height: 130px; text-align: center;display: block;width: 100%; height: 100%;"}).addClass("u_cbox_txt_upload _submitCmt").html("등록")
										.click(e=>{
											/* ==== 새 댓글 입력 클릭 이벤트  ==== */
											let $seqNum = $('#seqNum').attr('name');
											let $content= $('#input_content').val().replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;"); //태그입력방지
											let $writer = $('#input_writer').val().replace(/&/gi,"&amp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;").trim();
											let $pw = $('#input_pw').val();
											
											console.log("----새 댓글 입력시 $seqNum : "+$seqNum);
											/* 유효성 검사 */
											let v = app.valid.cmtValid();
											if(v){
												 $.ajax({
										             url : $.ctx()+'/board/addComment/'+$seqNum,
										             method : 'POST',
										             contentType : 'application/json',
										             data : JSON.stringify({
										            	 num : $seqNum,
										            	 cmt_content :$content,
										            	 cmt_writer :$writer, 
										            	 cmt_pw : $pw,
										             }),
										             success : d=>{
										            	alert('새 댓글 입력완료 ');
										            	$('#wrapper').empty();
										         		$('#wrapper').append($('<div/>').attr({id : 'contents'}));
										         		$('#wrapper').html(app.page.detailBrd());
										         		app.service.detail({seqNum:$seqNum });
										             }
									           });
											}
										}
									)
								)
						)
					)
				)
		);
		return cmtBox;
	};
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
				$('<table/>').attr({id:"board_table", style:"margin-top:30px;"}).addClass("table table-list table-bordred table-striped").appendTo('#list_tbl');
					$('<thead/>').attr({id:"board_thead"}).appendTo('#board_table');
						$('<th/>').addClass("th-num").append($('<span/>').html("NO")).appendTo('#board_thead');
						$('<th/>').addClass("th-title").append($('<span/>').html("제목")).appendTo('#board_thead');
						$('<th/>').addClass("th-writer").append($('<span/>').html("작성자")).appendTo('#board_thead');
						$('<th/>').addClass("th-regidate").append($('<span/>').html("작성일자")).appendTo('#board_thead');
					$('<tbody>').attr({id:"tbody_list"}).appendTo('#board_table');
		
		/* ================검색 및버튼  ================*/
		$('<div/>').attr({id:"btn_col"}).addClass("col-md-12").appendTo($('#list_col'));
		
		
		/*			+'<button id="list_btn" class="btn btn-primary pull-left">목록가기</button>'*/
		$('<div>').append(
				$('<button/>').attr({id:"list_btn"}).html("목록보기").addClass("btn btn-default pull-left")
				,$('<button/>').attr({id:"write_btn"}).html("글쓰기").addClass("btn btn-default pull-right")
				.click(e=>{
					console.log('글쓰기 버튼 클릭');
					app.service.add();
				})
			).appendTo('#list_col');
		/*$('<button/>').attr({id:"list_btn"}).html("목록보기").addClass("btn btn-default pull-left").appendTo($('#list_row'));
		//글쓰기
		$('<button/>').attr({id:"write_btn"}).html("글쓰기").addClass("btn btn-default pull-right").appendTo('#list_row')
		.click(e=>{
			console.log('글쓰기 버튼 클릭');
			app.service.add();
		});*/
		
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
			                  +'<textarea class="form-control autosize" id="input_content" style="white-space: pre-wrap; height:350px">'
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
		            /* 파일 업로드 */
		            +'<div id="file_div" style="margin-top: 10px;">'
		              
	                 
		              
		            +'</div>'
		            +''
		            
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
		    		).appendTo($('#file_div'));*/
		            
		            
		            
		            
		            
		        	/*
		    		
		    		<div class="imgup_con">
		    			<form enctype="multipart/form-data" id="imgup_form">
		    				<div class="imgup_prev">
		    					<div id="targetLayer" style="opacity: 0.7;"></div>
		    					<div class="imgup">
		    						<input type="file" name="find_img" id="find_img" class="inputFile">
		    					</div>
		    				</div>
		    			</form>
		    		</div>
		    		*/
		            
		            
		    		
		            
		            /* 버튼 div */
		            +'<div id="btn_div" style="text-align: right; margin-top: 50px;">'
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
		                  +'<th colspan="2" id="" style="background-color:#eeeeee; text-align: center;">게시글'
		                  +'<span id="seqNum"/>'
		                  +'<span id="parent"/>'
		                  +'<span id="depth"/>'
		                  +'<span id="ord"/>'
		                  +'</th>'
		                +'</tr>       '
		              +'</thead>'
		              +''
		              +'<tbody>'
		           /* +'<tr>'
		              +'<td id="td1" style="width: 160px; text-align: center;">NO</td>'
		              +'<td id="td_content1" style="text-align: left;"></td>'
		            +'</tr>'*/
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
		              +'<td id="td_content4" style="height:200px; text-align: left; white-space: pre-wrap;word-break:break-all;"></td>'
		            +'</tr>'
		              +'</tbody>'
	            +'</table>'
	           
	              +'<div id="btn_div" style="text-align: right; margin: 0 0 50px;">'
	                +'<button id="list_btn" class="btn btn-primary pull-left">목록가기</button>'
	                +'<button id="reply_btn" class="btn btn-primary" style="margin-left: 5px;">답글</button>'
	                +'<button id="update_btn" class="btn btn-primary" style="margin-left: 5px;">수정</button>'
	                +'<button id="delete_btn" class="btn btn-primary" style="margin-left: 5px;">삭제</button>'
	              +'</div>'
	              
	              /* 댓글 cmt_div START*/
	              +'<div id="cmt_div" class="cmt_div">'
	              
	              +'<div style="clear: both; height: 0pt; font: 0pt/0pt arial;"></div>'
	              +'<div style="display:none;" class="cc_paginate cmt" id="cmt_paginate"></div>'
	            +'</div>' 
	              /* 댓글 cmt_div 끝 */ 
	            
	            
	          +'</div>'
	         +'</div>'
	      +'</div>';
		
		
		return detailPage;
	};
	var fileUpload =()=>{
		var profile;
		//$('<label/>').addClass('bold').html("프로필 사진 업로드").attr({style:"padding-top:20px;padding-bottom:5px"}).appendTo($('#file_div'));
		$('<div/>').append(
				$('<form/>').attr({enctype:'multipart/form-data',id:'file_form'}).append(
						$('<div/>').append(
								$('<div/>').attr({id:'targetLayer',style:'opacity: 0.7;'}),
								//$('<img/>').addClass('icon_choose_image').attr({src:$.img()+'/hyeri/upimageicon.png',style:'opacity:0.5'}),
								$('<div/>').append(
										$('<input/>').attr({type:"file",id:'find_file'})
										.change(
												/*function(a) {
											let ck = (this.files[0].name.match(/jpg|gif|png|jpeg/i)) ? true : false;
											if(ck){
												profile=this.files[0].name;
												hyeri.func.iu(this);
											}else{
												alert("gif,png,jpg,jpeg 파일만 업로드 할 수 있습니다.");
											}
										}*/
												)	
								)
						)
						
				)
		).appendTo($('#file_div'));
		
	/*
		
		<div class="imgup_con">
			<form enctype="multipart/form-data" id="imgup_form">
				<div class="imgup_prev">
					<div id="targetLayer" style="opacity: 0.7;"></div>
					<div class="imgup">
						<input type="file" name="find_img" id="find_img" class="inputFile">
					</div>
				</div>
			</form>
		</div>
		*/
		
		
		
		
	};
	return{cmtTable:cmtTable
		, fisrt:fisrt
		, listBrd:listBrd
		, inputBrd:inputBrd
		, detailBrd:detailBrd
		, fileUpload:fileUpload };
})();









/*//바이트 수 계산
var getByteLength = function(s,b,i,c){
	  for(b=i=0; c=s.charCodeAt(i++); b+=c>>11?3:c>>7?2:1);
	  return b;
	};*/
	/* console.log(getByteLength("1234567890") + " Bytes");
		console.log(getByteLength("안녕하세요") + " Bytes");*/
	