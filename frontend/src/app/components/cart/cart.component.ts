import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, KeyValuePipe, RouterLink],
  template: `
    <div class="container py-4">
      <h2 class="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="me-2" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        Shopping Cart
      </h2>

      @if (cartService.items().length === 0) {
        <div class="text-center py-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="text-muted mb-3" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <h4 class="text-muted">Your cart is empty</h4>
          <p class="text-muted">Browse our products and add items to your cart.</p>
          <a routerLink="/" class="btn btn-primary">Browse Products</a>
        </div>
      } @else {
        <div class="row g-4">
          <div class="col-lg-8">
            @for (itemGroup of cartService.itemsByCategory() | keyvalue; track itemGroup.key) {
              <div class="mb-4">
                <h5 class="text-muted small text-uppercase fw-bold mb-3">
                  {{ getCategoryName(itemGroup.key) }}
                </h5>
                @for (item of itemGroup.value; track item.product.id) {
                  <div class="card mb-2 border-0 shadow-sm">
                    <div class="card-body">
                      <div class="row align-items-center g-3">
                        <div class="col-auto">
                          <img
                            [src]="item.product.image"
                            [alt]="item.product.name"
                            class="rounded"
                            style="width: 80px; height: 60px; object-fit: contain; background: #f8f9fa;"
                          />
                        </div>
                        <div class="col">
                          <h6 class="mb-1 fw-bold">{{ item.product.name }}</h6>
                          <small class="text-muted">{{ item.product.price | currency }} each</small>
                        </div>
                        <div class="col-auto">
                          <div class="input-group input-group-sm" style="width: 120px;">
                            <button class="btn btn-outline-secondary" type="button" (click)="updateQuantity(item.product.id, item.quantity - 1)">−</button>
                            <input type="text" class="form-control text-center" [value]="item.quantity" readonly />
                            <button class="btn btn-outline-secondary" type="button" (click)="updateQuantity(item.product.id, item.quantity + 1)">+</button>
                          </div>
                        </div>
                        <div class="col-auto text-end" style="min-width: 90px;">
                          <span class="fw-bold">{{ item.product.price * item.quantity | currency }}</span>
                        </div>
                        <div class="col-auto">
                          <button class="btn btn-sm btn-outline-danger" (click)="removeItem(item.product.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <div class="col-lg-4">
            <div class="card border-0 shadow-sm sticky-top" style="top: 80px; z-index: 1;">
              <div class="card-body">
                <h5 class="card-title fw-bold mb-3">Order Summary</h5>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Items</span>
                  <span>{{ cartService.itemCount() }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Subtotal</span>
                  <span>{{ cartService.total() | currency }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Shipping</span>
                  <span class="text-success">Free</span>
                </div>
                <hr />
                <div class="d-flex justify-content-between mb-4">
                  <span class="fw-bold fs-5">Total</span>
                  <span class="fw-bold fs-5 text-primary">{{ cartService.total() | currency }}</span>
                </div>
                <button class="btn btn-primary w-100 mb-2" routerLink="/checkout">
                  Proceed to Checkout
                </button>
                <button class="btn btn-outline-secondary w-100 btn-sm" (click)="clearCart()">
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .input-group .form-control { background: #fff; }
  `],
})
export class CartComponent {
  cartService = inject(CartService);
  categoryService = inject(CategoryService);

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getCategoryName(categoryId: string): string {
    const id = Number(categoryId);
    const category = this.categoryService.categories().find(c => c.id === id);
    return category?.name || 'Unknown';
  }
}
