import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import {
  ToastAnimation,
  ToastPosition,
  ToastType,
  XToastComponent,
} from 'projects/ash-kit/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private viewContainerRef: ViewContainerRef) {}
  @ViewChild('XToast') XToast: XToastComponent;

  title = 'AshKit';
  loading = false;
  badgeContent = 0;
  toastVisible = false;
  ToastPosition = ToastPosition;
  ToastAnimation = ToastAnimation;
  ToastType = ToastType;

  buttonAction = () => {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  };

  badgeAction = () => {
    this.badgeContent++;
  };

  showToast = () => {
    this.XToast.show();
  };

  showDynamicToast = () => {
    const componentRef = this.viewContainerRef.createComponent(XToastComponent);
    const xToastComponent = componentRef.instance;
    xToastComponent.type = ToastType.Info;
    xToastComponent.position = ToastPosition.Top;
    xToastComponent.animation = ToastAnimation.Slide;
    xToastComponent.hideAfter = 5000;
    xToastComponent.message = 'Dynamic toast works !';

    xToastComponent.show();
  };
}
