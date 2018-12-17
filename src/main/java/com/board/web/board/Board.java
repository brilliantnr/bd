package com.board.web.board;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component @Data @Lazy
public class Board {
	private String title, content, writer, pw, regidate;
	private int num;
	private int parent, ord, depth;
	
}
