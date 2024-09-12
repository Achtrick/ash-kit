import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AshKitService } from '../ash-kit.service';

@Component({
  selector: 'x-badge',
  templateUrl: './xbadge.component.html',
  styleUrls: ['./xbadge.component.scss'],
})
export class XBadgeComponent implements OnInit {
  @ViewChild('badge', { static: true }) badge: ElementRef<HTMLElement>;

  @Input() content: number = 0;
  @Input() set color(value: string) {
    this.originalColor = value;
    this.deducedColor = this.AshKitService.deduceColor(value);
  }

  protected originalColor: string = '#ffffff';
  protected deducedColor: string = '#000000';

  constructor(private AshKitService: AshKitService) {}

  ngOnInit(): void {
    this.setBadgeStyle();
  }

  private setBadgeStyle(): void {
    const badge = this.badge.nativeElement;

    badge.style.backgroundColor = this.originalColor;
    badge.style.color = this.deducedColor;
    badge.style.border = '1px solid ' + this.deducedColor;
  }
}
