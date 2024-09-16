import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class AshKitService {
  constructor(private sanitizer: DomSanitizer) {}

  public isColorDark(color: string): boolean {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 160;
  }

  public deduceColor(color: string): string {
    return this.isColorDark(color) ? 'white' : 'black';
  }

  public loadIcon(icon: string, color?: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      color
        ? icon.replace(/fill="[^"]*"/, `fill="${this.deduceColor(color)}"`)
        : icon
    );
  }
}
