import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CustomerInfo, Order } from '../../models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, RouterLink],
  template: `
    <div class="container py-4">
      <h2 class="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="me-2" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        Checkout
      </h2>

      @if (cartService.items().length === 0 && !order) {
        <div class="text-center py-5">
          <h4 class="text-muted">Your cart is empty</h4>
          <a routerLink="/" class="btn btn-primary mt-2">Browse Products</a>
        </div>
      } @else if (order) {
        <div class="text-center py-4">
          <div class="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="text-success mx-auto d-block" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          <h3 class="text-success mb-3">Order Submitted Successfully!</h3>
          <p class="text-muted mb-1">Order ID: <strong>{{ order.id }}</strong></p>
          <p class="text-muted mb-4">Total: <strong class="text-primary">{{ order.total | currency }}</strong></p>
          <p class="text-muted">A confirmation email has been sent to <strong>{{ order.customer.email }}</strong></p>
          <a routerLink="/" class="btn btn-primary mt-3">Continue Shopping</a>
        </div>
      } @else {
        <div class="row g-4">
          <div class="col-lg-7">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h5 class="card-title fw-bold mb-4">Shipping Information</h5>
                <form #checkoutForm="ngForm" (ngSubmit)="submitOrder()">
                  <div class="row g-3">
                    <div class="col-sm-6">
                      <label class="form-label">First Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        name="firstName"
                        [(ngModel)]="customer.firstName"
                        required
                      />
                    </div>
                    <div class="col-sm-6">
                      <label class="form-label">Last Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        name="lastName"
                        [(ngModel)]="customer.lastName"
                        required
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Email *</label>
                      <input
                        type="email"
                        class="form-control"
                        name="email"
                        [(ngModel)]="customer.email"
                        required
                        email
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Address *</label>
                      <input
                        type="text"
                        class="form-control"
                        name="address"
                        [(ngModel)]="customer.address"
                        required
                      />
                    </div>
                    <div class="col-sm-5">
                      <label class="form-label">City *</label>
                      <input
                        type="text"
                        class="form-control"
                        name="city"
                        [(ngModel)]="customer.city"
                        required
                      />
                    </div>
                    <div class="col-sm-3">
                      <label class="form-label">ZIP Code *</label>
                      <input
                        type="text"
                        class="form-control"
                        name="zipCode"
                        [(ngModel)]="customer.zipCode"
                        required
                      />
                    </div>
                    <div class="col-sm-4">
                      <label class="form-label">Country *</label>
                      <input
                        type="text"
                        class="form-control"
                        name="country"
                        [(ngModel)]="customer.country"
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h5 class="card-title fw-bold mb-3">Order Review</h5>
                @for (item of cartService.items(); track item.product.id) {
                  <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div class="d-flex align-items-center gap-2">
                      <img
                        [src]="item.product.image"
                        [alt]="item.product.name"
                        style="width: 50px; height: 40px; object-fit: contain;"
                      />
                      <div>
                        <small class="fw-bold d-block">{{ item.product.name }}</small>
                        <small class="text-muted">Qty: {{ item.quantity }}</small>
                      </div>
                    </div>
                    <span class="fw-bold">{{ item.product.price * item.quantity | currency }}</span>
                  </div>
                }
                <div class="d-flex justify-content-between mt-3 pt-2 border-top">
                  <span class="fw-bold fs-5">Total</span>
                  <span class="fw-bold fs-5 text-primary">{{ cartService.total() | currency }}</span>
                </div>
                <button
                  class="btn btn-primary w-100 mt-3"
                  [disabled]="!isFormValid()"
                  (click)="submitOrder()"
                >
                  Submit Order
                </button>
                <a routerLink="/cart" class="btn btn-outline-secondary w-100 mt-2">
                  Back to Cart
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .form-control:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.2rem rgba(13,110,253,.25); }
    input.ng-invalid.ng-touched { border-color: #dc3545; }
  `],
})
export class CheckoutComponent {
  cartService = inject(CartService);
  router = inject(Router);

  customer: CustomerInfo = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  };

  order: Order | null = null;

  isFormValid(): boolean {
    const c = this.customer;
    return !!(
      c.firstName.trim() &&
      c.lastName.trim() &&
      c.email.trim() &&
      c.address.trim() &&
      c.city.trim() &&
      c.zipCode.trim() &&
      c.country.trim() &&
      this.cartService.items().length > 0
    );
  }

  submitOrder(): void {
    if (!this.isFormValid()) return;

    this.order = this.cartService.submitOrder(this.customer);
    this.customer = {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
    };
  }
}
