import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { OrderXProduct } from 'src/app/models/orderxproduct';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  formOrder: FormGroup;
  orders: any;
  totalprice = 0;
  orderxproducts: any[] = [];
  elements: { productid: number, product: string, price: number, amount: number }[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  noValorderido = true;
  orderid = 0;
  idproduct = 0;
  productprice = 0;
  productdescription = "";
  clientname = "";
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
  ) {
    this.formOrder = this.form.group({
      DeliveryDate: [''],
      ProductId: [''],
      ClientId: [''],
      Amount: ['']
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
    this.storeService.getOrders().subscribe(response => {
      this.orders = response;
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

  // Método para editar un proveedor
  editElement(idproduct: any) {
    for (const element of this.elements) {
      if (element.productid == idproduct) {
        this.formOrder.value.ProductId = element.productid;
        this.formOrder.value.Amount = element.amount;
      }
    }
    this.formOrder = this.form.group({
      ProductId: [''],
      ClientId: [''],
      Amount: ['']
    });
  }
  deleteElement(idproduct: any) {
    for (const element of this.elements) {
      if (element.productid == idproduct) {
        const indice = this.elements.indexOf(element);
        this.elements.splice(indice, 1); // Elimina 1 elemento a partir del índice encontrado
      }
    }
  }
  editOrder(orderid: any) {
    this.creating = false;
    this.storeService.getOrder(orderid).subscribe((response: any) => {
      this.orderid = response.OrderId;
      this.formOrder.setValue({
        DeliveryDate:response.DeliveryDate,
        ProductId: response.ProductId,
        ClientId: response.ClientId,
        Amount: response.Amount
      });
    });

    this.formOrder = this.form.group({
      ProductId: [''],
      ClientId: [''],
      Amount: ['']
    });
    this.storeService.getOrderXProductByOrderId(orderid).subscribe((r: any) => {
      this.orderxproducts = r;
      console.log(this.orderxproducts);
      for (const orderxproduct of this.orderxproducts) {
        this.storeService.getProduct(orderxproduct.Product).subscribe((r: any) => {
          this.elements.push({
            productid: r.ProductId,
            product: r.Description,
            price: r.SalePrice,
            amount: orderxproduct.Amount
          });
        })
      }
    })
  }
  // Método para eliminar un proveedor
  deleteOrder(orderid: any) {
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

        this.storeService.deleteOrder(orderid).subscribe(r => {
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

          if (err.OrderDate == 'HttpErrorResponse') {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error al conectar',
              text: 'Error de comunicación con el servorderidor',
            });
            return;
          }
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: err.OrderDate,
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
    for (const element of this.elements) {
      this.totalprice = this.totalprice + (element.amount * element.price);
    }
    var order = new Order();
    order.OrderDate = this.todayWithPipe;
    order.State = "Pendiente";
    order.DeliveryDate = this.formOrder.value.DeliveryDate;
    order.TotalPrice = this.totalprice;
    order.ClientId = this.formOrder.value.ClientId;
    if (!this.creating) {
      order.OrderId = this.orderid;
    }

    var solicitud = this.creating ? this.storeService.insertOrder(order) : this.storeService.updateOrder(this.orderid, order);
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

        solicitud.subscribe((r: any) => {
          for (const element of this.elements) {
            var orderxproduct = new OrderXProduct();
            orderxproduct.Amount = element.amount;
            orderxproduct.OrderId = r.OrderId;
            orderxproduct.ProductId = element.productid;
            this.storeService.insertOrderXProduct(orderxproduct).subscribe(r => { })
          }
          for (const element of this.elements) {

            const indice = this.elements.indexOf(element);
            this.elements.splice(indice, 1); // Elimina 1 elemento a partir del índice encontrado
          }
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
              text: 'Error de comunicación con el servorderxproductidor',
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
  //Metodo para agregar productos a una ordern
  addProduct() {
    this.storeService.getProduct(this.formOrder.value.ProductId).subscribe((r: any) => {
      this.productdescription = r.Description;
      this.productprice = r.SalePrice;
    })
    this.storeService.getClient(this.formOrder.value.ClientId).subscribe((r: any) => {
      this.clientname = r.Name;
    })
    this.elements.push({
      productid: this.formOrder.value.ProductId,
      product: this.productdescription,
      price: this.productprice,
      amount: this.formOrder.value.Amount
    });
    this.idproduct = 0; this.productdescription = ""; this.productprice = 0;
  }
  // Método para cerrar el modal y limpiar el formulario
  closeModal() {
    this.formOrder = this.form.group({
      DeliveryDate: [''],
      ProductId: [''],
      ClientId: [''],
      Amount: ['']
    });
  }

}
