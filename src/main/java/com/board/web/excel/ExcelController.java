package com.board.web.excel;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.board.web.board.Board;
import com.board.web.board.BoardMapper;

@RestController
@RequestMapping("/excel")
public class ExcelController {
	private static final Logger logger = LoggerFactory.getLogger(ExcelController.class);
	@Autowired BoardMapper mapper;
	
	@RequestMapping("/down/{keyword}")
	public void listExcel(HttpServletRequest request
			, HttpServletResponse response
			, Board board
			, @PathVariable String keyword) throws Exception, Exception {
		logger.info(" listExcel() 진입");
		
		
		
		// 그냥 평소에 마이바티스에서 데이터 뽑는 방법으로 데이터를 가져온다.
		Map<String,Object> map = new HashMap<>();
		map.put("keyword", keyword);
		
		List<?> dataList = mapper.listExcel(map);
		map.put("dataList", dataList);
		
		//map.put("dataList", mapper.listExcel(map));
		
		String curdate = new SimpleDateFormat("yyyyMMdd").format(new Date());
		
		// 엑셀 다운로드 메소드가 담겨 있는 객체
		MakeExcel me = new MakeExcel();
		me.download(request, response, map, curdate, "template.xlsx", "");
		
		//System.out.println("================================\n"+map.get("dataList"));
		System.out.println("================================\n"+dataList);
		
	}
		
}
