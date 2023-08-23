import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  cartData: CartModelServer;
  cartTotal: number;
  //@ts-ignore
  authState: boolean;

  constructor( public cartService: CartService,
    private userService:UserService){
    this.cartTotal=0, this.cartData={} as CartModelServer
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);


    this.userService.authState$.subscribe(authState => this.authState = authState);
  }

}
