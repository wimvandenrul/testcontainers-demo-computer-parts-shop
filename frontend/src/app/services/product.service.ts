import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ApiProduct, normalizeProduct } from '../models/product.model';
import { environment } from '../../environments/environment';
import { catchError, tap, throwError } from 'rxjs';

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  private _products = signal<Product[]>([]);
  private _loading = signal<boolean>(true);
  private _error = signal<string | null>(null);

  readonly products: Signal<Product[]> = this._products.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly error: Signal<string | null> = this._error.asReadonly();

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    this._loading.set(true);
    this.http.get<ApiProduct[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => {
        const normalizedProducts = data.map(normalizeProduct);
        this._products.set(normalizedProducts);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load products. Please try again later.');
        this._loading.set(false);
        console.error('Failed to load products:', err);
      },
    });
  }

  addProduct(dto: CreateProductDto) {
    return this.http.post<ApiProduct>(`${environment.apiUrl}/products`, dto).pipe(
      tap((product) => {
        this._products.update(products => [...products, normalizeProduct(product)]);
      }),
      catchError((err) => {
        console.error('Failed to add product:', err);
        return throwError(() => err);
      })
    );
  }

  updateProduct(id: number, dto: CreateProductDto) {
    return this.http.put<ApiProduct>(`${environment.apiUrl}/products/${id}`, dto).pipe(
      tap((updatedProduct) => {
        this._products.update(products =>
          products.map(p => p.id === id ? normalizeProduct(updatedProduct) : p)
        );
      }),
      catchError((err) => {
        console.error('Failed to update product:', err);
        return throwError(() => err);
      })
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${environment.apiUrl}/products/${id}`).pipe(
      tap(() => {
        this._products.update(products => products.filter(p => p.id !== id));
      }),
      catchError((err) => {
        console.error('Failed to delete product:', err);
        return throwError(() => err);
      })
    );
  }

  refreshProducts() {
    this.loadProducts();
  }
}
