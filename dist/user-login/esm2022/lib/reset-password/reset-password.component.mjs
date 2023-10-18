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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
        this.hideReset = new EventEmitter();
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
        this.#translateService = inject(TranslateService);
    }
    #resetPasswordService;
    #translateService;
    /** 初始化,與Nats連線，如果網址傳入之token無誤則可以進入重置密碼頁面
     * @memberof ResetPasswordComponent
     */
    async ngOnInit() {
        if (this.token) {
            await this.#resetPasswordService.connect();
            this.checkUserCode();
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
        this.hideReset.emit();
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
        this.hideReset.emit();
        this.router.navigate(['login']);
    }
    /** 點擊確定按鈕送出新密碼
     * @memberof ResetPasswordComponent
     */
    onSubmitClick() {
        if (this.checkPassword()) {
            history.replaceState('', '', 'login');
            this.isVisibleReset = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.#translateService.instant('重置成功') });
            this.#resetPasswordService.pubPassword(this.userCode, this.passwordHash);
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: this.#translateService.instant('請輸入相同密碼') });
        }
        this.password = '';
        this.passwordConfirm = '';
    }
    /** 檢查有無Usercode 如果得到的userCode是空值則不能進入重置密碼頁面
     * @memberof ResetPasswordComponent
     */
    checkUserCode() {
        this.#resetPasswordService.getUserCode(this.token).subscribe(x => {
            this.userCode = x;
            if (this.userCode === '') {
                history.replaceState('', '', 'login');
                this.messageService.add({ severity: 'error', summary: 'Error', detail: this.#translateService.instant('重置連結驗證失敗') });
            }
            else {
                this.isVisibleReset = true;
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: ResetPasswordComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.9", type: ResetPasswordComponent, isStandalone: true, selector: "his-reset-password", inputs: { isVisibleReset: "isVisibleReset", token: "token" }, outputs: { hideReset: "hideReset" }, ngImport: i0, template: "<p-dialog\n  class=\"profile\"\n  [(visible)]=\"isVisibleReset\"\n  [modal]=\"true\"\n  showEffect=\"fade\"\n  [breakpoints]=\"{ '960px': '75vw' }\"\n>\n<ng-template pTemplate=\"header\">\n  <div class=\"dialog-header\">\n    <span>{{'\u91CD\u7F6E\u5BC6\u78BC'|translate}}</span>\n    <button pButton pRipple type=\"button\" (click)=\"onCloseClick()\" icon=\"pi pi-times\" class=\"p-button-rounded\"> </button>\n  </div>\n</ng-template>\n  <div class=\"profileContent lg:col-12 mb-2 p-0 flex justify-content-center\">\n    <div class=\"fromList flex flex-wrap justify-content-center w-full\">\n        <div class=\"fromColumn flex\">\n          <h6>{{'\u65B0\u5BC6\u78BC'|translate}}</h6>\n            <p-password [(ngModel)]=\"password\" [placeholder]=\"'\u8ACB\u8F38\u5165\u65B0\u5BC6\u78BC'|translate\" [feedback]=\"true\" [toggleMask]=\"true\"></p-password>\n        </div>\n        <div class=\"fromColumn flex\">\n          <h6>{{'\u8ACB\u518D\u6B21\u8F38\u5165'| translate}}</h6>\n            <p-password [(ngModel)]=\"passwordConfirm\" [placeholder]=\"'\u8ACB\u518D\u6B21\u8F38\u5165'|translate\" [feedback]=\"false\" [toggleMask]=\"true\"></p-password>\n        </div>\n      <div>\u203B {{'\u8ACB\u6CE8\u610F\u8F38\u5165\u76F8\u540C\u5BC6\u78BC'|translate}}</div>\n    </div>\n  </div>\n  <ng-template pTemplate=\"footer\">\n    <button\n      pButton\n      pRipple\n      (click)=\"onCancelClick()\"\n      type=\"button\"\n      [label]=\"'\u53D6\u6D88'|translate\"\n      class=\"p-button-secondary\"\n    > </button>\n    <button\n      pButton\n      pRipple\n      (click)=\"onSubmitClick()\"\n      type=\"button\"\n      [label]=\"'\u78BA\u5B9A\u9001\u51FA'|translate\"\n    > </button>\n  </ng-template>\n</p-dialog>\n", styles: [":host ::ng-deep .p-dialog{width:25vw}:host ::ng-deep .p-dialog-content{padding:10%}:host ::ng-deep .p-dialog-header .dialog-header{display:flex;width:100%;justify-content:space-between;align-items:center}:host ::ng-deep .p-dialog-header-icon.p-dialog-header-close{display:none}:host ::ng-deep .p-password{width:100%}:host ::ng-deep .p-input-icon-right>.p-inputtext{width:100%}:host ::ng-deep .p-input-icon-right>.p-icon-wrapper{right:15px;cursor:pointer}.fromList{flex-direction:column;gap:8px}.fromList .fromColumn{flex-direction:column;gap:4px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: DialogModule }, { kind: "component", type: i1.Dialog, selector: "p-dialog", inputs: ["header", "draggable", "resizable", "positionLeft", "positionTop", "contentStyle", "contentStyleClass", "modal", "closeOnEscape", "dismissableMask", "rtl", "closable", "responsive", "appendTo", "breakpoints", "styleClass", "maskStyleClass", "showHeader", "breakpoint", "blockScroll", "autoZIndex", "baseZIndex", "minX", "minY", "focusOnShow", "maximizable", "keepInViewport", "focusTrap", "transitionOptions", "closeIcon", "closeAriaLabel", "closeTabindex", "minimizeIcon", "maximizeIcon", "visible", "style", "position"], outputs: ["onShow", "onHide", "visibleChange", "onResizeInit", "onResizeEnd", "onDragEnd", "onMaximize"] }, { kind: "directive", type: i2.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i4.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "ngmodule", type: InputTextModule }, { kind: "ngmodule", type: PasswordModule }, { kind: "component", type: i5.Password, selector: "p-password", inputs: ["ariaLabel", "ariaLabelledBy", "label", "disabled", "promptLabel", "mediumRegex", "strongRegex", "weakLabel", "mediumLabel", "maxLength", "strongLabel", "inputId", "feedback", "appendTo", "toggleMask", "inputStyleClass", "styleClass", "style", "inputStyle", "showTransitionOptions", "hideTransitionOptions", "autocomplete", "placeholder", "showClear"], outputs: ["onFocus", "onBlur", "onClear"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: ResetPasswordComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-reset-password', standalone: true, imports: [
                        CommonModule,
                        DialogModule,
                        FormsModule,
                        ButtonModule,
                        InputTextModule,
                        PasswordModule,
                        TranslateModule
                    ], template: "<p-dialog\n  class=\"profile\"\n  [(visible)]=\"isVisibleReset\"\n  [modal]=\"true\"\n  showEffect=\"fade\"\n  [breakpoints]=\"{ '960px': '75vw' }\"\n>\n<ng-template pTemplate=\"header\">\n  <div class=\"dialog-header\">\n    <span>{{'\u91CD\u7F6E\u5BC6\u78BC'|translate}}</span>\n    <button pButton pRipple type=\"button\" (click)=\"onCloseClick()\" icon=\"pi pi-times\" class=\"p-button-rounded\"> </button>\n  </div>\n</ng-template>\n  <div class=\"profileContent lg:col-12 mb-2 p-0 flex justify-content-center\">\n    <div class=\"fromList flex flex-wrap justify-content-center w-full\">\n        <div class=\"fromColumn flex\">\n          <h6>{{'\u65B0\u5BC6\u78BC'|translate}}</h6>\n            <p-password [(ngModel)]=\"password\" [placeholder]=\"'\u8ACB\u8F38\u5165\u65B0\u5BC6\u78BC'|translate\" [feedback]=\"true\" [toggleMask]=\"true\"></p-password>\n        </div>\n        <div class=\"fromColumn flex\">\n          <h6>{{'\u8ACB\u518D\u6B21\u8F38\u5165'| translate}}</h6>\n            <p-password [(ngModel)]=\"passwordConfirm\" [placeholder]=\"'\u8ACB\u518D\u6B21\u8F38\u5165'|translate\" [feedback]=\"false\" [toggleMask]=\"true\"></p-password>\n        </div>\n      <div>\u203B {{'\u8ACB\u6CE8\u610F\u8F38\u5165\u76F8\u540C\u5BC6\u78BC'|translate}}</div>\n    </div>\n  </div>\n  <ng-template pTemplate=\"footer\">\n    <button\n      pButton\n      pRipple\n      (click)=\"onCancelClick()\"\n      type=\"button\"\n      [label]=\"'\u53D6\u6D88'|translate\"\n      class=\"p-button-secondary\"\n    > </button>\n    <button\n      pButton\n      pRipple\n      (click)=\"onSubmitClick()\"\n      type=\"button\"\n      [label]=\"'\u78BA\u5B9A\u9001\u51FA'|translate\"\n    > </button>\n  </ng-template>\n</p-dialog>\n", styles: [":host ::ng-deep .p-dialog{width:25vw}:host ::ng-deep .p-dialog-content{padding:10%}:host ::ng-deep .p-dialog-header .dialog-header{display:flex;width:100%;justify-content:space-between;align-items:center}:host ::ng-deep .p-dialog-header-icon.p-dialog-header-close{display:none}:host ::ng-deep .p-password{width:100%}:host ::ng-deep .p-input-icon-right>.p-inputtext{width:100%}:host ::ng-deep .p-input-icon-right>.p-icon-wrapper{right:15px;cursor:pointer}.fromList{flex-direction:column;gap:8px}.fromList .fromColumn{flex-direction:column;gap:4px}\n"] }]
        }], propDecorators: { isVisibleReset: [{
                type: Input
            }], token: [{
                type: Input
            }], hideReset: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtcGFzc3dvcmQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdXNlci1sb2dpbi9zcmMvbGliL3Jlc2V0LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3VzZXItbG9naW4vc3JjL2xpYi9yZXNldC1wYXNzd29yZC9yZXNldC1wYXNzd29yZC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBMkQ7QUFDM0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7Ozs7QUFrQnhFLE1BQU0sT0FBTyxzQkFBc0I7SUFmbkM7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WTt3QkFDWixZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsWUFBWTt3QkFDWixlQUFlO3dCQUNmLGNBQWM7d0JBQ2QsZUFBZTtxQkFDeEI7OEJBVVEsY0FBYztzQkFBdEIsS0FBSztnQkFNRyxLQUFLO3NCQUFiLEtBQUs7Z0JBS0ksU0FBUztzQkFBbEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1pbmZlcnJhYmxlLXR5cGVzICovXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERpYWxvZ01vZHVsZSB9IGZyb20gJ3ByaW1lbmcvZGlhbG9nJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHsgSW5wdXRUZXh0TW9kdWxlIH0gZnJvbSAncHJpbWVuZy9pbnB1dHRleHQnO1xuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi4vbG9naW4uc2VydmljZSc7XG5pbXBvcnQgeyBQYXNzd29yZE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcGFzc3dvcmQnO1xuaW1wb3J0IHsgUmVzZXRQYXNzd29yZFNlcnZpY2UgfSBmcm9tICcuL3Jlc2V0LXBhc3N3b3JkLnNlcnZpY2UnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCAnQGFuZ3VsYXIvbG9jYWxpemUvaW5pdCc7XG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IFRyYW5zbGF0ZU1vZHVsZSwgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2hpcy1yZXNldC1wYXNzd29yZCcsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtcbiAgICAgICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgICAgIERpYWxvZ01vZHVsZSxcbiAgICAgICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICAgICAgQnV0dG9uTW9kdWxlLFxuICAgICAgICAgICAgSW5wdXRUZXh0TW9kdWxlLFxuICAgICAgICAgICAgUGFzc3dvcmRNb2R1bGUsXG4gICAgICAgICAgICBUcmFuc2xhdGVNb2R1bGVcbiAgXSxcbiAgdGVtcGxhdGVVcmw6ICcuL3Jlc2V0LXBhc3N3b3JkLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcmVzZXQtcGFzc3dvcmQuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBSZXNldFBhc3N3b3JkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3l7XG5cbiAgLyoqIOmHjeioreWvhueivOeVq+mdouaYr+WQpuWPr+imllxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIEBJbnB1dCgpIGlzVmlzaWJsZVJlc2V0ITogYm9vbGVhbjtcblxuICAvKiog6K2Y5YildG9rZW5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIEBJbnB1dCgpIHRva2VuITogc3RyaW5nO1xuXG4gIC8qKiDnmbzlsITpl5zplonph43nva7lr4bnorzoppbnqpfkuovku7ZcbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIEBPdXRwdXQoKSBoaWRlUmVzZXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqIOaWsOWvhueivFxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZENvbXBvbmVudFxuICAgKi9cbiAgcGFzc3dvcmQ6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiDlho3norroqo3mlrDlr4bnorxcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIHBhc3N3b3JkQ29uZmlybTogc3RyaW5nID0gJyc7XG5cbiAgLyoqIOW+nuW+jOerr+aLv+WIsOeahOS9v+eUqOiAheS7o+eivFxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZENvbXBvbmVudFxuICAgKi9cbiAgdXNlckNvZGU6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiDliqDlr4blvoznmoTmlrDlr4bnorxcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIHBhc3N3b3JkSGFzaDogc3RyaW5nID0gJydcblxuICByb3V0ZXIgPSBpbmplY3QoUm91dGVyKTtcbiAgbWVzc2FnZVNlcnZpY2UgPSBpbmplY3QoTWVzc2FnZVNlcnZpY2UpO1xuICBsb2dpblNlcnZpY2UgPSBpbmplY3QoTG9naW5TZXJ2aWNlKTtcbiAgI3Jlc2V0UGFzc3dvcmRTZXJ2aWNlID0gaW5qZWN0KFJlc2V0UGFzc3dvcmRTZXJ2aWNlKTtcbiAgI3RyYW5zbGF0ZVNlcnZpY2UgPSBpbmplY3QoVHJhbnNsYXRlU2VydmljZSlcblxuICAvKiog5Yid5aeL5YyWLOiIh05hdHPpgKPnt5rvvIzlpoLmnpzntrLlnYDlgrPlhaXkuYt0b2tlbueEoeiqpOWJh+WPr+S7pemAsuWFpemHjee9ruWvhueivOmggemdolxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZENvbXBvbmVudFxuICAgKi9cbiAgYXN5bmMgbmdPbkluaXQoKSB7XG4gICAgaWYodGhpcy50b2tlbil7XG4gICAgICBhd2FpdCB0aGlzLiNyZXNldFBhc3N3b3JkU2VydmljZS5jb25uZWN0KCk7XG4gICAgICB0aGlzLmNoZWNrVXNlckNvZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiog5pa36ZaLTmF0c+eahOmAo+e3mlxuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZENvbXBvbmVudFxuICAgKi9cbiAgYXN5bmMgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy9DYWxsZWQgb25jZSwgYmVmb3JlIHRoZSBpbnN0YW5jZSBpcyBkZXN0cm95ZWQuXG4gICAgLy9BZGQgJ2ltcGxlbWVudHMgT25EZXN0cm95JyB0byB0aGUgY2xhc3MuXG4gICAgYXdhaXQgdGhpcy4jcmVzZXRQYXNzd29yZFNlcnZpY2UuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqIOm7nuaTiumXnOmWiemHjee9ruWvhueivGRpYWxvZ1xuICAgKiBAbWVtYmVyb2YgUmVzZXRQYXNzd29yZENvbXBvbmVudFxuICAgKi9cbiAgb25DbG9zZUNsaWNrKCkge1xuICAgIHRoaXMuaGlkZVJlc2V0LmVtaXQoKTtcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJ2xvZ2luJ10pO1xuICB9XG5cbiAgLyoqIOmpl+itieWvhueivOiIh+WGjei8uOWFpeWvhueivOWFqeWAi+ashOS9jeeahOWAvOaYr+WQpuebuOWQjFxuICAgKiBAcmV0dXJuIHsqfSAge2Jvb2xlYW59XG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBjaGVja1Bhc3N3b3JkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhc3N3b3JkSGFzaCA9IHRoaXMubG9naW5TZXJ2aWNlLmdldEhhc2hQYXNzd29yZCh0aGlzLnBhc3N3b3JkKTtcbiAgICBjb25zdCBwYXNzd29yZENvbmZpcm1IYXNoID0gdGhpcy5sb2dpblNlcnZpY2UuZ2V0SGFzaFBhc3N3b3JkKHRoaXMucGFzc3dvcmRDb25maXJtKTtcbiAgICBpZihwYXNzd29yZEhhc2ggPT09IHBhc3N3b3JkQ29uZmlybUhhc2ggJiYgdGhpcy5wYXNzd29yZCAhPT0gJycpIHtcbiAgICAgIHRoaXMucGFzc3dvcmRIYXNoID0gcGFzc3dvcmRIYXNoO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiDpu57mk4rlj5bmtojmjInpiJVcbiAgICogQG1lbWJlcm9mIFJlc2V0UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIG9uQ2FuY2VsQ2xpY2soKSB7XG4gICAgdGhpcy5wYXNzd29yZCA9ICcnO1xuICAgIHRoaXMucGFzc3dvcmRDb25maXJtID0gJyc7XG4gICAgdGhpcy5oaWRlUmVzZXQuZW1pdCgpO1xuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnbG9naW4nXSk7XG4gIH1cblxuICAvKiog6bue5pOK56K65a6a5oyJ6YiV6YCB5Ye65paw5a+G56K8XG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBvblN1Ym1pdENsaWNrKCkge1xuICAgIGlmKHRoaXMuY2hlY2tQYXNzd29yZCgpKSB7XG4gICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSgnJywnJywnbG9naW4nKVxuICAgICAgdGhpcy5pc1Zpc2libGVSZXNldCA9IGZhbHNlXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmFkZCh7IHNldmVyaXR5OiAnc3VjY2VzcycsIHN1bW1hcnk6ICdTdWNjZXNzJywgZGV0YWlsOiB0aGlzLiN0cmFuc2xhdGVTZXJ2aWNlLmluc3RhbnQoJ+mHjee9ruaIkOWKnycpfSk7XG4gICAgICB0aGlzLiNyZXNldFBhc3N3b3JkU2VydmljZS5wdWJQYXNzd29yZCh0aGlzLnVzZXJDb2RlLCB0aGlzLnBhc3N3b3JkSGFzaCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5hZGQoeyBzZXZlcml0eTogJ2Vycm9yJywgc3VtbWFyeTogJ0Vycm9yJywgZGV0YWlsOiB0aGlzLiN0cmFuc2xhdGVTZXJ2aWNlLmluc3RhbnQoJ+iri+i8uOWFpeebuOWQjOWvhueivCcpfSk7XG4gICAgfVxuICAgIHRoaXMucGFzc3dvcmQgPSAnJztcbiAgICB0aGlzLnBhc3N3b3JkQ29uZmlybSA9ICcnO1xuICB9XG5cbiAgLyoqIOaqouafpeacieeEoVVzZXJjb2RlIOWmguaenOW+l+WIsOeahHVzZXJDb2Rl5piv56m65YC85YmH5LiN6IO96YCy5YWl6YeN572u5a+G56K86aCB6Z2iXG4gICAqIEBtZW1iZXJvZiBSZXNldFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBjaGVja1VzZXJDb2RlKCkge1xuICAgIHRoaXMuI3Jlc2V0UGFzc3dvcmRTZXJ2aWNlLmdldFVzZXJDb2RlKHRoaXMudG9rZW4pLnN1YnNjcmliZSh4ID0+IHtcbiAgICAgIHRoaXMudXNlckNvZGUgPSB4XG4gICAgICBpZih0aGlzLnVzZXJDb2RlID09PSAnJykge1xuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSgnJywnJywnbG9naW4nKVxuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmFkZCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3InLCBkZXRhaWw6IHRoaXMuI3RyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudCgn6YeN572u6YCj57WQ6amX6K2J5aSx5pWXJyl9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmlzVmlzaWJsZVJlc2V0ID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiIsIjxwLWRpYWxvZ1xuICBjbGFzcz1cInByb2ZpbGVcIlxuICBbKHZpc2libGUpXT1cImlzVmlzaWJsZVJlc2V0XCJcbiAgW21vZGFsXT1cInRydWVcIlxuICBzaG93RWZmZWN0PVwiZmFkZVwiXG4gIFticmVha3BvaW50c109XCJ7ICc5NjBweCc6ICc3NXZ3JyB9XCJcbj5cbjxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJoZWFkZXJcIj5cbiAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICA8c3Bhbj57eyfph43nva7lr4bnorwnfHRyYW5zbGF0ZX19PC9zcGFuPlxuICAgIDxidXR0b24gcEJ1dHRvbiBwUmlwcGxlIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwib25DbG9zZUNsaWNrKClcIiBpY29uPVwicGkgcGktdGltZXNcIiBjbGFzcz1cInAtYnV0dG9uLXJvdW5kZWRcIj4gPC9idXR0b24+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cInByb2ZpbGVDb250ZW50IGxnOmNvbC0xMiBtYi0yIHAtMCBmbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwiZnJvbUxpc3QgZmxleCBmbGV4LXdyYXAganVzdGlmeS1jb250ZW50LWNlbnRlciB3LWZ1bGxcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZyb21Db2x1bW4gZmxleFwiPlxuICAgICAgICAgIDxoNj57eyfmlrDlr4bnorwnfHRyYW5zbGF0ZX19PC9oNj5cbiAgICAgICAgICAgIDxwLXBhc3N3b3JkIFsobmdNb2RlbCldPVwicGFzc3dvcmRcIiBbcGxhY2Vob2xkZXJdPVwiJ+iri+i8uOWFpeaWsOWvhueivCd8dHJhbnNsYXRlXCIgW2ZlZWRiYWNrXT1cInRydWVcIiBbdG9nZ2xlTWFza109XCJ0cnVlXCI+PC9wLXBhc3N3b3JkPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZyb21Db2x1bW4gZmxleFwiPlxuICAgICAgICAgIDxoNj57eyfoq4vlho3mrKHovLjlhaUnfCB0cmFuc2xhdGV9fTwvaDY+XG4gICAgICAgICAgICA8cC1wYXNzd29yZCBbKG5nTW9kZWwpXT1cInBhc3N3b3JkQ29uZmlybVwiIFtwbGFjZWhvbGRlcl09XCIn6KuL5YaN5qyh6Ly45YWlJ3x0cmFuc2xhdGVcIiBbZmVlZGJhY2tdPVwiZmFsc2VcIiBbdG9nZ2xlTWFza109XCJ0cnVlXCI+PC9wLXBhc3N3b3JkPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDxkaXY+4oC7IHt7J+iri+azqOaEj+i8uOWFpeebuOWQjOWvhueivCd8dHJhbnNsYXRlfX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJmb290ZXJcIj5cbiAgICA8YnV0dG9uXG4gICAgICBwQnV0dG9uXG4gICAgICBwUmlwcGxlXG4gICAgICAoY2xpY2spPVwib25DYW5jZWxDbGljaygpXCJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgW2xhYmVsXT1cIiflj5bmtognfHRyYW5zbGF0ZVwiXG4gICAgICBjbGFzcz1cInAtYnV0dG9uLXNlY29uZGFyeVwiXG4gICAgPiA8L2J1dHRvbj5cbiAgICA8YnV0dG9uXG4gICAgICBwQnV0dG9uXG4gICAgICBwUmlwcGxlXG4gICAgICAoY2xpY2spPVwib25TdWJtaXRDbGljaygpXCJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgW2xhYmVsXT1cIifnorrlrprpgIHlh7onfHRyYW5zbGF0ZVwiXG4gICAgPiA8L2J1dHRvbj5cbiAgPC9uZy10ZW1wbGF0ZT5cbjwvcC1kaWFsb2c+XG4iXX0=