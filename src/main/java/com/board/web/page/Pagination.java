package com.board.web.page;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.board.web.board.BoardMapper;

import lombok.Data;

@Component @Data @Lazy
public class Pagination {
	private static final Logger logger = LoggerFactory.getLogger(Pagination.class);
	
	@Autowired BoardMapper mapper;

public Map<?, ?> excute(Map<?, ?> p) {
	Map<String, Object> pg = (Map<String, Object>) p;
	
	logger.info("페이지네이션 진입");
	int pageNum = Integer.parseInt((String) pg.get("pageNo"));
	logger.info("pageNum : "+pageNum);
	
	int blockSize = 5; // 1~5, 6~10
	int rowSize = 5; 
	
	int rowCount =mapper.countTotalContents(p); //총 게시물의 수
	int pageCount = (int) Math.ceil((double)rowCount / (double)rowSize); // 총페이지수
	
	int beginPage = (int) (Math.floor((double)(pageNum - 1) / (double)blockSize) * blockSize + 1); //시작페이지 숫자
	int endPage = (pageCount > (beginPage + blockSize-1)) ? (beginPage + blockSize-1) : pageCount; //마지막 페이지 숫자
	
	int beginRow = (pageNum - 1) * rowSize + 1;
	int endRow = pageNum * rowSize;

	int preBlock = beginPage - 1;
	int nextBlock = beginPage + blockSize;
	
	boolean existPrev = (beginPage!=1);
	boolean existNext = (endPage<pageCount);
	/*
	System.out.println("총 게시글 수 - rowCount : "+rowCount);
	System.out.println("총 페이지 수  - pageCount : "+pageCount);
	System.out.println("시작페이지 숫자: beginPage : "+beginPage);
	System.out.println("마지막 페이지 숫자 - endPage : "+endPage);
	System.out.println("preBlock : "+preBlock);
	System.out.println("nextBlock : "+nextBlock);
	System.out.println("beginRow : "+beginRow);
	System.out.println("endRow : "+endRow);
	System.out.println("existPrev : "+existPrev);
	System.out.println("existNext : "+existNext);
	*/
	
	//pg.put("rowSize", rowSize);
	pg.put("rowCount", rowCount);
	pg.put("beginPage", beginPage);
	pg.put("endPage", endPage);
	pg.put("lastPage", pageCount);
	pg.put("beginRow", beginRow);
	pg.put("endRow", endRow);
	
	pg.put("preBlock", preBlock);
	pg.put("nextBlock", nextBlock);
	
	pg.put("existPrev", existPrev);
	pg.put("existNext", existNext);
	
	return pg;
}

}
