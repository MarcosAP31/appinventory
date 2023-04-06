import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { Product } from '../models/product';
import { Supplier } from '../models/supplier';
import { User } from '../models/user';
import { Entry } from '../models/entry';
import { Output } from '../models/output';
import { Operation } from '../models/operation';
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  headers=new Headers()
  API_URI = 'http://localhost:3000/apistore';
  /*
  apitipoinventario = 'https://localhost:7000/api/Tipoinventario';
  apilocal = 'https://localhost:7000/api/Local';
  apifamilia = 'https://localhost:7000/api/Familia';
  apiunidadmedida = 'https://localhost:7000/api/Unidadmedida';
  apicategoria = 'https://localhost:7000/api/Categoria';
  apialmacen = 'https://localhost:7000/api/Almacen';
  apiarticulo = 'https://localhost:7000/api/Articulo';
  apiusuario = 'https://localhost:7000/api/Usuario'
  apiarea='https://localhost:7000/api/Area'
  apiarticulotipoinventario='https://localhost:7000/api/ArticuloTipoInventario'
  apiusuarioarea='https://localhost:7000/api/UsuarioArea'
  apiinventariocabecera='https://localhost:7000/api/InventarioCabecera'
  apiinventariodetalle='https://localhost:7000/api/InventarioDetalle'
  //token='lrgWUpXa4Zu0cygU3NIL';*/
  //url='https://www.covermanager.com/api/restaurant/get_reservs_basic/'+this.token;
  constructor(public http: HttpClient) { 
    
    this.headers.append("Authorization", "Bearer "+ localStorage.getItem("token") )
  }
  //Images
  

  //Clients
  getClients() {
    return this.http.get(`${this.API_URI}/client`);
  }
  getClient(id: number) {
    return this.http.get(`${this.API_URI}/client/${id}`);
  }
  insertClient(client:Client) {
   
    return this.http.post(`${this.API_URI}/client`, client);
    
  }
  updateClient(id:number, updatedClient: Client){
    return this.http.put(`${this.API_URI}/client/${id}`, updatedClient);
    
  }
  deleteClient(id:number): Observable<any> {
    return this.http.delete(`${this.API_URI}/client/${id}`);
  }

  //Products
  getProducts() {
    return this.http.get(`${this.API_URI}/product`);
  }
  getIncomes(){
    return this.http.get(`${this.API_URI}/product/operations/incomes`);
  }
  getExpenses(){
    return this.http.get(`${this.API_URI}/product/operations/expenses`);
  }
  getProduct(id: number) {
    return this.http.get(`${this.API_URI}/product/${id}`);
  }
  insertProduct(product:Product) {
   
    return this.http.post(`${this.API_URI}/product`, product);
    
  }
  updateProduct(id:number, updatedProduct: Product){
    return this.http.put(`${this.API_URI}/product/${id}`, updatedProduct);
    
  }
  deleteProduct(id:number): Observable<any> {
    return this.http.delete(`${this.API_URI}/product/${id}`);
  }
  getProductByDescription(description: string) {
    return this.http.get(`${this.API_URI}/product/description/${description}`);
  }
  //Proveedores
  getSuppliers() {
    return this.http.get(`${this.API_URI}/supplier`);
  }
  getSupplier(id: number) {
    return this.http.get(`${this.API_URI}/supplier/${id}`);
  }
  insertSupplier(supplier:Supplier) {
    return this.http.post(`${this.API_URI}/supplier`, supplier);
  }
  updateSupplier(id:number, updatedSupplier: Supplier){
    return this.http.put(`${this.API_URI}/supplier/${id}`, updatedSupplier);
  }
  deleteSupplier(id:number): Observable<any> {
    return this.http.delete(`${this.API_URI}/supplier/${id}`);
  }

  //Usuarios
  getUsers() {
    return this.http.get(`${this.API_URI}/user`);
  }
  getUser(id: number) {
    return this.http.get(`${this.API_URI}/user/${id}`);
  }
  insertUser(user:User) {
    return this.http.post(`${this.API_URI}/user`, user);
  }
  updateUser(id:number, updatedUser: User){
    return this.http.put(`${this.API_URI}/user/${id}`, updatedUser);
  }
  deleteUser(id:number): Observable<any> {
    return this.http.delete(`${this.API_URI}/user/${id}`);
  }
  getUserByEmail(email: string) {
    return this.http.get(`${this.API_URI}/user/email/${email}`);
  }
  login(user:User){
    return this.http.post(`${this.API_URI}/user/login`, user);
  }
  verify(token:any){
    
    return this.http.post(`${this.API_URI}/user/verify`, token);
  }
  //Entradas
  getEntrys() {
    return this.http.get(`${this.API_URI}/entry`);
  }
  getEntry(id: number) {
    return this.http.get(`${this.API_URI}/entry/${id}`);
  }
  insertEntry(entry:Entry) {
    return this.http.post(`${this.API_URI}/entry`, entry);
  }
  updateEntry(id:number, updatedEntry: Entry){
    return this.http.put(`${this.API_URI}/entry/${id}`, updatedEntry);
  }
  deleteEntry(id:number): Observable<any> {
    return this.http.delete(`${this.API_URI}/entry/${id}`);
  }

  //Salidas
  getOutputs() {
    return this.http.get(`${this.API_URI}/output`);
  }
  getOutput(id: number) {
    return this.http.get(`${this.API_URI}/output/${id}`);
  }
  insertOutput(output:Output) {
    return this.http.post(`${this.API_URI}/output`, output);
  }
  updateOutput(id:number, updatedOutput: Output){
    return this.http.put(`${this.API_URI}/output/${id}`, updatedOutput);
  }
  deleteOutput(id:number): Observable<any> {
    return this.http.delete(`${this.API_URI}/output/${id}`);
  }

  //Operaciones
  getOperations() {
    return this.http.get(`${this.API_URI}/operation`);
  }
  insertOperation(operation:Operation) {
    return this.http.post(`${this.API_URI}/operation`, operation);
  }
 
