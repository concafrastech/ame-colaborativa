import { Component, OnInit } from "@angular/core";
import { Customer } from "../../models/Customer";
import { uid } from "uid";
import { OrdersService } from "../../services/orders.service";
import { MessageService } from "primeng/api";
import { CheckoutsService } from "../../services/checkouts.service";
import { ViewportScroller } from "@angular/common";

@Component({
  selector: "app-payments-methods",
  templateUrl: "./payments-methods.component.html",
  styleUrls: ["./payments-methods.component.css"],
  providers: [OrdersService, CheckoutsService, MessageService],
})
export class PaymentsMethodsComponent implements OnInit {
  typeProduct: string;
  customer: Customer;
  items: any[];
  amount: number;
  quantity: number;
  isShow: boolean;

  constructor(
    private _checkoutsService: CheckoutsService,
    private _messageService: MessageService,
    private _viewportScroller: ViewportScroller,
  ) {
    this.typeProduct = "";
    this.amount = 195;
    this.quantity = 1;
    this.isShow = false;
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
        reference_id: "",
        name: "",
        quantity: this.quantity,
        unit_amount: this.amount,
      },
    ];
  }

  ngOnInit(): void {
    console.log("[OK] PaymentsMethodsComponent");
  }

  onSubmit(): void {
    this.isShow = true;
    this._messageService.clear();
    let isValidated = this.validateData();

    if (isValidated) {
      this.splitNumber();
      this.prepareItemsData();
      let checkout = {
        reference_id: uid(),
        customer: this.customer,
        items: this.items,
        additional_amount: 0,
        discount_amount: 0,
        payment_methods: [
          {
            type: "credit_card",
            brands: ["mastercard", "visa"],
          },
          {
            type: "PIX",
          },
          {
            type: "BOLETO",
          },
        ],
        payment_methods_configs: [
          {
            type: "credit_card",
            brands: ["mastercard", "visa"],
            config_options: [
              {
                option: "installments_limit",
                value: "3",
              },
            ],
          },
        ],
        redirect_url: "https://concafras-ame.web.app/",
        return_url: "https://concafras-ame.web.app/",
        notification_urls: ["https://concafras-ame.web.app/"],
      };

      this._checkoutsService.createCheckout(checkout).subscribe({
        next: (response: any) => {
          let data = JSON.parse(response.data);
          data.links.forEach((link: any) => {
            if (link.rel == "PAY") {
              this._checkoutsService.successCheckout(data).subscribe({
                next: () => {
                  window.open(link.href, "_self");
                },
              });
            }
            this.isShow = false;
          });
        },
        error: () => {},
      });
    } else {
      this.isShow = false;
    }
  }

  prepareItemsData() {
    this.items[0].unit_amount = this.amount * 100;

    if (this.typeProduct == "cota10") {
      this.items[0].reference_id = "cota_10";
      this.items[0].name = "Cota 10";
    } else if (this.typeProduct == "value") {
      this.items[0].reference_id = "value";
      this.items[0].name = "Valor Avulso";
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
    } else if (this.typeProduct == "value") {
      if (this.amount < 30) {
        this._messageService.add({
          severity: "error",
          summary: "Valor inválido",
          detail:
            "Certifique-se de que o valor inserido é superior ou igual ao mínimo.",
        });
        return false;
      }
    }
    return true;
  }

  setTypeProduct(value: string): void {
    this.typeProduct = value;

    if (this.typeProduct == "value") {
      this.amount = 30;
    } else {
      this.amount = 195;
    }

    this._viewportScroller.scrollToAnchor("payments-contents");
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
