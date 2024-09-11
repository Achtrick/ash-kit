import { Component, Input, OnInit } from '@angular/core';
import { AshKitService } from '../ash-kit.service';

@Component({
  selector: 'x-badge',
  templateUrl: './xbadge.component.html',
  styleUrls: ['./xbadge.component.scss'],
})
export class XBadgeComponent implements OnInit {
  @Input() content: number = 0;
  @Input() set color(value: string) {
    this.originalColor = value;
    this.deducedColor = this.AshKitService.deduceColor(value);
  }

  protected originalColor: string = '#ffffff';
  protected deducedColor: string = '#000000';

  constructor(private AshKitService: AshKitService) {}

  ngOnInit(): void {}
}
