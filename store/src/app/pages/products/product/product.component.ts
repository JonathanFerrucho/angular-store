import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../intefaces/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent  {
  @Input() product!: Product;
  @Output() addToCartClick = new EventEmitter<Product>();

  onClick(): void {
    this.addToCartClick.emit(this.product);
  }
}
