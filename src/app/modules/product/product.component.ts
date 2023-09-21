import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StoreService } from 'src/app/service/store.service';
import { Request, Response } from 'express'

import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Operation } from 'src/app/models/operation';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  // Propiedades
  image: any = "../../../assets/upload.png";
  show: boolean = false;
  showUbication: boolean = true;
  title = 'fileUpload';
  images = '';
  imgURL = '/assets/noimage.png';
  multipleImages = [];
  imagenes: any = [];
  file: any;
  previsualizacion: any;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  formProduct: FormGroup;
  products: any;
  idproduct: any;
  suppliers: any;
  ubications: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  noValido = true;
  id = 0;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public form: FormBuilder,
    private storeService: StoreService
  ) {
    // Inicializar formulario
    this.formProduct = this.form.group({
      Description: [''],
      Category: [''],
      Amount: [''],
      PurchasePrice: [''],
      SalePrice: [''],
      SupplierId: [''],
      UbicationId: [''],
      Image: ['']
    });
  }

  // Método para mostrar un cuadro de carga
  isLoading() {
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }

  // Método para detener el cuadro de carga
  stopLoading() {
    Swal.close();
  }

  // Método para obtener los productos y proveedores
  get() {
    this.storeService.getProducts().subscribe(response => {
      this.products = response;
      this.dtTrigger.next(0);
    });
    this.storeService.getSuppliers().subscribe(response => {
      this.suppliers = response;
    });
    this.storeService.getUbications().subscribe(response => {
      this.ubications = response;
    });
  }

  ngOnInit(): void {
    // Configuraciones de DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };
    this.get();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
  }

  // Método para seleccionar una imagen
  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.imgURL = event.target.result;
      }
      this.images = file;
    }
    this.show = true;
  }

  // Método para seleccionar múltiples imágenes
  selectMultipleImage(event: any) {
    if (event.target.files.length > 0) {
      this.multipleImages = event.target.files;
    }
  }

  // Método para mostrar las imágenes
  mostrarImg() {
    this.http.get<any>('http://localhost:3000/apistore/upload').subscribe(res => {
      this.imagenes = res;
      const reader = new FileReader();
      reader.onload = (this.imagenes);
      console.log(this.imagenes);
    });
  }

  // Método para editar un producto
  edit(id: any) {
    this.creating = false;
    this.formProduct.get('Amount')?.disable();
    this.showUbication=true;
    this.storeService.getProduct(id).subscribe((response: any) => {
      this.id = response.ProductId;
      this.formProduct.setValue({
        Description: response.Description,
        Category: response.Category,
        Amount: response.Amount,
        PurchasePrice: response.PurchasePrice,
        SalePrice: response.SalePrice,
        SupplierId: response.SupplierId,
        Image: response.Image
      });
    });
    this.showUbication = false;
    this.formProduct = this.form.group({
      Description: [''],
      Category: [''],
      Amount: [''],
      PurchasePrice: [''],
      SalePrice: [''],
      SupplierId: [''],
      Image: ['']
    });
  }

  // Método para eliminar un producto
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

        this.storeService.getProduct(id).subscribe((r: any) => {
          this.storeService.getFileByName(r.Image).subscribe((res: any) => {
            this.http.delete<any>(`http://localhost:3000/apistore/file/${res.FileId}`).subscribe(re => {
              console.log(re, location.reload());
            });
          })
        });

        this.storeService.deleteProduct(id).subscribe(r => {
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

  // Método para guardar un producto
  submit() {
    var product = new Product();
    var entry = new Entry();
    var operation = new Operation();
    var newoperation = new Operation();
    product.Description = this.formProduct.value.Description;
    product.Category = this.formProduct.value.Category;
    product.Amount = this.formProduct.value.Amount;
    product.PurchasePrice = this.formProduct.value.PurchasePrice;
    product.SalePrice = this.formProduct.value.SalePrice;
    product.SupplierId = this.formProduct.value.SupplierId;
    var string = this.formProduct.value.Image;
    var splits = string.split("\\", 3);
    product.Image = splits[2];
    var solicitud = this.creating ? this.storeService.insertProduct(product) : this.storeService.updateProduct(this.id, product);
    this.storeService.getProductByDescription(this.formProduct.value.Description).subscribe((p: any) => {
      if (p != null&&this.creating==true) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Ya existe un producto con la misma descripción.'
        });
      } else {
        this.storeService.getUbication(this.formProduct.value.UbicationId).subscribe((u: any) => {
          console.log(u.Capacity);
          console.log(u.Capacity);
          console.log(this.formProduct.value.Amount);
          if (Number(u.Capacity) - Number(u.Amount) < Number(this.formProduct.value.Amount)) {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Excede la capacidad del almacén',
              text: 'El almacén ' + u.Name + ' solo tiene capacidad para ' + u.Capacity + ' producto(s) y actualmente tiene ' + u.Amount + ' productos.',
            });
          } else {
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
                  if (this.creating == true) {
                    this.storeService.getProductByDescription(this.formProduct.value.Description).subscribe((res: any) => {
                      this.idproduct = res.ProductId;
                      entry.ProductId = this.idproduct;
                      entry.Date = this.todayWithPipe;
                      entry.Amount = this.formProduct.value.Amount;
                      entry.UbicationId = this.formProduct.value.UbicationId;
                      entry.UserId = Number(localStorage.getItem('userId'));
                      console.log(entry)
                      this.storeService.insertEntry(entry).subscribe(() => { });

                      operation.Date = entry.Date;
                      operation.Description = "Compra de " + product.Amount + " " + product.Description + "(s)";
                      operation.ProductId = entry.ProductId;
                      operation.UserId = Number(localStorage.getItem('userId'));
                      this.storeService.insertOperation(operation).subscribe(() => { });
                      this.storeService.getUbication(entry.UbicationId).subscribe((ub: any) => {
                        newoperation.Date = entry.Date;
                        newoperation.Description = "Se agregó " + product.Amount + " " + product.Description + "(s) a " + ub.Name;
                        newoperation.ProductId = entry.ProductId;
                        newoperation.UserId = Number(localStorage.getItem('userId'));
                        this.storeService.insertOperation(newoperation).subscribe(() => { });
                        ub.Amount = ub.Amount + Number(this.formProduct.value.Amount);

                        if (ub.Description == "El almacén no tiene productos") {
                          ub.Description = ub.Amount + " " + res.Description + "(s)";
                        } else {
                          ub.Description = ub.Description + "," + this.formProduct.value.Amount + " " + res.Description;
                        }
                        this.storeService.updateUbication(entry.UbicationId, ub).subscribe(() => { });
                      })
                    });
                    const formData = new FormData();
                    formData.append('file', this.images);
                    this.http.post<any>('http://localhost:3000/apistore/saveimg', formData).subscribe((res) => { });
                    Swal.fire({
                      allowOutsideClick: false,
                      icon: 'success',
                      title: 'Éxito',
                      text: '¡Se ha guardado correctamente!',
                    }).then((result) => {
                      window.location.reload();
                    });
                  } else {
                    console.log("holaaaa")
                    this.storeService.getProduct(this.id).subscribe((re: any) => {
                      this.storeService.getFileByName(re.Image).subscribe((res: any) => {
                        this.http.delete<any>(`http://localhost:3000/apistore/file/${res.FileId}`).subscribe();
                      })
                    });
                  }
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

                //this.imgURL = '/assets/noimage.png';
              } else if (result.isDenied) {
                // El usuario ha cancelado la operación
              }

            });
          }
        })
      }
    })
  }

  // Método para cerrar el modal
  closeModal() {
    this.formProduct = this.form.group({
      Description: [''],
      Category: [''],
      Amount: [''],
      PurchasePrice: [''],
      SalePrice: [''],
      SupplierId: [''],
      UbicationId: [''],
      Image:['']
    });
    this.show = false;
    this.showUbication=false;
  }
}
