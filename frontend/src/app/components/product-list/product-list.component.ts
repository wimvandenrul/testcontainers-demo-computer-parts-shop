import { Component, computed, inject } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <div id="product-list" class="container py-4">
      @if (productService.loading() || categoryService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading products...</p>
        </div>
      } @else if (productService.error()) {
        <div class="alert alert-danger">
          {{ productService.error() }}
        </div>
      } @else if (categoryService.error()) {
        <div class="alert alert-danger">
          {{ categoryService.error() }}
        </div>
      } @else {
        @for (category of categoryService.categories(); track category.id) {
          @if (productsByCategory()[category.id]?.length) {
            <section id="category-{{ category.id }}" class="mb-5">
              <h2 class="category-title mb-4">
                <span class="category-icon">{{ categoryIcons[category.id] || '📦' }}</span>
                {{ category.name }}
              </h2>
              <div class="row g-4">
                @for (product of productsByCategory()[category.id]; track product.id) {
                  <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <app-product-card [product]="product" />
                  </div>
                }
              </div>
            </section>
          }
        }
      }
    </div>
  `,
  styles: [`
    .category-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #333;
      padding-bottom: 0.5rem;
      border-bottom: 3px solid #0d6efd;
      display: inline-block;
    }
    .category-icon {
      margin-right: 0.5rem;
    }
  `],
})
export class ProductListComponent {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  // Optional: You can define icons per category ID in the backend or here
  categoryIcons: Record<number, string> = {
    // Example: 1: '⬡', 2: '◈', etc. These will be used if backend category IDs match
  };

  productsByCategory = computed(() => {
    const products = this.productService.products();
    const categories = this.categoryService.categories();
    const grouped: Record<number, Product[]> = {};
    
    // Initialize groups for all categories
    for (const category of categories) {
      grouped[category.id] = [];
    }
    
    // Group products by categoryId
    for (const product of products) {
      if (!grouped[product.categoryId]) {
        grouped[product.categoryId] = [];
      }
      grouped[product.categoryId].push(product);
    }
    
    return grouped;
  });
}
