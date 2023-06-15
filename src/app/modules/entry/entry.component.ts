import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder } from '@angular/forms';
import{Router,ActivatedRoute} from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
import { Operation } from 'src/app/models/operation';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  product: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  entrys: any;
  products: any;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  formEntry: FormGroup;
  creating = true;
  entryid = 0;
  amountproduct: any;
 
  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
  ) { 
    // Inicializar el formulario de entrada
    this.formEntry = this.form.group({
      Code: [''],
      Amount: ['']
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
    this.storeService.getEntrys().subscribe(response => {
      this.entrys = response;
      this.dtTrigger.next(0);
    });

    this.storeService.getProducts().subscribe(response => {
      this.products = response;
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
    // Crear una nueva entrada o actualizar una entrada existente
    var entry = new Entry();
    var operation = new Operation();
    entry.Date = this.todayWithPipe;
    entry.Amount = this.formEntry.value.Amount;
    entry.Code = this.formEntry.value.Code;
    entry.UserId = Number(localStorage.getItem('userId'));

    if (!this.creating) {
      entry.EntryId = this.entryid;
    }
    
    var solicitud = this.creating ? this.storeService.insertEntry(entry) : this.storeService.updateEntry(this.entryid, entry);

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
      if (result.isConfirmed) {
        // Obtener el producto correspondiente al código ingresado en el formulario
        this.storeService.getProduct(this.formEntry.value.Code).subscribe((r: any) => {
          this.amountproduct = r.Amount;

          operation.Date = entry.Date;
          operation.Description = "Compra de " + entry.Amount + " " + r.Description + "(s)";
          operation.Code = r.Code;

          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            title: 'Guardando registro',
            text: 'Cargando...',
          });
  
          Swal.showLoading();
          
          // Realizar la solicitud para guardar la entrada
          solicitud.subscribe(r => {
            // Insertar la operación relacionada a la entrada
            this.storeService.insertOperation(operation).subscribe(r => {
              // Mostrar mensaje de éxito y recargar la página
              Swal.fire({
                allowOutsideClick: false,
                icon: 'success',
                title: 'Éxito',
                text: 'Se ha guardado correctamente!',
              }).then((result) => {
                window.location.reload();
              });
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

          // Actualizar la cantidad del producto correspondiente
          this.storeService.getProduct(this.formEntry.value.Code).subscribe(r => {
            this.product = r;
            this.product.Amount = Number(this.amountproduct) + Number(this.formEntry.value.Amount);
            
            this.storeService.updateProduct(this.formEntry.value.Code, this.product).subscribe(r => {
              // Realizar cualquier otra acción necesaria después de actualizar el producto
            });
          });
        });
      } else if (result.isDenied) {
        // El usuario canceló la operación
      }
    });
  }

  closeModal() {
    // Reiniciar el formulario al cerrar el modal
    this.formEntry = this.form.group({
      Code: [''],
      Amount: ['']
    });
  }
}
