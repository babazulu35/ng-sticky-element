import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { StickyDirective } from './sticky.directive';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { InlineTextComponent } from './inline-text/inline-text.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    StickyDirective,
    SideMenuComponent,
    CheckoutComponent,
    InlineTextComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
