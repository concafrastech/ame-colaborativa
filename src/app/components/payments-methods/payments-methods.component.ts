import { Component, OnInit } from "@angular/core";
import { Customer } from "../../models/Customer";

@Component({
  selector: "app-payments-methods",
  templateUrl: "./payments-methods.component.html",
  styleUrls: ["./payments-methods.component.css"],
})
export class PaymentsMethodsComponent implements OnInit {
  /**
   * Link doc PagSeguro:
   * https://dev.pagbank.uol.com.br/reference/criar-pedido
   */
  typePayment: string;
  customer: Customer;

  constructor() {
    this.typePayment = "";
    this.customer = {
      name: "",
      email: "",
      tax_id: "",
      phones: [
        {
          country: "",
          area: "",
          number: "",
          type: "MOBILE",
        },
      ],
    };
  }

  ngOnInit() {
    console.log("[OK] PaymentsMethodsComponent");
  }

  setTypePayment(value: string) {
    this.typePayment = value;
  }
}
