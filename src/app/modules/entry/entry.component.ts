import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
import { Operation } from 'src/app/models/operation';
import { Ubication } from 'src/app/models/ubication';
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
  ubications: any;
  existprod:boolean=false;
  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
  ) {
    // Inicializar el formulario de entrada
    this.formEntry = this.form.group({
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
    this.storeService.getEntrys().subscribe(response => {
      this.entrys = response;
      this.dtTrigger.next(0);
    });

    this.storeService.getProducts().subscribe(response => {
      this.products = response;
    });
    this.storeService.getUbications().subscribe(response => {
      this.ubications = response;
    })
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
    var newoperation = new Operation();
    entry.Date = this.todayWithPipe;
    entry.Amount = this.formEntry.value.Amount;
    entry.ProductId = this.formEntry.value.ProductId;
    entry.UbicationId = this.formEntry.value.UbicationId;
    entry.UserId = Number(localStorage.getItem('userId'));
    this.storeService.getUbication(Number(entry.UbicationId)).subscribe((ub: any) => {
      if (Number(entry.Amount) + ub.Amount > ub.Capacity) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: 'Excede la capacidad del almacén',
          text: 'El almacén ' + ub.Name + ' solo tiene capacidad para ' + ub.Capacity + ' producto(s) y actualmente tiene '+ub.Amount+' productos.',
        });
      } else {

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
            this.storeService.getProduct(this.formEntry.value.ProductId).subscribe((prod: any) => {
              this.amountproduct = prod.Amount;

              operation.Date = entry.Date;
              operation.Description = "Compra de " + entry.Amount + " " + prod.Description + "(s)";
              operation.ProductId = prod.ProductId;
              operation.UserId = Number(localStorage.getItem('userId'));

              Swal.fire({
                allowOutsideClick: false,
                icon: 'info',
                title: 'Guardando registro',
                text: 'Cargando...',
              });

              Swal.showLoading();

              // Realizar la solicitud para guardar la entrada
              solicitud.subscribe(() => {
                ub.Amount = ub.Amount + Number(entry.Amount);
                if(ub.Description=="El almacén no tiene productos"){
                  ub.Description=ub.Amount+" "+prod.Description+"(s)";
                }else{
                  const splits: string[] = ub.Description.split(',');
                  for(let i=0;i<splits.length;i++){
                    if(splits[i].includes(prod.Description)){
                      const array:string[]=splits[i].split(' ');
                      const amountprod=Number(array[0])+Number(entry.Amount);
                      console.log(array[0]);
                      ub.Description=ub.Description.replace(array[0]+" "+array[1],amountprod+" "+array[1]);
                      this.existprod=true;
                      break;
                    }
                  }
                  if(this.existprod==false){
                    ub.Description=ub.Description+","+entry.Amount+" "+prod.Description+"(s)";
                  }
                  
                }
                this.storeService.updateUbication(ub.UbicationId,ub).subscribe(()=>{});
                this.storeService.getUbication(entry.UbicationId).subscribe((resp: any) => {
                  newoperation.Date = entry.Date;
                  newoperation.Description = "Se agregó " + entry.Amount + " " + prod.Description + "(s) a " + resp.Name;
                  newoperation.ProductId = entry.ProductId;
                  newoperation.UserId = Number(localStorage.getItem('userId'));
                  this.storeService.insertOperation(newoperation).subscribe(respons => { });
                })
                // Insertar la operación relacionada a la entrada
                this.storeService.insertOperation(operation).subscribe(() => {
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
              this.storeService.getProduct(this.formEntry.value.ProductId).subscribe(r => {
                this.product = r;
                this.product.Amount = Number(this.amountproduct) + Number(this.formEntry.value.Amount);
                this.storeService.updateProduct(this.formEntry.value.ProductId, this.product).subscribe(r => {
                  // Realizar cualquier otra acción necesaria después de actualizar el producto
                });
              });
            });
          } else if (result.isDenied) {
            // El usuario canceló la operación
          }
        });
      }
    })
  }

  closeModal() {
    // Reiniciar el formulario al cerrar el modal
    this.formEntry = this.form.group({
      ProductId: [''],
      Amount: ['']
    });
  }
}
