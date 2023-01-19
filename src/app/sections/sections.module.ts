import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioComponent } from './inventario/inventario.component';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';

import { AppRoutingModule } from '../app-routing.module';
//import { ReadexcelDirective } from '../directives/readexcel.directive';
//import { ReportesComponent } from './reportes/reportes.component';
//import { IngresosSalidasComponent } from './ingresos-salidas/ingresos-salidas.component';



@NgModule({
  declarations: [
    InventarioComponent,
    MantenimientoComponent
    //ReportesComponent,
    //IngresosSalidasComponent
  ],
  imports: [
    CommonModule,
    
    AppRoutingModule
  ],
  exports:[
    InventarioComponent,
    MantenimientoComponent
    //ReportesComponent
    //IngresosSalidasComponent
  ]
})
export class SectionsModule { }
