import { Component, ViewContainerRef } from '@angular/core';
import {
  ActionButton,
  PopupAnimation,
  ToastAnimation,
  ToastPosition,
  ToastType,
  XButtonComponent,
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
      color: '#2000e3',
      action: () => {
        this.popupVisible = false;
      },
    },
    {
      text: 'confirm',
      color: '#2000e3',
      action: () => {
        this.popupVisible = false;
        this.showDynamicToast();
      },
    },
  ];

  galleryDataSource: any[] = [
    this.createTable(),
    this.createButton(),
    '<img width="100%" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQghvwcgSWS3t-dnjU5sSCOjxcgaclzoLC9cQ&s" />',
    '<img width="100%" src="https://t4.ftcdn.net/jpg/01/66/10/03/360_F_166100342_KbTGIRrnrlwGDZSXSMpH3zfn2dxyTKae.jpg" />',
    '<h1>item 2</h1>',
    '<div onclick="alert("clicked!")">Click me</div>',
    "<input type='text' placeholder='item1' />",
    '<button (onclick)="()=>console.log("clicked")">item 3</button>',
    "<input type='date' placeholder='item4' />",
  ];

  tileNavDataSource: any[] = [
    { caption: 'Parent' },
    { caption: 'Child-1' },
    { caption: 'Child-2' },
    { caption: 'Child-3' },
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

  createTable() {
    const table = document.createElement('table');
    for (let i = 0; i <= 5; i++) {
      table.insertRow();
    }

    for (let i = 0; i <= table.rows.length - 1; i++) {
      for (let i = 0; i <= 5; i++) {
        const td = table.rows[i].insertCell();
        td.style.border = '5px solid #ccc';
        td.innerText = `TD-${i}`;
      }
    }

    table.style.width = '100%';
    table.style.height = '100%';
    table.style.border = '1px solid #ccc';

    return table;
  }

  createButton(color: string = '#aa22aa') {
    let componentRef = this.viewContainerRef.createComponent(XButtonComponent);
    const xButtonComponent = componentRef.instance;
    xButtonComponent.text = 'Dynamic button !';
    xButtonComponent.color = color;
    xButtonComponent.action = () => this.showToast();

    return componentRef.location.nativeElement;
  }

  generateHexCode(): string {
    const hexChars = '0123456789ABCDEF';
    let hexCode = '#';

    for (let i = 0; i < 6; i++) {
      hexCode += hexChars[Math.floor(Math.random() * 16)];
    }

    return hexCode;
  }
}
