import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XBadgeComponent } from './xbadge/xbadge.component';
import { XButtonComponent } from './xbutton/xbutton.component';
import { XpopupComponent } from './xpopup/xpopup.component';
import { XToastComponent } from './xtoast/xtoast.component';

@NgModule({
  declarations: [
    XButtonComponent,
    XBadgeComponent,
    XToastComponent,
    XpopupComponent,
  ],
  imports: [CommonModule],
  exports: [
    XButtonComponent,
    XBadgeComponent,
    XToastComponent,
    XpopupComponent,
  ],
})
export class AshKitModule {}
