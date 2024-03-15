import { Component, OnInit } from "@angular/core";
import { Customer } from "../../models/Customer";
import { uid } from "uid";
import { OrdersService } from "../../services/orders.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-payments-methods",
  templateUrl: "./payments-methods.component.html",
  styleUrls: ["./payments-methods.component.css"],
  providers: [OrdersService, MessageService],
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

  constructor(
    private _ordersService: OrdersService,
    private _messageService: MessageService,
  ) {
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

  ngOnInit(): void {
    console.log("[OK] PaymentsMethodsComponent");
  }

  onSubmit(): void {
    this._messageService.clear();
    let isValidated = this.validateData();

    if (isValidated) {
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

      this._ordersService.createOrder(order).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: () => {},
      });
    } else {
      console.log("Algo acontece");
    }
  }

  validateData(): boolean {
    if (
      this.customer.name == "" ||
      this.customer.tax_id == "" ||
      this.customer.email == "" ||
      this.customer.phones[0].number == ""
    ) {
      this._messageService.add({
        severity: "error",
        summary: "Dados incorretos",
        detail:
          "Verifique se preencheu corretamente os dados de nome, email, cpf (ou cnpj) e o telefone para contato.",
      });
      return false;
    } else if (
      this.customer.tax_id.indexOf(".") != -1 ||
      this.customer.tax_id.indexOf("-") != -1
    ) {
      this._messageService.add({
        severity: "error",
        summary: "CPF ou CNPJ inválido",
        detail:
          "Certifique-se de que preencheu todos os números e sem a pontuação.",
      });
      return false;
    }
    return true;
  }

  getTotalValue(): number {
    return this.items[0].quantity * this.items[0].unit_amount;
  }

  setTypePayment(value: string): void {
    this.typePayment = value;
  }

  splitNumber(): void {
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
