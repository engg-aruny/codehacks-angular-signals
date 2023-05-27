import { Component, computed, signal } from '@angular/core';

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
