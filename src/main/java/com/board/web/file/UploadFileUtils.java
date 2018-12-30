package com.board.web.file;

import java.io.File;
import java.util.Calendar;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UploadFileUtils {
	private static final Logger logger = LoggerFactory.getLogger(UploadFileUtils.class);
	
	public static String uploadFile(String uploadPath
			, String originName
			, byte[] fileData) {

		
		UUID uid = UUID.randomUUID();
		
		String saveName = uid.toString() + "_"+originName;
		
		//String savePath = calPath();
		
		
		
		
		
		return "";
	}

	private static String calPath(String uploadPath) {
		Calendar cal = Calendar.getInstance();
		String yearPath = File.separator + cal.get(Calendar.YEAR);
		
		
		return null;
	}
	
}
