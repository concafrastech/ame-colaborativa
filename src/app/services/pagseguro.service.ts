import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class PagseguroService {
  apiPagseguro: string;
  tokenPagseguro: string;

  constructor(private _http: HttpClient) {
    this.apiPagseguro = environment.apiPagSeguro;
    this.tokenPagseguro = environment.tokenPagSeguro;
  }

  createOrder(order: any): Observable<any> {
    console.log(order);

    let headers = {
      Authorization: `Bearer ${this.tokenPagseguro}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
    };

    // TODO: fazer chamada dessa requisição em uma function
    return this._http.post(`${this.apiPagseguro}/orders`, order, { headers });
  }
}
