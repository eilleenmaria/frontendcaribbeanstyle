import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import { ProductModelServer, serverResponse } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) { }

  /* This is to fetch all products from the backend server */
  getAllProducts(numberOfResults= 10):Observable<serverResponse> {

    return this.http.get<serverResponse>(this.SERVER_URL + '/products', {
      params: {
        limit: numberOfResults.toString()
      }
    });
  }
  // get product single from server
  getSingleProduct(id:number):Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/' + id);
  }

  // get products of one category

  getProductsFromCategory(catName: String): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + 'products/category/' + catName);
  }
}

