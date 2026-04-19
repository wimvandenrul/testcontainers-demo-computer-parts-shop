import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <footer class="bg-dark text-light text-center py-3 mt-5">
      <small class="text-muted">&copy; 2026 PartsShop. All rights reserved.</small>
    </footer>
  `,
  styles: [`
    main { min-height: calc(100vh - 200px); }
  `],
})
export class AppComponent {}
