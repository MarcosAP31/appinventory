import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientComponent } from './modules/client/client.component';
import { ProductComponent } from './modules/product/product.component';
import { UserComponent } from './modules/user/user.component';
import { SupplierComponent } from './modules/supplier/supplier.component';
import { EntryComponent } from './modules/entry/entry.component';
import { OutputComponent } from './modules/output/output.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { OperationsComponent } from './modules/operations/operations.component';
import { BusinessComponent } from './modules/business/business.component';
import { SessionComponent } from './modules/session/session.component';
import { MessageComponent } from './modules/message/message.component';
import { DocumentComponent } from './modules/document/document.component';
import { LoginComponent } from './pages/login/login.component';
import { MantenimientoComponent } from './sections/mantenimiento/mantenimiento.component';
import { SecurityGuard } from './security.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [SecurityGuard],
    children: [
      {
        path: 'mantenimiento',
        component: MantenimientoComponent,
        children: [
          { path: 'client', component: ClientComponent, canActivate: [SecurityGuard] },
          { path: 'product', component: ProductComponent, canActivate: [SecurityGuard] },
          { path: 'user', component: UserComponent, canActivate: [SecurityGuard] },
          { path: 'supplier', component: SupplierComponent, canActivate: [SecurityGuard] },
          { path: 'entry', component: EntryComponent, canActivate: [SecurityGuard] },
          { path: 'output', component: OutputComponent, canActivate: [SecurityGuard] },
          { path: 'operations', component: OperationsComponent, canActivate: [SecurityGuard] },
          { path: 'business', component: BusinessComponent, canActivate: [SecurityGuard] },
          { path: 'session', component: SessionComponent, canActivate: [SecurityGuard] },
          { path: 'message', component: MessageComponent, canActivate: [SecurityGuard] },
          { path: 'document', component: DocumentComponent, canActivate: [SecurityGuard] }
        ]
      },
      {
        path: '',
        redirectTo: 'mantenimiento',
        pathMatch: 'full'
      }
    ]
  },
  // Agrega una ruta para manejar cualquier otra ruta no definida
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
