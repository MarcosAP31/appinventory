import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user';
import { Session } from 'src/app/models/session';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  formLogin: FormGroup;
  todayWithPipe: any;
  pipe = new DatePipe('en-US');

  constructor(
    private cookieService: CookieService,
    public form: FormBuilder,
    private storeService: StoreService,
    private router: Router
  ) {
    // Inicializar el formulario
    this.formLogin = this.form.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    
    // Redireccionar al inicio si ya hay un token de acceso en las cookies
    if (this.cookieService.check('token_access')) {
      this.router.navigateByUrl('inicio');
    }

    // Obtener la fecha actual formateada
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
    /* Comentar este bloque temporalmente
    if (this.storeService.estaAutenticado()) {
      this.router.navigateByUrl("inicio");
      var r = this.storeService.obtenerUserLogeado();
      if (r.administrador) {
        this.router.navigate(['/mantenimiento/empresa']);
      } else if (r.supervisor) {
        this.router.navigate(['/inventario/apertura']);
      } else {
        this.router.navigate(['/inventario/toma']);
      }
    }
    */
  }
  redirectFromHash() {
    if (window.location.hash && window.location.hash === '#/') {
      window.location.replace(window.location.href.replace('#/', ''));
    }
  }
  submit() {
    // Crear un nuevo usuario con los datos del formulario
    const user = new User();
    user.Email = this.formLogin.value.email;
    user.Password = this.formLogin.value.password;
  
    // Mostrar un mensaje de carga mientras se realiza la autenticación
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Login',
      text: 'Ingresando...',
    });
    Swal.showLoading();
  
    // Llamar al servicio de autenticación
    this.storeService.login(user).subscribe((r: any) => {
      if (r == null) {
        // Si la autenticación falla, redireccionar a la página de inicio de sesión y cerrar el mensaje de carga
        this.router.navigateByUrl('login');
        Swal.close();
      } else {
        // Si la autenticación tiene éxito, almacenar el token de acceso y realizar verificaciones adicionales
        localStorage.setItem("token", r);
        this.storeService.verifyToken(localStorage.getItem("token")).subscribe(re => {
          this.cookieService.set('token_access', r);
          this.storeService.getUserByEmail(this.formLogin.value.email).subscribe((res: any) => {
            
            localStorage.setItem('username', res.UserName);
            localStorage.setItem('userId', res.UserId);
            const session = new Session();
            session.UserId = res.UserId;
            session.LoginTime = this.todayWithPipe;
            this.storeService.insertSession(session).subscribe(response => {});
          });
          this.router.navigateByUrl('inicio');
        });
        
        Swal.close();
      }
    });
  
  }
}
