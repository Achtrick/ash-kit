import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AshKitService } from '../ash-kit.service';
import { Icons } from '../assets';

@Component({
  selector: 'x-popup',
  templateUrl: './xpopup.component.html',
  styleUrls: ['./xpopup.component.scss'],
})
export class XpopupComponent implements OnInit, OnChanges {
  @ViewChild('overlay', { static: true }) overlay: ElementRef<HTMLElement>;
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;
  @ViewChild('content', { static: true }) content: ElementRef<HTMLElement>;

  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() showCloseBtn: boolean = true;
  @Input() blurBackground: boolean = true;
  @Input() backgroundColor: string = '#000000';
  @Input() width: string = '50%';
  @Input() height: string = '50%';
  @Input() actionButtons: ActionButton[] = [];

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnHiding: EventEmitter<void> = new EventEmitter<void>();

  protected Icons: Icons = new Icons();

  private _visible: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _animate: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(protected AshKitService: AshKitService) {}

  ngOnInit(): void {
    this.setOverlayStyle();
    this.setContainerStyle();
    this.setContentStyle();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'].currentValue) {
      this.open();
    } else if (changes['visible'].currentValue === false) {
      this.close();
    }
  }

  private setOverlayStyle(): void {
    const popupOverlay = this.overlay.nativeElement;

    this._visible.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value) {
        popupOverlay.style.display = 'flex';
        setTimeout(() => {
          popupOverlay.style.opacity = '1';
        }, 0);
      } else {
        popupOverlay.style.opacity = '0';
        setTimeout(() => {
          popupOverlay.style.display = 'none';
        }, 600);
      }
    });
  }

  private setContainerStyle(): void {
    const popupContainer = this.container.nativeElement;
    popupContainer.style.width = this.width;
    popupContainer.style.height = this.height;
  }

  private setContentStyle(): void {
    const popupContent = this.content.nativeElement;
    popupContent.style.padding = this.actionButtons.length
      ? '50px 8px 50px 8px'
      : '50px 8px 8px 8px';
  }

  public open(): void {
    this._visible.next(true);
  }

  public close(): void {
    this._visible.next(false);
    this.visibleChange.emit(false);
    this.OnHiding.emit();
  }
}

export class ActionButton {
  text: string = '';
  color?: string = '#000000';
  width?: string = '';
  height?: string = '';
  inversed?: boolean = false;
  disabled?: boolean = false;
  loading?: boolean = false;
  action: (() => void) | (() => Promise<void>) = () => {};
}
