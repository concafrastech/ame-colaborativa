import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class OrdersService {
  apiFunctions: string;

  constructor(private _http: HttpClient) {
    this.apiFunctions = environment.apiFunctions;
  }

  createOrder(order: any): Observable<any> {
    console.log(order);

    let headers = {
      "Content-Type": "application/json",
    };

    return this._http.post(`${this.apiFunctions}/orders`, order, { headers });
  }
}
