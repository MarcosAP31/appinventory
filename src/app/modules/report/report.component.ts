import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Report } from 'src/app/models/report';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StoreService } from 'src/app/service/store.service';
import { Request, Response } from 'express'
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import Swal from 'sweetalert2';
import { Entry } from 'src/app/models/entry';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Operation } from 'src/app/models/operation';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  // Propiedades
  image: any = "../../../assets/upload.png";
  show: boolean = false;
  title = 'fileUpload';
  images = '';
  imgURL = '/assets/noimage.png';
  multipleImages = [];
  imagenes: any = [];
  file: any;
  previsualizacion: any;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  formReport: FormGroup;
  reports: any;
  products: any;
  orders: any;
  idreport: any;
  suppliers: any;
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
    this.formReport = this.form.group({
      Description: [''],
      Category: [''],
      Date: ['']
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

  // Método para obtener los reportos y proveedores
  get() {
    this.storeService.getReports().subscribe(response => {
      this.reports = response;
      this.dtTrigger.next(0);
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
    this.http.get<any>('http://192.168.1.5:3000/apistore/upload').subscribe(res => {
      this.imagenes = res;
      const reader = new FileReader();
      reader.onload = (this.imagenes);
      console.log(this.imagenes);
    });
  }

  // Método para editar un reporto
  edit(id: any) {
    this.creating = false;
    this.formReport.get('Amount')?.disable();

    this.storeService.getReport(id).subscribe((response: any) => {
      this.id = response.ReportId;
      this.formReport.setValue({
        Description: response.Description,
        Category: response.Category,
        Amount: response.Amount,
        PurchasePrice: response.PurchasePrice,
        SalePrice: response.SalePrice,
        SupplierId: response.SupplierId,
        Image: response.Image
      });
    });

    this.formReport = this.form.group({
      Description: [''],
      Category: [''],
      Amount: [''],
      PurchasePrice: [''],
      SalePrice: [''],
      SupplierId: [''],
      Image: ['']
    });
  }

  // Método para eliminar un reporto
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

        this.storeService.getReport(id).subscribe((r: any) => {
          this.storeService.getFileByName(r.Image).subscribe((res: any) => {
            this.http.delete<any>(`http://192.168.1.5:3000/apistore/file/${res.FileId}`).subscribe(re => {
              console.log(re, location.reload());
            });
          })
        });

        this.storeService.deleteReport(id).subscribe(r => {
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

  // Método para guardar un reporto
  submit() {
    var report = new Report();
    report.Description = this.formReport.value.Description;
    report.Category = this.formReport.value.Category;
    report.Date = this.todayWithPipe;
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

        this.storeService.insertReport(report).subscribe(r => {
          if (this.formReport.value.Category == "Existencias") {
            this.storeService.getProducts().subscribe(response => {
              this.products = response;
              this.dtTrigger.next(0);
            });
          } else {
            if (this.formReport.value.Category == "Escasez de inventario") {
              this.storeService.getProducts().subscribe((response: any) => {
                for (let i = 0; i < response.length; i++) {
                  if (response[i].Amount <= 5) {
                    this.products.push(response[i]);
                  }
                }
              });
            } else {
              if (this.formReport.value.Category == "Exceso de inventario") {
                this.storeService.getProducts().subscribe((response: any) => {
                  for (let i = 0; i < response.length; i++) {
                    if (response[i].Amount >= 8) {
                      this.products.push(response[i]);
                    }
                  }
                });
              } else {
                if (this.formReport.value.Category == "Pedidos pendientes") {
                  this.storeService.getOrders().subscribe((response: any) => {
                    for (let i = 0; i < response.length; i++) {
                      if (response[i].State == "Pendiente") {
                        this.orders.push(response[i]);
                      }
                    }
                  });
                } else {
                  this.storeService.getProducts().subscribe((response: any) => {
                    let profits: { revenue: number, productid: number }[] = [];
                    for (let i = 0; i < response.length; i++) {
                      this.storeService.getOutput(response[i]).subscribe((res: any) => {
                        profits.push({
                          revenue: (response[i].SalePrice - response[i].PurchasePrice) * res.Amount,
                          productid: res.ProductId
                        });
                      })
                    }
                    let max = profits[0].revenue;
                    for (let j = 0; j < profits.length; j++) {
                      for (let k = j + 1; k < profits.length; k++) {
                        if (profits[k].revenue > max) {
                          max = profits[k].revenue;
                          this.storeService.getProduct(profits[k].productid).subscribe((res: any) => {
                            this.products.push(res);
                          })
                          break;
                        }
                      }
                    }
                  });
                }
              }
            }
          }
          this.generatePDF();
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
  generatePDF() {
    const tableData:any[] = [];
    let table = document.getElementById('productTable');
    if(this.products.length>0){
      table = document.getElementById('productTable'); // Reemplaza 'myTable' con el ID de tu tabla
    }else{
      table = document.getElementById('orderTable'); // Reemplaza 'myTable' con el ID de tu tabla
    }
  
    if (table) {
      const rows = table.querySelectorAll('tr');
  
      rows.forEach((row) => {
        const rowData:any[] = [];
        const cells = row.querySelectorAll('td');
  
        cells.forEach((cell) => {
          rowData.push(cell.innerText);
        });
  
        tableData.push(rowData);
      });
    }
  
    // Luego, puedes usar tableData para construir el contenido del PDF
    const documentDefinition = {
      content: [
        { text: 'Tabla de Datos', style: 'header' },
        {
          table: {
            headerRows: 1,
            body: tableData,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
      },
    };
  
    pdfMake.createPdf(documentDefinition).open(); // Abre el PDF en una nueva ventana
  }
  // Método para cerrar el modal
  closeModal() {
    this.formReport = this.form.group({
      Description: [''],
      Category: [''],
      Amount: [''],
      PurchasePrice: [''],
      SalePrice: [''],
      SupplierId: [''],
      Image: ['']
    });
    this.show = false;
  }
}
