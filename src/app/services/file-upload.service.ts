import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';

import { ImageType } from '../models/enums';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiConfig = environment.api;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  uploadImage(
    file: File,
    imageType: ImageType,
    fileNameIdentifier: string
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file); // Use the desired field name for the file

    const url = `${
      apiConfig.baseUrl
    }media/uploadImage/${imageType.toString()}/${fileNameIdentifier}`;

    const headers = new HttpHeaders(); // Create a new HttpHeaders instance
    headers.append('Content-Type', 'multipart/form-data'); // Set the Content-Type header

    const req = new HttpRequest('POST', url, formData, {
      headers: headers, // Include the headers in the request
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  generateObjectId(): Observable<any> {
    const url = `${apiConfig.baseUrl}media/generateObjectId`;
    return this.http.get<any>(url);
  }
}
