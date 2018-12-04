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
}
