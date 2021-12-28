import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; //ReactiveX -> JS RxJS | Java RxJava || ProjectReactor Webflux
import { environment } from 'src/environments/environment';
import { Paciente } from '../_model/paciente';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente> {

  private pacienteCambio: Subject<Paciente[]> = new Subject<Paciente[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  private pacienteUnCambio: Subject<Paciente> = new Subject<Paciente>();

  //private url: string = `${environment.HOST}/pacientes`;

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/pacientes`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  /*listar(){
    return this.http.get<Paciente[]>(this.url);
  }

  listarPorId(id: number){
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }
  
  registrar(paciente: Paciente){
    return this.http.post(this.url, paciente);
  }

  modificar(paciente: Paciente){
    return this.http.put(this.url, paciente);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }*/

  //////////////////////////

  getPacienteCambio(){
    return this.pacienteCambio.asObservable();
  }

  setPacienteCambio(lista: Paciente[]){
    this.pacienteCambio.next(lista);
  }


  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(msj: string){
    this.mensajeCambio.next(msj);
  }
  setUnPacienteCambio(paciente: Paciente){
    this.pacienteUnCambio.next(paciente);
  }

  getUnPacienteCambio(){
    return this.pacienteUnCambio.asObservable();
  }
}
