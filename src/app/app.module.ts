import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from "angular-datatables";
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { NgSelect2Module } from 'ng-select2';
import { ClientComponent } from './modules/client/client.component';
import { ProductComponent } from './modules/product/product.component';
import { SupplierComponent } from './modules/supplier/supplier.component';
import { UserComponent } from './modules/user/user.component';
import { EntryComponent } from './modules/entry/entry.component';
import { OutputComponent } from './modules/output/output.component'
import { OperationsComponent } from './modules/operations/operations.component';
import { BusinessComponent } from './modules/business/business.component'
import { SessionComponent } from './modules/session/session.component'
import { MessageComponent } from './modules/message/message.component'
import { DocumentComponent } from './modules/document/document.component'
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



//import { ReadexcelDirective } from './directives/readexcel.directive';
//import { DatatableArticulosAperturaComponent } from './components/datatable-articulos-apertura/datatable-articulos-apertura.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MantenimientoComponent } from './sections/mantenimiento/mantenimiento.component';
import { InventarioComponent } from './sections/inventario/inventario.component';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
@NgModule({
  declarations: [
    AppComponent,
    MantenimientoComponent,
    InventarioComponent,
    ClientComponent,
    ProductComponent,
    UserComponent,
    SupplierComponent,
    EntryComponent,
    OutputComponent,
    OperationsComponent,
    BusinessComponent,
    SessionComponent,
    MessageComponent,
    DocumentComponent,
    InicioComponent,
    LoginComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    DataTablesModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    
  ],
  exports:[
    DataTablesModule,
    
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:JwtInterceptor,multi:true},
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
