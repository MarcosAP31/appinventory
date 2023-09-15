import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Output } from 'src/app/models/output';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { Operation } from 'src/app/models/operation';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {
  product: any;
  amountproduct: any;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  formOutput: FormGroup;
  outputs: any;
  clients: any;
  products: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  noValido = true;
  outputid = 0;

  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
  ) {
    // Inicializar el formulario de salida
    this.formOutput = this.form.group({
      ProductId: [''],
      ClientId: [''],
      Amount: ['']
    });
  }

  ngOnInit(): void {
    // Configurar opciones de DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };

    // Obtener datos de salida
    this.get();

    // Obtener fecha actual formateada
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
  }

  isLoading() {
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }

  stopLoading() {
    Swal.close();
  }

  get() {
    // Obtener salidas del servicio
    this.storeService.getOutputs().subscribe(response => {
      this.outputs = response;
      this.dtTrigger.next(0);
    });

    // Obtener productos del servicio
    this.storeService.getProducts().subscribe(response => {
      this.products = response;
    });

    // Obtener clientes del servicio
    this.storeService.getClients().subscribe(response => {
      this.clients = response;
    });
  }

  submit() {
    // Crear objeto de salida
    const output = new Output();
    const operation = new Operation();
    output.Date = this.todayWithPipe;
    output.Amount = this.formOutput.value.Amount;
    output.ProductId = this.formOutput.value.ProductId;
    output.ClientId = this.formOutput.value.ClientId;
    output.UserId = Number(localStorage.getItem('userId'));

    if (this.creating == false) {
      output.OutputId = this.outputid;
    }

    // Crear solicitud para insertar o actualizar la salida
    const solicitud = this.creating ? this.storeService.insertOutput(output) : this.storeService.updateOutput(this.outputid, output);

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
        // Obtener el producto relacionado a través del código
        this.storeService.getProduct(this.formOutput.value.ProductId).subscribe((r: any) => {
          this.amountproduct = r.Amount;
          operation.Date = output.Date;
          operation.Description = 'Venta de ' + output.Amount + ' ' + r.Description + '(s)';
          operation.ProductId = r.ProductId;
          operation.UserId=Number(localStorage.getItem('userId'));
          if (this.amountproduct - this.formOutput.value.Amount < 0) {
            // Validar si la cantidad ingresada excede la cantidad de productos en stock
            Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              title: 'Alerta de cantidad ingresada',
              text: 'Excede a la cantidad de productos en stock',
              showCancelButton: false,
              confirmButtonText: `OK`
            }).then((result) => {
              Swal.close();
            });
          } else {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              title: 'Guardando registro',
              text: 'Cargando...',
            });

            Swal.showLoading();

            // Realizar la solicitud de inserción o actualización de la salida
            solicitud.subscribe(r => {
              // Insertar la operación relacionada
              this.storeService.insertOperation(operation).subscribe(re => {});

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

              if (err.name == 'HttpErrorResponse') {
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

            // Actualizar el producto relacionado
            this.storeService.getProduct(this.formOutput.value.ProductId).subscribe(r => {
              this.product = r;
              this.product.Amount = this.amountproduct - this.formOutput.value.Amount;
              this.storeService.updateProduct(this.formOutput.value.ProductId, this.product).subscribe(re => {});
            });
          }
        });
      } else if (result.isDenied) {
        // Acción cuando se cancela la operación
      }
    });
  }

  closeModal() {
    // Reiniciar el formulario de salida
    this.formOutput = this.form.group({
      ProductId: [''],
      ClientId: [''],
      Amount: ['']
    });
  }
}
