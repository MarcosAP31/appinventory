import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';

import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  image: any = "../../../assets/upload.png";
  show: boolean = false;
  title = 'fileUpload';
  images = '';
  imgURL = '/assets/noimage.png';
  multipleImages = [];
  imagenes: any = [];
  pipe = new DatePipe('en-US');
  todayWithPipe: any;

  formUser: FormGroup;
  users: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  noValido = true;
  id = 0;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public form: FormBuilder,
    private storeService: StoreService
  ) {
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

  // Método para obtener los usuarios
  get() {
    this.storeService.getUsers().subscribe(response => {
      this.users = response;
      this.dtTrigger.next(0);
    });
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };
    this.get();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
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
    this.http.get<any>('http://localhost:3000/apistore/upload').subscribe(res => {
      this.imagenes = res;
      const reader = new FileReader();
      reader.onload = (this.imagenes);
      console.log(this.imagenes);
    });
  }

  // Método para editar un usuario
  edit(userid: any) {
    this.creating = false;
    this.storeService.getUser(userid).subscribe(
      (response: any) => {
        this.id = response.UserId;
        this.formUser.setValue({
          Name: response.Name,
          LastName: response.LastName,
          Birthday: response.Birthday,
          Sex: response.Sex,
          Department: response.Department,
          Province: response.Province,
          District: response.District,
          Direction: response.Direction,
          Phone: response.Phone,
          UserName: response.UserName,
          Email: response.Email,
          Password: response.Password,
          Image: ''
        });
        console.log(this.id);
      }
    );
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

  // Método para eliminar un usuario
  delete(id: any) {
    Swal.fire({
      title: 'Confirmación',
      text: 'Seguro de eliminar el registro?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Eliminando registro',
          text: 'Cargando...',
        });
        Swal.showLoading();
        this.storeService.getUser(id).subscribe((r: any) => {
          this.storeService.getFileByName(r.Image).subscribe((res: any) => {
            this.http.delete<any>(`http://localhost:3000/apistore/file/${res.FileId}`).subscribe(re => {
              console.log(re, location.reload());
            });
          });
        });
        this.storeService.deleteUser(id).subscribe(r => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: 'Se ha eliminado correctamente!',
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

  // Método para guardar o actualizar un usuario
  submit() {
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
    if (this.creating == false) {
      user.UserId = this.id;
    }
    var solicitud = this.creating ? this.storeService.insertUser(user) : this.storeService.updateUser(this.id, user);
    this.storeService.getUserByUserName(this.formUser.value.UserName).subscribe((u: any) => {
      if (u != null&&this.creating==true) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Ya existe un registro con el mismo nombre de usuario.'
        });
      } else {
        Swal.fire({
          title: 'Confirmación',
          text: '¿Seguro de guardar el registro?',
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
            const formData = new FormData();
            formData.append('file', this.images);
            if (this.creating == false) {
              if (this.formUser.value.Image != '') {
                this.storeService.getUser(this.id).subscribe((re: any) => {
                  this.storeService.getFileByName(re.Image).subscribe((res: any) => {
                    this.http.delete<any>(`http://localhost:3000/apistore/file/${res.FileId}`).subscribe(() => { });
                    this.http.post<any>('http://localhost:3000/apistore/saveimg', formData).subscribe(() => { });
                  })
                });
              } 
            }else{
              this.http.post<any>('http://localhost:3000/apistore/saveimg', formData).subscribe(() => { });
            }
            solicitud.subscribe(() => {
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
    })

  }

  // Método para cerrar el modal
  closeModal() {
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
