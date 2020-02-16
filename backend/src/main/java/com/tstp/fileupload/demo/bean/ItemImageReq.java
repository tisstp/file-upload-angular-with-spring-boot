package com.tstp.fileupload.demo.bean;

import org.springframework.web.multipart.MultipartFile;

/**
 * @author sathaphorn.stp (Tis)
 * @since 17-02-2020, 12:15 AM
 */
public class ItemImageReq {

  private String name;
  private MultipartFile file;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public MultipartFile getFile() {
    return file;
  }

  public void setFile(MultipartFile file) {
    this.file = file;
  }

  @Override
  public String toString() {
    return "ItemImageReq{" +
      "name='" + name + '\'' +
      '}';
  }

}
