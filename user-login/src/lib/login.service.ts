/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable,inject} from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { JSONCodec, JetstreamWsService} from '@his-base/jetstream-ws/dist';
import { LoginReq, UserAccount, UserToken } from '@his-viewmodel/app-portal/dist';
import jsSHA from 'jssha';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  #jetStreamWsService = inject(JetstreamWsService);

  /** 取得使用者權杖
   * @param {LoginReq} payload
   * @return {*}  {Promise<Msg>}
   * @memberof LoginService
   */
  getUserToken(payload: LoginReq): Observable<UserToken>{
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return this.#jetStreamWsService.request('UserAccount.GetUserToken', payload)
  }

  /** 加密密碼
   * @param {string} password
   * @return {*}  {string}
   * @memberof LoginService
   */
  getHashPassword(password: string): string {
    const shaObj = new jsSHA('SHA3-256', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(password);
    return shaObj.getHash('HEX');
  }

  /** 取得使用者帳號資訊
   * @param {string} payload
   * @return {*}  {Promise<UserAccount>}
   * @memberof LoginService
   */
  getUserAccount(payload: string): Observable<UserAccount>{
    return this.#jetStreamWsService.request('UserAccount.GetUserAccount', payload)
  }
}
