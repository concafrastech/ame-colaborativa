import { Component, OnInit } from "@angular/core";
import { Customer } from "../../models/Customer";
import { uid } from "uid";
import { PagseguroService } from "../../services/pagseguro.service";

@Component({
  selector: "app-payments-methods",
  templateUrl: "./payments-methods.component.html",
  styleUrls: ["./payments-methods.component.css"],
  providers: [PagseguroService],
})
export class PaymentsMethodsComponent implements OnInit {
  /**
   * Link doc PagSeguro:
   * https://dev.pagbank.uol.com.br/reference/criar-pedido
   */
  typePayment: string;
  customer: Customer;
  items: any[];
  amount: number;

  constructor(private _pagseguroService: PagseguroService) {
    this.typePayment = "";
    this.amount = 195;
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
    this.items = [
      {
        reference_id: "cota_10",
        name: "Cota 10",
        quantity: 0,
        unit_amount: this.amount,
      },
    ];
  }

  ngOnInit() {
    console.log("[OK] PaymentsMethodsComponent");
  }

  onSubmit() {
    this.splitNumber();

    let order = {
      reference_id: uid(),
      customer: this.customer,
      items: this.items,
      qr_code: [
        {
          amount: {
            value: this.getTotalValue(),
          },
        },
      ],
      shipping: {},
      billing: {},
      notification_urls: [],
    };

    this._pagseguroService.createOrder(order).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: () => {},
    });
  }

  getTotalValue() {
    return this.items[0].quantity * this.items[0].unit_amount;
  }

  setTypePayment(value: string) {
    this.typePayment = value;
  }

  splitNumber() {
    this.customer.phones[0].country = this.customer.phones[0].number
      .split(" ")[0]
      .split("+")[1];

    this.customer.phones[0].area = this.customer.phones[0].number
      .split(" ")[1]
      .split("(")[1]
      .split(")")[0];

    this.customer.phones[0].number = `${
      this.customer.phones[0].number.split(" ")[2].split("-")[0]
    }${this.customer.phones[0].number.split(" ")[2].split("-")[1]}`;
  }
}
