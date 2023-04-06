import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import{Router,ActivatedRoute} from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { Request, Response } from 'express'

import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { OperationsComponent } from '../operations/operations.component';
import { Operation } from 'src/app/models/operation';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  image:any="../../../assets/upload.png"
  show:boolean=false;
  title = 'fileUpload';
  images = '';
  imgURL = '/assets/noimage.png';
  multipleImages = [];
  imagenes: any = [];
  
  file:any
  previsualizacion:any
  pipe = new DatePipe('en-US');
  todayWithPipe:any;
  formProduct:FormGroup
  products:any
  
  codeproduct:any
  suppliers:any
  dtOptions:DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating=true
  noValido=true
  code=0
 
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public form:FormBuilder,
    private storeService:StoreService,
    
  ) { 
    
    this.formProduct=this.form.group({
      Description:[''],Category:[''],Amount:[''],PurchasePrice:[''],SalePrice:[''],SupplierId:[''],Image:['']
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
    this.storeService.getProducts().subscribe(response=>{
      this.products = response;
      this.dtTrigger.next(0);
      //this.stopLoading();
    })
    this.storeService.getSuppliers().subscribe(response=>{
      this.suppliers = response;
      
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
    this.mostrarImg();
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };
    this.get();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
  }
  selectImage(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = (event: any)=>{
         this.imgURL = event.target.result;
       }
      this.images = file;
    }
    this.show=true;
  }

  selectMultipleImage(event:any) {
    if (event.target.files.length > 0) {
      this.multipleImages = event.target.files;
    }
  }
  mostrarImg(){
    
    this.http.get<any>('http://localhost:3000/apistore/upload').subscribe(res => {
    
    this.imagenes = res;
    const reader = new FileReader();
    reader.onload = (this.imagenes);
       
   console.log(this.imagenes);
    });

  }
  /*obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
  }*/
  edit(code:any){
   
    this.creating=false
    this.storeService.getProduct(code).subscribe(
      (response:any)=>{
        
        this.code=response.Code,
        this.formProduct.setValue({
          Description:response.Description,
          Category:response.Description,
          Amount:response.Amount,
          PurchasePrice:response.PurchasePrice,
          SalePrice:response.SalePrice,
          SupplierId:response.SupplierId,
          Image:response.Image
        });
        
        console.log(this.code)
      }
    )
    
    
    
    /*
      */
    
    this.formProduct=this.form.group(
      {
        Description:[''],Category:[''],Amount:[''],PurchasePrice:[''],SalePrice:[''],SupplierId:[''],Image:['']
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
        
        this.storeService.deleteProduct(id).subscribe(r => {
          
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
        
          if (err.Description == "HttpErrorResponse") {
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
            title: err.Description,
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
    var product=new Product()
    var entry=new Entry()
    var operation=new Operation()
    
    product.Description=this.formProduct.value.Description
    product.Category=this.formProduct.value.Category
    product.Amount=this.formProduct.value.Amount
    product.PurchasePrice=this.formProduct.value.PurchasePrice
    product.SalePrice=this.formProduct.value.SalePrice
    product.SupplierId=this.formProduct.value.SupplierId
    var string=this.formProduct.value.Image
     var splits = string.split("\\",3); 
     product.Image=splits[2]
    var solicitud = this.creating?this.storeService.insertProduct(product):this.storeService.updateProduct(this.code,product);
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
          this.storeService.getProductByDescription(this.formProduct.value.Description).subscribe((res:any)=>{
            this.codeproduct=res.Code
           
        entry.Code=this.codeproduct
          entry.Date=this.todayWithPipe
        entry.Amount=this.formProduct.value.Amount
          
        entry.UserId=Number(localStorage.getItem('userId'))
        
        this.storeService.insertEntry(entry).subscribe(response=>{
    
        })
        operation.Date=entry.Date
        operation.Description="Compra de "+product.Amount+" "+product.Description+"(s)"
        operation.Code=entry.Code
        
        this.storeService.insertOperation(operation).subscribe(r=>{
        })
          })
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
        
          if (err.name == "HttpErrorResponse") {
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
            title: err.name,
            text: err.message,
          });
        });

      } else if (result.isDenied) {

      }
      const formData = new FormData();
    formData.append('file', this.images);
   

    this.http.post<any>('http://localhost:3000/apistore/file', formData).subscribe(
      (res) => console.log(res,  Swal.fire({
                icon: 'success',
                title: 'Imagen cargada!!',
                text: 'La imagen se subio correctamente!'
                }).then((result) => {
                            if (result) {
                                       location.reload();
                          }
               }) 
         )
    );
   this.imgURL = '/assets/noimage.png';
    });
    
    
   //console.log(this.formProduct.value.Image);


    
    
  
    
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
    this.formProduct=this.form.group({
      Description:[''],Category:[''],Amount:[''],PurchasePrice:[''],SalePrice:[''],SupplierId:[''],Image:['']
  })
  this.show=false;
  }
  
  
  /*deleteProduct(id:any,iControl:any){
    console.log(id);
    console.log(iControl);
    
  }
  }*/

}
