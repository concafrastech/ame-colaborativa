import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  projectName: string;

  constructor() {
    this.projectName = "Nome do Projeto";
  }

  ngOnInit() {}
}
