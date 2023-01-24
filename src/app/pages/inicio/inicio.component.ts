import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { UsuarioModel } from 'src/app/models/usuario.model';
import { StoreService } from 'src/app/service/store.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  name:any
  accountant:any=1
  //user!:UsuarioModel;
  //rol = "-";
  constructor(private api:StoreService,private router:Router) { 
   
  }


  ngOnInit(): void {
    this.name=localStorage.getItem('name')
    this.obtenerUsuario();
    
    
  }

  obtenerUsuario(){
   /* var objectUser = localStorage.getItem('user-inventario-application');
    if(objectUser!=null){
      this.user = JSON.parse(objectUser);
      if(this.user.administrador){
        this.rol = 'Administrador'
      }else if(this.user.supervisor){
        this.rol = 'Supervisor';
      }else if(this.user.inventario){
        this.rol = 'Inventariador';
      }
    }*/
  }

  logout(){
    //localStorage.setItem('token','')
  
    this.router.navigate(['login']);
  }
}
