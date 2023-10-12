import * as i0 from '@angular/core';
import { inject, Injectable, EventEmitter, Component, Input, Output } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import jsSHA from 'jssha';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import * as i4$1 from 'primeng/dropdown';
import { DropdownModule } from 'primeng/dropdown';
import * as i5$2 from 'primeng/toast';
import { ToastModule } from 'primeng/toast';
import * as i4 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import * as i5$1 from 'primeng/password';
import { PasswordModule } from 'primeng/password';
import * as i3 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import * as i2 from 'primeng/api';
import { MessageService } from 'primeng/api';
import { SharedService } from '@his-base/shared';
import { LoginReq, UserToken, UserAccount } from '@his-viewmodel/app-portal/dist';
import * as i1 from 'primeng/dialog';
import { DialogModule } from 'primeng/dialog';
import * as i5 from 'primeng/inputtext';
import { InputTextModule } from 'primeng/inputtext';
import '@angular/localize/init';
import * as i6 from '@ngx-translate/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/* eslint-disable @typescript-eslint/ban-ts-comment */
class LoginService {
    #jetStreamWsService = inject(JetstreamWsService);
    /** 取得使用者權杖
     * @param {LoginReq} payload
     * @return {*}  {Promise<Msg>}
     * @memberof LoginService
     */
    getUserToken(payload) {
        // @ts-ignore
        // 需帶入指定的主題跟要傳遞的資料
        return this.#jetStreamWsService.request('UserAccount.GetUserToken', payload);
    }
    /** 加密密碼
     * @param {string} password
     * @return {*}  {string}
     * @memberof LoginService
     */
    getHashPassword(password) {
        const shaObj = new jsSHA('SHA3-256', 'TEXT', { encoding: 'UTF8' });
        shaObj.update(password);
        return shaObj.getHash('HEX');
    }
    /** 取得使用者帳號資訊
     * @param {string} payload
     * @return {*}  {Promise<UserAccount>}
     * @memberof LoginService
     */
    getUserAccount(payload) {
        return this.#jetStreamWsService.request('UserAccount.GetUserAccount', payload);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: LoginService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: LoginService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: LoginService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

const environment = {
    wsUrl: 'ws://localhost:8080'
};

class WsNatsService {
    /** 與Nats連接的Url
     * @type {string}
     * @memberof WsNatsService
     */
    #natsUrl = environment.wsUrl;
    #jetStreamWsService = inject(JetstreamWsService);
    /** 與Nats連接
     * @memberof WsNatsService
     */
    async connect() {
        await this.#jetStreamWsService.connect(this.#natsUrl);
    }
    /** 與Nats斷開連接
     * @memberof WsNatsService
     */
    async disconnect() {
        // 連線關閉前，會先將目前訂閱給排空
        await this.#jetStreamWsService.drain();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: WsNatsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: WsNatsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: WsNatsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class ForgotPasswordService {
    #jetStreamWsService = inject(JetstreamWsService);
    /** 向後端拿userMail
     * @param {string} userCode
     * @param {string} eMail
     * @return {*}  {Promise<boolean>}
     * @memberof ForgotPasswordService
     */
    getUserMail(userCode, eMail) {
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        return this.#jetStreamWsService.request('UserAccount.GetUserMail', { 'userCode': userCode, 'eMail': eMail });
    }
    /** 向後端publish發送email的訊息
     * @param {string} userCode
     * @param {string} eMail
     * @memberof ForgotPasswordService
     */
    async pubSendMail(userCode, eMail) {
        await this.#jetStreamWsService.publish('UserAccount.SendMail', { 'userCode': userCode, 'eMail': eMail });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ForgotPasswordService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ForgotPasswordService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ForgotPasswordService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class ForgotPasswordComponent {
    constructor() {
        /** 發射關閉忘記密碼畫面事件
         * @memberof ForgotPasswordComponent
         */
        this.hide = new EventEmitter();
        /** 帳號
         * @type {string}
         * @memberof ForgotPasswordComponent
         */
        this.userCode = '';
        /** 電子信箱
         * @type {string}
         * @memberof ForgotPasswordComponent
         */
        this.eMail = '';
        /** 後端回傳的使用者信箱
         * @type {string}
         * @memberof ForgotPasswordComponent
         */
        this.userMail = '';
        this.messageService = inject(MessageService);
        this.#forgotPasswordService = inject(ForgotPasswordService);
    }
    #forgotPasswordService;
    /** 點擊確定送出按鈕
     * @memberof ForgotPasswordComponent
     */
    onSubmitClick() {
        this.#forgotPasswordService.getUserMail(this.userCode, this.eMail).subscribe(x => {
            this.userMail = x;
            if (this.userMail !== this.eMail) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: '帳號或信箱不正確' });
            }
            else {
                this.#forgotPasswordService.pubSendMail(this.userCode, this.userMail);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: '重置連結已發送到信箱，請至信箱查收!' });
                this.hide.emit();
            }
            this.userCode = '';
            this.eMail = '';
        });
    }
    /** 關閉忘記密碼視窗
     * @memberof ForgotPasswordComponent
     */
    onCloseClick() {
        this.userCode = '';
        this.eMail = '';
        this.hide.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ForgotPasswordComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: ForgotPasswordComponent, isStandalone: true, selector: "his-forgot-password", inputs: { isVisibleForgot: "isVisibleForgot" }, outputs: { hide: "hide" }, ngImport: i0, template: "<p-dialog\n  class=\"profile\"\n  [(visible)]=\"isVisibleForgot\"\n  [modal]=\"true\"\n  showEffect=\"fade\"\n  [breakpoints]=\"{ '960px': '75vw' }\"\n>\n<ng-template pTemplate=\"header\">\n  <div class=\"dialog-header\">\n    <span [innerText]=\"'forget password'|translate\"></span>\n    <button pButton pRipple type=\"button\" (click)=\"onCloseClick()\" icon=\"pi pi-times\" class=\"p-button-rounded\"> </button>\n  </div>\n</ng-template>\n  <div class=\"profileContent lg:col-12 mb-2 p-0 flex justify-content-center\">\n    <div class=\"fromList flex flex-wrap justify-content-center w-full\">\n      <div class=\"fromColumn flex\">\n        <h6 [innerText]=\"'account'|translate\"></h6>\n        <input type=\"text\" pInputText [(ngModel)]=\"userCode\" />\n      </div>\n      <div class=\"fromColumn flex\">\n        <h6 [innerText]=\"'eMail'|translate\"></h6>\n        <input type=\"text\" pInputText [(ngModel)]=\"eMail\"/>\n      </div>\n      <div>\u203B \u8F38\u5165\u9A57\u8B49\u8CC7\u6599\u5C07\u6703\u6536\u5230\u4FEE\u6539\u5BC6\u78BC\u78BA\u8A8D\u4FE1</div>\n    </div>\n  </div>\n  <ng-template pTemplate=\"footer\">\n    <button\n      pButton\n      pRipple\n      (click)=\"onCloseClick()\"\n      type=\"button\"\n      [label]=\"'cancel'|translate\"\n      class=\"p-button-secondary\"\n    > </button>\n    <button\n      pButton\n      pRipple\n      (click)=\"onSubmitClick()\"\n      type=\"button\"\n      [label]=\"'submit'|translate\"\n    > </button>\n  </ng-template>\n</p-dialog>\n", styles: [":host ::ng-deep .p-dialog{width:25vw}:host ::ng-deep .p-dialog-content{padding:10%}:host ::ng-deep .p-dialog-header .dialog-header{display:flex;width:100%;justify-content:space-between;align-items:center}:host ::ng-deep .p-dialog-header-icon.p-dialog-header-close{display:none}.fromList{flex-direction:column;gap:8px}.fromList .fromColumn{flex-direction:column;gap:4px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: DialogModule }, { kind: "component", type: i1.Dialog, selector: "p-dialog", inputs: ["header", "draggable", "resizable", "positionLeft", "positionTop", "contentStyle", "contentStyleClass", "modal", "closeOnEscape", "dismissableMask", "rtl", "closable", "responsive", "appendTo", "breakpoints", "styleClass", "maskStyleClass", "showHeader", "breakpoint", "blockScroll", "autoZIndex", "baseZIndex", "minX", "minY", "focusOnShow", "maximizable", "keepInViewport", "focusTrap", "transitionOptions", "closeIcon", "closeAriaLabel", "closeTabindex", "minimizeIcon", "maximizeIcon", "visible", "style", "position"], outputs: ["onShow", "onHide", "visibleChange", "onResizeInit", "onResizeEnd", "onDragEnd", "onMaximize"] }, { kind: "directive", type: i2.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i4.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "ngmodule", type: InputTextModule }, { kind: "directive", type: i5.InputText, selector: "[pInputText]" }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ForgotPasswordComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-forgot-password', standalone: true, imports: [
                        CommonModule,
                        DialogModule,
                        FormsModule,
                        ButtonModule,
                        InputTextModule,
                        TranslateModule
                    ], template: "<p-dialog\n  class=\"profile\"\n  [(visible)]=\"isVisibleForgot\"\n  [modal]=\"true\"\n  showEffect=\"fade\"\n  [breakpoints]=\"{ '960px': '75vw' }\"\n>\n<ng-template pTemplate=\"header\">\n  <div class=\"dialog-header\">\n    <span [innerText]=\"'forget password'|translate\"></span>\n    <button pButton pRipple type=\"button\" (click)=\"onCloseClick()\" icon=\"pi pi-times\" class=\"p-button-rounded\"> </button>\n  </div>\n</ng-template>\n  <div class=\"profileContent lg:col-12 mb-2 p-0 flex justify-content-center\">\n    <div class=\"fromList flex flex-wrap justify-content-center w-full\">\n      <div class=\"fromColumn flex\">\n        <h6 [innerText]=\"'account'|translate\"></h6>\n        <input type=\"text\" pInputText [(ngModel)]=\"userCode\" />\n      </div>\n      <div class=\"fromColumn flex\">\n        <h6 [innerText]=\"'eMail'|translate\"></h6>\n        <input type=\"text\" pInputText [(ngModel)]=\"eMail\"/>\n      </div>\n      <div>\u203B \u8F38\u5165\u9A57\u8B49\u8CC7\u6599\u5C07\u6703\u6536\u5230\u4FEE\u6539\u5BC6\u78BC\u78BA\u8A8D\u4FE1</div>\n    </div>\n  </div>\n  <ng-template pTemplate=\"footer\">\n    <button\n      pButton\n      pRipple\n      (click)=\"onCloseClick()\"\n      type=\"button\"\n      [label]=\"'cancel'|translate\"\n      class=\"p-button-secondary\"\n    > </button>\n    <button\n      pButton\n      pRipple\n      (click)=\"onSubmitClick()\"\n      type=\"button\"\n      [label]=\"'submit'|translate\"\n    > </button>\n  </ng-template>\n</p-dialog>\n", styles: [":host ::ng-deep .p-dialog{width:25vw}:host ::ng-deep .p-dialog-content{padding:10%}:host ::ng-deep .p-dialog-header .dialog-header{display:flex;width:100%;justify-content:space-between;align-items:center}:host ::ng-deep .p-dialog-header-icon.p-dialog-header-close{display:none}.fromList{flex-direction:column;gap:8px}.fromList .fromColumn{flex-direction:column;gap:4px}\n"] }]
        }], propDecorators: { isVisibleForgot: [{
                type: Input
            }], hide: [{
                type: Output
            }] } });

