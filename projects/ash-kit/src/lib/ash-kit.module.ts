import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XGalleryComponent } from '../public-api';
import { XBadgeComponent } from './xbadge/xbadge.component';
import { XButtonComponent } from './xbutton/xbutton.component';
import { XpopupComponent } from './xpopup/xpopup.component';
import { XTileNavComponent } from './xtilenav/xtilenav.component';
import { XToastComponent } from './xtoast/xtoast.component';

@NgModule({
  declarations: [
    XButtonComponent,
    XBadgeComponent,
    XToastComponent,
    XpopupComponent,
    XGalleryComponent,
    XTileNavComponent,
  ],
  imports: [CommonModule],
  exports: [
    XButtonComponent,
    XBadgeComponent,
    XToastComponent,
    XpopupComponent,
    XGalleryComponent,
    XTileNavComponent,
  ],
})
export class AshKitModule {}
