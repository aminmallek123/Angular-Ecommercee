import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Products } from './products';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiURL = 'http://localhost:3001/api'
  httpOptions = {

    headers: new HttpHeaders({

      'Content-Type': 'application/json'

    })

  }
  errorHandler(error: any) {

    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {

      errorMessage = error.error.message;

    } else {

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

    }

    return throwError(errorMessage);

  }

  constructor(private httpClient: HttpClient) { }
  getAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/articles/')
      .pipe(
        catchError(this.errorHandler)
      )
  }
  create(products:Products): Observable<any> {
    return this.httpClient.post(this.apiURL + '/articles/', JSON.stringify(products), this.httpOptions)
    .pipe(

      catchError(this.errorHandler)

    )

  }  
  find(_id:object): Observable<any> {
    return this.httpClient.get(this.apiURL + '/articles/' + _id)
    .pipe(

      catchError(this.errorHandler)

    )

  }
  update(_id:object, products:Products): Observable<any> {

  

    return this.httpClient.put(this.apiURL + '/articles/' + _id, JSON.stringify(products), this.httpOptions)

 

    .pipe( 

      catchError(this.errorHandler)

    )

  }
  delete(_id:object){

    return this.httpClient.delete(this.apiURL + '/articles/' + _id, this.httpOptions)

  

    .pipe(

      catchError(this.errorHandler)

    )

  }
  uploadSignature(vals: any): Observable<any>{ 
    let data = vals;
    return this.httpClient.post('https://api.cloudinary.com/v1_1/dgnv9nmqw/image/upload',data)
  }
  
}
