import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";

// PrimeNg
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputMaskModule } from "primeng/inputmask";

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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
