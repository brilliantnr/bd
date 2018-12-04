package com.board.web.board;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
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
	public Map<String,Object> listBoard(@PathVariable String pageNo,
			@PathVariable Object keyword) {
		logger.info(" list() 진입 ");
		Map<String,Object> map = new HashMap<>();
		
		map.put("pageNo", pageNo);
		map.put("keyword", keyword);
		System.out.println("map.get keyword :  "+map.get("keyword"));
		//페이지네이션
		pagination.excute(map);
		map.put("list", mapper.listBoard(map));
		System.out.println("map.get(\"list\")결과 : "+map.get("list"));
		return map;
	};
	
	/*
	 * 서치 조건 추가중 에러
	 * @GetMapping("/list/{pageNo}/{keyword}/{con}")
	public Map<String,Object> listBoard(@PathVariable String pageNo,
			@PathVariable Object keyword,
			@PathVariable String con) {
		logger.info(" list() 진입 ");
		Map<String,Object> map = new HashMap<>();
		
		map.put("pageNo", pageNo);
		map.put("keyword", keyword);
		map.put("con", con);
		System.out.println("map.get keyword :  "+map.get("keyword"));
		//페이지네이션
		pagination.excute(map);
		map.put("list", mapper.listBoard(map));
		System.out.println("map.get(\"list\")결과 : "+map.get("list"));
		return map;
	};*/
	@GetMapping("/detail/{num}")
	public Map<String,Object> detailBoard(@PathVariable String num) {
		logger.info(" detail() 진입 ");
		Map<String,Object> map = new HashMap<>();
		map.put("num", num);
		logger.info("num : "+map.get("num"));
		
		map.put("detail", mapper.detailBoard(map));
		logger.info("detail 결과 : "+map.get("detail"));
		
		
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
	
	
	
		
}
