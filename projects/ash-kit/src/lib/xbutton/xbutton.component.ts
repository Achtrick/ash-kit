import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AshKitService } from '../ash-kit.service';
import { Icons } from '../assets';

@Component({
  selector: 'x-button',
  templateUrl: './xbutton.component.html',
  styleUrls: ['./xbutton.component.scss'],
})
export class XButtonComponent implements OnInit {
  @ViewChild('button', { static: true }) button: ElementRef<HTMLElement>;

  @Input() text: string = '';
  @Input() width: string = '';
  @Input() height: string = '40px';
  @Input() inversed: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() set color(value: string) {
    this.originalColor = value;
    this.deducedColor = this.AshKitService.deduceColor(value);
  }
  @Input() action: (() => void) | (() => Promise<void>) = () => {};

  protected originalColor: string = '#000000';
  protected deducedColor: string = '#ffffff';
  protected Icons: Icons = new Icons();

  constructor(public AshKitService: AshKitService) {}

  ngOnInit(): void {
    this.setButtonStyle();
  }

  private setButtonStyle(): void {
    const button = this.button.nativeElement;
    button.style.opacity = this.disabled ? '0.6' : '1';
    button.style.pointerEvents = this.disabled ? 'none' : 'all';
    button.style.width = this.width;
    button.style.height = this.height;

    if (this.inversed) {
      button.style.backgroundColor = this.deducedColor;
      button.style.color = this.originalColor;
      button.style.border = '1px solid ' + this.originalColor;
    } else {
      button.style.backgroundColor = this.originalColor;
      button.style.color = this.deducedColor;
      button.style.border = '1px solid ' + this.deducedColor;
    }
  }

  protected mouseOver(event: MouseEvent): void {
    if (!this.loading) {
      const target = event.target as HTMLElement;
      if (this.inversed) {
        target.style.backgroundColor = this.originalColor;
        target.style.color = this.deducedColor;
        target.style.borderColor = this.deducedColor;
      } else {
        target.style.backgroundColor = this.deducedColor;
        target.style.color = this.originalColor;
        target.style.borderColor = this.originalColor;
      }
    }
  }
  protected mouseLeave(event: MouseEvent): void {
    if (!this.loading) {
      const target = event.target as HTMLElement;
      if (this.inversed) {
        target.style.backgroundColor = this.deducedColor;
        target.style.color = this.originalColor;
        target.style.borderColor = this.originalColor;
      } else {
        target.style.backgroundColor = this.originalColor;
        target.style.color = this.deducedColor;
        target.style.borderColor = this.deducedColor;
      }
    }
  }
}
