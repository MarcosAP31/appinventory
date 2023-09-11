import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Ubication } from 'src/app/models/ubication';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ubication',
  templateUrl: './ubication.component.html',
  styleUrls: ['./ubication.component.css']
})
export class UbicationComponent implements OnInit {

  formUbication: FormGroup;
  ubications: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  noValubicationido = true;
  ubicationid = 0;

  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
  ) {
    this.formUbication = this.form.group({
      Name: [''],
      Description: [''],
      Capacity: ['']
    });
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

  // Método para obtener los proveedores
  get() {
    this.storeService.getUbications().subscribe(response => {
      this.ubications = response;
      this.dtTrigger.next(0);
    });
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };
    this.get();
  }

  // Método para editar un proveedor
  edit(ubicationid: any) {
    this.creating = false;
    this.storeService.getUbication(ubicationid).subscribe((response: any) => {
      this.ubicationid = response.UbicationId;
      this.formUbication.setValue({
        Name: response.Name,
        Description: response.Description,
        Capacity: response.Capacity
      });
    });

    this.formUbication = this.form.group({
      Name: [''],
      Description: [''],
      Capacity: ['']
    });
  }

  // Método para eliminar un proveedor
  delete(ubicationid: any) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro de eliminar el registro?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Eliminando registro',
          text: 'Cargando...',
        });
        Swal.showLoading();

        this.storeService.deleteUbication(ubicationid).subscribe(r => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: '¡Se ha eliminado correctamente!',
          }).then((result) => {
            window.location.reload();
          });
        }, err => {
          console.log(err);

          if (err.Name == 'HttpErrorResponse') {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error al conectar',
              text: 'Error de comunicación con el servubicationidor',
            });
            return;
          }
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: err.Name,
            text: err.message,
          });
        });

      } else if (result.isDenied) {
        // Acción cancelada
      }
    });
  }

  // Método para guardar el proveedor
  submit() {
    var ubication = new Ubication();
    ubication.Name = this.formUbication.value.Name;
    ubication.Description = this.formUbication.value.Description;
    ubication.Capacity = this.formUbication.value.Capacity;
    if (!this.creating) {
      ubication.UbicationId = this.ubicationid;
    }

    var solicitud = this.creating ? this.storeService.insertUbication(ubication) : this.storeService.updateUbication(this.ubicationid, ubication);
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

        solicitud.subscribe(r => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: '¡Se ha guardado correctamente!',
          }).then((result) => {
            window.location.reload();
          });
        }, err => {
          console.log(err);

          if (err.Name == 'HttpErrorResponse') {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error al conectar',
              text: 'Error de comunicación con el servubicationidor',
            });
            return;
          }
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: err.Name,
            text: err.message,
          });
        });

      } else if (result.isDenied) {
        // Acción cancelada
      }
    });
  }

  // Método para cerrar el modal y limpiar el formulario
  closeModal() {
    this.formUbication = this.form.group({
      Name: [''],
      Description: [''],
      Capacity: ['']
    });
  }

}
