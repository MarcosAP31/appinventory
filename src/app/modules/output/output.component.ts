import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Output } from 'src/app/models/output';
import { FormGroup, FormBuilder } from '@angular/forms';
import{Router,ActivatedRoute} from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {
  product:any
  amountproduct:any
  pipe = new DatePipe('en-US');
  todayWithPipe:any;
  formOutput:FormGroup
  outputs:any
  clients:any
  products:any
 
  dtOptions:DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating=true
  noValido=true
  outputid=0
 
  constructor(
    public form:FormBuilder,
    private storeService:StoreService,
    
  ) { 
    
    this.formOutput=this.form.group({
      Code:[''],ClientId:[''],Amount:['']
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
      this.storeService.getOutputs().subscribe(response=>{
      this.outputs = response;
      this.dtTrigger.next(0);
    })
    this.storeService.getProducts().subscribe(response=>{
      this.products = response;
    })
    this.storeService.getClients().subscribe(response=>{
      this.clients = response;
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
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
  }
  /*obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
  }*/
  
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
    var output=new Output()
    output.Date=this.todayWithPipe
    output.Amount=this.formOutput.value.Amount
    output.Code=this.formOutput.value.Code
    output.ClientId=this.formOutput.value.ClientId
    output.UserId=Number(localStorage.getItem('userId'))
    if(this.creating==false){
      output.OutputId=this.outputid
    }
    
    var solicitud = this.creating?this.storeService.insertOutput(output):this.storeService.updateOutput(this.outputid,output);
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
        this.storeService.getProduct(this.formOutput.value.Code).subscribe((r:any)=>{
          this.amountproduct=r.Amount
          console.log(this.amountproduct)
          if(this.amountproduct-this.formOutput.value.Amount<0){
            Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              title: 'Alerta de cantidad ingresada',
              text: 'Excede a la cantidad de productos en stock',
              
        showCancelButton: false,
        confirmButtonText: `OK`,
        
       
            }).then((result)=>{
              Swal.close()
            })
          }else{
                     
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
          this.storeService.getProduct(this.formOutput.value.Code).subscribe(r=>{
            this.product=r
            this.product.Amount=this.amountproduct-this.formOutput.value.Amount
            this.storeService.updateProduct(this.formOutput.value.Code,this.product).subscribe(r=>{
              
            })
          })
        }
        })
        
        
        
      } else if (result.isDenied) {

      }
    });



    
    
  
    
  }
  

  closeModal(){
    this.formOutput=this.form.group({
      Code:[''],ClientId:[''],Amount:['']
  })
  }
  /*deleteOutput(id:any,iControl:any){
    console.log(id);
    console.log(iControl);
    
  }
  }*/

}
