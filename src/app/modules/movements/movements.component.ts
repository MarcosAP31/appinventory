import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { Operation } from 'src/app/models/operation';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {
  product: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  operations: any;
  products: any;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  formMovement: FormGroup;
  creating = true;
  operationid = 0;
  amountproduct: any;
  ubications:any;
  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
  ) {
    // Inicializar el formulario de entrada
    this.formMovement = this.form.group({
      ProductId: [''],
      Amount: [''],
      UbicationId: ['']
    });
  }

  isLoading() {
    // Mostrar un spinner de carga
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }

  stopLoading() {
    // Ocultar el spinner de carga
    Swal.close();
  }

  get() {
    // Obtener las entradas y los productos
    this.storeService.getMovements().subscribe(response => {
      this.operations = response;
      this.dtTrigger.next(0);
    });

    this.storeService.getProducts().subscribe(response => {
      this.products = response;
    });
    this.storeService.getUbications().subscribe(response => {
      this.ubications = response;
    });
  }

  ngOnInit(): void {
    // Configurar opciones de DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };

    // Obtener datos iniciales
    this.get();

    // Obtener la fecha actual formateada
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy h:mm:ss a');
  }

  submit() {
    var operation = new Operation();
    // Crear una nueva operacion
    this.storeService.getUbication(this.formMovement.value.UbicationId).subscribe((r:any) => {
      this.storeService.getLastOperationByProductId(this.formMovement.value.ProductId).subscribe((re:any) => {
        this.storeService.getProduct(this.formMovement.value.ProductId).subscribe((res:any)=>{
          const splits: string[] = re.Description.split(' ');
          operation.Date = this.todayWithPipe;
          operation.Description = "Se movió "+this.formMovement.value.Amount+" "+res.Description+"(s) de "+splits[5]+" hacia "+r.Name;
          operation.ProductId = this.formMovement.value.ProductId;
          operation.UserId = Number(localStorage.getItem('userId'));
          console.log(splits);
        })
      })
    })
    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro de guardar el registro?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Guardar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Guardando registro',
          text: 'Cargando...',
        });
        Swal.showLoading();

        this.storeService.insertOperation(operation).subscribe(r => {
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
      }
    });
  }

  closeModal() {
    // Reiniciar el formulario al cerrar el modal
    this.formMovement = this.form.group({
      ProductId: [''],
      Amount: ['']
    });
  }
}
