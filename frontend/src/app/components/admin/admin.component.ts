import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService, CreateProductDto } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../models/product.model';

interface ProductForm {
  name: string;
  description: string;
  price: number | null;
  categoryId: number;
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: null,
  categoryId: 0,
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Product Administration</h1>
        <button class="btn btn-primary" (click)="openAdd()">
          <i class="bi bi-plus-lg"></i> Add Product
        </button>
      </div>

      @if (productService.loading() || categoryService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (productService.error()) {
        <div class="alert alert-danger">{{ productService.error() }}</div>
      } @else if (categoryService.error()) {
        <div class="alert alert-danger">{{ categoryService.error() }}</div>
      } @else {
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60px">ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th style="width: 120px">Price</th>
                <th style="width: 150px">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (product of productService.products(); track product.id) {
                <tr>
                  <td>{{ product.id }}</td>
                  <td>
                    <img
                      [src]="product.image"
                      [alt]="product.name"
                      class="rounded"
                      style="width: 50px; height: 50px; object-fit: cover;"
                      (error)="onImageError($event)"
                    />
                  </td>
                  <td>
                    <div class="fw-semibold">{{ product.name }}</div>
                    <small class="text-muted text-truncate d-block" style="max-width: 300px;">
                      {{ product.description }}
                    </small>
                  </td>
                  <td>
                    <span class="badge bg-secondary">{{ getCategoryName(product.categoryId) }}</span>
                  </td>
                  <td class="fw-bold">{{ product.price | currency }}</td>
                  <td>
                    <div class="d-flex gap-2">
                      <button class="btn btn-sm btn-outline-primary" (click)="openEdit(product)">
                        Edit
                      </button>
                      <button class="btn btn-sm btn-outline-danger" (click)="deleteProduct(product)">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center text-muted py-4">No products found.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    @if (showModal) {
      <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);" (click)="closeModal()">
        <div class="modal-dialog modal-dialog-centered" (click)="$event.stopPropagation()">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form #productForm="ngForm">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    [(ngModel)]="form.name"
                    name="name"
                    required
                    maxlength="200"
                  />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea
                    class="form-control"
                    id="description"
                    [(ngModel)]="form.description"
                    name="description"
                    rows="3"
                    maxlength="2000"
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label for="price" class="form-label">Price</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      [(ngModel)]="form.price"
                      name="price"
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label for="category" class="form-label">Category</label>
                  <select class="form-select" id="category" [(ngModel)]="form.categoryId" name="categoryId">
                    <option [value]="0" disabled>Select a category</option>
                    @for (category of categoryService.categories(); track category.id) {
                      <option [value]="category.id">{{ category.name }}</option>
                    }
                  </select>
                </div>
              </form>
              @if (formError) {
                <div class="alert alert-danger mb-0">{{ formError }}</div>
              }
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button
                type="button"
                class="btn btn-primary"
                [disabled]="saving"
                (click)="saveProduct()"
              >
                @if (saving) {
                  <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                }
                {{ isEditing ? 'Update' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal { display: block; }
    .table tbody tr:hover { background-color: rgba(0,0,0,0.02); }
  `],
})
export class AdminComponent implements OnInit {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  showModal = false;
  isEditing = false;
  editingId: number | null = null;
  saving = false;
  formError: string | null = null;

  form: ProductForm = { ...emptyForm };

  ngOnInit() {
    this.productService.refreshProducts();
    this.categoryService.refreshCategories();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categoryService.categories().find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  }

  openAdd() {
    this.isEditing = false;
    this.editingId = null;
    this.form = { ...emptyForm };
    this.formError = null;
    this.showModal = true;
  }

  openEdit(product: Product) {
    this.isEditing = true;
    this.editingId = product.id;
    this.form = {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
    };
    this.formError = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.formError = null;
  }

  validateForm(): string | null {
    if (!this.form.name.trim()) return 'Name is required';
    if (!this.form.description.trim()) return 'Description is required';
    if (this.form.price === null || this.form.price <= 0) return 'Price must be greater than 0';
    if (this.form.categoryId === 0) return 'Please select a category';
    return null;
  }

  saveProduct() {
    const error = this.validateForm();
    if (error) {
      this.formError = error;
      return;
    }

    this.saving = true;
    const dto: CreateProductDto = {
      name: this.form.name,
      description: this.form.description,
      price: this.form.price!,
      categoryId: this.form.categoryId,
    };

    if (this.isEditing && this.editingId !== null) {
      this.productService.updateProduct(this.editingId, dto).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
        },
        error: () => {
          this.saving = false;
          this.formError = 'Failed to update product. Please try again.';
        },
      });
    } else {
      this.productService.addProduct(dto).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
        },
        error: () => {
          this.saving = false;
          this.formError = 'Failed to add product. Please try again.';
        },
      });
    }
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        error: () => {
          alert('Failed to delete product. Please try again.');
        },
      });
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
  }
}
