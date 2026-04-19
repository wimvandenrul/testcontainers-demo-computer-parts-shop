import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">
          <span class="text-primary">⬡</span> Computer Parts Shop
        </a>

        <div class="d-flex align-items-center gap-3">
          <ul class="navbar-nav flex-row gap-3">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                Products
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/admin"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                Admin
              </a>
            </li>
          </ul>

          <a
            class="btn btn-outline-primary position-relative"
            routerLink="/cart"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            Cart
            @if (cartService.itemCount() > 0) {
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ cartService.itemCount() }}
              </span>
            }
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { box-shadow: 0 2px 4px rgba(0,0,0,.3); }
    .nav-link.active { color: #fff !important; border-bottom: 2px solid #0d6efd; }
    .btn-outline-primary.active { background: #0d6efd; color: #fff; }
  `],
})
export class HeaderComponent {
  cartService = inject(CartService);
}
