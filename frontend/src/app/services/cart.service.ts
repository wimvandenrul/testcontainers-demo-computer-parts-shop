import { Injectable, inject, signal, computed, Signal, NgZone, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { CartItem, CustomerInfo } from '../models/cart.model';
import { Order } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private ngZone = inject(NgZone);
  private appRef = inject(ApplicationRef);

  private _items = signal<CartItem[]>(this.loadFromStorage());
  readonly items: Signal<CartItem[]> = this._items.asReadonly();

  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly itemsByCategory = computed(() => {
    const grouped: Record<number, CartItem[]> = {};
    const items = this._items();
    
    // Group by categoryId
    for (const item of items) {
      const catId = item.product.categoryId;
      if (!grouped[catId]) {
        grouped[catId] = [];
      }
      grouped[catId].push(item);
    }
    
    return grouped;
  });

  addToCart(product: Product): void {
    const current = this._items();
    const existing = current.find((i) => i.product.id === product.id);
    if (existing) {
      this._items.update((items) =>
        items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      this._items.set([...current, { product, quantity: 1 }]);
    }
    this.saveToStorage();
  }

  removeFromCart(productId: number): void {
    this._items.update((items) => items.filter((i) => i.product.id !== productId));
    this.saveToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._items.update((items) =>
      items.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
    this.saveToStorage();
  }

  clearCart(): void {
    this._items.set([]);
    this.saveToStorage();
  }

  isInCart(productId: number): boolean {
    return this._items().some((i) => i.product.id === productId);
  }

  submitOrder(customer: CustomerInfo): Promise<Order> {
    const items = this._items();

    const createOrderDto = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      zipCode: customer.zipCode,
      country: customer.country,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    return this.http.post<Order>(`${environment.apiUrl}/orders`, createOrderDto).toPromise().then(
      (response) => {
        if (!response) throw new Error('No response from server');
        this.ngZone.run(() => {
          this.clearCart();
          // Force global change detection to ensure all components re-render
          this.appRef.tick();
        });
        return response;
      }
    );
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem('parts-shop-cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('parts-shop-cart', JSON.stringify(this._items()));
  }
}
