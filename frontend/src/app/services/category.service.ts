import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/product.model';
import { environment } from '../../environments/environment';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  private _categories = signal<Category[]>([]);
  private _loading = signal<boolean>(true);
  private _error = signal<string | null>(null);

  readonly categories: Signal<Category[]> = this._categories.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly error: Signal<string | null> = this._error.asReadonly();

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    this._loading.set(true);
    this.http.get<Category[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (data) => {
        this._categories.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load categories. Please try again later.');
        this._loading.set(false);
        console.error('Failed to load categories:', err);
      },
    });
  }

  refreshCategories() {
    this.loadCategories();
  }
}