/*
  getClient(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiempresa}/${id}?token=${token}`);
  }

  insertarTipoInventario(form: any, token: any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apitipoinventario + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarTipoInventario(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apitipoinventario + '/update?token='}${token}`, form,
      { responseType: 'text' });
  }
  eliminarTipoInventario(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apitipoinventario}/${id}?token=${token}`);
  }
  obtenerTiposInventario(token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apitipoinventario}?token=${token}`);
  }

  obtenerTipoInventario(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apitipoinventario}/${id}?token=${token}`);
  }
  insertarLocal(form: any, token: any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apilocal + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarLocal(form: any, token: any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apilocal + '/update?token='}${token}`, form,
      { responseType: 'text' });

  }
  eliminarLocal(id: any, token: any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apilocal}/${id}?token=${token}`);
  }
  obtenerLocalesPorEmpresa(token: any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apilocal}?token=${token}`);
  }
  obtenerLocalesPorEmpresaId(id:any,token:any):Observable<any>{
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apilocal}/empresa/${id}?token=${token}`);
  }
  /*obtenerLocalesPorEmpresa():Observable<any>{
    return this.http.get(this.apilocal+'/empresa');
  }
  obtenerlocalesPorEmpresa(id:any):Observable<any>{
    return this.http.get(`${this.apilocal}/empresa/${id}?id=${id}`);
  }
  obtenerLocal(id: any, token: any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apilocal}/${id}?token=${token}`);
  }


  insertarFamilia(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apifamilia + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarFamilia(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apifamilia + '/update?token='}${token}`, form,
      { responseType: 'text' });
  }
  eliminarFamilia(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apifamilia}/${id}?token=${token}`);
  }
  obtenerFamiliasPorEmpresa(token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apifamilia}?token=${token}`);
  }
  obtenerFamilia(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apifamilia}/${id}?token=${token}`);
  }

  insertarUnidadMedida(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apiunidadmedida + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarUnidadMedida(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apiunidadmedida + '/update?token='}${token}`, form,
      { responseType: 'text' });

    //form.nombre_usuario=localStorage.getItem('usuario');
    //form.token=localStorage.getItem('token');
    
  }
  eliminarUnidadMedida(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apiunidadmedida}/${id}?token=${token}`);
  }
  obtenerUnidadesMedida(token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiunidadmedida}?token=${token}`);
  }
  obtenerUnidadMedida(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiunidadmedida}/${id}?token=${token}`);
  }

  insertarCategoria(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apicategoria + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarCategoria(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apicategoria + '/update?token='}${token}`, form,
      { responseType: 'text' });

  }
  eliminarCategoria(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apicategoria}/${id}?token=${token}`);
  }
  obtenerCategoriasPorEmpresa(token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apicategoria}?token=${token}`);
  }
  obtenerCategoria(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apicategoria}/${id}?token=${token}`);
  }

  insertarAlmacen(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apialmacen + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarAlmacen(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apialmacen + '/update?token='}${token}`, form,
      { responseType: 'text' });
    //form.nombre_usuario=localStorage.getItem('usuario');
    //form.token=localStorage.getItem('token');

  }
  eliminarAlmacen(id: any, token: any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apialmacen}/${id}?token=${token}`);
  }
  obtenerAlmacenesPorEmpresa(token: any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apialmacen}?token=${token}`);
  }
  obtenerAlmacenesPorLocal(id:any,token:any):Observable<any>{
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apialmacen}/local/${id}?token=${token}`);
  }
  /*obtenerAlmacenesPorLocal():Observable<any>{
    return this.http.get(this.apialmacen+'/local');
  }
  obtenerAlmacen(id: any, token: any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apialmacen}/${id}?token=${token}`);
  }

  insertarArticulo(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apiarticulo + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarArticulo(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apiarticulo + '/update?token='}${token}`, form,
      { responseType: 'text' });
  }
  eliminarArticulo(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apiarticulo}/${id}?token=${token}`);
  }
  obtenerArticulosPorEmpresa(token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiarticulo}?token=${token}`);
  }
  obtenerArticulo(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiarticulo}/${id}?token=${token}`);
  }

  insertarUsuario(form: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apiusuario + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarUsuario(form: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apiusuario + '/update?token='}${token}`, form,
      { responseType: 'text' });
  }
  eliminarUsuario(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apiusuario}/${id}?token=${token}`);
  }
  obtenerUsuariosPorEmpresa(token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiusuario}?token=${token}`);
  }
  obtenerUsuariosPorEmpresaId(id:any,token:any):Observable<any>{
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiusuario}/empresa/${id}?token=${token}`);
  }
  obtenerUsuario(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiusuario}/${id}?token=${token}`);
  }
  obtenerUsuarioPorNombreUsuario(usuario: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiusuario + '/nombreUsuario'}/${usuario}?token=${token}`);
  }
  login(usuario: any): Observable<any> {
    return this.http.post(this.apiusuario + '/login', usuario,
      { responseType: 'text' });
  }
  validarLogin(token: any): Observable<any> {
    //let caracter=/\b[+]\b/g
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apiusuario + '/vallogin?token='}${token}`, token,
      { responseType: 'text' });
  }

  insertarArea(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apiarea + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarArea(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apiarea + '/update?token='}${token}`, form,
      { responseType: 'text' });
  }
  eliminarArea(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apiarea}/${id}?token=${token}`);
  }
  obtenerAreasPorEmpresa(token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiarea}?token=${token}`);
  }
  obtenerAreasPorAlmacen(id:any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiarea}/almacen/${id}?token=${token}`);
  }
  obtenerAreasPorLocalAlmacen(id:any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiarea}/local/${id}?token=${token}`);
  }
  obtenerArea(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiarea}/${id}?token=${token}`);
  }




  insertarArticuloTipoInventario(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apiarticulotipoinventario + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarArticuloTipoInventario(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apiarticulotipoinventario + '/update?token='}${token}`, form,
      { responseType: 'text' });
  }
  eliminarArticuloTipoInventario(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apiarticulotipoinventario}/${id}?token=${token}`);
  }
  obtenerArticuloTiposInventarioPorEmpresa(token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiarticulotipoinventario}?token=${token}`);
  }
  obtenerArticulosTipoInventarioPorAreaId(id:any,token:any):Observable<any>{
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiarticulotipoinventario}/area/${id}?token=${token}`);
  }
  obtenerArticuloTipoInventario(articuloid: any,areaid:any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiarticulotipoinventario}/${articuloid}%2C${areaid}?articuloId=${articuloid}&areaId=${areaid}&token=${token}`);
  }


  insertarUsuarioArea(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apiusuarioarea + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarUsuarioArea(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apiusuarioarea + '/update?token='}${token}`, form,
      { responseType: 'text' });
  }
  eliminarUsuarioArea(usuarioid: any,areaid:any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.delete(`${this.apiusuarioarea}/${usuarioid}%2C${areaid}?usuarioId=${usuarioid}&areaId=${areaid}&token=${token}`);
  }
  obtenerUsuariosAreaPorEmpresa(token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiusuarioarea}?token=${token}`);
  }
  obtenerUsuarioArea(usuarioid: any,areaid:any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiusuarioarea}/${usuarioid}%2C${areaid}?usuarioId=${usuarioid}&areaId=${areaid}&token=${token}`);
  }

  insertarInventarioCabecera(form: any, token: any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apiinventariocabecera + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  actualizarInventarioCabecera(form: any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.put(`${this.apiinventariocabecera + '/update?token='}${token}`, form,
      { responseType: 'text' });
  }
  obtenerInventariosCabecera(token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiinventariocabecera}?token=${token}`);
  }
  obtenerInventariosCabeceraPorEstado(estado:string,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiinventariocabecera}/apertura/${estado}?token=${token}`);
  }
  obtenerInventarioCabecera(id: any,token:any): Observable<any> {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiinventariocabecera}/${id}?token=${token}`);
  }
  obtenerInventariosCabeceraPorFecha(fecha:any,token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    
    return this.http.get(`${this.apiinventariocabecera}/fecha/${fecha}?token=${token}`);
  }
  insertarInventarioDetalle(form: any, token: any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.post(`${this.apiinventariodetalle + '/insert?token='}${token}`, form,
      { responseType: 'text' });
  }
  
  obtenerInventariosDetalle(token:any) {
    let caracter=new RegExp('[+]','g')
    token=token.replace(caracter,'%2B')
    let caracter1=new RegExp('[/]','g')
    token=token.replace(caracter1,'%2F')
    return this.http.get(`${this.apiinventariodetalle}?token=${token}`);
  }
  /*
  getRestaurantes(){
    return this.http.get('https://www.covermanager.com/api/restaurant/list/lrgWUpXa4Zu0cygU3NIL');
  }*/

  /*
  getReservasRango(desde:any,hasta:any){
    return this.http.get('https://localhost:7023/api/reservas/rango?fecha1='+desde+'&fecha2='+hasta);
  }
  login(usuario:object){
    return this.http.post('https://localhost:7023/api/Usuario',usuario);
  }*/
}
