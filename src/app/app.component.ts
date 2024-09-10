import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'AshKit';
  loading = false;

  action = () => {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  };
}