/* eslint-disable @typescript-eslint/ban-ts-comment */
class ResetPasswordService {
    /** 與Nats連接的Url
     * @type {string}
     * @memberof ResetPasswordService
     */
    #natsUrl = environment.wsUrl;
    #jetStreamWsService = inject(JetstreamWsService);
    /** 以傳入的token至後端抓取使用者代號
     * @param {string} payload
     * @return {*}  {Promise<string>}
     * @memberof ResetPasswordService
     */
    getUserCode(payload) {
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        return this.#jetStreamWsService.request('UserAccount.GetUserCode', payload);
    }
    /** 將新密碼送至後端更新
     * @param {string} userCode
     * @param {string} passwordHash
     * @memberof ResetPasswordService
     */
    async pubPassword(userCode, passwordHash) {
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        await this.#jetStreamWsService.publish('UserAccount.UpdatePassword', { 'userCode': userCode, 'passwordHash': passwordHash });
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
        await this.#jetStreamWsService.drain();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ResetPasswordService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ResetPasswordService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ResetPasswordService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

/* eslint-disable @typescript-eslint/no-inferrable-types */
class ResetPasswordComponent {
    constructor() {
        /** 發射關閉重置密碼視窗事件
         * @memberof ResetPasswordComponent
         */
        this.hide = new EventEmitter();
        /** 發射重置密碼失敗事件
         * @memberof ResetPasswordComponent
         */
        this.authError = new EventEmitter();
        /** 新密碼
         * @type {string}
         * @memberof ResetPasswordComponent
         */
        this.password = '';
        /** 再確認新密碼
         * @type {string}
         * @memberof ResetPasswordComponent
         */
        this.passwordConfirm = '';
        /** 從後端拿到的使用者代碼
         * @type {string}
         * @memberof ResetPasswordComponent
         */
        this.userCode = '';
        /** 加密後的新密碼
         * @type {string}
         * @memberof ResetPasswordComponent
         */
        this.passwordHash = '';
        this.router = inject(Router);
        this.messageService = inject(MessageService);
        this.loginService = inject(LoginService);
        this.#resetPasswordService = inject(ResetPasswordService);
    }
    #resetPasswordService;
    /** 初始化,與Nats連線，如果網址傳入之token無誤則可以進入重置密碼頁面
     * @memberof ResetPasswordComponent
     */
    async ngOnInit() {
        if (this.token) {
            this.isVisibleReset = true;
            await this.#resetPasswordService.connect();
            this.catchAuthError();
        }
    }
    /** 斷開Nats的連線
     * @memberof ResetPasswordComponent
     */
    async ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        await this.#resetPasswordService.disconnect();
    }
    /** 點擊關閉重置密碼dialog
     * @memberof ResetPasswordComponent
     */
    onCloseClick() {
        this.hide.emit();
        this.router.navigate(['login']);
    }
    /** 驗證密碼與再輸入密碼兩個欄位的值是否相同
     * @return {*}  {boolean}
     * @memberof ResetPasswordComponent
     */
    checkPassword() {
        const passwordHash = this.loginService.getHashPassword(this.password);
        const passwordConfirmHash = this.loginService.getHashPassword(this.passwordConfirm);
        if (passwordHash === passwordConfirmHash && this.password !== '') {
            this.passwordHash = passwordHash;
            return true;
        }
        else
            return false;
    }
    /** 點擊取消按鈕
     * @memberof ResetPasswordComponent
     */
    onCancelClick() {
        this.password = '';
        this.passwordConfirm = '';
        this.hide.emit();
        this.router.navigate(['login']);
    }
    /** 點擊確定按鈕送出新密碼
     * @memberof ResetPasswordComponent
     */
    async onSubmitClick() {
        if (this.checkPassword()) {
            this.hide.emit();
            await this.#resetPasswordService.pubPassword(this.userCode, this.passwordHash);
            this.router.navigate(['login']);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: '密碼更改成功' });
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: '請輸入相同密碼' });
        }
        this.password = '';
        this.passwordConfirm = '';
    }
    /** 取得重置密碼授權 如果得到的userCode是空值則不能進入重置密碼頁面
     * @memberof ResetPasswordComponent
     */
    catchAuthError() {
        this.#resetPasswordService.getUserCode(this.token).subscribe(x => {
            this.userCode = x;
            if (this.userCode === '') {
                this.router.navigate(['login']);
                this.authError.emit();
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ResetPasswordComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: ResetPasswordComponent, isStandalone: true, selector: "his-reset-password", inputs: { isVisibleReset: "isVisibleReset", token: "token" }, outputs: { hide: "hide", authError: "authError" }, ngImport: i0, template: "<p-dialog\n  class=\"profile\"\n  [(visible)]=\"isVisibleReset\"\n  [modal]=\"true\"\n  showEffect=\"fade\"\n  [breakpoints]=\"{ '960px': '75vw' }\"\n>\n<ng-template pTemplate=\"header\">\n  <div class=\"dialog-header\">\n    <span [innerText]=\"'reset password'|translate\"></span>\n    <button pButton pRipple type=\"button\" (click)=\"onCloseClick()\" icon=\"pi pi-times\" class=\"p-button-rounded\"> </button>\n  </div>\n</ng-template>\n  <div class=\"profileContent lg:col-12 mb-2 p-0 flex justify-content-center\">\n    <div class=\"fromList flex flex-wrap justify-content-center w-full\">\n        <div class=\"fromColumn flex\">\n          <h6 [innerText]=\"'new password'|translate\"></h6>\n            <p-password [(ngModel)]=\"password\" [placeholder]=\"'Please enter new password'|translate\" [feedback]=\"true\" [toggleMask]=\"true\"></p-password>\n        </div>\n        <div class=\"fromColumn flex\">\n          <h6 [innerText]=\"'Please enter again'| translate\"></h6>\n            <p-password [(ngModel)]=\"passwordConfirm\" [placeholder]=\"'Please enter again'|translate\" [feedback]=\"false\" [toggleMask]=\"true\"></p-password>\n        </div>\n      <div>\u203B \u8ACB\u6CE8\u610F\u8F38\u5165\u76F8\u540C\u5BC6\u78BC</div>\n    </div>\n  </div>\n  <ng-template pTemplate=\"footer\">\n    <button\n      pButton\n      pRipple\n      (click)=\"onCancelClick()\"\n      type=\"button\"\n      [label]=\"'cancel'|translate\"\n      class=\"p-button-secondary\"\n    > </button>\n    <button\n      pButton\n      pRipple\n      (click)=\"onSubmitClick()\"\n      type=\"button\"\n      [label]=\"'submit'|translate\"\n    > </button>\n  </ng-template>\n</p-dialog>\n", styles: [":host ::ng-deep .p-dialog{width:25vw}:host ::ng-deep .p-dialog-content{padding:10%}:host ::ng-deep .p-dialog-header .dialog-header{display:flex;width:100%;justify-content:space-between;align-items:center}:host ::ng-deep .p-dialog-header-icon.p-dialog-header-close{display:none}:host ::ng-deep .p-password{width:100%}:host ::ng-deep .p-input-icon-right>.p-inputtext{width:100%}:host ::ng-deep .p-input-icon-right>.p-icon-wrapper{right:15px;cursor:pointer}.fromList{flex-direction:column;gap:8px}.fromList .fromColumn{flex-direction:column;gap:4px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: DialogModule }, { kind: "component", type: i1.Dialog, selector: "p-dialog", inputs: ["header", "draggable", "resizable", "positionLeft", "positionTop", "contentStyle", "contentStyleClass", "modal", "closeOnEscape", "dismissableMask", "rtl", "closable", "responsive", "appendTo", "breakpoints", "styleClass", "maskStyleClass", "showHeader", "breakpoint", "blockScroll", "autoZIndex", "baseZIndex", "minX", "minY", "focusOnShow", "maximizable", "keepInViewport", "focusTrap", "transitionOptions", "closeIcon", "closeAriaLabel", "closeTabindex", "minimizeIcon", "maximizeIcon", "visible", "style", "position"], outputs: ["onShow", "onHide", "visibleChange", "onResizeInit", "onResizeEnd", "onDragEnd", "onMaximize"] }, { kind: "directive", type: i2.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i4.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "ngmodule", type: InputTextModule }, { kind: "ngmodule", type: PasswordModule }, { kind: "component", type: i5$1.Password, selector: "p-password", inputs: ["ariaLabel", "ariaLabelledBy", "label", "disabled", "promptLabel", "mediumRegex", "strongRegex", "weakLabel", "mediumLabel", "maxLength", "strongLabel", "inputId", "feedback", "appendTo", "toggleMask", "inputStyleClass", "styleClass", "style", "inputStyle", "showTransitionOptions", "hideTransitionOptions", "autocomplete", "placeholder", "showClear"], outputs: ["onFocus", "onBlur", "onClear"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ResetPasswordComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-reset-password', standalone: true, imports: [
                        CommonModule,
                        DialogModule,
                        FormsModule,
                        ButtonModule,
                        InputTextModule,
                        PasswordModule,
                        TranslateModule
                    ], template: "<p-dialog\n  class=\"profile\"\n  [(visible)]=\"isVisibleReset\"\n  [modal]=\"true\"\n  showEffect=\"fade\"\n  [breakpoints]=\"{ '960px': '75vw' }\"\n>\n<ng-template pTemplate=\"header\">\n  <div class=\"dialog-header\">\n    <span [innerText]=\"'reset password'|translate\"></span>\n    <button pButton pRipple type=\"button\" (click)=\"onCloseClick()\" icon=\"pi pi-times\" class=\"p-button-rounded\"> </button>\n  </div>\n</ng-template>\n  <div class=\"profileContent lg:col-12 mb-2 p-0 flex justify-content-center\">\n    <div class=\"fromList flex flex-wrap justify-content-center w-full\">\n        <div class=\"fromColumn flex\">\n          <h6 [innerText]=\"'new password'|translate\"></h6>\n            <p-password [(ngModel)]=\"password\" [placeholder]=\"'Please enter new password'|translate\" [feedback]=\"true\" [toggleMask]=\"true\"></p-password>\n        </div>\n        <div class=\"fromColumn flex\">\n          <h6 [innerText]=\"'Please enter again'| translate\"></h6>\n            <p-password [(ngModel)]=\"passwordConfirm\" [placeholder]=\"'Please enter again'|translate\" [feedback]=\"false\" [toggleMask]=\"true\"></p-password>\n        </div>\n      <div>\u203B \u8ACB\u6CE8\u610F\u8F38\u5165\u76F8\u540C\u5BC6\u78BC</div>\n    </div>\n  </div>\n  <ng-template pTemplate=\"footer\">\n    <button\n      pButton\n      pRipple\n      (click)=\"onCancelClick()\"\n      type=\"button\"\n      [label]=\"'cancel'|translate\"\n      class=\"p-button-secondary\"\n    > </button>\n    <button\n      pButton\n      pRipple\n      (click)=\"onSubmitClick()\"\n      type=\"button\"\n      [label]=\"'submit'|translate\"\n    > </button>\n  </ng-template>\n</p-dialog>\n", styles: [":host ::ng-deep .p-dialog{width:25vw}:host ::ng-deep .p-dialog-content{padding:10%}:host ::ng-deep .p-dialog-header .dialog-header{display:flex;width:100%;justify-content:space-between;align-items:center}:host ::ng-deep .p-dialog-header-icon.p-dialog-header-close{display:none}:host ::ng-deep .p-password{width:100%}:host ::ng-deep .p-input-icon-right>.p-inputtext{width:100%}:host ::ng-deep .p-input-icon-right>.p-icon-wrapper{right:15px;cursor:pointer}.fromList{flex-direction:column;gap:8px}.fromList .fromColumn{flex-direction:column;gap:4px}\n"] }]
        }], propDecorators: { isVisibleReset: [{
                type: Input
            }], token: [{
                type: Input
            }], hide: [{
                type: Output
            }], authError: [{
                type: Output
            }] } });

