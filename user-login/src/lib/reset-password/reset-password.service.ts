import {  Observable } from 'rxjs';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  /** 與Nats連接的Url
   * @type {string}
   * @memberof ResetPasswordService
   */
  #natsUrl = environment.wsUrl;

  #jetStreamWsService = inject(JetstreamWsService)

  /** 以傳入的token至後端抓取使用者代號
   * @param {string} payload
   * @return {*}  {Observable<string>}
   * @memberof ResetPasswordService
   */
  getUserCode(payload: string): Observable<string> {
    // @ts-ignore
    // 需帶入指定發布主題以及要傳送的訊息
    return this.#jetStreamWsService.request('appPortal.userAccount.userCode', payload);
  }

  /** 將新密碼送至後端更新
   * @param {string} userCode
   * @param {string} passwordHash
   * @memberof ResetPasswordService
   */
  async pubPassword(userCode: string, passwordHash: string) {
    // @ts-ignore
    // 需帶入指定發布主題以及要傳送的訊息
    await this.#jetStreamWsService.publish('appPortal.userAccount.modifyPassword', {'userCode': userCode, 'passwordHash': passwordHash});
  }

  /** nats server連線
   * @memberof ResetPasswordService
   */
  async connect() {
    await this.#jetStreamWsService.connect(this.#natsUrl);
  }

  /** nats server中斷連線
   * @memberof ResetPasswordService
   */
  async disconnect() {
    await this.#jetStreamWsService.drain()
  }
}
