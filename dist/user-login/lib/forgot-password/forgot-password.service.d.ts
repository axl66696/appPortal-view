import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ForgotPasswordService {
    #private;
    /** 向後端拿userMail
     * @param {string} userCode
     * @param {string} eMail
     * @return {*}  {Observable<string>}
     * @memberof ForgotPasswordService
     */
    getUserMail(userCode: string, eMail: string): Observable<string>;
    /** 向後端publish發送email的訊息
     * @param {string} userCode
     * @param {string} eMail
     * @memberof ForgotPasswordService
     */
    pubSendMail(userCode: string, eMail: string): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ForgotPasswordService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ForgotPasswordService>;
}
