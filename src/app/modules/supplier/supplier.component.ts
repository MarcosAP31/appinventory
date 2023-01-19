import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Supplier } from 'src/app/models/supplier';
import { FormGroup, FormBuilder } from '@angular/forms';
import{Router,ActivatedRoute} from '@angular/router';
import { StoreService } from 'src/app/service/store.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  formSupplier:FormGroup
  suppliers:any
  dtOptions:DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating=true
  noValido=true
  id=0
  
  constructor(
    public form:FormBuilder,
    private storeService:StoreService,

  ) { 
    this.formSupplier=this.form.group({
      RUC:[''],BusinessName:[''],TradeName:[''],Kind:[''],Department:[''],Province:[''],District:[''],Direction:[''],Phone:[''],Email:['']
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
    this.storeService.getSuppliers().subscribe(response=>{
      this.suppliers = response;
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
  edit(supplierid:any){
   
    this.creating=false
    this.storeService.getSupplier(supplierid).subscribe(
      (response:any)=>{
        
        this.id=response.SupplierId,
        this.formSupplier.setValue({
          RUC:response.RUC,
          BusinessName:response.BusinessName,
          TradeName:response.TradeName,
          Kind:response.Kind,
          Department:response.Department,
          Province:response.Province,
          District:response.District,
          Direction:response.Direction,
          Phone:response.Phone,
          Email:response.Email
        });
        
        console.log(this.id)
      }
    )
    
    
    
    /*
      */
    
    this.formSupplier=this.form.group(
      {
        RUC:[''],BusinessName:[''],TradeName:[''],Kind:[''],Department:[''],Province:[''],District:[''],Direction:[''],Phone:[''],Email:['']
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
        
        this.storeService.deleteSupplier(id).subscribe(r => {
          
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
        
          if (err.RUC == "HttpErrorResponse") {
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
            title: err.RUC,
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
    var supplier=new Supplier()
    supplier.RUC=this.formSupplier.value.RUC
    supplier.BusinessName=this.formSupplier.value.BusinessName
    supplier.TradeName=this.formSupplier.value.TradeName
    supplier.Kind=this.formSupplier.value.Kind
    supplier.Department=this.formSupplier.value.Department
    supplier.Province=this.formSupplier.value.Province
    supplier.District=this.formSupplier.value.District
    supplier.Direction=this.formSupplier.value.Direction
    supplier.Phone=this.formSupplier.value.Phone
    supplier.Email=this.formSupplier.value.Email
    
    if(this.creating==false){
      supplier.SupplierId=this.id
    }

    var solicitud = this.creating?this.storeService.insertSupplier(supplier):this.storeService.updateSupplier(this.id,supplier);
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
        
          if (err.RUC == "HttpErrorResponse") {
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
            title: err.RUC,
            text: err.message,
          });
        });

      } else if (result.isDenied) {

      }
    });
  }
  

  closeModal(){
    this.formSupplier=this.form.group({
      RUC:[''],BusinessName:[''],TradeName:[''],Kind:[''],Department:[''],Province:[''],District:[''],Direction:[''],Phone:[''],Email:['']
    
  })
  }
  /*deleteSupplier(id:any,iControl:any){
    console.log(id);
    console.log(iControl);
    
  }
  }*/

}
