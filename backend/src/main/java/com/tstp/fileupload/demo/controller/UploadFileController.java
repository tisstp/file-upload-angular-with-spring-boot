package com.tstp.fileupload.demo.controller;


import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.io.FilenameUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tstp.fileupload.demo.bean.ImageBean;

/**
 * @author sathaphorn.stp (T.STP)
 * @since 26-12-2018, 22:53
 */
@RestController
@RequestMapping("/uploadfile")
public class UploadFileController {

  final static Logger log = LogManager.getLogger(UploadFileController.class);
  final static String UPLOADED_FOLDER = ""; // folder target upload


  @PostMapping(value = "form1")
  @ResponseBody
  public ImageBean uploadSaveToFolder(@RequestParam("file") MultipartFile file) {
    ImageBean image = new ImageBean();

    if (file == null) {
      log.warn("Please select a file to upload");
      return image;
    }

    String filename = StringUtils.cleanPath(file.getOriginalFilename());
    Path rootLocation = Paths.get(UPLOADED_FOLDER);

    try {
      if (file.isEmpty()) {
        log.error("Failed to store empty file " + filename);
        return image;
      }

      if (filename.contains("..")) {
        // This is a security check
        log.error("Cannot store file with relative path outside current directory " + filename);
        return image;
      }

      // Generate File Name
      /*SimpleDateFormat dt = new SimpleDateFormat("yyyyy-mm-dd_hhmmss");
      String newFileName = "file_".concat(dt.format(new Date()));
      String extension = FilenameUtils.getExtension(filename);
      filename = newFileName.concat(".").concat(extension);*/

      try (InputStream inputStream = file.getInputStream()) {
        Path pathFile = rootLocation.resolve(filename);

        // save file to target(server)
        Files.copy(inputStream, pathFile, StandardCopyOption.REPLACE_EXISTING);

        // read file to bytes
        // Files.readAllBytes(pathFile);

        image.setName(filename);
        image.setUrl(pathFile.toString());
        log.info("You successfully uploaded '" + filename + "'");
      }
    } catch (IOException e) {
      log.error("Failed to store file " + filename, e);
    }

    return image;
  }

  /**
   * http://localhost:8080/uploadfile/test
   */
  @GetMapping("test")
  @ResponseBody
  public String test() {
    return "Hello World.";
  }
}
