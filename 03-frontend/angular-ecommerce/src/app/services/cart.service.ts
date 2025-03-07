import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
  
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;  // ✅ Khai báo ở ngoài nhưng có thể là undefined
  
    if (this.cartItems.length > 0) {
      // Dùng .find() để tìm sản phẩm
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
  
      // Kiểm tra nếu sản phẩm đã tồn tại
      alreadyExistsInCart = (existingCartItem !== undefined);
    }
  
    if (alreadyExistsInCart) {
      // ✅ Kiểm tra `existingCartItem` trước khi tăng quantity
      existingCartItem!.quantity++;  
    } else {
      this.cartItems.push(theCartItem);
    }
  
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }
}
