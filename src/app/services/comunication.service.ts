import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComunicationService {
  valorEnviado = new EventEmitter<boolean>();

  constructor() {}

  enviarValor(valor: boolean) {
    this.valorEnviado.emit(valor);
  }
}
