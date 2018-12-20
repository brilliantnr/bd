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
	public int countlist(Map<?, ?> p);
	public void updateBoard(Map<?, ?> p);
	public void deleteBoard(Map<?, ?> p);
	
	/* reply */
	public void insertReply(Map<?, ?> p);
	public Integer checkOrd(Map<?, ?> p);
	
	/* 댓글 */
	public void insertComments(Map<?, ?> p);
	public Comments detailComments(Map<?, ?> p);
	public List<?> listComments(Map<?, ?> p);
	public int countComments(String p);
	public void updateComments(Map<?, ?> p);
	public void deleteComments(Map<?, ?> p);
}
