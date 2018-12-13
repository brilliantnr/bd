package com.board.web.board;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository
public interface BoardMapper {
	public void insertBoard(Map<?, ?> p);
	public Board detailBoard(Map<?, ?> p);
	public List<?> listBoard(Map<?, ?> p);
	public int countTotalContents(Map<?, ?> p);
	public void updateBoard(Map<?, ?> p);
	public void deleteBoard(Map<?, ?> p);
	
	/* 댓글 */
	public void insertComments(Map<?, ?> p);
	public Comments detailComments(Map<?, ?> p);
	public List<?> listComments(Map<?, ?> p);
	public int countComments(Map<?, ?> p);
	public void updateComments(Map<?, ?> p);
	public void deleteComments(Map<?, ?> p);
}
