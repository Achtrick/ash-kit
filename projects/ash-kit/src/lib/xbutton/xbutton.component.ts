import { Component, Input, OnInit } from '@angular/core';
import { AshKitService } from '../ash-kit.service';

@Component({
  selector: 'x-button',
  templateUrl: './xbutton.component.html',
  styleUrls: ['./xbutton.component.scss'],
})
export class XButtonComponent implements OnInit {
  @Input() text: string = '';
  @Input() width: string = '';
  @Input() inversed: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() set color(value: string) {
    this.originalColor = value;
    this.deducedColor = this.AshKitService.deduceColor(value);
  }
  @Input() action: () => void = () => {};

  protected originalColor: string = '#000000';
  protected deducedColor: string = '#ffffff';

  constructor(public AshKitService: AshKitService) {}

  ngOnInit(): void {}

  mouseOver(event: MouseEvent): void {
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
  mouseLeave(event: MouseEvent): void {
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
