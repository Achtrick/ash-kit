import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AshKitModule } from '../../projects/ash-kit/src/lib/ash-kit.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AshKitModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
