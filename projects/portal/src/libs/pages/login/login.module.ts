import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoginRoutingModule } from "./login-routing.module";
import { LoginPage } from "./login.page";

import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [LoginPage],
  imports: [CommonModule, LoginRoutingModule, MatButtonModule],
})
export class LoginModule {}
