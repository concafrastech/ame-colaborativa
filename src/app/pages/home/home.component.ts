import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  projectName: string;

  constructor() {
    this.projectName = "Bons Frutos - Projeto Divulu";
  }

  ngOnInit() {}
}
