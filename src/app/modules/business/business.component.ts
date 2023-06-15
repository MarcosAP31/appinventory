import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Business } from 'src/app/models/business';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { OperationsComponent } from '../operations/operations.component';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  formBusiness: FormGroup;
  businesses: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  businessid = 0;

  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
    private cd: ChangeDetectorRef
  ) {
    this.formBusiness = this.form.group({
      Description: [''],
      Value: [''],
      Reference: [''],
      State: [''],
      ClosingDate: [''],
      ClosingTime: [''],
      Commentary: [''],
      Activity: [''],
      NextActivityDate: [''],
      NextActivityTime: ['']
    });
  }

  // Función para mostrar el mensaje de carga
  isLoading() {
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }

  // Función para detener la carga
  stopLoading() {
    Swal.close();
  }

  // Función para obtener los negocios
  get() {
    this.storeService.getBusinesses().subscribe(response => {
      this.businesses = response;
      this.dtTrigger.next(0);
    });
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };
    this.get();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
  }

  // Función para editar un negocio
  edit(businessid: any) {
    this.creating = false;
    this.storeService.getBusiness(businessid).subscribe((response: any) => {
      var splits = response.ClosingDate.split(' ');
      var splits1 = response.NextActivity.split(' ');

      this.businessid = response.BusinessId;
      this.formBusiness.setValue({
        Description: response.Description,
        Value: response.Value,
        Reference: response.Reference,
        State: response.State,
        ClosingDate: splits[0],
        ClosingTime: splits[1],
        Commentary: response.Commentary,
        Activity: response.Activity,
        NextActivityDate: splits1[0],
        NextActivityTime: splits1[1]
      });
    });

    this.formBusiness = this.form.group({
      Description: [''],
      Value: [''],
      Reference: [''],
      State: [''],
      ClosingDate: [''],
      ClosingTime: [''],
      Commentary: [''],
      Activity: [''],
      NextActivityDate: [''],
      NextActivityTime: ['']
    });
  }

  // Función para eliminar un negocio
  delete(id: any) {
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

        this.storeService.deleteBusiness(id).subscribe(r => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: 'Se ha eliminado correctamente!',
          }).then((result) => {
            window.location.reload();
          });
        }, err => {
          console.log(err);

          if (err.Description == "HttpErrorResponse") {
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
            title: err.Description,
            text: err.message,
          });
        });
      }
    });
  }

  // Función para guardar un negocio
  submit() {
    var business = new Business();
    business.Description = this.formBusiness.value.Description;
    business.Value = this.formBusiness.value.Value;
    business.Reference = this.formBusiness.value.Reference;
    business.State = this.formBusiness.value.State;
    business.CreationDate = this.todayWithPipe;
    business.ClosingDate = this.formBusiness.value.ClosingDate + " " + this.formBusiness.value.ClosingTime;
    business.Commentary = this.formBusiness.value.Commentary;
    business.Activity = this.formBusiness.value.Activity;
    business.NextActivity = this.formBusiness.value.NextActivityDate + " " + this.formBusiness.value.NextActivityTime;

    var solicitud = this.creating ? this.storeService.insertBusiness(business) : this.storeService.updateBusiness(this.businessid, business);

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

  // Función para cerrar el modal
  closeModal() {
    this.formBusiness = this.form.group({
      Description: [''],
      Value: [''],
      Reference: [''],
      State: [''],
      ClosingDate: [''],
      ClosingTime: [''],
      Commentary: [''],
      Activity: [''],
      NextActivity: [''],
      NextActivityDate: [''],
      NextActivityTime: ['']
    });
  }
}
