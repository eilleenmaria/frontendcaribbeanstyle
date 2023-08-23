import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  products: ProductResponseModel[] = [];
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  getSingleOrder(orderId: number) {
    return this.http.get<ProductResponseModel[]>(`${this.SERVER_URL}/orders/${orderId}`).toPromise();
  }
}



interface ProductResponseModel {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}
