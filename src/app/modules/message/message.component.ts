import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';
import { Conversation } from 'src/app/models/conversation';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @ViewChild('messageContainer', { static: false }) messageContainer!: ElementRef;
  private unsubscribe$: Subject<void> = new Subject<void>();
  socket: any;
  validate: boolean = false
  listmessages: any[] = []

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  formMessage: FormGroup;
  users: User[] = [];
  messages: any[] = [];
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  selectedChat: any;

  constructor(public form: FormBuilder, private storeService: StoreService) {
    // Inicializar el formulario de mensajes
    this.formMessage = this.form.group({
      Content: ['']
    });
  }

  ngOnInit(): void {
    // Configurar opciones de DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };
    // Establecer conexión con el servidor de Socket.IO
    this.socket = io('http://192.168.1.5:3000'); // Reemplaza la URL con la URL de tu servidor Socket.IO

    // Suscribirse a eventos del socket
    this.socket.on('message', (message: any) => {
      // Actualizar los mensajes cuando se recibe un nuevo mensaje del servidor
      this.messages.push(message);
      this.scrollToBottom();
    });


    this.getUsers();
    interval(1000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.validate) {


          const conversationName = `${localStorage.getItem('username')}-${localStorage.getItem('receiver')}`;
          this.storeService.getConversationByName(conversationName).subscribe((r: any) => {
            if (r != null) {
              this.storeService.getMessagesByConversationId(r.ConversationId).subscribe((res: any) => {

                this.getMessages(res);
              });
            } else {
              const conversationNameReverse = `${localStorage.getItem('receiver')}-${localStorage.getItem('username')}`;
              this.storeService.getConversationByName(conversationNameReverse).subscribe((re: any) => {
                if (re != null) {
                  this.storeService.getMessagesByConversationId(re.ConversationId).subscribe((res: any) => {
                    this.getMessages(res);
                  });
                } else {
                  this.messages = re;
                }
              });
            }
          });
        }
      });
      this.validate=false
  }
  ngOnDestroy(): void {
    // Limpiar el Subject al destruir el componente para evitar fugas de memoria
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  getUsers() {
    // Obtener usuarios del servicio
    this.dtTrigger.next(0);
    this.storeService.getUsers().subscribe((response: any) => {
      for (let i = 0; i < response.length; i++) {
        // Agregar usuarios excepto el usuario actual
        if (response[i].UserId != localStorage.getItem('userId')) {
          this.users.push(response[i]);
        }
      }
    });
  }

  openChat(user: any) {
    // Abrir chat con el usuario seleccionado
    this.selectedChat = user;
    localStorage.setItem('receiver', user.UserName);
    console.log(localStorage.getItem('receiver'));
    const conversationName = `${localStorage.getItem('username')}-${localStorage.getItem('receiver')}`;
    this.storeService.getConversationByName(conversationName).subscribe((r: any) => {
      if (r != null) {
        this.storeService.getMessagesByConversationId(r.ConversationId).subscribe((res: any) => {

          this.getMessages(res);
        });
      } else {
        const conversationNameReverse = `${localStorage.getItem('receiver')}-${localStorage.getItem('username')}`;
        this.storeService.getConversationByName(conversationNameReverse).subscribe((re: any) => {
          if (re != null) {
            this.storeService.getMessagesByConversationId(re.ConversationId).subscribe((res: any) => {
              this.getMessages(res);
            });
          } else {
            this.messages = re;
          }
        });
      }
    });

  }

  closeChat() {
    // Cerrar chat
    this.selectedChat = null;
  }

  getMessages(listmessages: any[]) {

    this.messages = listmessages;
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);

  }
  //Función para mostrar mensaje
  showMessage(message: any) {
    let sentByUser=false
    let receivedMessage=false
    let content=message.content
    if (message.userName == localStorage.getItem('username')) {
      sentByUser = true
      receivedMessage = false
    } else {
      receivedMessage = true
      sentByUser = false
    }
    return {
      message:message.Content,sentByUser, receivedMessage
    }
  }
  //Funcion para desplazaarse hasta el final del contenedor de los mensajes
  scrollToBottom() {
    const container = this.messageContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  submit() {
    // Enviar mensaje
    const conversationName = `${localStorage.getItem('username')}-${localStorage.getItem('receiver')}`;
    this.storeService.getConversationByName(conversationName).subscribe((r: any) => {
      if (r == null) {
        const conversationNameReverse = `${localStorage.getItem('receiver')}-${localStorage.getItem('username')}`;
        this.storeService.getConversationByName(conversationNameReverse).subscribe((re: any) => {
          if (re == null) {
            // Insertar nueva conversación
            const conversation = new Conversation();
            conversation.Name = conversationName;
            conversation.CreationDate = this.todayWithPipe;
            this.storeService.insertConversation(conversation).subscribe(res => {

            });

            // Obtener el ID de la nueva conversación
            this.storeService.getConversationByName(conversationName).subscribe((res: any) => {
              // Insertar mensaje en la nueva conversación
              const message = new Message();
              message.Content = this.formMessage.value.Content;
              message.ShippingDate = this.todayWithPipe;
              message.UserId = Number(localStorage.getItem('userId'));
              message.ConversationId = res.ConversationId;
              this.storeService.insertMessage(message).subscribe(response => {
                this.storeService.getMessagesByConversationId(res.ConversationId).subscribe((resp: any) => {
                  this.listmessages = resp
                  // Obtener mensajes actualizados
                  this.getMessages(resp);
                  console.log(this.messages)
                  // Emitir el mensaje al servidor Socket.IO
                  this.socket.emit('message', message);
                  this.validate = true
                })
              });

            });
          } else {
            // Insertar mensaje en la conversación existente
            const message = new Message();
            message.Content = this.formMessage.value.Content;
            message.ShippingDate = this.todayWithPipe;
            message.UserId = Number(localStorage.getItem('userId'));
            message.ConversationId = re.ConversationId;
            this.storeService.insertMessage(message).subscribe(response => {
              this.storeService.getMessagesByConversationId(re.ConversationId).subscribe((resp: any) => {
                // Obtener mensajes actualizados
                this.listmessages = resp
                this.getMessages(resp);
                console.log(this.messages)
                // Emitir el mensaje al servidor Socket.IO
                this.socket.emit('message', message);
                this.validate = true
              })
            });

          }
        });
      } else {
        const message = new Message();
        message.Content = this.formMessage.value.Content;
        message.ShippingDate = this.todayWithPipe;
        message.UserId = Number(localStorage.getItem('userId'));
        message.ConversationId = r.ConversationId;
        this.storeService.insertMessage(message).subscribe(response => {
          this.storeService.getMessagesByConversationId(r.ConversationId).subscribe((resp: any) => {
            // Obtener mensajes actualizados
            this.getMessages(resp);
            console.log(this.messages)
            // Emitir el mensaje al servidor Socket.IO
            this.socket.emit('message', message);
            this.validate = true
          })
        });

      }
    });
  }
}
