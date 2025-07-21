import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'x-tilenav',
  templateUrl: './xtilenav.component.html',
  styleUrls: ['./xtilenav.component.scss'],
})
export class XTileNavComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tileNavContainer') tileNavContainer: ElementRef<HTMLElement>;
  @ViewChild('flat') flat: ElementRef<HTMLElement>;
  @ViewChild('nested') nested: ElementRef<HTMLElement>;
  @ViewChildren('captions') captions: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('nestedCaptions') nestedCaptions: QueryList<
    ElementRef<HTMLElement>
  >;
  @ViewChild('nestedFirstCaption') nestedFirstCaption: ElementRef<HTMLElement>;
  @ViewChild('nestedLastCaption') nestedLastCaption: ElementRef<HTMLElement>;

  @Input() set dataSource(value: any[]) {
    this._dataSource = value;

    if (!this.displayExpr && value.length) {
      this.deduceExpr(value[0]);
    }
  }
  get dataSource(): any[] {
    return this._dataSource;
  }
  @Input() displayExpr: string;
  /** use this when you have overlaying content that hides your tile nav component */
  @Input() offset: number = 0;
  @Input() rtlEnabled: boolean = false;
  /** function that determines if the tile is disabled */
  @Input() disabled: (
    item: any
  ) => boolean | ((item: any) => Promise<boolean>) = (item: any) => {
    return this.dataSource[this.dataSource.length - 1] === item;
  };

  /** returns the data emitted by a tile click */
  @Output() OnTileClick = new EventEmitter<any>();

  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver;
  private _dataSource: any[] = [];
  private abcTileNavParentContainer: HTMLElement;
  private abcTileNavFlat: HTMLElement;

  protected nestedView: boolean = false;
  protected menuOpen: boolean = false;
  protected menuDataSource: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      if (this.dataSource.length >= 3) {
        this.menuDataSource = this.dataSource.slice(
          1,
          this.dataSource.length - 1
        );
      }

      setTimeout(() => {
        if (this.abcTileNavParentContainer) {
          this.switchView(this.abcTileNavParentContainer.clientWidth);
        }
      }, 0);

      return this.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    this.abcTileNavParentContainer =
      this.tileNavContainer.nativeElement.parentElement.parentElement;
    this.abcTileNavFlat = this.flat.nativeElement;

    if (this.abcTileNavParentContainer) {
      this.resizeObserver = new ResizeObserver(
        (entries: ResizeObserverEntry[]) => {
          for (const entry of entries) {
            const newWidth = entry.contentRect.width;
            this.switchView(newWidth);
            return this.detectChanges();
          }
        }
      );

      this.resizeObserver.observe(this.abcTileNavParentContainer);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    document.removeEventListener('click', this.closeMenu);
  }

  private detectChanges(): void {
    return this.cdr.detectChanges();
  }

  /**
   * deduces the tile item display expression if no expression is given
   * @param item Object
   */
  private deduceExpr(item: Object) {
    const keys = Object.keys(item);
    keys.forEach((key) => {
      if (typeof item[key] === 'string') {
        this.displayExpr = key;
      }
    });
  }

  /**
   * switchs between flat and nested views and shows tooltip for overflow captions
   * @param parentWidth the parent component width hosting the tile-nav-component
   */
  private switchView(parentWidth: number): void {
    this.nestedView =
      this.abcTileNavFlat.scrollWidth - parentWidth > 1 &&
      this.dataSource.length >= 3;

    // for flat view
    if (this.captions && this.dataSource.length >= 2) {
      const lastCaption = this.captions.get(
        this.captions.length - 1
      ).nativeElement;
      lastCaption.style.maxWidth = `${
        parentWidth - this.calcTakenSpace() - this.offset
      }px`;
      this.toggleToolTip(lastCaption);
    }

    // for nested view
    if (this.nestedLastCaption) {
      const firstCaption = this.nestedFirstCaption.nativeElement;
      const lastCaption = this.nestedLastCaption.nativeElement;
      this.nestedLastCaption.nativeElement.style.maxWidth = `${
        parentWidth - firstCaption.clientWidth - 50 - this.offset
      }px`;
      this.toggleToolTip(lastCaption);
    }
  }

  /**
   * @returns taken space inside the parent container by the previous tiles except the last one
   */
  private calcTakenSpace(): number {
    return this.captions.reduce(
      (sum: number, caption: ElementRef<HTMLElement>, index: number) => {
        return index < this.captions.length - 1
          ? (sum += caption.nativeElement.clientWidth + 30)
          : sum;
      },
      0
    );
  }

  /**
   * toggles a tooltip if the element has an overflowing text
   * @param captionElement the caption element
   */
  private toggleToolTip(captionElement: HTMLElement): void {
    if (captionElement.scrollWidth - captionElement.clientWidth > 1) {
      captionElement.title = captionElement.innerText;
    } else {
      captionElement.title = '';
    }
  }

  /**
   * calculates the item caption from a given tile nav item
   * @param item the tile nav item
   * @returns string
   */
  protected getItemCaption = (item: any): string => {
    if (!item) return 'noCaption';

    if (typeof item === 'string') return item;

    if (item[this.displayExpr]) return item[this.displayExpr];

    if (typeof item === 'object') {
      for (const key of Object.keys(item)) {
        const result = this.getItemCaption(item[key]);
        if (result !== 'noCaption') return result;
      }
    }

    return 'noCaption';
  };

  protected onTileClick(item: any): void {
    if (!this.disabled(item)) {
      this.OnTileClick.emit(item);
    }
  }

  protected openMenu(): void {
    this.menuOpen = true;
    document.addEventListener('click', this.closeMenu);

    setTimeout(() => {
      this.nestedCaptions.forEach((caption: ElementRef<HTMLElement>) => {
        this.toggleToolTip(caption.nativeElement);
      });
    }, 0);
  }

  protected closeMenu = (e: MouseEvent): void => {
    if ((e.target as HTMLElement).id !== 'menu-toggler') {
      this.menuOpen = false;
      this.detectChanges();
    }
  };
}
