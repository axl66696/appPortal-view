/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../login.service';
import { PasswordModule } from 'primeng/password';
import { ResetPasswordService } from './reset-password.service';
import { Router } from '@angular/router';
import '@angular/localize/init';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "primeng/dialog";
import * as i2 from "primeng/api";
import * as i3 from "@angular/forms";
import * as i4 from "primeng/button";
import * as i5 from "primeng/password";
import * as i6 from "@ngx-translate/core";
export class ResetPasswordComponent {
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: ResetPasswordComponent, isStandalone: true, selector: "his-reset-password", inputs: { isVisibleReset: "isVisibleReset", token: "token" }, outputs: { hide: "hide", authError: "authError" }, ngImport: i0, template: "<p-dialog\n  class=\"profile\"\n  [(visible)]=\"isVisibleReset\"\n  [modal]=\"true\"\n  showEffect=\"fade\"\n  [breakpoints]=\"{ '960px': '75vw' }\"\n>\n<ng-template pTemplate=\"header\">\n  <div class=\"dialog-header\">\n    <span [innerText]=\"'reset password'|translate\"></span>\n    <button pButton pRipple type=\"button\" (click)=\"onCloseClick()\" icon=\"pi pi-times\" class=\"p-button-rounded\"> </button>\n  </div>\n</ng-template>\n  <div class=\"profileContent lg:col-12 mb-2 p-0 flex justify-content-center\">\n    <div class=\"fromList flex flex-wrap justify-content-center w-full\">\n        <div class=\"fromColumn flex\">\n          <h6 [innerText]=\"'new password'|translate\"></h6>\n            <p-password [(ngModel)]=\"password\" [placeholder]=\"'Please enter new password'|translate\" [feedback]=\"true\" [toggleMask]=\"true\"></p-password>\n        </div>\n        <div class=\"fromColumn flex\">\n          <h6 [innerText]=\"'Please enter again'| translate\"></h6>\n            <p-password [(ngModel)]=\"passwordConfirm\" [placeholder]=\"'Please enter again'|translate\" [feedback]=\"false\" [toggleMask]=\"true\"></p-password>\n        </div>\n      <div>\u203B \u8ACB\u6CE8\u610F\u8F38\u5165\u76F8\u540C\u5BC6\u78BC</div>\n    </div>\n  </div>\n  <ng-template pTemplate=\"footer\">\n    <button\n      pButton\n      pRipple\n      (click)=\"onCancelClick()\"\n      type=\"button\"\n      [label]=\"'cancel'|translate\"\n      class=\"p-button-secondary\"\n    > </button>\n    <button\n      pButton\n      pRipple\n      (click)=\"onSubmitClick()\"\n      type=\"button\"\n      [label]=\"'submit'|translate\"\n    > </button>\n  </ng-template>\n</p-dialog>\n", styles: [":host ::ng-deep .p-dialog{width:25vw}:host ::ng-deep .p-dialog-content{padding:10%}:host ::ng-deep .p-dialog-header .dialog-header{display:flex;width:100%;justify-content:space-between;align-items:center}:host ::ng-deep .p-dialog-header-icon.p-dialog-header-close{display:none}:host ::ng-deep .p-password{width:100%}:host ::ng-deep .p-input-icon-right>.p-inputtext{width:100%}:host ::ng-deep .p-input-icon-right>.p-icon-wrapper{right:15px;cursor:pointer}.fromList{flex-direction:column;gap:8px}.fromList .fromColumn{flex-direction:column;gap:4px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: DialogModule }, { kind: "component", type: i1.Dialog, selector: "p-dialog", inputs: ["header", "draggable", "resizable", "positionLeft", "positionTop", "contentStyle", "contentStyleClass", "modal", "closeOnEscape", "dismissableMask", "rtl", "closable", "responsive", "appendTo", "breakpoints", "styleClass", "maskStyleClass", "showHeader", "breakpoint", "blockScroll", "autoZIndex", "baseZIndex", "minX", "minY", "focusOnShow", "maximizable", "keepInViewport", "focusTrap", "transitionOptions", "closeIcon", "closeAriaLabel", "closeTabindex", "minimizeIcon", "maximizeIcon", "visible", "style", "position"], outputs: ["onShow", "onHide", "visibleChange", "onResizeInit", "onResizeEnd", "onDragEnd", "onMaximize"] }, { kind: "directive", type: i2.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i4.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "ngmodule", type: InputTextModule }, { kind: "ngmodule", type: PasswordModule }, { kind: "component", type: i5.Password, selector: "p-password", inputs: ["ariaLabel", "ariaLabelledBy", "label", "disabled", "promptLabel", "mediumRegex", "strongRegex", "weakLabel", "mediumLabel", "maxLength", "strongLabel", "inputId", "feedback", "appendTo", "toggleMask", "inputStyleClass", "styleClass", "style", "inputStyle", "showTransitionOptions", "hideTransitionOptions", "autocomplete", "placeholder", "showClear"], outputs: ["onFocus", "onBlur", "onClear"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtcGFzc3dvcmQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdXNlci1sb2dpbi9zcmMvbGliL3Jlc2V0LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3VzZXItbG9naW4vc3JjL2xpYi9yZXNldC1wYXNzd29yZC9yZXNldC1wYXNzd29yZC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBMkQ7QUFDM0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7Ozs7QUFrQnRELE1BQU0sT0FBTyxzQkFBc0I7SUFmbkM7UUE2QkU7O1dBRUc7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ZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8taW5mZXJyYWJsZS10eXBlcyAqL1xuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEaWFsb2dNb2R1bGUgfSBmcm9tICdwcmltZW5nL2RpYWxvZyc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYnV0dG9uJztcbmltcG9ydCB7IElucHV0VGV4dE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvaW5wdXR0ZXh0JztcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4uL2xvZ2luLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGFzc3dvcmRNb2R1bGUgfSBmcm9tICdwcmltZW5nL3Bhc3N3b3JkJztcbmltcG9ydCB7IFJlc2V0UGFzc3dvcmRTZXJ2aWNlIH0gZnJvbSAnLi9yZXNldC1wYXNzd29yZC5zZXJ2aWNlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgJ0Bhbmd1bGFyL2xvY2FsaXplL2luaXQnO1xuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdoaXMtcmVzZXQtcGFzc3dvcmQnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbXG4gICAgICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgICAgICBEaWFsb2dNb2R1bGUsXG4gICAgICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgICAgIEJ1dHRvbk1vZHVsZSxcbiAgICAgICAgICAgIElucHV0VGV4dE1vZHVsZSxcbiAgICAgICAgICAgIFBhc3N3b3JkTW9kdWxlLFxuICAgICAgICAgICAgVHJhbnNsYXRlTW9kdWxlXG4gIF0sXG4gIHRlbXBsYXRlVXJsOiAnLi9yZXNldC1wYXNzd29yZC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Jlc2V0LXBhc3N3b3JkLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUmVzZXRQYXNzd29yZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95e1xuXG4gIC8qKiDph43oqK3lr4bnorznlavpnaLmmK/lkKblj6/oppZcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBASW5wdXQoKSBpc1Zpc2libGVSZXNldCE6IGJvb2xlYW47XG5cbiAgLyoqIOitmOWIpXRva2VuXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBASW5wdXQoKSB0b2tlbiE6IHN0cmluZztcblxuICAvKiog55m85bCE6Zec6ZaJ6YeN572u5a+G56K86KaW56qX5LqL5Lu2XG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBAT3V0cHV0KCkgaGlkZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKiog55m85bCE6YeN572u5a+G56K85aSx5pWX5LqL5Lu2XG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBAT3V0cHV0KCkgYXV0aEVycm9yID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKiDmlrDlr4bnorxcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIHBhc3N3b3JkOiBzdHJpbmcgPSAnJztcblxuICAvKiog5YaN56K66KqN5paw5a+G56K8XG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBwYXNzd29yZENvbmZpcm06IHN0cmluZyA9ICcnO1xuXG4gIC8qKiDlvp7lvoznq6/mi7/liLDnmoTkvb/nlKjogIXku6PnorxcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIHVzZXJDb2RlOiBzdHJpbmcgPSAnJztcblxuICAvKiog5Yqg5a+G5b6M55qE5paw5a+G56K8XG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBwYXNzd29yZEhhc2g6IHN0cmluZyA9ICcnXG5cbiAgcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gIG1lc3NhZ2VTZXJ2aWNlID0gaW5qZWN0KE1lc3NhZ2VTZXJ2aWNlKTtcbiAgbG9naW5TZXJ2aWNlID0gaW5qZWN0KExvZ2luU2VydmljZSk7XG4gICNyZXNldFBhc3N3b3JkU2VydmljZSA9IGluamVjdChSZXNldFBhc3N3b3JkU2VydmljZSk7XG5cbiAgLyoqIOWIneWni+WMlizoiIdOYXRz6YCj57ea77yM5aaC5p6c57ay5Z2A5YKz5YWl5LmLdG9rZW7nhKHoqqTliYflj6/ku6XpgLLlhaXph43nva7lr4bnorzpoIHpnaJcbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIGFzeW5jIG5nT25Jbml0KCkge1xuICAgIGlmKHRoaXMudG9rZW4pe1xuICAgICAgdGhpcy5pc1Zpc2libGVSZXNldCA9IHRydWU7XG4gICAgICBhd2FpdCB0aGlzLiNyZXNldFBhc3N3b3JkU2VydmljZS5jb25uZWN0KCk7XG4gICAgICB0aGlzLmNhdGNoQXV0aEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIOaWt+mWi05hdHPnmoTpgKPnt5pcbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIGFzeW5jIG5nT25EZXN0cm95KCkge1xuICAgIC8vQ2FsbGVkIG9uY2UsIGJlZm9yZSB0aGUgaW5zdGFuY2UgaXMgZGVzdHJveWVkLlxuICAgIC8vQWRkICdpbXBsZW1lbnRzIE9uRGVzdHJveScgdG8gdGhlIGNsYXNzLlxuICAgIGF3YWl0IHRoaXMuI3Jlc2V0UGFzc3dvcmRTZXJ2aWNlLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8qKiDpu57mk4rpl5zplonph43nva7lr4bnorxkaWFsb2dcbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIG9uQ2xvc2VDbGljaygpIHtcbiAgICB0aGlzLmhpZGUuZW1pdCgpO1xuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnbG9naW4nXSk7XG4gIH1cblxuICAvKiog6amX6K2J5a+G56K86IiH5YaN6Ly45YWl5a+G56K85YWp5YCL5qyE5L2N55qE5YC85piv5ZCm55u45ZCMXG4gICAqIEByZXR1cm4geyp9ICB7Ym9vbGVhbn1cbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIGNoZWNrUGFzc3dvcmQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFzc3dvcmRIYXNoID0gdGhpcy5sb2dpblNlcnZpY2UuZ2V0SGFzaFBhc3N3b3JkKHRoaXMucGFzc3dvcmQpO1xuICAgIGNvbnN0IHBhc3N3b3JkQ29uZmlybUhhc2ggPSB0aGlzLmxvZ2luU2VydmljZS5nZXRIYXNoUGFzc3dvcmQodGhpcy5wYXNzd29yZENvbmZpcm0pO1xuICAgIGlmKHBhc3N3b3JkSGFzaCA9PT0gcGFzc3dvcmRDb25maXJtSGFzaCAmJiB0aGlzLnBhc3N3b3JkICE9PSAnJykge1xuICAgICAgdGhpcy5wYXNzd29yZEhhc2ggPSBwYXNzd29yZEhhc2g7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIOm7nuaTiuWPlua2iOaMiemIlVxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZENvbXBvbmVudFxuICAgKi9cbiAgb25DYW5jZWxDbGljaygpIHtcbiAgICB0aGlzLnBhc3N3b3JkID0gJyc7XG4gICAgdGhpcy5wYXNzd29yZENvbmZpcm0gPSAnJztcbiAgICB0aGlzLmhpZGUuZW1pdCgpO1xuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnbG9naW4nXSk7XG4gIH1cblxuICAvKiog6bue5pOK56K65a6a5oyJ6YiV6YCB5Ye65paw5a+G56K8XG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBhc3luYyBvblN1Ym1pdENsaWNrKCkge1xuICAgIGlmKHRoaXMuY2hlY2tQYXNzd29yZCgpKSB7XG4gICAgICB0aGlzLmhpZGUuZW1pdCgpO1xuICAgICAgYXdhaXQgdGhpcy4jcmVzZXRQYXNzd29yZFNlcnZpY2UucHViUGFzc3dvcmQodGhpcy51c2VyQ29kZSwgdGhpcy5wYXNzd29yZEhhc2gpO1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWydsb2dpbiddKTtcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UuYWRkKHsgc2V2ZXJpdHk6ICdzdWNjZXNzJywgc3VtbWFyeTogJ1N1Y2Nlc3MnLCBkZXRhaWw6ICflr4bnorzmm7TmlLnmiJDlip8nfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5hZGQoeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yJywgZGV0YWlsOiAn6KuL6Ly45YWl55u45ZCM5a+G56K8J30pO1xuICAgIH1cbiAgICB0aGlzLnBhc3N3b3JkID0gJyc7XG4gICAgdGhpcy5wYXNzd29yZENvbmZpcm0gPSAnJztcbiAgfVxuXG4gIC8qKiDlj5blvpfph43nva7lr4bnorzmjojmrIog5aaC5p6c5b6X5Yiw55qEdXNlckNvZGXmmK/nqbrlgLzliYfkuI3og73pgLLlhaXph43nva7lr4bnorzpoIHpnaJcbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIGNhdGNoQXV0aEVycm9yKCkge1xuICAgIHRoaXMuI3Jlc2V0UGFzc3dvcmRTZXJ2aWNlLmdldFVzZXJDb2RlKHRoaXMudG9rZW4pLnN1YnNjcmliZSh4PT57XG4gICAgICB0aGlzLnVzZXJDb2RlID0geFxuICAgICAgaWYodGhpcy51c2VyQ29kZSA9PT0gJycpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWydsb2dpbiddKTtcbiAgICAgICAgdGhpcy5hdXRoRXJyb3IuZW1pdCgpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiIsIjxwLWRpYWxvZ1xuICBjbGFzcz1cInByb2ZpbGVcIlxuICBbKHZpc2libGUpXT1cImlzVmlzaWJsZVJlc2V0XCJcbiAgW21vZGFsXT1cInRydWVcIlxuICBzaG93RWZmZWN0PVwiZmFkZVwiXG4gIFticmVha3BvaW50c109XCJ7ICc5NjBweCc6ICc3NXZ3JyB9XCJcbj5cbjxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJoZWFkZXJcIj5cbiAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICA8c3BhbiBbaW5uZXJUZXh0XT1cIidyZXNldCBwYXNzd29yZCd8dHJhbnNsYXRlXCI+PC9zcGFuPlxuICAgIDxidXR0b24gcEJ1dHRvbiBwUmlwcGxlIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwib25DbG9zZUNsaWNrKClcIiBpY29uPVwicGkgcGktdGltZXNcIiBjbGFzcz1cInAtYnV0dG9uLXJvdW5kZWRcIj4gPC9idXR0b24+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInByb2ZpbGVDb250ZW50IGxnOmNvbC0xMiBtYi0yIHAtMCBmbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwiZnJvbUxpc3QgZmxleCBmbGV4LXdyYXAganVzdGlmeS1jb250ZW50LWNlbnRlciB3LWZ1bGxcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZyb21Db2x1bW4gZmxleFwiPlxuICAgICAgICAgIDxoNiBbaW5uZXJUZXh0XT1cIiduZXcgcGFzc3dvcmQnfHRyYW5zbGF0ZVwiPjwvaDY+XG4gICAgICAgICAgICA8cC1wYXNzd29yZCBbKG5nTW9kZWwpXT1cInBhc3N3b3JkXCIgW3BsYWNlaG9sZGVyXT1cIidQbGVhc2UgZW50ZXIgbmV3IHBhc3N3b3JkJ3x0cmFuc2xhdGVcIiBbZmVlZGJhY2tdPVwidHJ1ZVwiIFt0b2dnbGVNYXNrXT1cInRydWVcIj48L3AtcGFzc3dvcmQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZnJvbUNvbHVtbiBmbGV4XCI+XG4gICAgICAgICAgPGg2IFtpbm5lclRleHRdPVwiJ1BsZWFzZSBlbnRlciBhZ2Fpbid8IHRyYW5zbGF0ZVwiPjwvaDY+XG4gICAgICAgICAgICA8cC1wYXNzd29yZCBbKG5nTW9kZWwpXT1cInBhc3N3b3JkQ29uZmlybVwiIFtwbGFjZWhvbGRlcl09XCInUGxlYXNlIGVudGVyIGFnYWluJ3x0cmFuc2xhdGVcIiBbZmVlZGJhY2tdPVwiZmFsc2VcIiBbdG9nZ2xlTWFza109XCJ0cnVlXCI+PC9wLXBhc3N3b3JkPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDxkaXY+4oC7IOiri+azqOaEj+i8uOWFpeebuOWQjOWvhueivDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImZvb3RlclwiPlxuICAgIDxidXR0b25cbiAgICAgIHBCdXR0b25cbiAgICAgIHBSaXBwbGVcbiAgICAgIChjbGljayk9XCJvbkNhbmNlbENsaWNrKClcIlxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBbbGFiZWxdPVwiJ2NhbmNlbCd8dHJhbnNsYXRlXCJcbiAgICAgIGNsYXNzPVwicC1idXR0b24tc2Vjb25kYXJ5XCJcbiAgICA+IDwvYnV0dG9uPlxuICAgIDxidXR0b25cbiAgICAgIHBCdXR0b25cbiAgICAgIHBSaXBwbGVcbiAgICAgIChjbGljayk9XCJvblN1Ym1pdENsaWNrKClcIlxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBbbGFiZWxdPVwiJ3N1Ym1pdCd8dHJhbnNsYXRlXCJcbiAgICA+IDwvYnV0dG9uPlxuICA8L25nLXRlbXBsYXRlPlxuPC9wLWRpYWxvZz5cbiJdfQ==