import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Operation } from 'src/app/models/operation';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  product: any;
  finalincomes: number = 0;
  finalexpenses: number = 0;
  formOperation: FormGroup;
  initialBalance: number = 0;
  finalBalance: number = 0;
  balancefinal: number = 0;
  sumas: number[] = [];
  contador: any = 0;
  operations: any;
  array: number[] = [];
  finalbalance: number = 0;
  operaciones = [];
  balancedisabled: boolean = false;
  valor = document.getElementById("item");

  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
    private cd: ChangeDetectorRef
  ) {
    // Inicializar el formulario de operaciones
    this.formOperation = this.form.group({
      Balance: ['']
    });
  }

  ngOnInit(): void {
    // Configurar opciones de DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };

    // Obtener operaciones
    this.get();
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
    // Obtener operaciones del servicio
    this.storeService.getOperations().subscribe(response => {
      this.operations = response;
      this.operaciones = this.operations;
      console.log(response)
      for (let i = 0; i < this.operations.length; i++) {
        if (this.operations[i].Description.includes('Venta')) {
          this.finalincomes = this.finalincomes + (this.operations[i].salePrice * this.getAmount(this.operations[i].Description));
        } else {
          this.finalexpenses = this.finalexpenses + (this.operations[i].purchasePrice * this.getAmount(this.operations[i].Description));
        }
      }
      this.dtTrigger.next(0);
    });
  }

  getAmount(description: string) {
    // Obtener la cantidad de la descripción de la operación
    const splits = description.split(' ');
    const amount = Number(splits[2]);
    return amount;
  }

  submit() {
    // Desactivar el campo de balance y establecer el valor final del balance
    this.formOperation.get('Balance')?.disable();
    this.finalBalance = this.formOperation.value.Balance;
    this.balancefinal = this.finalBalance;
  }

  getFinalBalance(operation: any) {
    if (this.finalBalance != 0) {
      if (operation.Description.includes('Venta')) {
        this.finalBalance = this.finalBalance + (operation.salePrice * this.getAmount(operation.Description));
      } else {
        this.finalBalance = this.finalBalance - (operation.purchasePrice * this.getAmount(operation.Description));
      }
    }
    return this.finalBalance;
  }
}
