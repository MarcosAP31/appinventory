import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { Client } from 'src/app/models/client';
import { FormGroup, FormBuilder } from '@angular/forms';

//import { UsuarioModel } from 'src/app/models/usuario.model';
import{Router,ActivatedRoute} from '@angular/router';
import { StoreService } from 'src/app/service/store.service';

import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  image:any
  files:any
  previsualizacion:any
  formClient:FormGroup
  clients:any
  empresas:any
  dtOptions:DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating=true
  noValido=true
  id=0
  
  constructor(
    private sanitizer: DomSanitizer,
    public form:FormBuilder,
    private storeService:StoreService,

  ) { 
    this.formClient=this.form.group({
      Name:[''],LastName:[''],MotherLastname:[''],Birthday:[''],Sex:[''],Department:[''],Province:[''],District:[''],Direction:[''],Phone:[''],Email:[''],Image:['']
    
  });}

  /*gOnInit(): void {
    this.inventarioService.obtenerEmpresas().subscribe(response=>{
      this.empresas=response;
      console.log(this.empresas);
    });
  }*/
  isLoading(){
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }
  stopLoading(){
    Swal.close();
  }

  get(){
    this.storeService.getClients().subscribe(response=>{
      this.clients = response;
      this.dtTrigger.next(0);
      //this.stopLoading();
    })
    
    /*
    this.inventarioService.obtenerEmpresas().subscribe(response=>{
      this.empresas = response;
      //this.stopLoading();
    })*/
    
    
  }
  
  ngOnInit(): void {
    //this.obtenerUsuario();
    //this.reiniciar();
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };
    this.get();
  }
  /*obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
  }*/
  edit(clientid:any){
   
    this.creating=false
    this.storeService.getClient(clientid).subscribe(
      (response:any)=>{
        
        this.id=response.ClientId,
        this.formClient.setValue({
          Name:response.Name,
          LastName:response.LastName,
          MotherLastname:response.MotherLastname,
          Birthday:response.Birthday,
          Sex:response.Sex,
          Department:response.Department,
          Province:response.Province,
          District:response.District,
          Direction:response.Direction,
          Phone:response.Phone,
          Email:response.Email,
          Image:response.Image
        });
        
        console.log(this.id)
      }
    )
    
    
    
    /*
      */
    
    this.formClient=this.form.group(
      {
        Name:[''],LastName:[''],MotherLastname:[''],Birthday:[''],Sex:[''],Department:[''],Province:[''],District:[''],Direction:[''],Phone:[''],Email:[''],Image:['']
      }
    );
  }
  
  delete(id:any){

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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Eliminando registro',
          text: 'Cargando...',
        });

        Swal.showLoading();
        
        this.storeService.deleteClient(id).subscribe(r => {
          
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
      /*this.inventarioService.eliminarEmpresa(id).subscribe(response=>{
        console.log("me eliminaste");
      });*/
   
  }
  submit(){
    /*
    var empresa=new Empresa();
    if(this.creando==true){
      
      empresa.descripcion=this.formularioEmpresa.value.descripcion;
      empresa.habilitado=true;
      var arr = [];
    arr.push(empresa);
    this.inventarioService.insertarEmpresa(arr).subscribe(response=>{
     
      console.log("Me presionaste");
    });
    }
    else{
      this.inventarioService.obtenerEmpresa(this.formularioEmpresa.value.empresaId).subscribe(
        (response:any)=>{
         empresa.empresaId=response[0]['empresaId'];
         empresa.descripcion=this.formularioEmpresa.value.descripcion;
         empresa.habilitado=true;
         this.inventarioService.actualizarEmpresa(empresa).subscribe();
        }
      );
      
      
    }
    */
    var client=new Client()
    client.Name=this.formClient.value.Name
    client.LastName=this.formClient.value.LastName
    client.MotherLastname=this.formClient.value.MotherLastname
    client.Birthday=this.formClient.value.Birthday
    client.Sex=this.formClient.value.Sex
    client.Department=this.formClient.value.Department
    client.Province=this.formClient.value.Province
    client.District=this.formClient.value.District
    client.Direction=this.formClient.value.Direction
    client.Phone=this.formClient.value.Phone
    client.Email=this.formClient.value.Email
    var splits
    splits=this.formClient.value.Image.split('fakepath\\')
    
    this.image=splits[1]
    client.Image=this.image  
    
    if(this.creating==false){
      
      client.ClientId=this.id
    }

    var solicitud = this.creating?this.storeService.insertClient(client):this.storeService.updateClient(this.id,client);
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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Guardando registro',
          text: 'Cargando...',
        });

        Swal.showLoading();

        solicitud.subscribe(r => {
          
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
  captureFile(event:any){
    const capturedFile=event.target.files[0]
    this.extraerBase64(capturedFile).then((image:any)=>{
      this.previsualizacion=image.base;
      console.log(image)
    })
    
    console.log(this.image)
    //this.files.push(capturedFile)
    //console.log(event.target.files)
  }
  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
      return 0
    } catch (e) {
      return null;
    }
  })

  closeModal(){
    this.formClient=this.form.group({
      Name:[''],LastName:[''],MotherLastname:[''],Birthday:[''],Sex:[''],Department:[''],Province:[''],District:[''],Direction:[''],Phone:[''],Email:[''],Image:['']
    
  })
  }
  /*deleteClient(id:any,iControl:any){
    console.log(id);
    console.log(iControl);
    
  }
  }*/

}