var branchesName = [
	"竹銘醫院"
];

var branchData = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: branchesName
});

/* eslint-disable @typescript-eslint/no-non-null-assertion */
class LoginComponent {
    constructor() {
        /** 院區選項
         * @type {string[]}
         * @memberof LoginComponent
         */
        this.branchesOption = [];
        /** 輸入的密碼
         * @memberof LoginComponent
         */
        this.password = '';
        /** 登入資訊
         * @type {LoginReq}
         * @memberof LoginComponent
         */
        this.loginReq = new LoginReq();
        /** 使用者權杖
         * @type {UserToken}
         * @memberof LoginComponent
         */
        this.userToken = new UserToken();
        /** 忘記密碼頁面顯示與否
         * @type {boolean}
         * @memberof LoginComponent
         */
        this.isVisibleForgot = false;
        /** 重置密碼頁面顯示與否
         * @type {boolean}
         * @memberof LoginComponent
         */
        this.isVisibleReset = false;
        /** 使用者帳號資訊
         * @type {UserAccount}
         * @memberof LoginComponent
         */
        this.userAccount = new UserAccount();
        this.messageService = inject(MessageService);
        this.router = inject(Router);
        this.#loginService = inject(LoginService);
        this.#wsNatsService = inject(WsNatsService);
        this.#sharedService = inject(SharedService);
        this.#translate = inject(TranslateService);
    }
    #loginService;
    #wsNatsService;
    #sharedService;
    #translate;
    /** 初始化登入畫面為淺色模式 以及與Nats連線
     * @memberof LoginComponent
     */
    async ngOnInit() {
        // this.#translate.setDefaultLang(`zh-Hant`)
        if (this.token) {
            this.isVisibleReset = true;
        }
        this.branchesOption = Object.values(branchData)[0];
        await this.#wsNatsService.connect();
        const themeLink = document.getElementById('theme-css');
        themeLink.href = 'app/styles/theme.css';
    }
    /** 點擊登入按鈕
     * @memberof LoginComponent
     */
    onLoginClick() {
        try {
            this.loginReq.passwordHash = this.#loginService.getHashPassword(this.password);
            this.#loginService.getUserToken(this.loginReq).subscribe(x => {
                this.userToken = x;
                this.checkUserToken(this.userToken);
            });
        }
        catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "登入失敗" });
        }
    }
    /** 檢查有無登入授權
     * @param {UserToken} userToken
     * @memberof LoginComponent
     */
    checkUserToken(userToken) {
        if (userToken.token !== '') {
            this.#sharedService.sharedValue = null;
            this.#loginService.getUserAccount(userToken.userCode.code).subscribe(x => {
                this.userAccount = x;
                const key = this.#sharedService.setValue(this.userAccount);
                this.router.navigate(['/home'], { state: { token: key } });
            });
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: '帳號或密碼錯誤' });
        }
    }
    /** 點擊忘記密碼
     * @memberof LoginComponent
     */
    onForgotClick() {
        this.isVisibleForgot = true;
    }
    /** 關閉忘記密碼視窗
     * @memberof LoginComponent
     */
    onHideForgot() {
        this.isVisibleForgot = false;
    }
    /** 關閉重置密碼視窗
     * @memberof LoginComponent
     */
    onHideReset() {
        this.isVisibleReset = false;
    }
    /** 重置連結驗證失敗
     * @memberof LoginComponent
     */
    onAuthError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '重置連結驗證失敗' });
        this.isVisibleReset = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: LoginComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: LoginComponent, isStandalone: true, selector: "his-login", inputs: { token: "token" }, providers: [MessageService], ngImport: i0, template: "<div class=\"login-page-container\">\n  <div class=\"login-container\">\n    <div class=\"welcome-container\">\n    <div class=\"welcome-style\">Welcome!</div>\n  </div>\n    <div class=\"logo-container\">\n      <img src=\"assets/companyLogo.png\" alt=\"Image\" />\n    </div>\n\n    <div class=\"title-style\">\u96F2\u884C\u81F3\u5584\u91AB\u7642\u7CFB\u7D71</div>\n\n\n    <div class=\"form-container\">\n      <div class=\"input-text\">\n        <label class=\"input-label\" htmlFor=\"branchSelector\" [innerText]=\"'branch' | translate\"></label>\n        <p-dropdown\n          id=\"branchSelector\"\n          [options]=\"branchesOption\"\n          [(ngModel)]=\"loginReq.orgNo\"\n          [placeholder]=\"'Please select branch' | translate\"\n        >\n      </p-dropdown>\n      </div>\n      <div class=\"input-text\">\n        <label class=\"input-label\" htmlFor=\"UserName\" [innerText]=\"'account' | translate\"></label>\n        <input\n          pInputText\n          id=\"UserName\"\n          type=\"text\"\n          [placeholder]=\"'Please enter account' | translate\"\n          [(ngModel)]=\"loginReq.userCode.code\"\n          class=\"p-inputtext p-element p-component\"\n        />\n      </div>\n      <div class=\"input-text\">\n        <label class=\"input-label\" htmlFor=\"UserName\" [innerText]=\"'password' | translate\"></label>\n        <p-password\n          id=\"password\"\n          [placeholder]=\"'Please enter password' | translate\"\n          [(ngModel)]=\"password\"\n          [feedback]=\"false\"\n          (keyup.enter)=\"onLoginClick()\"\n          class=\"p-fluid\"\n        ></p-password>\n      </div>\n      <div class=\"button-group\">\n        <p-button [label]=\"'forget password' | translate\" styleClass=\"p-button-link\" (onClick)=\"onForgotClick()\"></p-button>\n        <button pButton pRipple-label [label]=\"'login' | translate\" (click)=\"onLoginClick()\"> </button>\n      </div>\n    </div>\n  </div>\n  <div class=\"image-container\">\n    <div class=\"image-box\">\n      <img src=\"assets/loginImage.png\" class=\"image-style\" alt=\"Image\" />\n    </div>\n  </div>\n</div>\n<p-toast></p-toast>\n\n<his-forgot-password (hide)=\"onHideForgot()\" [isVisibleForgot]=isVisibleForgot></his-forgot-password>\n<his-reset-password (hide)=\"onHideReset()\" (authError)=\"onAuthError()\" [isVisibleReset]=isVisibleReset\n                                                         [token]=\"token\"></his-reset-password>\n\n", styles: [":host ::ng-deep .p-dropdown-panel .p-dropdown-items .p-dropdown-item{padding:.5rem .75rem}:host ::ng-deep .p-dropdown,:host ::ng-deep .p-inputtext{width:100%;background:var(--white)!important}:host ::ng-deep .button-group{display:flex;gap:var(--spacing-lg)}:host ::ng-deep .button-group .p-button{max-width:142px;width:calc(50% - 8px)}:host ::ng-deep .button-group p-button{width:calc(50% - 8px)}:host ::ng-deep .button-group p-button .p-button{width:100%}:host ::ng-deep .p-dropdown{border-color:var(--outline);max-height:40px}:host ::ng-deep .p-dropdown .p-inputtext{padding:10px 16px}input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px white inset!important}.login-page-container{width:100%;height:100%;display:flex}.login-container{width:33%;height:100%;padding:var(--spacing-xxl);display:flex;flex-direction:column;align-items:center;background-color:var(--surface-card)}.welcome-container{position:relative;width:100%;display:flex}.welcome-style{color:#13141461;font-size:32px;font-style:normal;font-weight:700;line-height:44px;letter-spacing:1.28px}.logo-container{width:44.79%;object-fit:cover;padding:var(--spacing-xxl) 0}.logo-container img{width:100%;display:block}.form-container{width:52%;min-width:250px;display:flex;flex-direction:column;justify-content:center;gap:var(--spacing-lg)}.title-style{font-size:24px;font-style:normal;font-weight:700;line-height:32px;display:flex;justify-content:center;padding-bottom:var(--spacing-xxl)}.input-text{display:flex;flex-direction:column;gap:8px}.input-label{color:var(--surface-on-surface);font-size:20px;font-style:normal;font-weight:700;line-height:28px;letter-spacing:.4px}.button-group{display:flex;justify-content:space-between;align-items:center;padding-top:var(--spacing-lg)}.image-container{width:67%;height:100%}.image-box{width:100%;height:100%}.image-style{width:100%;height:100%;object-fit:cover;display:block}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i4.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "component", type: i4.Button, selector: "p-button", inputs: ["type", "iconPos", "icon", "badge", "label", "disabled", "loading", "loadingIcon", "style", "styleClass", "badgeClass", "ariaLabel"], outputs: ["onClick", "onFocus", "onBlur"] }, { kind: "ngmodule", type: PasswordModule }, { kind: "component", type: i5$1.Password, selector: "p-password", inputs: ["ariaLabel", "ariaLabelledBy", "label", "disabled", "promptLabel", "mediumRegex", "strongRegex", "weakLabel", "mediumLabel", "maxLength", "strongLabel", "inputId", "feedback", "appendTo", "toggleMask", "inputStyleClass", "styleClass", "style", "inputStyle", "showTransitionOptions", "hideTransitionOptions", "autocomplete", "placeholder", "showClear"], outputs: ["onFocus", "onBlur", "onClear"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: ImageModule }, { kind: "ngmodule", type: DropdownModule }, { kind: "component", type: i4$1.Dropdown, selector: "p-dropdown", inputs: ["scrollHeight", "filter", "name", "style", "panelStyle", "styleClass", "panelStyleClass", "readonly", "required", "editable", "appendTo", "tabindex", "placeholder", "filterPlaceholder", "filterLocale", "inputId", "dataKey", "filterBy", "autofocus", "resetFilterOnHide", "dropdownIcon", "optionLabel", "optionValue", "optionDisabled", "optionGroupLabel", "optionGroupChildren", "autoDisplayFirst", "group", "showClear", "emptyFilterMessage", "emptyMessage", "lazy", "virtualScroll", "virtualScrollItemSize", "virtualScrollOptions", "overlayOptions", "ariaFilterLabel", "ariaLabel", "ariaLabelledBy", "filterMatchMode", "maxlength", "tooltip", "tooltipPosition", "tooltipPositionStyle", "tooltipStyleClass", "autofocusFilter", "disabled", "itemSize", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions", "filterValue", "options"], outputs: ["onChange", "onFilter", "onFocus", "onBlur", "onClick", "onShow", "onHide", "onClear", "onLazyLoad"] }, { kind: "ngmodule", type: ToastModule }, { kind: "component", type: i5$2.Toast, selector: "p-toast", inputs: ["key", "autoZIndex", "baseZIndex", "life", "style", "styleClass", "position", "preventOpenDuplicates", "preventDuplicates", "showTransformOptions", "hideTransformOptions", "showTransitionOptions", "hideTransitionOptions", "breakpoints"], outputs: ["onClose"] }, { kind: "component", type: ForgotPasswordComponent, selector: "his-forgot-password", inputs: ["isVisibleForgot"], outputs: ["hide"] }, { kind: "component", type: ResetPasswordComponent, selector: "his-reset-password", inputs: ["isVisibleReset", "token"], outputs: ["hide", "authError"] }, { kind: "ngmodule", type: InputTextModule }, { kind: "directive", type: i5.InputText, selector: "[pInputText]" }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: LoginComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-login', standalone: true, providers: [MessageService], imports: [CommonModule,
                        ButtonModule,
                        PasswordModule,
                        FormsModule,
                        RouterLink,
                        ImageModule,
                        DropdownModule,
                        ToastModule,
                        ForgotPasswordComponent,
                        ResetPasswordComponent,
                        InputTextModule,
                        TranslateModule
                    ], template: "<div class=\"login-page-container\">\n  <div class=\"login-container\">\n    <div class=\"welcome-container\">\n    <div class=\"welcome-style\">Welcome!</div>\n  </div>\n    <div class=\"logo-container\">\n      <img src=\"assets/companyLogo.png\" alt=\"Image\" />\n    </div>\n\n    <div class=\"title-style\">\u96F2\u884C\u81F3\u5584\u91AB\u7642\u7CFB\u7D71</div>\n\n\n    <div class=\"form-container\">\n      <div class=\"input-text\">\n        <label class=\"input-label\" htmlFor=\"branchSelector\" [innerText]=\"'branch' | translate\"></label>\n        <p-dropdown\n          id=\"branchSelector\"\n          [options]=\"branchesOption\"\n          [(ngModel)]=\"loginReq.orgNo\"\n          [placeholder]=\"'Please select branch' | translate\"\n        >\n      </p-dropdown>\n      </div>\n      <div class=\"input-text\">\n        <label class=\"input-label\" htmlFor=\"UserName\" [innerText]=\"'account' | translate\"></label>\n        <input\n          pInputText\n          id=\"UserName\"\n          type=\"text\"\n          [placeholder]=\"'Please enter account' | translate\"\n          [(ngModel)]=\"loginReq.userCode.code\"\n          class=\"p-inputtext p-element p-component\"\n        />\n      </div>\n      <div class=\"input-text\">\n        <label class=\"input-label\" htmlFor=\"UserName\" [innerText]=\"'password' | translate\"></label>\n        <p-password\n          id=\"password\"\n          [placeholder]=\"'Please enter password' | translate\"\n          [(ngModel)]=\"password\"\n          [feedback]=\"false\"\n          (keyup.enter)=\"onLoginClick()\"\n          class=\"p-fluid\"\n        ></p-password>\n      </div>\n      <div class=\"button-group\">\n        <p-button [label]=\"'forget password' | translate\" styleClass=\"p-button-link\" (onClick)=\"onForgotClick()\"></p-button>\n        <button pButton pRipple-label [label]=\"'login' | translate\" (click)=\"onLoginClick()\"> </button>\n      </div>\n    </div>\n  </div>\n  <div class=\"image-container\">\n    <div class=\"image-box\">\n      <img src=\"assets/loginImage.png\" class=\"image-style\" alt=\"Image\" />\n    </div>\n  </div>\n</div>\n<p-toast></p-toast>\n\n<his-forgot-password (hide)=\"onHideForgot()\" [isVisibleForgot]=isVisibleForgot></his-forgot-password>\n<his-reset-password (hide)=\"onHideReset()\" (authError)=\"onAuthError()\" [isVisibleReset]=isVisibleReset\n                                                         [token]=\"token\"></his-reset-password>\n\n", styles: [":host ::ng-deep .p-dropdown-panel .p-dropdown-items .p-dropdown-item{padding:.5rem .75rem}:host ::ng-deep .p-dropdown,:host ::ng-deep .p-inputtext{width:100%;background:var(--white)!important}:host ::ng-deep .button-group{display:flex;gap:var(--spacing-lg)}:host ::ng-deep .button-group .p-button{max-width:142px;width:calc(50% - 8px)}:host ::ng-deep .button-group p-button{width:calc(50% - 8px)}:host ::ng-deep .button-group p-button .p-button{width:100%}:host ::ng-deep .p-dropdown{border-color:var(--outline);max-height:40px}:host ::ng-deep .p-dropdown .p-inputtext{padding:10px 16px}input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px white inset!important}.login-page-container{width:100%;height:100%;display:flex}.login-container{width:33%;height:100%;padding:var(--spacing-xxl);display:flex;flex-direction:column;align-items:center;background-color:var(--surface-card)}.welcome-container{position:relative;width:100%;display:flex}.welcome-style{color:#13141461;font-size:32px;font-style:normal;font-weight:700;line-height:44px;letter-spacing:1.28px}.logo-container{width:44.79%;object-fit:cover;padding:var(--spacing-xxl) 0}.logo-container img{width:100%;display:block}.form-container{width:52%;min-width:250px;display:flex;flex-direction:column;justify-content:center;gap:var(--spacing-lg)}.title-style{font-size:24px;font-style:normal;font-weight:700;line-height:32px;display:flex;justify-content:center;padding-bottom:var(--spacing-xxl)}.input-text{display:flex;flex-direction:column;gap:8px}.input-label{color:var(--surface-on-surface);font-size:20px;font-style:normal;font-weight:700;line-height:28px;letter-spacing:.4px}.button-group{display:flex;justify-content:space-between;align-items:center;padding-top:var(--spacing-lg)}.image-container{width:67%;height:100%}.image-box{width:100%;height:100%}.image-style{width:100%;height:100%;object-fit:cover;display:block}\n"] }]
        }], propDecorators: { token: [{
                type: Input
            }] } });

/*
 * Public API Surface of login
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ForgotPasswordComponent, ForgotPasswordService, LoginComponent, LoginService, ResetPasswordComponent, ResetPasswordService };
//# sourceMappingURL=his-view-login.mjs.map
