import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  image: any = "../../../assets/upload.png";
  show: boolean = false;
  title = 'fileUpload';
  images = '';
  imgURL = '/assets/noimage.png';
  multipleImages = [];
  imagenes: any = [];
  pipe = new DatePipe('en-US');
  formLogin: FormGroup;
  todayWithPipe: any;
  formUser: FormGroup;
  constructor(
    private http: HttpClient,
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
    this.formUser = this.form.group({
      Name: [''],
      LastName: [''],
      Birthday: [''],
      Sex: [''],
      Department: [''],
      Province: [''],
      District: [''],
      Direction: [''],
      Phone: [''],
      UserName: [''],
      Email: [''],
      Password: [''],
      Image: ['']
    });
  }
  // Método para mostrar el mensaje de carga
  isLoading() {
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }

  // Método para ocultar el mensaje de carga
  stopLoading() {
    Swal.close();
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
  // Método para seleccionar una imagen
  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.imgURL = event.target.result;
      }
      this.images = file;
    }
    this.show = true;
  }

  // Método para seleccionar múltiples imágenes
  selectMultipleImage(event: any) {
    if (event.target.files.length > 0) {
      this.multipleImages = event.target.files;
    }
  }

  // Método para mostrar imágenes
  mostrarImg() {
    this.http.get<any>('http://192.168.1.5:3000/apistore/upload').subscribe(res => {
      this.imagenes = res;
      const reader = new FileReader();
      reader.onload = (this.imagenes);
      console.log(this.imagenes);
    });
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
        this.storeService.verifyToken(localStorage.getItem("token")).subscribe(() => {
          this.cookieService.set('token_access', r);
          this.storeService.getUserByEmail(this.formLogin.value.email).subscribe((res: any) => {
            localStorage.setItem('username', res.UserName);
            localStorage.setItem('userId', res.UserId);
            const session = new Session();
            session.UserId = res.UserId;
            session.LoginTime = this.todayWithPipe;
            this.storeService.insertSession(session).subscribe(response => { });
          });
          this.router.navigateByUrl('inicio');
        });

        Swal.close();
      }
    });
  }
  // Método para guardar o actualizar un usuario
  submitForm() {
    var user = new User();
    user.Name = this.formUser.value.Name;
    user.LastName = this.formUser.value.LastName;
    user.Birthday = this.formUser.value.Birthday;
    user.Sex = this.formUser.value.Sex;
    user.Department = this.formUser.value.Department;
    user.Province = this.formUser.value.Province;
    user.District = this.formUser.value.District;
    user.Direction = this.formUser.value.Direction;
    user.Phone = this.formUser.value.Phone;
    user.UserName = this.formUser.value.UserName;
    user.Email = this.formUser.value.Email;
    user.Password = this.formUser.value.Password;
    user.Status = "Inactivo";
    var splits;
    splits = this.formUser.value.Image.split('fakepath\\');
    this.image = splits[1];
    user.Image = this.image;
    Swal.fire({
      title: 'Confirmación',
      text: 'Seguro de guardar el registro?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Guardar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Guardando registro',
          text: 'Cargando...',
        });
        Swal.showLoading();
        
        this.storeService.insertUser(user).subscribe(() => {
          const formData = new FormData();
          formData.append('file', this.images);
          this.http.post<any>('http://localhost:3000/apistore/saveimg', formData).subscribe(
            /*(res) => console.log(res, Swal.fire({
              icon: 'success',
              title: 'Imagen cargada!!',
              text: 'La imagen se subió correctamente!'
            }).then((result) => {
              if (result) {
                location.reload();
              }
            }))*/
          );
          
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: 'Se ha guardado correctamente!',
          }).then((result) => {
            window.location.reload();
          });
        }, err => {
          console.log(err);
          if (err.Name == "HttpErrorResponse") {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error al conectar',
              text: 'Error de comunicación con el servidor',
            });
            return;
          }
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: err.Name,
            text: err.message,
          });
        });
      } else if (result.isDenied) {

      }

    });
  }

  // Método para cerrar el modal
  closeModal() {
    this.imgURL="";
    this.formUser = this.form.group({
      Name: [''],
      LastName: [''],
      Birthday: [''],
      Sex: [''],
      Department: [''],
      Province: [''],
      District: [''],
      Direction: [''],
      Phone: [''],
      UserName: [''],
      Email: [''],
      Password: [''],
      Image: ['']
    });
  }
}
