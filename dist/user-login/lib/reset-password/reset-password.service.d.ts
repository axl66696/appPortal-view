import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ResetPasswordService {
    #private;
    /** 以傳入的token至後端抓取使用者代號
     * @param {string} payload
     * @return {*}  {Observable<string>}
     * @memberof ResetPasswordService
     */
    getUserCode(payload: string): Observable<string>;
    /** 將新密碼送至後端更新
     * @param {string} userCode
     * @param {string} passwordHash
     * @memberof ResetPasswordService
     */
    pubPassword(userCode: string, passwordHash: string): Promise<void>;
    /** nats server連線
     * @memberof ResetPasswordService
     */
    connect(): Promise<void>;
    /** nats server中斷連線
     * @memberof ResetPasswordService
     */
    disconnect(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResetPasswordService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ResetPasswordService>;
}
