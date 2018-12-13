package com.board.web.board;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.board.web.page.Pagination;

@RestController
@RequestMapping("/board")
public class BoardController {
	private static final Logger logger = LoggerFactory.getLogger(BoardController.class);
	@Autowired BoardMapper mapper;
	@Autowired Pagination pagination;
	
	@GetMapping("/list/{pageNo}/{keyword}")
	public Map<String,Object> listBoard(@PathVariable String pageNo, @PathVariable Object keyword) {
		logger.info(" list() 진입 ");
		Map<String,Object> map = new HashMap<>();
		
		map.put("pageNo", pageNo);
		map.put("keyword", keyword);
		System.out.println("map.get keyword :  "+map.get("keyword"));
		
		pagination.excute(map);//페이지네이션
		map.put("list", mapper.listBoard(map));
		//System.out.println("map.get(\"list\")결과 : "+map.get("list"));
		return map;
	};
	
	@GetMapping("/detail/{num}")
	public Map<String,Object> detailBoard(@PathVariable String num) {
		logger.info(" detail() 진입 ");
		Map<String,Object> map = new HashMap<>();
		map.put("num", num);
		logger.info("num : "+map.get("num"));
		
		map.put("detail", mapper.detailBoard(map));
		//map.put("cmtList", mapper.listComments(map));
		//logger.info("detail 결과 : "+map.get("detail"));
		
		
		return map;
	}
	
	
	
	
	
	@PostMapping("/add")
	public Map<String, Object> add(@RequestBody Map<String,Object> pm) {
		logger.info(" add() 진입");
		Map<String,Object> map = new HashMap<>();
		logger.info("pm : "+pm);
		System.out.println(pm.get("title"));
		mapper.insertBoard(pm);
		return map;
	};
	
	@PutMapping("/update")
	public void updateBrd(@RequestBody Map<String,Object> p){
		logger.info(" updateBrd() 진입");
		logger.info("p : "+p);
		mapper.updateBoard(p);
	}
	/*@DeleteMapping("/delete")
	public void deleteBrd(@RequestBody Map<String,Object> p){
		logger.info(" deleteBrd() 진입");
		logger.info("p : "+p);
		mapper.deleteBoard(p);
	}*/
	@PutMapping("/delete")
	public void deleteBrd(@RequestBody Map<String,Object> p){
		logger.info(" deleteBrd() 진입");
		logger.info("p : "+p);
		mapper.deleteBoard(p);
	}
	
	@PostMapping("/valid/{pwInput}")
	public Map<String, Object> confirmPw(@RequestBody Map<String,Object> p){
		logger.info(" confirmPw() 진입");
		Map<String,Object> map = new HashMap<>();
		Board retrieveInfo = mapper.detailBoard(p);
		Boolean auth = false;
		/*
		System.out.println(p);
		System.out.println("p.get(\"pwInput\") : "+p.get("pwInput"));
		System.out.println("Board retrieveInfo : "+mapper.detailBoard(p));
		System.out.println("retrieveInfo : "+map.get("retrieveInfo"));
		*/
		if(p.get("pwInput").equals(retrieveInfo.getPw())) {
			auth = true;
		};
		
		map.put("auth", auth);
		map.put("retrieveInfo", retrieveInfo);
		System.out.println("auth : "+auth);
		return map;
	}
	
	/* =========================================
	 * 댓글 관련
	 * =========================================
	*/
	@PostMapping("/validcmt/{pwInput}")
	public Map<String, Object> validcmt(@RequestBody Map<String,Object> p){
		logger.info(" validcmt() 진입");
		Map<String,Object> map = new HashMap<>();
		Comments retrieveCmt = mapper.detailComments(p);
		Boolean auth = false;
		if(p.get("pwInput").equals(retrieveCmt.getCmt_pw())) {
			auth = true;
		};
		map.put("auth", auth);
		map.put("retrieveCmt", retrieveCmt);
		System.out.println("auth : "+auth);
		return map;
	}
	
	
	@PostMapping("/addComment/{num}")
	public Map<String, Object> addComment(@RequestBody Map<String,Object> pm) {
		Map<String,Object> map = new HashMap<>();
		logger.info(" addComment() 진입");
		
		System.out.println(pm.get("num"));
		
		mapper.insertComments(pm);
		map.put("detail", mapper.detailBoard(pm));
		map.put("listCmt", mapper.listComments(pm));
		return map;
	};
	@GetMapping("/listCmt/{num}")
	public Map<String,Object> listCmt(@PathVariable String num) {
		logger.info(" listCmt() 진입 ");
		Map<String,Object> map = new HashMap<>();
		System.out.println("listCMt - ");
		map.put("num", num);
		map.put("listCmt", mapper.listComments(map));
		System.out.println("map.get(\"listCmt\") : "+map.get("listCmt"));
		return map;
	};
	
	@PutMapping("/updateComment")
	public void updateComment(@RequestBody Map<String,Object> p){
		logger.info(" updateComment() 진입");
		logger.info("p : "+p);
		mapper.updateComments(p);
	}
	
	
	
	
	
	
	
	
	
	
		
}
