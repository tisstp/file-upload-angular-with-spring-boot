import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private url = 'http://localhost:8080/uploadfile/form1';
  private fileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  private fileSize = 20 * 1024 * 1024; // bytes

  constructor(private http: HttpClient) { }

  get maxSize(): number {
    return this.fileSize;
  }

  checkName(file: File): boolean {
    return !this.validateName(file.name);
  }

  checkType(file: File): boolean {
    return !this.fileTypes.includes(file.type);
  }

  checkSize(file: File): boolean {
    return file.size > this.fileSize;
  }

  postUploadFile(formData: FormData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.url, formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        // Handle Result
        if (event.type === HttpEventType.UploadProgress) {
          console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%');
        } else if (event.type === HttpEventType.Response) {
          console.log(event);
          resolve(event.body);
        }
      }, error => {
        // Handle Error
        alert('Error: ' + error.status + ' ' + error.statusText);
        console.error('Error: ', error);
        reject(error);
      }, () => {
        // 'onCompleted' callback.
        // No errors, route to new here
      });
    });
  }

  private validateName(name: string): boolean {
    // format: Service_Fee_Upload_yyyymmdd
    const formatName = /^(Service_Fee_Upload_)\d{4}(0?[1-9]|1[012])(0?[1-9]|[12][0-9]|3[01])(.xlsx)$/;
    // Match the date format through regular expression
    if (formatName.test(name)) {

      const dd = Number(name.substring(25, 27));
      const mm = Number(name.substring(23, 25));
      const yy = Number(name.substring(19, 23));
      // Create list of days of a month [assume there is no leap year by default]
      const listOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      // update month 02: February
      if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
        listOfDays[1] = 29;
      }

      if (dd > listOfDays[mm - 1]) {
        // alert('Invalid date format!');
        return false;
      }

      return true;
    } else {
      // alert("Invalid date format or File Type!");
      return false;
    }
  }

}
