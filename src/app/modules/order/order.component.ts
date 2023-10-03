import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Order } from 'src/app/models/order';
import { Output } from 'src/app/models/output';
import { Operation } from 'src/app/models/operation';
import { Ubication } from 'src/app/models/ubication';
import { OrderXProduct } from 'src/app/models/orderxproduct';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { subscribe } from 'diagnostics_channel';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @ViewChild('selectState') selectState: any;
  @ViewChild('selectUbication') selectUbication: any;
  formOrder: FormGroup;
  formEditOrder: FormGroup;
  orders: any;
  totalprice = 0;
  ubamount = 0;
  amountorder: number = 0;
  orderxproducts: any[] = [];
  elements: { productid: number, product: string, price: number, amount: number, ubicationid: number }[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  noValorderido = true;
  orderid = 0;
  idproduct = 0;
  productprice = 0;
  productdescription = "";
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  clients: any;
  products: any;
  finalprice: number = 0;
  addedproduct: boolean = false;
  recalledprod: boolean = false;
  ubs: any[] = [];
  ubications: { UbicationId: number, Name: string }[] = [];
  oldubications: any;
  invalidate: boolean = false;
  existprod: boolean = false;
  showUbication: boolean = false;
  constructor(
    public form: FormBuilder,
    private storeService: StoreService,
  ) {
    this.formOrder = this.form.group({
      DeliveryDate: [''],
      ProductId: [''],
      ClientId: [''],
      UbicationId: [''],
      Amount: ['']
    });
    this.formEditOrder = this.form.group({
      OrderDate: [''],
      State: [''],
      DeliveryDate: [''],
      TotalPrice: [''],
      ClientId: [''],
      UbicationId: ['']
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
    this.storeService.getClients().subscribe(response => {
      this.clients = response;
    })
    this.storeService.getProducts().subscribe(response => {
      this.products = response;
    })
    this.storeService.getUbications().subscribe(r => {
      this.oldubications = r;
    })
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
        console.log(idproduct)
        this.formOrder.setValue({
          DeliveryDate: this.formOrder.value.DeliveryDate,
          ProductId: element.productid,
          ClientId: this.formOrder.value.ClientId,
          Amount: element.amount
        });
        console.log(element)
      }
    }

  }
  deleteElement(idproduct: any, idubication: any) {
    for (const element of this.elements) {
      if (element.productid == idproduct) {
        const indice = this.elements.indexOf(element);
        this.finalprice = this.finalprice - (element.amount * element.price);
        this.elements.splice(indice, 1); // Elimina 1 elemento a partir del índice encontrado
      }
    }
    for (const ub of this.ubs) {
      if (ub.UbicationId == idubication) {
        const indice = this.ubs.indexOf(ub);
        this.ubs.splice(indice, 1); // Elimina 1 elemento a partir del índice encontrado
      }
    }
  }
  editOrder(orderid: any) {
    this.finalprice = 0;
    /*for (const element of this.elements) {

      const indice = this.elements.indexOf(element);
      this.elements.splice(indice, 1); // Elimina 1 elemento a partir del índice encontrado
    }*/
    this.elements.length = 0;
    console.log(this.elements)
    this.creating = false;
    this.storeService.getOrder(orderid).subscribe((response: any) => {
      if (response.State == "Cancelado" || response.State == "Despachado") {
        this.selectState.nativeElement.disabled = true;
      } else {
        this.selectState.nativeElement.disabled = false;
      }
      this.orderid = response.OrderId;
      this.formEditOrder.setValue({
        OrderDate: response.OrderDate,
        State: response.State,
        DeliveryDate: response.DeliveryDate,
        TotalPrice: response.TotalPrice,
        ClientId: response.ClientId,
        UbicationId: 0
      });
      this.storeService.getOrderXProductByOrderId(orderid).subscribe((orderxproducts: any) => {
        console.log(orderxproducts)
        for (const orderxproduct of orderxproducts) {
          this.storeService.getProduct(orderxproduct.ProductId).subscribe((res: any) => {
            this.finalprice = this.finalprice + (orderxproduct.Amount * res.SalePrice);
            this.elements.push({
              productid: orderxproduct.ProductId,
              product: res.Description,
              price: res.SalePrice,
              amount: orderxproduct.Amount,
              ubicationid: 0
            });
          })

        }
      })
    });

    this.formEditOrder = this.form.group({
      OrderDate: [''],
      State: [''],
      DeliveryDate: [''],
      TotalPrice: [''],
      ClientId: [''],
      UbicationId: ['']
    });
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
    this.finalprice = 0;
    for (const element of this.elements) {
      this.finalprice = this.finalprice + (element.amount * element.price);
    }
    var ubid = 0;
    var order = new Order();
    order.OrderDate = this.todayWithPipe;
    order.State = "Pendiente";
    order.DeliveryDate = this.formOrder.value.DeliveryDate;
    order.TotalPrice = this.finalprice;
    order.ClientId = this.formOrder.value.ClientId;
    order.UserId = Number(localStorage.getItem('userId'));
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
          for (const ub of this.ubs) {
            ubid = ub.UbicationId;

            this.storeService.updateUbication(ub.UbicationId, ub).subscribe(() => { });
          }
          for (const element of this.elements) {
            var orderxproduct = new OrderXProduct();
            orderxproduct.Amount = element.amount;
            orderxproduct.OrderId = r;
            orderxproduct.ProductId = element.productid;
            this.storeService.insertOrderXProduct(orderxproduct).subscribe(() => { })
            this.storeService.getProduct(element.productid).subscribe((resp: any) => {
              resp.Amount = resp.Amount - element.amount;
              this.storeService.updateProduct(element.productid, resp).subscribe(() => {
              })
            })

          }
          this.elements.length = 0;
          this.ubs.length = 0;
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
  submitOrder() {
    var order = new Order();
    var amountorder = 0;
    order.OrderDate = this.todayWithPipe;
    order.State = this.formEditOrder.value.State;
    order.DeliveryDate = this.formEditOrder.value.DeliveryDate;
    order.TotalPrice = this.formEditOrder.value.TotalPrice;
    order.ClientId = this.formEditOrder.value.ClientId;
    order.UserId = Number(localStorage.getItem('userId'));
    if (this.formEditOrder.value.State == "Cancelado") {

      this.storeService.getUbication(this.formEditOrder.value.UbicationId).subscribe((ub: any) => {
        this.storeService.getOrderXProductByOrderId(this.orderid).subscribe((orderxproducts: any) => {

          for (const orderxproduct of orderxproducts) {
            amountorder = amountorder + orderxproduct.Amount;

          }
          console.log(amountorder);
          if (amountorder > (ub.Capacity - ub.Amount)) {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Excede la cantidad de stock del almacén',
              text: 'La capacidad del almacén es de ' + ub.Capacity + ' productos y actualmente tiene ' + ub.Amount + ' productos.'
            });
            this.invalidate = true;
          }
        })
      })
    }
    if (this.invalidate == false) {
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

          this.storeService.updateOrder(this.orderid, order).subscribe(r => {
            if (this.formEditOrder.value.State == "Despachado") {
              this.storeService.getOrderXProductByOrderId(this.orderid).subscribe((orderxproducts: any) => {
                for (const orderxproduct of orderxproducts) {
                  var output = new Output();
                  output.Date = this.todayWithPipe;
                  output.Amount = orderxproduct.Amount;
                  output.ProductId = orderxproduct.ProductId;
                  output.ClientId = order.ClientId;
                  output.UserId = order.UserId;
                  this.storeService.insertOutput(output).subscribe(() => { })
                  this.storeService.getProduct(output.ProductId).subscribe((p: any) => {
                    console.log(orderxproduct.Amount)
                    var operation = new Operation();
                    operation.Date = output.Date;
                    operation.Description = 'Venta de ' + orderxproduct.Amount + ' ' + p.Description + '(s)';
                    operation.ProductId = output.ProductId;
                    operation.UserId = Number(localStorage.getItem('userId'));
                    this.storeService.insertOperation(operation).subscribe(() => { })
                  })
                }
              })
            }
            if (this.formEditOrder.value.State == "Cancelado") {
              this.storeService.getUbication(this.formEditOrder.value.UbicationId).subscribe((ub: any) => {
                this.storeService.getOrderXProductByOrderId(this.orderid).subscribe((orderxproducts: any) => {
                  for (const orderxproduct of orderxproducts) {
                    this.storeService.getProduct(orderxproduct.ProductId).subscribe((p: any) => {
                      p.Amount = p.Amount + orderxproduct.Amount;
                      this.storeService.updateProduct(orderxproduct.ProductId, p).subscribe(() => {
                      })
                      ub.Amount = ub.Amount + Number(orderxproduct.Amount);
                      if (ub.Description == "El almacén no tiene productos") {
                        ub.Description = ub.Amount + " " + p.Description + "(s)";
                      } else {
                        const splits: string[] = ub.Description.split(',');
                        for (let i = 0; i < splits.length; i++) {
                          if (splits[i].includes(p.Description)) {
                            const array: string[] = splits[i].split(' ');
                            const amountprodub = Number(array[0]) + Number(orderxproduct.Amount);
                            console.log(array[0]);
                            ub.Description = ub.Description.replace(array[0] + " " + array[1], amountprodub + " " + array[1]);
                            this.existprod = true;
                            break;
                          }
                        }
                        if (this.existprod == false) {
                          ub.Description = ub.Description + "," + orderxproduct.Amount + " " + p.Description + "(s)";
                        }
                      }
                      var operation = new Operation();
                      operation.Date = this.todayWithPipe;
                      operation.Description = 'Se devolvió ' + orderxproduct.Amount + ' ' + p.Description + '(s) a ' + ub.Name;
                      operation.ProductId = p.ProductId;
                      operation.UserId = Number(localStorage.getItem('userId'));
                      this.storeService.insertOperation(operation).subscribe(() => { })
                      this.storeService.updateUbication(ub.UbicationId, ub).subscribe(() => { });
                    })
                  }
                })
              })
            }
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
    this.invalidate = false;
    amountorder = 0;
  }
  //Metodo para agregar productos a una ordern
  addProduct() {
    this.storeService.getUbication(this.formOrder.value.UbicationId).subscribe((ub: any) => {
      this.storeService.getProduct(this.formOrder.value.ProductId).subscribe((p: any) => {
        this.productdescription = p.Description;
        this.productprice = p.SalePrice;
        console.log(p.Description)
        for (const element of this.elements) {
          if (element.productid == this.formOrder.value.ProductId) {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'El producto ya está agregado en la orden'
            });
            this.addedproduct = true;
            break;
          }
        }
        if (this.addedproduct == false) {
          ub.Amount = ub.Amount - Number(this.formOrder.value.Amount);
          const splits: string[] = ub.Description.split(',');
          for (let i = 0; i < splits.length; i++) {
            if (splits[i].includes(p.Description)) {
              const array: string[] = splits[i].split(' ');
              const amountprodub = Number(array[0]) - Number(this.formOrder.value.Amount);
              console.log(array[0]);
              if (amountprodub < 0) {
                Swal.fire({
                  allowOutsideClick: false,
                  icon: 'error',
                  title: 'Excede la cantidad de stock',
                  text: 'En ' + ub.Name + ' hay ' + array[0] + " " + p.Description + "(s)"
                });
              } else {
                if (ub.Amount == 0) {
                  ub.Description = "El almacén no tiene productos";
                } else {
                  if (amountprodub >= 0) {
                    if (amountprodub == 0) {
                      if (i == splits.length - 1) {
                        ub.Description = ub.Description.replace(',' + splits[i], '');
                      } else {
                        ub.Description = ub.Description.replace(splits[i] + ',', '');
                      }
                    } else {
                      ub.Description = ub.Description.replace(array[0] + " " + array[1], amountprodub + " " + array[1]);
                    }
                    this.elements.push({
                      productid: this.formOrder.value.ProductId,
                      product: this.productdescription,
                      price: this.productprice,
                      amount: this.formOrder.value.Amount,
                      ubicationid: ub.UbicationId
                    });
                  }
                }
                this.finalprice = this.finalprice + (this.formOrder.value.Amount * p.SalePrice);
                break;
              }
            }
          }
          for (let i = 0; i < this.ubs.length; i++) {
            if (this.ubs[i].UbicationId == ub.UbicationId) {
              if (splits[i].includes(p.Description)) {
                const array: string[] = splits[i].split(' ');
                const amountprodub = Number(array[0]) - Number(this.formOrder.value.Amount);
                const newarray: string[] = splits[i].split(' ');
                if (amountprodub == 0) {
                  if (i == splits.length - 1) {
                    this.ubs[i].Description = this.ubs[i].Description.replace(',' + splits[i], '');
                  } else {
                    this.ubs[i].Description = this.ubs[i].Description.replace(splits[i] + ',', '');
                  }
                } else {
                  this.ubs[i].Description = this.ubs[i].Description.replace(newarray[0] + " " + array[1], amountprodub + " " + array[1]);
                }


              } else {
                this.ubs[i].Amount = this.ubs[i].Amount - this.formOrder.value.Amount;
              }
              this.recalledprod = true;
              break;

            }
          }
          if (this.recalledprod == false) {
            ub.Amount = ub.Amount - this.formOrder.value.Amount;
            this.ubs.push(ub);
          }
          console.log(this.ubs);
          console.log(ub.Amount);
          //dsa
          //this.storeService.updateUbication(this.formOrder.value.UbicationId,ub).subscribe(()=>{});
          /*for (const element of this.elements) {
            console.log(element)
            this.finalprice = this.finalprice + (element.amount * element.price);
            console.log(this.finalprice)
          }*/
        }
        this.recalledprod = false;
        this.addedproduct = false;
        this.idproduct = 0; this.productdescription = ""; this.productprice = 0;
      })
    })
  }
  updateUbications() {
    this.ubications.length = 0;
    this.storeService.getProduct(this.formOrder.value.ProductId).subscribe((p: any) => {
      this.storeService.getUbications().subscribe((ubs: any) => {
        for (let i = 0; i < ubs.length; i++) {
          if (ubs[i].Description.includes(p.Description)) {
            this.ubications.push({
              UbicationId: ubs[i].UbicationId,
              Name: ubs[i].Name
            });
            console.log(this.ubications)
          }
        }
      });
    })
  }
  updateOldUbications() {
    if (this.formEditOrder.value.State == "Cancelado") {
      this.showUbication = true;
      this.storeService.getUbications().subscribe((ubs: any) => {
        this.oldubications = ubs;
      });
    } else {
      this.showUbication = false;
      //this.selectUbication.nativeElement.disabled = false;
    }
  }
  // Método para cerrar el modal y limpiar el formulario
  closeModal() {

    this.formOrder = this.form.group({
      DeliveryDate: [''],
      ProductId: [''],
      UbicationId: [''],
      ClientId: [''],
      Amount: ['']
    });
    this.formEditOrder = this.form.group({
      OrderDate: [''],
      State: [''],
      DeliveryDate: [''],
      TotalPrice: [''],
      ClientId: [''],
      UbicationId: ['']
    });
    this.showUbication = false;
    this.elements.length = 0;
    this.ubs.length = 0;
    this.finalprice = 0;
  }

}