package com.board.web.board;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component @Data @Lazy
public class Comments {
	private int br_no,cmt_no;
	private String cmt_writer,cmt_pw,cmt_content;
}
