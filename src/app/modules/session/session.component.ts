import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  sessions: any;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };
    this.get();
  }

  // Método para mostrar el mensaje de carga
  isLoading() {
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }

  // Método para detener la carga
  stopLoading() {
    Swal.close();
  }

  // Método para obtener las sesiones
  get() {
    this.storeService.getSessions().subscribe((response: any) => {
      this.sessions = response;
      this.dtTrigger.next(0);
    });
  }
}
