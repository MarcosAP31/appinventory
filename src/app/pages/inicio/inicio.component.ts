import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { StoreService } from 'src/app/service/store.service';
import { DatePipe } from '@angular/common';
import { Session } from 'src/app/models/session';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  windowRef: Window = window;
  username: any;
  accountant: any = 1;
  todayWithPipe: any;
  pipe = new DatePipe('en-US');
  session: Session = new Session();

  constructor(
    private cookieService: CookieService,
    private storeService: StoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener el nombre de usuario almacenado en el almacenamiento local
    this.username = localStorage.getItem('username');
    this.obtenerUsuario();
    // Obtener la fecha actual formateada
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
  }

  obtenerUsuario() {
    /* Comentar temporalmente este bloque
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
      if (this.user.administrador) {
        this.rol = 'Administrador';
      } else if (this.user.supervisor) {
        this.rol = 'Supervisor';
      } else if (this.user.inventario) {
        this.rol = 'Inventariador';
      }
    }
    */
  }

  logout() {
    this.router.navigateByUrl('login');
    // Obtener la sesión actual del usuario y actualizar la hora de cierre
    this.storeService.getSessionByUserId(Number(localStorage.getItem('userId'))).subscribe((res: any) => {
      this.session = res;
      this.session.LogoutTime = this.todayWithPipe;
      this.storeService.updateSession(res.SessionId, this.session).subscribe((r: any) => {});
    });

    // Expirar el token de acceso y realizar el proceso de cierre de sesión
    this.storeService.expireToken(localStorage.getItem('token')).subscribe((res: any) => {
      
      console.log(this.cookieService.get('token_access'));
      if (res == null) {
        this.cookieService.delete('token_access');
        
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        console.log(localStorage.getItem('username'))
      }
      
    });
  }
}
