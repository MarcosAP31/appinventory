import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { Operation } from 'src/app/models/operation';
import { Ubication } from 'src/app/models/ubication';
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
  ubications: Ubication[] = [];
  actualubications: { UbicationId: number, Name: string }[] = [];
  newubications: { UbicationId: number, Name: string }[] = [];
  existprod: boolean = false;
  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
  ) {
    // Inicializar el formulario de entrada
    this.formMovement = this.form.group({
      ProductId: [''],
      Amount: [''],
      ActualUbicationId: [''],
      NewUbicationId: ['']
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

  }
  updateActualUbications() {
    this.actualubications.length = 0;
    this.storeService.getProduct(this.formMovement.value.ProductId).subscribe((p: any) => {
      this.storeService.getUbications().subscribe((ubs: any) => {
        for (let i = 0; i < ubs.length; i++) {
          console.log(ubs[i])
          if (ubs[i].Description.includes(p.Description)) {

            this.actualubications.push({
              UbicationId: ubs[i].UbicationId,
              Name: ubs[i].Name
            });
            console.log(this.actualubications)
          }
        }
      });
    })
  }
  updateNewUbications() {
    this.newubications.length = 0;
    this.storeService.getUbications().subscribe((ubs: any) => {
      for (let i = 0; i < ubs.length; i++) {
        if (ubs[i].UbicationId != this.formMovement.value.ActualUbicationId) {
          this.newubications.push({
            UbicationId: ubs[i].UbicationId,
            Name: ubs[i].Name
          });
        }
      }
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
    this.storeService.getUbication(this.formMovement.value.ActualUbicationId).subscribe((actub: any) => {
      this.storeService.getUbication(this.formMovement.value.NewUbicationId).subscribe((newub: any) => {
        this.storeService.getProduct(this.formMovement.value.ProductId).subscribe((p: any) => {
          actub.Amount = actub.Amount - Number(this.formMovement.value.Amount);
          newub.Amount = newub.Amount + Number(this.formMovement.value.Amount);
          if (newub.Description == "El almacén no tiene productos") {
            newub.Description = newub.Amount + " " + p.Description + "(s)";
          } else {
            const splits: string[] = newub.Description.split(',');
            const actsplits: string[] = actub.Description.split(',');
            for (let i = 0; i < actsplits.length; i++) {
              if (actsplits[i].includes(p.Description)) {
                const array: string[] = actsplits[i].split(' ');
                const amountprod = Number(array[0]) - Number(this.formMovement.value.Amount);
                console.log(array[0]);
                if(actub.Amount==0){
                  actub.Description="El almacén no tiene productos";
                }else{
                  if(amountprod==0){
                    actub.Description = actub.Description.replace(actsplits[i]+',','');
                  }else{
                    actub.Description = actub.Description.replace(array[0], amountprod);
                  }
                }
                break;
              }
            }
            for (let i = 0; i < splits.length; i++) {
              if (splits[i].includes(p.Description)) {
                const array: string[] = splits[i].split(' ');
                const amountprod = Number(array[0]) + Number(this.formMovement.value.Amount);
                console.log(array[0]);
                newub.Description = newub.Description.replace(array[0], amountprod);
                this.existprod = true;
                break;
              }
            }
            if (this.existprod == false) {
              newub.Description = newub.Description + "," + this.formMovement.value.Amount + " " + p.Description + "(s)";
            }

          }
        })
      })
    })
    this.storeService.getUbication(this.formMovement.value.ActualUbicationId).subscribe((actub: any) => {
      this.storeService.getLastOperationByProductId(this.formMovement.value.ProductId).subscribe((re: any) => {
        this.storeService.getProduct(this.formMovement.value.ProductId).subscribe((res: any) => {
          const splits: string[] = re.Description.split(' ');
          operation.Date = this.todayWithPipe;
          operation.Description = "Se movió " + this.formMovement.value.Amount + " " + res.Description + "(s) de " + splits[5] + " hacia " + actub.Name;
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
      Amount: [''],
      ActualUbicationId: [''],
      NewUbicationId: ['']
    });
  }
}
