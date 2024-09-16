import { Component, ViewContainerRef } from '@angular/core';
import {
  ActionButton,
  PopupAnimation,
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

  title = 'AshKit';
  loading = false;
  badgeContent = 0;
  toastVisible = false;
  popupVisible = false;
  PopupAnimation = PopupAnimation;
  ToastPosition = ToastPosition;
  ToastAnimation = ToastAnimation;
  ToastType = ToastType;
  popupActionButtons: ActionButton[] = [
    {
      text: 'cancel',
      color: '#ffffff',
      action: () => {
        this.popupVisible = false;
      },
    },
    {
      text: 'confirm',
      color: '#ffffff',
      action: () => {
        this.popupVisible = false;
        this.showDynamicToast();
      },
    },
  ];

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
    this.toastVisible = true;
  };

  showDynamicToast = () => {
    let componentRef = this.viewContainerRef.createComponent(XToastComponent);
    const xToastComponent = componentRef.instance;
    xToastComponent.type = ToastType.Info;
    xToastComponent.position = ToastPosition.Top;
    xToastComponent.animation = ToastAnimation.FadeOut;
    xToastComponent.hideAfter = 5000;
    xToastComponent.message = 'Dynamic toast works !';

    xToastComponent.open();
    xToastComponent.OnHiding.subscribe(() => {
      componentRef.destroy();
    });
  };

  showPopup = () => {
    this.popupVisible = true;
  };
}
