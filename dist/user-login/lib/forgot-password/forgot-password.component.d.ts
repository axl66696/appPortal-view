import { EventEmitter } from '@angular/core';
import '@angular/localize/init';
import { MessageService } from 'primeng/api';
import * as i0 from "@angular/core";
export declare class ForgotPasswordComponent {
    #private;
    /** 忘記密碼畫面顯示與否
     * @type {boolean}
     * @memberof ForgotPasswordComponent
     */
    isVisibleForgot: boolean;
    /** 發射關閉忘記密碼畫面事件
     * @memberof ForgotPasswordComponent
     */
    hideForgot: EventEmitter<any>;
    /** 帳號
     * @type {string}
     * @memberof ForgotPasswordComponent
     */
    userCode: string;
    /** 電子信箱
     * @type {string}
     * @memberof ForgotPasswordComponent
     */
    eMail: string;
    /** 後端回傳的使用者信箱
     * @type {string}
     * @memberof ForgotPasswordComponent
     */
    userMail: string;
    messageService: MessageService;
    /** 點擊確定送出按鈕
     * @memberof ForgotPasswordComponent
     */
    onSubmitClick(): void;
    /** 關閉忘記密碼視窗
     * @memberof ForgotPasswordComponent
     */
    onCloseClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ForgotPasswordComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ForgotPasswordComponent, "his-forgot-password", never, { "isVisibleForgot": { "alias": "isVisibleForgot"; "required": false; }; }, { "hideForgot": "hideForgot"; }, never, never, true, never>;
}
