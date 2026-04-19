import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="card h-100 product-card">
      <div class="position-relative overflow-hidden" style="background: #f8f9fa;">
        <img
          [src]="product.image"
          [alt]="product.name"
          class="card-img-top product-image"
          loading="lazy"
        />
      </div>
      <div class="card-body d-flex flex-column">
        <h6 class="card-title fw-bold mb-2">{{ product.name }}</h6>
        <p class="card-text text-muted small flex-grow-1">{{ product.description }}</p>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="fs-5 fw-bold text-primary">{{ product.price | currency }}</span>
          <button
            class="btn btn-sm"
            [class.btn-primary]="!cartService.isInCart(product.id)"
            [class.btn-success]="cartService.isInCart(product.id)"
            (click)="addToCart()"
          >
            @if (cartService.isInCart(product.id)) {
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" class="me-1">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
              In Cart
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" class="me-1">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              Add
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,.1);
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,.15);
    }
    .product-image {
      height: 180px;
      object-fit: contain;
      padding: 1rem;
      transition: transform 0.2s;
    }
    .product-card:hover .product-image {
      transform: scale(1.05);
    }
  `],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  cartService = inject(CartService);

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}
