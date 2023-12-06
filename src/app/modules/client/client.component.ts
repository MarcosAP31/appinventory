import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Client } from 'src/app/models/client';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  image: any = "../../../assets/upload.png";
  show: boolean = false;
  title = 'fileUpload';
  images = '';
  imgURL = '/assets/noimage.png';
  multipleImages = [];
  imagenes: any = [];
  pipe = new DatePipe('en-US');
  todayWithPipe: any;

  formClient: FormGroup;
  clients: any;
  empresas: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  noValido = true;
  id = 0;

  constructor(
    private http: HttpClient,
    
    public form: FormBuilder,
    private storeService: StoreService,
  ) {
    this.formClient = this.form.group({
      Name: [''],
      LastName: [''],
      Birthday: [''],
      Sex: [''],
      Department: [''],
      Province: [''],
      District: [''],
      Direction: [''],
      Phone: [''],
      Email: [''],
      Image: ['']
    });
  }

  // Mostrar mensaje de carga
  isLoading() {
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }

  // Detener mensaje de carga
  stopLoading() {
    Swal.close();
  }

  // Obtener lista de clientes
  getClients() {
    this.storeService.getClients().subscribe(response => {
      this.clients = response;
      this.dtTrigger.next(0);
    });
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };
    this.getClients();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
  }

  // Selecionar imagen
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

  // Mostrar múltiples imágenes
  selectMultipleImage(event: any) {
    if (event.target.files.length > 0) {
      this.multipleImages = event.target.files;
    }
  }

  // Mostrar imágenes
  mostrarImg() {
    this.http.get<any>('http://localhost:3000/apistore/upload').subscribe(res => {
      this.imagenes = res;
      const reader = new FileReader();
      reader.onload = (this.imagenes);
      console.log(this.imagenes);
    });
  }

  // Editar cliente
  edit(clientid: any) {
    this.creating = false;
    this.storeService.getClient(clientid).subscribe(
      (response: any) => {
        this.id = response.ClientId;
        this.formClient.setValue({
          Name: response.Name,
          LastName: response.LastName,
          Birthday: response.Birthday,
          Sex: response.Sex,
          Department: response.Department,
          Province: response.Province,
          District: response.District,
          Direction: response.Direction,
          Phone: response.Phone,
          Email: response.Email,
          Image:''
        });
        console.log(this.id);
      }
    );
    this.formClient = this.form.group({
      Name: [''],
      LastName: [''],
      Birthday: [''],
      Sex: [''],
      Department: [''],
      Province: [''],
      District: [''],
      Direction: [''],
      Phone: [''],
      Email: [''],
      Image: ['']
    });
  }

  // Eliminar cliente
  delete(id: any) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro que desea eliminar el registro?',
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

        // Obtener información del cliente
        this.storeService.getClient(id).subscribe((r: any) => {
          // Obtener archivo asociado al cliente
          this.storeService.getFileByName(r.Image).subscribe((res: any) => {
            // Eliminar archivo
            this.http.delete<any>(`http://192.168.1.5:3000/apistore/file/${res.FileId}`).subscribe(re => {
              console.log(re, location.reload());
            });
          });
        });

        // Eliminar cliente
        this.storeService.deleteClient(id).subscribe(r => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: '¡Se ha eliminado correctamente!'
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
              text: 'Error de comunicación con el servidor'
            });
            return;
          }
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: err.Name,
            text: err.message
          });
        });
      } else if (result.isDenied) {
        // El usuario ha cancelado la operación
      }
    });
  }

  // Enviar formulario
  submit() {
    var client = new Client();
    client.Name = this.formClient.value.Name;
    client.LastName = this.formClient.value.LastName;
    client.Birthday = this.formClient.value.Birthday;
    client.Sex = this.formClient.value.Sex;
    client.Department = this.formClient.value.Department;
    client.Province = this.formClient.value.Province;
    client.District = this.formClient.value.District;
    client.Direction = this.formClient.value.Direction;
    client.Phone = this.formClient.value.Phone;
    client.Email = this.formClient.value.Email;

    var splits = this.formClient.value.Image.split('fakepath\\');
    this.image = splits[1];
    client.Image = this.image;
    var solicitud = this.creating ? this.storeService.insertClient(client) : this.storeService.updateClient(this.id, client);
    this.storeService.getClientByEmail(this.formClient.value.Email).subscribe((c:any)=>{
      if(c!=null&&this.creating==true){
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Ya existe un cliente con el mismo correo.'
        });
      }else{
        Swal.fire({
          title: 'Confirmación',
          text: '¿Seguro que desea guardar el registro?',
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
              if (this.formClient.value.Image != '') {
                this.storeService.getClient(this.id).subscribe((re: any) => {
                  this.storeService.getFileByName(re.Image).subscribe((res: any) => {
                    this.http.delete<any>(`http://localhost:3000/apistore/file/${res.FileId}`).subscribe(()=>{});
                    this.http.post<any>('http://localhost:3000/apistore/saveimg', formData).subscribe(()=>{});
                  })
                });
              }
            }else{
              this.http.post<any>('http://localhost:3000/apistore/saveimg', formData).subscribe(()=>{});
            }
            solicitud.subscribe(r => {
              Swal.fire({
                allowOutsideClick: false,
                icon: 'success',
                title: 'Éxito',
                text: '¡Se ha guardado correctamente!'
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
                  text: 'Error de comunicación con el servidor'
                });
                return;
              }
              Swal.fire({
                allowOutsideClick: false,
                icon: 'error',
                title: err.Name,
                text: err.message
              });
            });
          } else if (result.isDenied) {
            // El usuario ha cancelado la operación
          }
        });
      }
    })
    
  }

  // Cerrar modal
  closeModal() {
    this.formClient = this.form.group({
      Name: [''],
      LastName: [''],
      Birthday: [''],
      Sex: [''],
      Department: [''],
      Province: [''],
      District: [''],
      Direction: [''],
      Phone: [''],
      Email: [''],
      Image: ['']
    });
  }
}
