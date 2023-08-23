import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {OrderService} from "../../services/order.service";

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {
    //@ts-ignore
  message;
    //@ts-ignore
  orderId;
    //@ts-ignore
  products;
    //@ts-ignore
  cartTotal;



  constructor(private router: Router,
    private orderService: OrderService){
      const navigation = this.router.getCurrentNavigation();
         //@ts-ignore
      console.log(navigation.extras.state);
      //@ts-ignore
    const state = navigation.extras.state as {
      message: string,
      products: ProductResponseModel[],
      orderId: number,
      total: number
    };
    console.log(state);

    this.message = state.message;
    this.orderId = state.orderId;
    this.products = state.products;
    this.cartTotal = state.total;
    console.log(this.products);
  }
    ngOnInit(): void {

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
