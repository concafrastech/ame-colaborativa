import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class OrdersService {
  apiFunctions: string;
  isProduction: boolean;

  constructor(private _http: HttpClient) {
    this.isProduction = environment.production;
    this.apiFunctions = environment.apiFunctions;
  }

  createOrder(order: any): Observable<any> {
    let body = {
      isProduction: this.isProduction,
      order,
    };
    let headers = {
      "Content-Type": "application/json",
    };

    return this._http.post(`${this.apiFunctions}/orders`, body, { headers });
  }
}
