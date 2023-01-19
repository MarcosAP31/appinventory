import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { User} from 'src/app/models/user';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
//import { UserModel } from 'src/app/models/user.model';
import{Router,ActivatedRoute} from '@angular/router';
import { StoreService } from 'src/app/service/store.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  formLogin:FormGroup;
  user:User = new User();
  token:any
  constructor(private cookieService:CookieService,public form:FormBuilder,private storeService:StoreService,private router:Router) {
    
    this.formLogin=this.form.group({
      email:[''],password:['']
    
  });
   }

  ngOnInit(): void {
    /*if(this.storeService.estaAutenticado()){
      this.router.navigateByUrl("inicio");
      var r = this.storeService.obtenerUserLogeado();
       if (r.administrador) {
          this.router.navigate(['/mantenimiento/empresa']);
        }else if(r.supervisor){
          this.router.navigate(['/inventario/apertura']);
        }else{
          this.router.navigate(['/inventario/toma']);
        }
    }*/
  }

  submit(){
    
    
    this.user.Email=this.formLogin.value.email
    this.user.Password=this.formLogin.value.password
    
  
  
    Swal.fire({
      allowOutsideClick:false,
      icon: 'info',
      title:'Login',
      text:'Ingresando...',
    });

    Swal.showLoading();
    
    
this.storeService.login(this.user).subscribe((r:any)=>{
  
  if(r==null){
    this.router.navigateByUrl('login')
    Swal.close();
  }else{
  localStorage.setItem("token",r)
  this.storeService.getUserByEmail(this.formLogin.value.email).subscribe((res:any)=>{
    console.log(res.Name)
    localStorage.setItem('name',res.Name)
    localStorage.setItem('userId',res.UserId)
  })  
  this.cookieService.set('token_access',r,1,'/')
  this.storeService.verify(localStorage.getItem("token")).subscribe(re=>{
    
    this.router.navigateByUrl('inicio')
    
  })
  
  console.log(r)
  
  
  Swal.close();
}
})

/*
    this.storeService.getUserByEmail(this.formLogin.value.email).subscribe((r:any)=>{
      this.user=r
      if(this.user.Password==this.formLogin.value.password){
        localStorage.setItem('name',r.Name)
      localStorage.setItem('userId',r.UserId)
      console.log(r.Name)
      this.router.navigateByUrl('inicio')
      Swal.close();
        //window.location.reload();
        console.log("Ingreso exitoso")
      }
    })*/
    }

}
