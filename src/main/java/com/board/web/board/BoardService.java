package com.board.web.board;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;


public interface BoardService {
	public void addBoard(Map<?, ?> p);
	public Board retrieveBoard(Map<?, ?> p);
	public List<?> searchBoard(Map<?, ?> p);
	public List<?> listBoard(Map<?, ?> p);
	public int count();
	public void modifyBoard(Board p);
	public void removeBoard(Board p);
}
