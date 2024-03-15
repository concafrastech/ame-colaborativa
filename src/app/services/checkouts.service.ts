import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CheckoutsService {
  apiFunctions: string;

  constructor(private _http: HttpClient) {
    this.apiFunctions = environment.apiFunctions;
  }

  createCheckout(checkout: any): Observable<any> {
    let headers = {
      "Content-Type": "application/json",
    };

    return this._http.post(`${this.apiFunctions}/checkouts`, checkout, {
      headers,
    });
  }
}
