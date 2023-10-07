import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserAccount, UserToken } from '@his-viewmodel/app-portal/dist';
import { LoginReq } from '@his-viewmodel/app-portal/dist';
import '@angular/localize/init';
import * as i0 from "@angular/core";
export declare class LoginComponent implements OnInit {
    #private;
    /** 加密識別token
     * @type {string}
     * @memberof LoginComponent
     */
    token: string;
    /** 院區選項
     * @type {string[]}
     * @memberof LoginComponent
     */
    branchesOption: string[];
    /** 輸入的密碼
     * @memberof LoginComponent
     */
    password: string;
    /** 登入資訊
     * @type {LoginReq}
     * @memberof LoginComponent
     */
    loginReq: LoginReq;
    /** 使用者權杖
     * @type {UserToken}
     * @memberof LoginComponent
     */
    userToken: UserToken;
    /** 忘記密碼頁面顯示與否
     * @type {boolean}
     * @memberof LoginComponent
     */
    isVisibleForgot: boolean;
    /** 重置密碼頁面顯示與否
     * @type {boolean}
     * @memberof LoginComponent
     */
    isVisibleReset: boolean;
    /** 使用者帳號資訊
     * @type {UserAccount}
     * @memberof LoginComponent
     */
    userAccount: UserAccount;
    messageService: MessageService;
    router: Router;
    /** 初始化登入畫面為淺色模式 以及與Nats連線
     * @memberof LoginComponent
     */
    ngOnInit(): Promise<void>;
    /** 點擊登入按鈕
     * @memberof LoginComponent
     */
    onLoginClick(): void;
    /** 檢查有無登入授權
     * @param {UserToken} userToken
     * @memberof LoginComponent
     */
    checkUserToken(userToken: UserToken): void;
    /** 點擊忘記密碼
     * @memberof LoginComponent
     */
    onForgotClick(): void;
    /** 關閉忘記密碼視窗
     * @memberof LoginComponent
     */
    onHideForgot(): void;
    /** 關閉重置密碼視窗
     * @memberof LoginComponent
     */
    onHideReset(): void;
    /** 重置連結驗證失敗
     * @memberof LoginComponent
     */
    onAuthError(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoginComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LoginComponent, "his-login", never, { "token": { "alias": "token"; "required": false; }; }, {}, never, never, true, never>;
}
