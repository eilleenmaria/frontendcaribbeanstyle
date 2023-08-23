import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {environment} from '../../environments/environment';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { ProductModelServer } from '../models/product.model';
import { NavigationExtras, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private SERVER_URL = environment.SERVER_URL;

  // Cart Data variable to store the cart information on the server
  private cartDataClient: CartModelPublic= {
    total: 0,
    prodData: [{
      incart:0,
      id:0
    }]

  };

   // Cart Data variable to store the cart information on the server

   private cartDataServer: CartModelServer = {
    data: [{
          // @ts-ignore
      product: undefined,
      numInCart: 0
    }],
    total: 0
  };

  // observables for the components to subscribe

  cartTotal$ = new BehaviorSubject<number>(0);
  // Data variable to store the cart information on the client's local storage

  cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
    ) {

      this.cartTotal$.next(this.cartDataServer.total);
      this.cartDataObs$.next(this.cartDataServer);
         // @ts-ignore
      let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

      if (info !== null && info !== undefined && info.prodData[0].incart !== 0){
        this.cartDataClient = info;

          // Loop through each entry and put it in the cartDataServer object
        this.cartDataClient.prodData.forEach(p =>{
          this.productService.getSingleProduct(p.id).subscribe((actualProdInfo: ProductModelServer) =>{
            if (this.cartDataServer.data[0].numInCart === 0){
              this.cartDataServer.data[0].numInCart = p.incart;
              this.cartDataServer.data[0].product = actualProdInfo;
              this.calculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }else{
              this.cartDataServer.data.push({
                numInCart: p.incart,
                product: actualProdInfo
              });
              this.calculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
          this.cartDataObs$.next({...this.cartDataServer});
          });
        });
      }
  }

  AddProductToCart(id: number,quantity?: number){
    this.productService.getSingleProduct(id).subscribe(prod => {
      // If the cart is empty
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.calculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({...this.cartDataServer});
        this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }  // END of IF
      // Cart is not empty
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id);

        // 1. If chosen product is already in cart array
        if (index !== -1) {

          if (quantity !== undefined && quantity <= prod.quantity) {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }


          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          this.toast.info(`${prod.name} quantity updated in the cart.`, "Product Updated", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        // 2. If chosen product is not in cart array
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id
          });
          this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({...this.cartDataServer});
      }  // END of ELSE


    });
  }

  UpdateCartData(index:number, increase: boolean){
    let data = this.cartDataServer.data[index];
    if (increase) {
          // @ts-ignore
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartDataObs$.next({...this.cartDataServer});
    }else{
      data.numInCart--;
      if(data.numInCart <1){
        this.cartDataObs$.next({...this.cartDataServer});
      }else{
        this.cartDataObs$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        // todo calculate total amount
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index:number) {
    /*    console.log(this.cartDataClient.prodData[index].prodId);
        console.log(this.cartDataServer.data[index].product.id);*/

    if (window.confirm('Are you sure you want to delete the item?')){
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      // todo calculate total amount
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }else{
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0){
        this.cartDataServer = {
          data: [{
                // @ts-ignore
            product: undefined,
            numInCart: 0
          }],
          total: 0
        };
        this.cartDataObs$.next({...this.cartDataServer});
      }else{
        this.cartDataObs$.next({...this.cartDataServer});
      }

    } else{
      // if the user clicks the cancel button
      return;
    }
  }

  private calculateTotal(){
    let Total=0;

    this.cartDataServer.data.forEach(p =>{
      const {numInCart} = p;
      const {price} = p.product;

      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  CalculateSubTotal(index:number): number {
    let subTotal = 0;

    let p = this.cartDataServer.data[index];
    // @ts-ignore
    subTotal = p.product.price * p.numInCart;

    return subTotal;
  }

  CheckoutFromCart(userId: number){
      // @ts-ignore
    this.http.post(`${this.SERVER_URL}/orders/payment`, null).subscribe((res: { success: boolean }) =>{
      console.clear();
      if (res.success) {
        this.resetServerData();

        this.http.post(`${this.SERVER_URL}/orders/new`, {
          userId: userId,
              // @ts-ignore
          products: this.cartDataClient.prodData}).subscribe((data: OrderConfirmationResponse) =>{
            this.orderService.getSingleOrder(data.order_id).then(prods =>{
              if (data.success){
                const navigationExtras: NavigationExtras = {
                  state: {
                    message: data.message,
                    products: prods,
                    orderId: data.order_id,
                    total: this.cartDataClient.total
                  }
                };
                this.spinner.hide().then();
                this.router.navigate(['/thankyou'], navigationExtras).then(p =>{
                  this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
                  this.cartTotal$.next(0);
                  localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                });
              }

            });

          });
      }else{
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`Sorry, failed to book the order`, "Order Status", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }

    });
  }
  private resetServerData(){
    this.cartDataServer = {
      data: [{
          // @ts-ignore
        product: undefined,
        numInCart: 0
      }],
      total: 0
    };
    this.cartDataObs$.next({...this.cartDataServer});
  }
}

  interface OrderConfirmationResponse {
    order_id: number;
    success: boolean;
    message: string;
    products: [{
      id: string,
      numInCart: string
    }]
  }


