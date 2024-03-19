import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CheckoutsService {
  apiFunctions: string;
  isProduction: boolean;

  constructor(private _http: HttpClient) {
    this.apiFunctions = environment.apiFunctions;
    this.isProduction = environment.production;
  }

  createCheckout(checkout: any): Observable<any> {
    let headers = {
      "Content-Type": "application/json",
    };

    let body = {
      isProduction: this.isProduction,
      checkout,
    };

    return this._http.post(`${this.apiFunctions}/checkouts`, body, {
      headers,
    });
  }

  successCheckout(checkoutPagseguro: any): Observable<any> {
    let headers = {
      "Content-Type": "application/json",
    };

    return this._http.post(
      `${this.apiFunctions}/checkouts/success`,
      checkoutPagseguro,
      {
        headers,
      },
    );
  }
}
