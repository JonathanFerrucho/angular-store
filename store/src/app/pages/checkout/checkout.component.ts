import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Details, Order } from 'src/app/shared/interface/order.interface';
import { Store } from 'src/app/shared/interface/stores.interface';
import { DataSerivece } from 'src/app/shared/services/data.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from '../products/intefaces/product.interface';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  model = {
    name: '',
    store: '',
    shippingAdress: '',
    city: '',
  };
  isDelivery: boolean = true;

  cart: Product[] = [];
  stores: Store[] = [];
  route: any;
  constructor(
    private dataSvc: DataSerivece,
    private shoppingCartSvc: ShoppingCartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStore();
    this.getDataCart();
    this.prepareDatils();
  }

  onPickupOrDelivery(value: boolean): void {
    this.isDelivery = value;
  }

  onSubmit({ value: formData }: NgForm): void {
    const data: Order = {
      ...formData,
      date: this.getCurrentDate(),
      isDelivery: this.isDelivery,
    };

    this.dataSvc
      .saveOrder(data)
      .pipe(
        tap((res) => console.log(res)),
        switchMap(({ id: orderId }) => {
          const details = this.prepareDatils();
          return this.dataSvc.saveDetailsOrder({ details, orderId });
        }),
        tap(() => this.router.navigate(['/thank-you-page'])),
        delay(2000),
        tap(() => this.shoppingCartSvc.resetCart())
      )
      .subscribe();
  }

  private getStore(): void {
    this.dataSvc
      .getStore()
      .pipe(tap((stores: Store[]) => (this.stores = stores)))
      .subscribe();
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDatils(): Details[] {
    const details: Details[] = [];

    this.cart.forEach((product: Product) => {
      const {
        id: productId,
        name: productName,
        qty: quantity,
        stock,
      } = product;

      details.push({ productId, productName, quantity });
    });
    return details;
  }

  private getDataCart(): void {
    this.shoppingCartSvc.cartAction$
      .pipe(tap((products: Product[]) => (this.cart = products)))
      .subscribe();
  }
}
