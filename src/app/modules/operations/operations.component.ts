import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Operation } from 'src/app/models/operation';
import { FormGroup, FormBuilder } from '@angular/forms';
import{Router,ActivatedRoute} from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
import { Product } from 'src/app/models/product';
@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {
  
  dtOptions:DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  product:any
  finalincomes:number=0
  finalexpenses:number=0
  formOperation:FormGroup
  initialBalance:number=0
  finalBalance:number=0
  sumas:number[]=[]
  contador:any=0
  operations:any
  array:number[]=[]
  finalbalance:number=0
  operaciones=[]
  
  valor = document.getElementById("item");
  constructor(
    public form:FormBuilder,
    private storeService:StoreService,
    private cd:ChangeDetectorRef
  ) { 
    this.formOperation=this.form.group({
      Balance:['']
    
  });
    
    }

  /*gOnInit(): void {
    this.inventarioService.obtenerEmpresas().subscribe(response=>{
      this.empresas=response;
      console.log(this.empresas);
    });
  }*/
  ngOnInit(): void {
    //this.obtenerUsuario();
    //this.reiniciar();
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive:true
    };
    this.get()
    
  }
 
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
    
    this.storeService.getOperations().subscribe((response:any)=>{
      this.operations = response;
      this.operaciones=this.operations
      for(let i=0;i<this.operations.length;i++){
        if(this.operations[i].Description.includes('Venta')){
          this.finalincomes=this.finalincomes+(this.operations[i].SalePrice*this.getAmount(this.operations[i].Description))
        }else{
          this.finalexpenses=this.finalexpenses+(this.operations[i].PurchasePrice*this.getAmount(this.operations[i].Description))
        }

      }
     
      
    })
    var mensaje="Venta de 2 cama(s)"
    var splits=mensaje.split(' ')
    var splits1=splits[3].split('(')
    console.log(splits[3])
    console.log(splits1[0])
    console.log(this.getAmount('Venta de 2 www(s)'))
    
  }
  
  

  getAmount(description:string){
    var splits=description.split(' ')
    var amount=Number(splits[2])
    return amount
  }
  
  /*obtenerUsuario() {
    var objectUser = localStorage.getItem('user-inventario-application');
    if (objectUser != null) {
      this.user = JSON.parse(objectUser);
    }
  }*/

}
