import { Observable } from 'rxjs';
import { LoginReq, UserAccount, UserToken } from '@his-viewmodel/app-portal/dist';
import * as i0 from "@angular/core";
export declare class LoginService {
    #private;
    /** 取得使用者權杖
     * @param {LoginReq} payload
     * @return {*}  {Observable<UserToken>}
     * @memberof LoginService
     */
    getUserToken(payload: LoginReq): Observable<UserToken>;
    /** 加密密碼
     * @param {string} password
     * @return {*}  {string}
     * @memberof LoginService
     */
    getHashPassword(password: string): string;
    /** 取得使用者帳號資訊
     * @param {string} payload
     * @return {*}  {Observable<UserAccount>}
     * @memberof LoginService
     */
    getUserAccount(payload: string): Observable<UserAccount>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoginService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LoginService>;
}
