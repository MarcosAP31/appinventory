import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder } from '@angular/forms';
import{Router,ActivatedRoute} from '@angular/router';
import { StoreService } from 'src/app/service/store.service';

import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  image:any
  files:any
  previsualizacion:any
  formUser:FormGroup
  users:any
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
    this.formUser=this.form.group({
      Name:[''],LastName:[''],MotherLastname:[''],Birthday:[''],Sex:[''],Department:[''],Province:[''],District:[''],Direction:[''],Phone:[''],Email:[''],Password:[''],Image:['']
    
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
    this.storeService.getUsers().subscribe(response=>{
      this.users = response;
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
  edit(userid:any){
   
    this.creating=false
    this.storeService.getUser(userid).subscribe(
      (response:any)=>{
        
        this.id=response.UserId,
        this.formUser.setValue({
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
          Password:response.Password,
          Image:response.Image
        });
        
        console.log(this.id)
      }
    )
    
    
    
    /*
      */
    
    this.formUser=this.form.group(
      {
        Name:[''],LastName:[''],MotherLastname:[''],Birthday:[''],Sex:[''],Department:[''],Province:[''],District:[''],Direction:[''],Phone:[''],Email:[''],Password:[''],Image:['']
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
    var user=new User()
    user.Name=this.formUser.value.Name
    user.LastName=this.formUser.value.LastName
    user.MotherLastname=this.formUser.value.MotherLastname
    user.Birthday=this.formUser.value.Birthday
    user.Sex=this.formUser.value.Sex
    user.Department=this.formUser.value.Department
    user.Province=this.formUser.value.Province
    user.District=this.formUser.value.District
    user.Direction=this.formUser.value.Direction
    user.Phone=this.formUser.value.Phone
    user.Email=this.formUser.value.Email
    user.Password=this.formUser.value.Password
    var splits
    splits=this.formUser.value.Image.split('fakepath\\')
    
    this.image=splits[1]
    user.Image=this.image  
    if(this.creating==false){
      
      user.UserId=this.id
    }

    var solicitud = this.creating?this.storeService.insertUser(user):this.storeService.updateUser(this.id,user);
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
    this.formUser=this.form.group({
      Name:[''],LastName:[''],MotherLastname:[''],Birthday:[''],Sex:[''],Department:[''],Province:[''],District:[''],Direction:[''],Phone:[''],Email:[''],Password:[''],Image:['']
    
    
  })
  }
  /*deleteUser(id:any,iControl:any){
    console.log(id);
    console.log(iControl);
    
  }
  }*/

}
