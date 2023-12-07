import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Subject } from 'rxjs';
import { Document } from 'src/app/models/document';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DomSanitizer, disableDebugTools } from '@angular/platform-browser';
import { StoreService } from 'src/app/service/store.service';



pdfMake.vfs = pdfFonts.pdfMake.vfs
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']

})
export class DocumentComponent implements OnInit {
  // Propiedades
  @ViewChild('pdfContent') pdfContent: any;
  show: boolean = false;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  formDocument: FormGroup;
  documents: any;
  suppliers: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  noValido = true;
  documentid = 0;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public form: FormBuilder,
    private storeService: StoreService
  ) {
    // Inicializar formulario
    this.formDocument = this.form.group({
      Name: [''],
      Action: [''],
      Area: [''],
      Attention: [''],
      Diagnosis: [''],
      Enterprise: [''],
      Device: [''],
      Failure: [''],
      Price: [''],
      Reference: [''],
      Serie: ['']
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
    this.storeService.getDocuments().subscribe(response => {
      this.documents = response;
      this.dtTrigger.next(0);
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
  edit(documentid: any) {
    this.creating = false;
    this.storeService.getDocument(documentid).subscribe((response: any) => {
      this.documentid = response.DocumentId;
      this.formDocument.setValue({
        Name: response.Name,
        Action: response.Action,
        Area: response.Area,
        Attention: response.Attention,
        Diagnosis: response.Diagnosis,
        Enterprise: response.Enterprise,
        Device: response.Device,
        Failure: response.Failure,
        Price: response.Price,
        Reference: response.Reference,
        Serie: response.Serie,
      });
    });

    this.formDocument = this.form.group({
      Name: [''],
      Action: [''],
      Area: [''],
      Attention: [''],
      Diagnosis: [''],
      Enterprise: [''],
      Device: [''],
      Failure: [''],
      Price: [''],
      Reference: [''],
      Serie: ['']
    });
  }

  // Método para eliminar un documento
  delete(documentid: any) {
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
        this.storeService.getDocument(documentid).subscribe((r: any) => {
          this.storeService.getFileByName(r.Path).subscribe((res: any) => {
            this.http.delete<any>(`http://localhost:3000/apistore/file/${res.FileId}`).subscribe(re => {
              console.log(re, location.reload());
            });
          })
        });
        this.storeService.deleteDocument(documentid).subscribe(r => {
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
  submit() {
    var document = new Document();
    document.Name = this.formDocument.value.Name;
    document.CreationDate = this.todayWithPipe;
    document.UserId = Number(localStorage.getItem('userId'));
    document.Path = document.Name + '.pdf';
    document.Action = this.formDocument.value.Action;
    document.Area = this.formDocument.value.Area;
    document.Attention = this.formDocument.value.Attention;
    document.Diagnosis = this.formDocument.value.Diagnosis;
    document.Enterprise = this.formDocument.value.Enterprise;
    document.Device = this.formDocument.value.Device;
    document.Failure = this.formDocument.value.Failure;
    document.Price = this.formDocument.value.Price;
    document.Reference = this.formDocument.value.Reference;
    document.Serie = this.formDocument.value.Serie;

    var solicitud = this.creating ? this.storeService.insertDocument(document) : this.storeService.updateDocument(this.documentid, document);

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
        if (this.creating == false) {
          this.storeService.getDocument(this.documentid).subscribe((re: any) => {
            this.storeService.getFileByName(re.Path).subscribe((res: any) => {
              this.http.delete<any>(`http://localhost:3000/apistore/file/${res.FileId}`).subscribe();
            })
          });
        }
        solicitud.subscribe(r => {
          this.generatePDF();
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
    const imageUrl1 = 'assets/img/dsadsa.PNG';
    const imageUrl2 = 'assets/img/fasdas.PNG';
    this.storeService.getDocumentByUserId(Number(localStorage.getItem('userId'))).subscribe((r: any) => {
      var document = new Document();
      document.Name = this.formDocument.value.Name;
      document.CreationDate = this.todayWithPipe;
      document.UserId = Number(localStorage.getItem('userId'));
      document.Path = document.Name + '.pdf';
      document.Action = this.formDocument.value.Action;
      document.Area = this.formDocument.value.Area;
      document.Attention = this.formDocument.value.Attention;
      document.Diagnosis = this.formDocument.value.Diagnosis;
      document.Enterprise = this.formDocument.value.Enterprise;
      document.Device = this.formDocument.value.Device;
      document.Failure = this.formDocument.value.Failure;
      document.Price = this.formDocument.value.Price;
      document.Reference = this.formDocument.value.Reference;
      document.Serie = this.formDocument.value.Serie;
      fetch(imageUrl1)
        .then(response => response.blob())
        .then(blob1 => {
          fetch(imageUrl2)
            .then(response => response.blob())
            .then(blob2 => {
              const reader1 = new FileReader();
              const reader2 = new FileReader();
              reader1.readAsDataURL(blob1);
              reader2.readAsDataURL(blob2);
              reader1.onloadend = () => {
                reader2.onloadend = () => {
                  const base64data1 = reader1.result as string;
                  const base64data2 = reader2.result as string;

                  const documentDefinition = {
                    content: [
                      // ... contenido del documento ...
                      { text: document.CreationDate },
                      { text: 'REFERENCIA: COTIZACION #' + r.DocumentId + '-2023 MANTENIMIENTO DE IMPRESORA', fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
                      { text: 'SRS: ' + document.Enterprise + '                                                               ' + 'ATENCION: ' + document.Attention + '\n\n' },
                      { text: 'Por medio del presente queremos hacerle llegar nuestra propuesta técnico – económica Por el servicio solicitado.' + '\n\n' },
                      {
                        table: {
                          headerRows: 1,
                          widths: ['*', 'auto'],
                          body: [
                            ['ITEM', '1'],
                            ['EQUIPO', { text: document.Device, style: 'cellText' }],
                            ['SERIE', { text: document.Serie, style: 'cellText' }],
                            ['AREA', { text: document.Area, style: 'cellText' }],
                            ['FALLA', { text: document.Failure, style: 'cellText' }],
                            ['DIAGNOSTICO', { text: document.Diagnosis, style: 'cellText' }],
                            ['ACCION A REALIZAR', { text: document.Action, style: 'cellText' }],
                            ['COSTO UNITARIO', 'S/.' + document.Price + ' SOLES']
                          ]
                        }
                      },
                      { text: '\n\n' + 'NOTA:  PRECIO : EN SOLES ,ENTREGA DE RECIBOS POR HONORARIOS' },
                      { text: '       GARANTIA: SOLO MANO DE OBRA Y EN REPUESTO POR DEFECTO DE FABRICA. ' },
                      { text: '       ENTREGA DE TRABAJOS. INMEDIATO UNA VES RECIBIDA LA O/C – O/S' + '\n\n' },
                      { image: base64data1 },
                      { text: '\n\n' + 'EMAIL: dsadsads' + '\n\n' },
                      {
                        image: base64data2,
                        width: 500,

                      }
                      // ... más contenido ...
                    ],
                    styles: {
                      tableHeader: {
                        bold: true,
                        fillColor: '#CCCCCC'
                      },
                      cellText: {
                        margin: [0, 5, 0, 5]
                      },

                    }
                  };
                  const pdfDocGenerator = pdfMake.createPdf(documentDefinition)
                  //pdfDocGenerator.download('nombre_archivo.pdf');
                  pdfDocGenerator.getBlob((blob: Blob) => {
                    const file = new File([blob], document.Path, { type: 'application/pdf' });
                    console.log('Archivo convertido:', file);
                    const formData = new FormData();
                    formData.append('file', file);

                    this.http.post<any>('http://localhost:3000/apistore/savedoc', formData).subscribe((res) =>
                      console.log(res, Swal.fire({
                        icon: 'success',
                        title: 'Imagen cargada!!',
                        text: '¡La imagen se subió correctamente!'
                      }).then((result) => {
                        if (result) {
                          location.reload();
                        }
                      }))
                    );
                    // Utiliza el objeto File según tus necesidades
                    // Por ejemplo, puedes enviarlo en una petición AJAX o realizar otras operaciones con él
                  });
                };
              };
            });
        });
    })

  }

  closeModal() {
    this.formDocument = this.form.group({
      Name: [''],
      Action: [''],
      Area: [''],
      Attention: [''],
      Diagnosis: [''],
      Enterprise: [''],
      Device: [''],
      Failure: [''],
      Price: [''],
      Reference: [''],
      Serie: ['']
    });
    this.show = false;
  }

}
