import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subject } from 'rxjs';
import { AshKitService } from '../ash-kit.service';

@Component({
  selector: 'x-gallery',
  templateUrl: './xgallery.component.html',
  styleUrls: ['./xgallery.component.scss'],
})
export class XGalleryComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef<HTMLElement>;
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;
  @ViewChildren('items') items: QueryList<ElementRef<HTMLElement>>;

  @Input() dataSource: any[] = [];
  @Input() width: string = '350px';
  @Input() height: string = '250px';

  @Output() OnSlideChange = new EventEmitter<number>();

  public currentSlideIndex: number = 0;

  private unsubscribe$: Subject<void> = new Subject();
  private trigger: number = 0;
  private containerElement: HTMLElement;
  private mouseX: number = 0;
  private slideWidth: number = 350;

  constructor(protected ashKitService: AshKitService) {}

  ngAfterViewInit(): void {
    this.containerElement = this.container.nativeElement;
    this.setContainerStyle();
    this.applyEvents();
    this.updateGallery();
  }

  private updateGallery() {
    document
      .querySelectorAll('.x-gallery-item-container')
      .forEach((item: Element, index: number) => {
        if (this.dataSource[index] instanceof HTMLElement) {
          item.append(this.dataSource[index]);
        } else {
          item.innerHTML = this.dataSource[index];
        }
      });

    document
      .getElementById('wrapper')
      .querySelectorAll('img')
      .forEach((img: HTMLImageElement) => (img.draggable = false));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['width']) {
      this.slideWidth = Number(this.width.split('px')[0]);
    }
    if (changes['dataSource']) {
      if (!changes['dataSource'].firstChange) {
        setTimeout(() => {
          this.updateGallery();
        }, 0);
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.detachEvents();
  }

  private setContainerStyle(): void {
    this.wrapper.nativeElement.style.width = this.width;
    this.containerElement.style.width = this.width;
    this.containerElement.style.minWidth = this.width;
    this.containerElement.style.height = this.height;
    this.containerElement.style.scrollBehavior = 'smooth';
    this.containerElement.querySelectorAll('img').forEach((img) => {
      img.style.pointerEvents = 'none';
    });
  }

  private applyEvents(): void {
    this.containerElement.addEventListener('mousedown', this.onMouseDown);
    this.containerElement.addEventListener('mousemove', this.onMouseMove);
    this.containerElement.addEventListener('mouseup', this.onMouseUp);
    this.containerElement.addEventListener('scrollend', this.onScrollEnd);
  }

  private onMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    this.mouseX = e.clientX;
    this.containerElement.addEventListener('mousemove', this.onMouseMove);
    this.containerElement.addEventListener('mouseup', this.onMouseUp);
    this.containerElement.addEventListener('scrollend', this.onScrollEnd);
  };

  private onMouseMove = (e: MouseEvent) => {
    this.trigger = this.mouseX - e.clientX;
  };

  private onScrollEnd = () => {
    const newIndex = this.containerElement.scrollLeft / this.slideWidth;
    if (newIndex !== this.currentSlideIndex) {
      this.currentSlideIndex = newIndex;
      this.OnSlideChange.emit(this.currentSlideIndex);
    }
  };

  private onMouseUp = () => {
    if (this.trigger < -30) {
      if (this.currentSlideIndex > 0) {
        this.slideTo(this.currentSlideIndex - 1);
      }
    } else if (this.trigger > 30) {
      if (this.currentSlideIndex < this.dataSource.length - 1) {
        this.slideTo(this.currentSlideIndex + 1);
      }
    }
    this.trigger = 0;
    this.containerElement.removeEventListener('mousemove', this.onMouseMove);
  };

  private detachEvents = (): void => {
    this.containerElement.removeEventListener('mousedown', this.onMouseDown);
    this.containerElement.removeEventListener('mouseup', this.onMouseUp);
    this.containerElement.removeEventListener('scrollend', this.onScrollEnd);
  };

  /**
   * navigates to a given (slideIndex: number), the slideIndex always starts from 0.
   * @param slideIndex the slide index that you want to navigate to.
   */
  public slideTo = (slideIndex: number) => {
    this.containerElement.scrollLeft = this.slideWidth * slideIndex;
  };
}
