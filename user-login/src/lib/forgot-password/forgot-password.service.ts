/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Observable, lastValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { JSONCodec, JetstreamWsService } from '@his-base/jetstream-ws/dist';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  #jetStreamWsService = inject(JetstreamWsService)

  /** 向後端拿userMail
   * @param {string} userCode
   * @param {string} eMail
   * @return {*}  {Promise<boolean>}
   * @memberof ForgotPasswordService
   */
  getUserMail(userCode: string, eMail: string): Observable<string> {
    // @ts-ignore
    // 需帶入指定發布主題以及要傳送的訊息
    return this.#jetStreamWsService.request('UserAccount.GetUserMail', {'userCode': userCode,'eMail': eMail});
  }

  /** 向後端publish發送email的訊息
   * @param {string} userCode
   * @param {string} eMail
   * @memberof ForgotPasswordService
   */
  async pubSendMail(userCode: string, eMail: string) {
    await this.#jetStreamWsService.publish('UserAccount.SendMail',{'userCode': userCode, 'eMail': eMail})
  }
}
