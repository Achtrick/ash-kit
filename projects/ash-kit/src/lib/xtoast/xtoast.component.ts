import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'x-toast',
  templateUrl: './xtoast.component.html',
  styleUrls: ['./xtoast.component.scss'],
})
export class XToastComponent implements OnInit {
  @ViewChild('ToastContainer', { static: true })
  private ToastContainer: ElementRef<HTMLElement>;
  @ViewChild('ToastContent', { static: true })
  private ToastContent: ElementRef<HTMLElement>;

  @Input() message: string = '';
  @Input() position: ToastPosition = ToastPosition.Top;
  @Input() animation: ToastAnimation = ToastAnimation.Pop;
  @Input() type: ToastType = ToastType.Default;
  @Input() hideAfter: number = 2000;

  public ToastAnimation = ToastAnimation;
  public ToastPosition = ToastPosition;
  public ToastType = ToastType;

  protected originalColor: string = '#000000';
  protected deducedColor: string = '#ffffff';
  protected visible: BehaviorSubject<boolean> = new BehaviorSubject(false);
  protected animate: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  ngOnInit(): void {
    this.setContainer();
    this.setContent();
  }

  private setContainer(): void {
    const toastContainer = this.ToastContainer.nativeElement;
    this.visible.subscribe((value) => {
      if (value) {
        toastContainer.style.display = 'flex';
        toastContainer.style.top =
          this.position === ToastPosition.Top ? '0px' : 'unset';
        toastContainer.style.bottom =
          this.position === ToastPosition.Bottom ? '0px' : 'unset';
      } else {
        toastContainer.style.display = 'none';
      }
    });
  }

  private setContent() {
    const tostContent = this.ToastContent.nativeElement;
    let backgroundColor = '';

    switch (this.type) {
      case ToastType.Default:
        backgroundColor = '#2e2e2e';
        break;
      case ToastType.Info:
        backgroundColor = '#20b9e3';
        break;
      case ToastType.Error:
        backgroundColor = '#e01017';
        break;
      case ToastType.Success:
        backgroundColor = '#51db23';
        break;
      case ToastType.Warning:
        backgroundColor = '#eb9423';
        break;

      default:
        backgroundColor = '#2e2e2e';
        break;
    }

    tostContent.style.backgroundColor = backgroundColor;

    this.animate.subscribe((value) => {
      if (value) {
        switch (this.animation) {
          case ToastAnimation.Pop:
            tostContent.style.opacity = '1';
            tostContent.style.transform = 'scale(1.08)';
            break;
          case ToastAnimation.Slide:
            tostContent.style.opacity = '1';
            if (this.position === ToastPosition.Top) {
              tostContent.style.transform = 'translateY(20px)';
            } else {
              tostContent.style.transform = 'translateY(-20px)';
            }
            break;
          default:
            break;
        }
      } else {
        switch (this.animation) {
          case ToastAnimation.Pop:
            tostContent.style.opacity = '0';
            tostContent.style.transform = 'scale(0.98)';
            break;
          case ToastAnimation.Slide:
            tostContent.style.opacity = '0';
            tostContent.style.transform = 'translateY(0px)';
            break;
          default:
            break;
        }
      }
    });
  }

  public show(): void {
    if (!this.visible.value) {
      this.visible.next(true);
      setTimeout(() => {
        this.visible.next(false);
      }, this.hideAfter);
      setTimeout(() => {
        this.animate.next(true);
      }, 0);
      setTimeout(() => {
        this.animate.next(false);
      }, this.hideAfter - 600);
    }
  }
}

export enum ToastAnimation {
  Slide = 'Slide',
  Pop = 'Pop',
}

export enum ToastPosition {
  Top = 'Top',
  Bottom = 'Bottom',
}

export enum ToastType {
  Default = 'Default',
  Info = 'Info',
  Error = 'Error',
  Success = 'Success',
  Warning = 'Warning',
}
