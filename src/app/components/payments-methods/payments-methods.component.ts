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
  typePayment: string;
  customer: Customer;
  items: any[];
  amount: number;
  quantity: number;
  totalAmount: number;
  srcImg: string;
  isShow: boolean;
  isValidTaxId: boolean;
  isValidEmail: boolean;
  isVisibleTypePayment: boolean;
  isVisiblePixQrCode: boolean;

  constructor(
    private _checkoutsService: CheckoutsService,
    private _ordersService: OrdersService,
    private _messageService: MessageService,
    private _viewportScroller: ViewportScroller,
  ) {
    this.typeProduct = "";
    this.typePayment = "";
    this.amount = 195;
    this.quantity = 1;
    this.totalAmount = 0;
    this.srcImg = "";
    this.isShow = false;
    this.isValidTaxId = true;
    this.isValidEmail = true;
    this.isVisibleTypePayment = false;
    this.isVisiblePixQrCode = false;
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

  ngOnInit(): void {}

  onSubmit(typePayment: any): void {
    this.typePayment = typePayment;
    this.isShow = true;
    this._messageService.clear();
    this.resetInputs();

    if (this.validateData()) {
      this.splitNumber();
      this.prepareItemsData();
      let body = this.setBody();

      this.executeService(body);
    } else {
      this.isShow = false;
    }
  }

  executeService(body: any) {
    if (this.typePayment == "pix") {
      this._ordersService.createOrder(body).subscribe({
        next: (response: any) => {
          let data = JSON.parse(response.data);
          data.qr_codes.forEach((qrcode: any) => {
            qrcode.links.forEach((link: any) => {
              if (link.rel == "QRCODE.PNG") {
                this.srcImg = link.href;
              }
              this.isShow = false;
            });
          });
          this.isShow = false;
          this.isVisibleTypePayment = false;
          this.isVisiblePixQrCode = true;
        },
        error: (response: any) => {
          console.log(response);
        },
      });
    } else {
      this._checkoutsService.createCheckout(body).subscribe({
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
        error: (response: any) => {
          let body = JSON.parse(response.error.data);
          this.customer.phones[0].number = "";

          body.error_messages.forEach((errorBody: any) => {
            if (errorBody.error == "invalid_value") {
              if (errorBody.parameter_name == "customer.tax_id") {
                this.isValidTaxId = false;
                this._messageService.add({
                  severity: "error",
                  summary: "CPF ou CNPJ inválido",
                  detail:
                    "Verifique se preencheu corretamente o seu CPF ou CNPJ.",
                });
              } else if (errorBody.parameter_name == "customer.email") {
                this.isValidEmail = false;
                this._messageService.add({
                  severity: "error",
                  summary: "E-mail inválido",
                  detail: "Verifique se preencheu corretamente o seu e-mail.",
                });
              }
            } else if (errorBody.error == "field_cannot_be_empty") {
              if (errorBody.parameter_name == "items[0].unit_amount") {
                this._messageService.add({
                  severity: "error",
                  summary: "Valor inválido",
                  detail:
                    "Verifique se preencheu corretamente o valor a ser pago.",
                });
              }
            }
          });

          this.isShow = false;
        },
      });
    }
  }

  prepareItemsData() {
    this.items[0].unit_amount = this.amount * 100;
    this.items[0].quantity = this.typeProduct == "cota10" ? this.quantity : 1;
    this.customer.email = this.customer.email.trim();
    this.totalAmount = this.items[0].unit_amount * this.items[0].quantity;

    if (this.typeProduct == "cota10") {
      this.items[0].reference_id = "cota_10";
      this.items[0].name = "Cota 10";
    } else if (this.typeProduct == "value") {
      this.items[0].reference_id = "value";
      this.items[0].name = "Valor Avulso";
    }
  }

  resetInputs(): void {
    this.isValidTaxId = true;
    this.isValidEmail = true;
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
    } else if (this.items[0].unit_amount == null) {
      this._messageService.add({
        severity: "error",
        summary: "Valor inválido",
        detail: "Certifique-se de que o valor inserido não é vazio.",
      });
      return false;
    }
    return true;
  }

  setBody() {
    return this.typePayment == "pix"
      ? {
          reference_id: uid(),
          customer: this.customer,
          items: this.items,
          qr_codes: [
            {
              amount: {
                value: this.totalAmount,
              },
            },
          ],
          notification_urls: ["https://concafras-ame.web.app/"],
        }
      : {
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
  }

  setTypeProduct(value: string): void {
    this.typeProduct = value;

    if (this.typeProduct == "value") {
      this.amount = 30;
    } else {
      this.amount = 195;
    }

    this._viewportScroller.scrollToAnchor("anchor-payments-contents");
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
