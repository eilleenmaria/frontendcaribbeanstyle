import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{

  cartData: CartModelServer;
  cartTotal: number;
  subTotal: number;

  constructor(public cartService:CartService){
    this.cartTotal=0, this.subTotal=0, this.cartData= {} as CartModelServer
  }

  ngOnInit(): void {
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
     this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  ChangeQuantity(id: number, increaseQuantity: boolean) {
    this.cartService.UpdateCartData(id, increaseQuantity);
  }
}
