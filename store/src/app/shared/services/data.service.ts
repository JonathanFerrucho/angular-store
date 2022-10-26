import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetailsOrder, Order } from '../interface/order.interface';
import { Store } from '../interface/stores.interface';

@Injectable({
  providedIn: 'root',
})
export class DataSerivece {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getStore(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiURL}/stores`);
  }

  saveOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiURL}/orders`, order);
  }

  saveDetailsOrder(datails:DetailsOrder): Observable<DetailsOrder> {
    return this.http.post<DetailsOrder>(`${this.apiURL}/detailsOrders`, datails);
  }
}
