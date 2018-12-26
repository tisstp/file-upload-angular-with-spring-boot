import {Component, OnInit} from '@angular/core';
import {UploadService} from './upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'File Upload with Spring boot';
  selectedFile: File;


  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {

  }

  onFileSelected(event) {
    console.log('File Changed: ', event);
    if (event) {
      this.selectedFile = <File>event.target.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onUpload() {
    console.log(this.selectedFile);
    if (this.selectedFile == null) {
      console.log('You not Choose file.');
    } else if (this.uploadService.checkName(this.selectedFile)) {
      console.log('Invalid file name. [' + this.selectedFile.name + ']');
    } else if (this.uploadService.checkType(this.selectedFile)) {
      console.log('Invalid file type. [' + this.selectedFile.type + ']');
    } else if (this.uploadService.checkSize(this.selectedFile)) {
      console.log('File size larger than ' + this.uploadService.maxSize + ' bytes. [' + (this.selectedFile.size) + ']');
    } else {
      console.log('Event: upload file start.');
      const fd = new FormData();
      fd.append('file', this.selectedFile, this.selectedFile.name);
      this.uploadService.postUploadFile(fd)
        .then(res => {
          console.log('success component', res);
          alert('Upload File Success!!!');
        })
        .catch(err => {
          console.log('error component', err);
        });
    }
  }

}
