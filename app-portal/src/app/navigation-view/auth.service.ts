import { Injectable, inject } from '@angular/core';
import jsSHA from 'jssha';
import {JSONCodec, Msg, TransferInfo } from '@his-base/jetstream-ws';
import { JetstreamWsService } from '@his-base/jetstream-ws';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #jetStreamWsService = inject(JetstreamWsService);


  /** 加密密碼
   * @param {string} password
   * @memberof AuthService
  */
  getHashPassword(password: string): string {
    const shaObj = new jsSHA('SHA3-256', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(password);
    return shaObj.getHash('HEX');
  }

  /** 獲得授權
   * @param {{token:string}} payload
   * @memberof AuthService
  */
  async getAuth(payload: {token:string}):Promise<Msg> {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return await lastValueFrom(this.#jetStreamWsService.request('auth.request', payload))
  }





}
