import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import '@angular/localize/init';
import { MessageService } from 'primeng/api';
import * as i0 from "@angular/core";
export declare class ResetPasswordComponent implements OnInit, OnDestroy {
    #private;
    /** 重設密碼畫面是否可視
     * @type {boolean}
     * @memberof ResetPasswordComponent
     */
    isVisibleReset: boolean;
    /** 識別token
     * @type {string}
     * @memberof ResetPasswordComponent
     */
    token: string;
    /** 發射關閉重置密碼視窗事件
     * @memberof ResetPasswordComponent
     */
    hideReset: EventEmitter<any>;
    /** 新密碼
     * @type {string}
     * @memberof ResetPasswordComponent
     */
    password: string;
    /** 再確認新密碼
     * @type {string}
     * @memberof ResetPasswordComponent
     */
    passwordConfirm: string;
    /** 從後端拿到的使用者代碼
     * @type {string}
     * @memberof ResetPasswordComponent
     */
    userCode: string;
    /** 加密後的新密碼
     * @type {string}
     * @memberof ResetPasswordComponent
     */
    passwordHash: string;
    router: Router;
    messageService: MessageService;
    loginService: LoginService;
    /** 初始化,與Nats連線，如果網址傳入之token無誤則可以進入重置密碼頁面
     * @memberof ResetPasswordComponent
     */
    ngOnInit(): Promise<void>;
    /** 斷開Nats的連線
     * @memberof ResetPasswordComponent
     */
    ngOnDestroy(): Promise<void>;
    /** 點擊關閉重置密碼dialog
     * @memberof ResetPasswordComponent
     */
    onCloseClick(): void;
    /** 驗證密碼與再輸入密碼兩個欄位的值是否相同
     * @return {*}  {boolean}
     * @memberof ResetPasswordComponent
     */
    checkPassword(): boolean;
    /** 點擊取消按鈕
     * @memberof ResetPasswordComponent
     */
    onCancelClick(): void;
    /** 點擊確定按鈕送出新密碼
     * @memberof ResetPasswordComponent
     */
    onSubmitClick(): void;
    /** 檢查有無Usercode 如果得到的userCode是空值則不能進入重置密碼頁面
     * @memberof ResetPasswordComponent
     */
    checkUserCode(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResetPasswordComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ResetPasswordComponent, "his-reset-password", never, { "isVisibleReset": { "alias": "isVisibleReset"; "required": false; }; "token": { "alias": "token"; "required": false; }; }, { "hideReset": "hideReset"; }, never, never, true, never>;
}
