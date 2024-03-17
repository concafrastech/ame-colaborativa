import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClient, HttpClientModule } from "@angular/common/http";

// PrimeNg
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputMaskModule } from "primeng/inputmask";
import { FieldsetModule } from "primeng/fieldset";
import { RippleModule } from "primeng/ripple";
import { MessagesModule } from "primeng/messages";
import { CardModule } from "primeng/card";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";
import { PaymentsMethodsComponent } from "./components/payments-methods/payments-methods.component";

@NgModule({
  declarations: [AppComponent, HomeComponent, PaymentsMethodsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    InputMaskModule,
    FieldsetModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RippleModule,
    MessagesModule,
    CardModule,
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
