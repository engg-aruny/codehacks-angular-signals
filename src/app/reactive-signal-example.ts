import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-shopping-cart',
  template: `
    <h1>Shopping Cart</h1>
    <ul class="cart-items">
      <li *ngFor="let item of cartItems()">
        {{ item.name }} - {{ item.price | currency }}
      </li>
    </ul>
    <p class="total">Total: {{ total() | currency }}</p>
    <button class="add-to-cart-btn" (click)="addToCart()">Add to Cart</button>
  `,
  styles: [`
    .cart-items {
      list-style-type: none;
      padding: 0;
      margin-bottom: 20px;
    }

    .cart-items li {
      margin-bottom: 10px;
    }

    .total {
      font-weight: bold;
      font-size: 18px;
    }

    .add-to-cart-btn {
      padding: 10px 20px;
      background-color: #4caf50;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .add-to-cart-btn:hover {
      background-color: #45a049;
    }
  `]
})
export class ShoppingCartReactiveSignalComponent implements OnInit, OnDestroy {
  products: Product[] = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
    { id: 3, name: 'Product 3', price: 30 }
  ];

  cartItems = signal<Product[]>([]);
  total = computed(() => this.cartItems().reduce((sum, item) => sum + item.price, 0));

  constructor() {
    effect(() => {
      console.log('Cart items changed:', this.cartItems());
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    // Clean up effects or subscriptions if necessary
  }

  addToCart() {
    const randomIndex = Math.floor(Math.random() * this.products.length);
    const selectedItem = this.products[randomIndex];
    this.cartItems.set([...this.cartItems(), selectedItem]);
  }
}
