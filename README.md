
The Angular team is released its new reactivity model to `'@angular/core'`, which means core framework. Signals is a new reactivity model that allows components to share data; when you change a signal's value, it automatically updates anything that uses it.

Angular discovered that scaling out `Zone.js` did not yield optimal solutions. Let's figure out why is that.

Currently, all change detection is managed and performed under the hood of the `Zone.js` library and triggering a change detection by listening to any event in the browser, so it is natural that if something is in one of the child components then the whole tree of dependencies will be re-evaluated. Even if your application's change detection is in OnPush mode, the change detection cycle will go through the entire tree, unlike the default mode, `OnPush` components with no change dependencies will not be re-evaluated. Therefore it is clear that the detection change in Angular is not optimal and in order to solve this problem, the integration of Signal will help.

![Compare Zone.js vs Signal](https://www.dropbox.com/s/tbd2a0ujy0scrxs/compare_zone_vs_signal.png?raw=1 "Compare Zone.js vs Signal")

The concept of Signal has been embraced and effectively implemented in various frameworks such as Preact, Solid, and Vue for quite some time, and has a lot of good performance improvement.

With Signal, the change detection level is done at the level of the signal variable. Thus a change detection will be done at the component level only, it does not require traversing through the whole tree without the need for the Zone.js. Signals will Significantly improve interoperability with reactive libraries such as RxJS.

> **Note**: In the future, Zone Js could be optional

### What is a Signal?
- A signal is a variable + change notification
- A signal is reactive, and is called a "reactive primitive"
- A signal always has a value
- A signal is synchronous
- A signal is **not a replacement for RxJS** and Observables for **asynchronous** operations, such as http.get

### How to Create a Signal
```typescript
numberToFind = signal(0);
//OR
cartItems = signal<Product[]>([]);
```

### How to Read a Signal

```html
<div>{{ numberToFind() }}<div>
//OR
<div>{{ cartItems() }}<div>
```

### How to Change the Value of a Signal

```typescript
this.numberToFind.set(10);
//OR 
//A detail example in below
this.cartItems.set([...this.cartItems(), selectedItem]);
```


#### Let's import '@angular/core' and let's create a sample application to find the square root of the counter number automatically.

**Here is an animated sample application GIF.**

![implementation gif](https://www.dropbox.com/s/5w4yy7zy6hfs0pt/GifMaker_20230526113615349.gif?raw=1 "implementation gif")

```html
  <div class="number-section">Number: {{ numberToFind() }}</div>
  <div class="sqrt-section">Square Root of Number: {{ squareRootOfNumber() }}</div>
```

```typescript
...
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'codehacks-angular-signals';
  numberToFind = signal(0);
  squareRootOfNumber = computed(() => this.numberToFind() * 2);

  constructor() {
    setInterval(() => this.numberToFind.set(this.numberToFind() + 1), 1000);
  }
}

```

Since `squareRootOfNumber` uses a Signal count, `squareRootOfNumber` gets updated every time `count` changes.

In the given code snippet, the AppComponent class is an Angular component. It defines a title property and two other properties: **numberToFind** and **squareRootOfNumber**. These properties are implemented using signals and computed values.

A signal represents a value that can change over time. In this case, **numberToFind** is initialized as a signal with an initial value of 0. The **setInterval** function is used to increment the value of **numberToFind** by 1 every second.

The **squareRootOfNumber** property is defined as a computed value. It is calculated based on the current value of **numberToFind**. Whenever the value of numberToFind changes, the computed value of squareRootOfNumber will be automatically updated.

### Three reactive primitives

_**Signals**_ A signal is a wrapper around a value that can notify interested consumers when that value changes. Signals can contain any value, from simple primitives to complex data structures.

_**Compute**_ A computed signal derives its value from other signals. Define one using computed and specifying a derivation function

 _**Effect**_ Signals are useful because they can notify interested consumers when they change. An effect is an operation that runs whenever one or more signal values change. 

#### Let's create a reactive shopping cart using reactive primitives

**Here is an animated sample application GIF.**

![Shopping Cart](https://www.dropbox.com/s/uo71p0t7631ff5v/GifMaker_20230527173522657.gif?raw=1 "Shopping Cart")

> The full source code for this article can be found on [GitHub](https://github.com/engg-aruny/codehacks-angular-signals).

**Sample Code**

```typescript
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

```

_In this example, the usage of signals, computed values, and effects help create a functional and reactive shopping cart component:_

**Signals**:
- The `cartItems` signal represents the current items in the shopping cart.
- Whenever a new item is added to the cart, the `cartItems` signal is updated using the set method.
- Other parts of the code that depend on the `cartItems` signal will automatically be notified and updated.

**Computed**:

- The `total` computed value depends on the `cartItems` signal.
 It calculates the total price by summing the prices of all items in the cart using the `reduce` function.
 Whenever the `cartItems` signal changes, the `total` computed value is automatically recomputed.

**Effects**:

- The effect created in the `constructor` hook logs a message whenever the `cartItems` signal changes.
- This allows us to perform side effects based on the changes in the cart items.
- In this case, the effect logs a message to the console, but you can perform other actions such as updating external data sources or triggering additional functionality.

By using signals, computed values, and effects, the shopping cart component becomes reactive and functional:

- Signals allow us to define reactive data that can be easily updated and tracked.
- Computed values derive their values from other signals or data and automatically update when their dependencies change.
- Effects enable us to perform side effects based on changes in signals, such as logging or triggering additional actions.

### Angular And RXJS Vision
The **sub-RFC 4** proposal sparked a Discussion about the possibilities of integrating Angular Signals with Observables. It all comes down to whether Angular Signals should adopt globally understood common interop 

Ben Lesh (RXJS Author) thinks that making signals fit observable chains directly is a good idea, stating that Signals inherently possess a time dimension that makes them well-suited for this. By adopting common interop points, Angular Signals could achieve better compatibility across various platforms. [Read More](https://blog.bitsrc.io/sub-rfc-4-for-angular-signals-sparks-interesting-discussion-started-by-rxjs-author-ben-lesh-6e77d9efb825)
