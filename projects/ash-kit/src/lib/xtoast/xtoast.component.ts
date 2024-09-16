import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'x-toast',
  templateUrl: './xtoast.component.html',
  styleUrls: ['./xtoast.component.scss'],
})
export class XToastComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('ToastContainer', { static: true })
  private ToastContainer: ElementRef<HTMLElement>;
  @ViewChild('ToastContent', { static: true })
  private ToastContent: ElementRef<HTMLElement>;

  @Input() visible: boolean = false;
  @Input() message: string = '';
  @Input() position: ToastPosition = ToastPosition.Top;
  @Input() animation: ToastAnimation = ToastAnimation.FadeIn;
  @Input() type: ToastType = ToastType.Default;
  @Input() hideAfter: number = 2000;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnHiding: EventEmitter<void> = new EventEmitter<void>();

  public ToastAnimation = ToastAnimation;
  public ToastPosition = ToastPosition;
  public ToastType = ToastType;

  private _visible: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _animate: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.setContainerStyle();
    this.setContentStyle();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['visible'].currentValue) {
      this.open();
    }
  }

  private setContainerStyle(): void {
    const toastContainer = this.ToastContainer.nativeElement;
    this._visible.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
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

  private setContentStyle() {
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
    }

    tostContent.style.backgroundColor = backgroundColor;

    if (this.animation === ToastAnimation.FadeIn) {
      tostContent.style.transform = 'scale(0.98)';
    }
    if (this.animation === ToastAnimation.FadeOut) {
      tostContent.style.transform = 'scale(1.08)';
    }

    this._animate.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value) {
        switch (this.animation) {
          case ToastAnimation.FadeIn:
            tostContent.style.opacity = '1';
            tostContent.style.transform = 'scale(1.08)';
            break;
          case ToastAnimation.FadeOut:
            tostContent.style.opacity = '1';
            tostContent.style.transform = 'scale(0.98)';
            break;
          case ToastAnimation.Slide:
            tostContent.style.opacity = '1';
            if (this.position === ToastPosition.Top) {
              tostContent.style.transform = 'translateY(20px)';
            } else {
              tostContent.style.transform = 'translateY(-20px)';
            }
            break;
        }
      } else {
        switch (this.animation) {
          case ToastAnimation.FadeIn:
            tostContent.style.opacity = '0';
            tostContent.style.transform = 'scale(0.98)';
            break;
          case ToastAnimation.FadeOut:
            tostContent.style.opacity = '0';
            tostContent.style.transform = 'scale(1.08)';
            break;
          case ToastAnimation.Slide:
            tostContent.style.opacity = '0';
            tostContent.style.transform = 'translateY(0px)';
            break;
        }
      }
    });
  }

  public open(): void {
    if (!this._visible.value) {
      this._visible.next(true);
      setTimeout(() => {
        this._visible.next(false);
        this.visibleChange.emit(false);
        this.OnHiding.emit();
      }, this.hideAfter);
      setTimeout(() => {
        this._animate.next(true);
      }, 0);
      setTimeout(() => {
        this._animate.next(false);
      }, this.hideAfter - 600);
    }
  }
}

export enum ToastAnimation {
  FadeIn = 'FadeIn',
  FadeOut = 'FadeOut',
  Slide = 'Slide',
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
