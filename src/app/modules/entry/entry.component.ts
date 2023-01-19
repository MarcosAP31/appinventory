import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder } from '@angular/forms';
import{Router,ActivatedRoute} from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  dtOptions:DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  entrys:any
  
  
 
  constructor(
    public form:FormBuilder,
    private storeService:StoreService,
    
  ) { 
    
    }

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
    this.storeService.getEntrys().subscribe(response=>{
      this.entrys = response;
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
  
}
