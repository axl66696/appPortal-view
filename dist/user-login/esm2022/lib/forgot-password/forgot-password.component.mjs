import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ForgotPasswordService } from './forgot-password.service';
import '@angular/localize/init';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "primeng/dialog";
import * as i2 from "primeng/api";
import * as i3 from "@angular/forms";
import * as i4 from "primeng/button";
import * as i5 from "primeng/inputtext";
import * as i6 from "@ngx-translate/core";
export class ForgotPasswordComponent {
    constructor() {
        /** 發射關閉忘記密碼畫面事件
         * @memberof ForgotPasswordComponent
         */
        this.hideForgot = new EventEmitter();
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
        this.#translateService = inject(TranslateService);
    }
    #forgotPasswordService;
    #translateService;
    /** 點擊確定送出按鈕
     * @memberof ForgotPasswordComponent
     */
    onSubmitClick() {
        this.#forgotPasswordService.getUserMail(this.userCode, this.eMail).subscribe(x => {
            this.userMail = x;
            if (this.userMail !== this.eMail) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: this.#translateService.instant('帳號或信箱不正確') });
            }
            else {
                this.#forgotPasswordService.pubSendMail(this.userCode, this.userMail);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: this.#translateService.instant('重置連結已發送到信箱') });
                this.hideForgot.emit();
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
        this.hideForgot.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: ForgotPasswordComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: ForgotPasswordComponent, isStandalone: true, selector: "his-forgot-password", inputs: { isVisibleForgot: "isVisibleForgot" }, outputs: { hideForgot: "hideForgot" }, ngImport: i0, template: "<p-dialog\n  class=\"profile\"\n  [(visible)]=\"isVisibleForgot\"\n  [modal]=\"true\"\n  showEffect=\"fade\"\n  [breakpoints]=\"{ '960px': '75vw' }\"\n>\n<ng-template pTemplate=\"header\">\n  <div class=\"dialog-header\">\n    <span>{{'\u5FD8\u8A18\u5BC6\u78BC'|translate}}</span>\n    <button pButton pRipple type=\"button\" (click)=\"onCloseClick()\" icon=\"pi pi-times\" class=\"p-button-rounded\"> </button>\n  </div>\n</ng-template>\n  <div class=\"profileContent lg:col-12 mb-2 p-0 flex justify-content-center\">\n    <div class=\"fromList flex flex-wrap justify-content-center w-full\">\n      <div class=\"fromColumn flex\">\n        <h6>{{'\u5E33\u865F'|translate}}</h6>\n        <input type=\"text\" pInputText [(ngModel)]=\"userCode\" />\n      </div>\n      <div class=\"fromColumn flex\">\n        <h6>{{'\u96FB\u5B50\u4FE1\u7BB1'|translate}}</h6>\n        <input type=\"text\" pInputText [(ngModel)]=\"eMail\"/>\n      </div>\n      <div>\u203B {{'\u8F38\u5165\u9A57\u8B49\u8CC7\u6599\u5C07\u6703\u6536\u5230\u4FEE\u6539\u5BC6\u78BC\u78BA\u8A8D\u4FE1'|translate}}</div>\n    </div>\n  </div>\n  <ng-template pTemplate=\"footer\">\n    <button\n      pButton\n      pRipple\n      (click)=\"onCloseClick()\"\n      type=\"button\"\n      [label]=\"'\u53D6\u6D88'|translate\"\n      class=\"p-button-secondary\"\n    > </button>\n    <button\n      pButton\n      pRipple\n      (click)=\"onSubmitClick()\"\n      type=\"button\"\n      [label]=\"'\u78BA\u5B9A\u9001\u51FA'|translate\"\n    > </button>\n  </ng-template>\n</p-dialog>\n", styles: [":host ::ng-deep .p-dialog{width:25vw}:host ::ng-deep .p-dialog-content{padding:10%}:host ::ng-deep .p-dialog-header .dialog-header{display:flex;width:100%;justify-content:space-between;align-items:center}:host ::ng-deep .p-dialog-header-icon.p-dialog-header-close{display:none}.fromList{flex-direction:column;gap:8px}.fromList .fromColumn{flex-direction:column;gap:4px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: DialogModule }, { kind: "component", type: i1.Dialog, selector: "p-dialog", inputs: ["header", "draggable", "resizable", "positionLeft", "positionTop", "contentStyle", "contentStyleClass", "modal", "closeOnEscape", "dismissableMask", "rtl", "closable", "responsive", "appendTo", "breakpoints", "styleClass", "maskStyleClass", "showHeader", "breakpoint", "blockScroll", "autoZIndex", "baseZIndex", "minX", "minY", "focusOnShow", "maximizable", "keepInViewport", "focusTrap", "transitionOptions", "closeIcon", "closeAriaLabel", "closeTabindex", "minimizeIcon", "maximizeIcon", "visible", "style", "position"], outputs: ["onShow", "onHide", "visibleChange", "onResizeInit", "onResizeEnd", "onDragEnd", "onMaximize"] }, { kind: "directive", type: i2.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i4.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "ngmodule", type: InputTextModule }, { kind: "directive", type: i5.InputText, selector: "[pInputText]" }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
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
                    ], template: "<p-dialog\n  class=\"profile\"\n  [(visible)]=\"isVisibleForgot\"\n  [modal]=\"true\"\n  showEffect=\"fade\"\n  [breakpoints]=\"{ '960px': '75vw' }\"\n>\n<ng-template pTemplate=\"header\">\n  <div class=\"dialog-header\">\n    <span>{{'\u5FD8\u8A18\u5BC6\u78BC'|translate}}</span>\n    <button pButton pRipple type=\"button\" (click)=\"onCloseClick()\" icon=\"pi pi-times\" class=\"p-button-rounded\"> </button>\n  </div>\n</ng-template>\n  <div class=\"profileContent lg:col-12 mb-2 p-0 flex justify-content-center\">\n    <div class=\"fromList flex flex-wrap justify-content-center w-full\">\n      <div class=\"fromColumn flex\">\n        <h6>{{'\u5E33\u865F'|translate}}</h6>\n        <input type=\"text\" pInputText [(ngModel)]=\"userCode\" />\n      </div>\n      <div class=\"fromColumn flex\">\n        <h6>{{'\u96FB\u5B50\u4FE1\u7BB1'|translate}}</h6>\n        <input type=\"text\" pInputText [(ngModel)]=\"eMail\"/>\n      </div>\n      <div>\u203B {{'\u8F38\u5165\u9A57\u8B49\u8CC7\u6599\u5C07\u6703\u6536\u5230\u4FEE\u6539\u5BC6\u78BC\u78BA\u8A8D\u4FE1'|translate}}</div>\n    </div>\n  </div>\n  <ng-template pTemplate=\"footer\">\n    <button\n      pButton\n      pRipple\n      (click)=\"onCloseClick()\"\n      type=\"button\"\n      [label]=\"'\u53D6\u6D88'|translate\"\n      class=\"p-button-secondary\"\n    > </button>\n    <button\n      pButton\n      pRipple\n      (click)=\"onSubmitClick()\"\n      type=\"button\"\n      [label]=\"'\u78BA\u5B9A\u9001\u51FA'|translate\"\n    > </button>\n  </ng-template>\n</p-dialog>\n", styles: [":host ::ng-deep .p-dialog{width:25vw}:host ::ng-deep .p-dialog-content{padding:10%}:host ::ng-deep .p-dialog-header .dialog-header{display:flex;width:100%;justify-content:space-between;align-items:center}:host ::ng-deep .p-dialog-header-icon.p-dialog-header-close{display:none}.fromList{flex-direction:column;gap:8px}.fromList .fromColumn{flex-direction:column;gap:4px}\n"] }]
        }], propDecorators: { isVisibleForgot: [{
                type: Input
            }], hideForgot: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290LXBhc3N3b3JkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3VzZXItbG9naW4vc3JjL2xpYi9mb3Jnb3QtcGFzc3dvcmQvZm9yZ290LXBhc3N3b3JkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3VzZXItbG9naW4vc3JjL2xpYi9mb3Jnb3QtcGFzc3dvcmQvZm9yZ290LXBhc3N3b3JkLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7Ozs7QUFnQnhFLE1BQU0sT0FBTyx1QkFBdUI7SUFkcEM7UUFzQkU7O1dBRUc7UUFDTyxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUxQzs7O1dBR0c7UUFDSCxhQUFRLEdBQVcsRUFBRSxDQUFDO1FBRXRCOzs7V0FHRztRQUNILFVBQUssR0FBVyxFQUFFLENBQUM7UUFFbkI7OztXQUdHO1FBQ0gsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUV0QixtQkFBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN4QywyQkFBc0IsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN2RCxzQkFBaUIsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQTZCOUM7SUE5QkMsc0JBQXNCLENBQWlDO0lBQ3ZELGlCQUFpQixDQUE0QjtJQUU3Qzs7T0FFRztJQUNILGFBQWE7UUFDWCxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMvRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQTtZQUNqQixJQUFHLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDL0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQyxDQUFDO2FBQ3JIO2lCQUNJO2dCQUNILElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQ3BFLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDMUgsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUN4QjtZQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFBO0lBQ0YsQ0FBQztJQUVIOztPQUVHO0lBQ0gsWUFBWTtRQUNWLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekIsQ0FBQzs4R0E3RFUsdUJBQXVCO2tHQUF2Qix1QkFBdUIsc0tDekJwQyw2Z0RBNENBLDRhRDdCWSxZQUFZLDhCQUNaLFlBQVksaTBCQUNaLFdBQVcsOG1CQUNYLFlBQVksc0tBQ1osZUFBZSxtR0FDZixlQUFlOzsyRkFLZCx1QkFBdUI7a0JBZG5DLFNBQVM7K0JBQ0UscUJBQXFCLGNBQ25CLElBQUksV0FDUDt3QkFDQyxZQUFZO3dCQUNaLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsZUFBZTtxQkFDeEI7OEJBVVEsZUFBZTtzQkFBdkIsS0FBSztnQkFLSSxVQUFVO3NCQUFuQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERpYWxvZ01vZHVsZSB9IGZyb20gJ3ByaW1lbmcvZGlhbG9nJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHsgSW5wdXRUZXh0TW9kdWxlIH0gZnJvbSAncHJpbWVuZy9pbnB1dHRleHQnO1xuaW1wb3J0IHsgRm9yZ290UGFzc3dvcmRTZXJ2aWNlIH0gZnJvbSAnLi9mb3Jnb3QtcGFzc3dvcmQuc2VydmljZSc7XG5pbXBvcnQgJ0Bhbmd1bGFyL2xvY2FsaXplL2luaXQnO1xuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUsIFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnaGlzLWZvcmdvdC1wYXNzd29yZCcsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtcbiAgICAgICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgICAgIERpYWxvZ01vZHVsZSxcbiAgICAgICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICAgICAgQnV0dG9uTW9kdWxlLFxuICAgICAgICAgICAgSW5wdXRUZXh0TW9kdWxlLFxuICAgICAgICAgICAgVHJhbnNsYXRlTW9kdWxlXG4gIF0sXG4gIHRlbXBsYXRlVXJsOiAnLi9mb3Jnb3QtcGFzc3dvcmQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9mb3Jnb3QtcGFzc3dvcmQuY29tcG9uZW50LnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgRm9yZ290UGFzc3dvcmRDb21wb25lbnQge1xuXG4gIC8qKiDlv5joqJjlr4bnorznlavpnaLpoa/npLroiIflkKZcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBtZW1iZXJvZiBGb3Jnb3RQYXNzd29yZENvbXBvbmVudFxuICAgKi9cbiAgQElucHV0KCkgaXNWaXNpYmxlRm9yZ290ITogYm9vbGVhbjtcblxuICAvKiog55m85bCE6Zec6ZaJ5b+Y6KiY5a+G56K855Wr6Z2i5LqL5Lu2XG4gICAqIEBtZW1iZXJvZiBGb3Jnb3RQYXNzd29yZENvbXBvbmVudFxuICAgKi9cbiAgQE91dHB1dCgpIGhpZGVGb3Jnb3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqIOW4s+iZn1xuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAbWVtYmVyb2YgRm9yZ290UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIHVzZXJDb2RlOiBzdHJpbmcgPSAnJztcblxuICAvKiog6Zu75a2Q5L+h566xXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBtZW1iZXJvZiBGb3Jnb3RQYXNzd29yZENvbXBvbmVudFxuICAgKi9cbiAgZU1haWw6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiDlvoznq6/lm57lgrPnmoTkvb/nlKjogIXkv6HnrrFcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIEZvcmdvdFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICB1c2VyTWFpbDogc3RyaW5nID0gJyc7XG5cbiAgbWVzc2FnZVNlcnZpY2UgPSBpbmplY3QoTWVzc2FnZVNlcnZpY2UpO1xuICAjZm9yZ290UGFzc3dvcmRTZXJ2aWNlID0gaW5qZWN0KEZvcmdvdFBhc3N3b3JkU2VydmljZSk7XG4gICN0cmFuc2xhdGVTZXJ2aWNlID0gaW5qZWN0KFRyYW5zbGF0ZVNlcnZpY2UpO1xuXG4gIC8qKiDpu57mk4rnorrlrprpgIHlh7rmjInpiJVcbiAgICogQG1lbWJlcm9mIEZvcmdvdFBhc3N3b3JkQ29tcG9uZW50XG4gICAqL1xuICBvblN1Ym1pdENsaWNrKCkge1xuICAgIHRoaXMuI2ZvcmdvdFBhc3N3b3JkU2VydmljZS5nZXRVc2VyTWFpbCh0aGlzLnVzZXJDb2RlLCB0aGlzLmVNYWlsKS5zdWJzY3JpYmUoeCA9PiB7XG4gICAgICB0aGlzLnVzZXJNYWlsID0geFxuICAgICAgaWYodGhpcy51c2VyTWFpbCAhPT0gdGhpcy5lTWFpbCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmFkZCh7IHNldmVyaXR5OiAnZXJyb3InLCBzdW1tYXJ5OiAnRXJyb3InLCBkZXRhaWw6IHRoaXMuI3RyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudCgn5biz6Jmf5oiW5L+h566x5LiN5q2j56K6Jyl9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLiNmb3Jnb3RQYXNzd29yZFNlcnZpY2UucHViU2VuZE1haWwodGhpcy51c2VyQ29kZSx0aGlzLnVzZXJNYWlsKVxuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmFkZCh7IHNldmVyaXR5OiAnc3VjY2VzcycsIHN1bW1hcnk6ICdTdWNjZXNzJywgZGV0YWlsOiB0aGlzLiN0cmFuc2xhdGVTZXJ2aWNlLmluc3RhbnQoJ+mHjee9rumAo+e1kOW3sueZvOmAgeWIsOS/oeeusScpfSk7XG4gICAgICAgIHRoaXMuaGlkZUZvcmdvdC5lbWl0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLnVzZXJDb2RlID0gJyc7XG4gICAgICB0aGlzLmVNYWlsID0gJyc7XG4gICAgfSlcbiAgICB9XG5cbiAgLyoqIOmXnOmWieW/mOiomOWvhueivOimlueql1xuICAgKiBAbWVtYmVyb2YgRm9yZ290UGFzc3dvcmRDb21wb25lbnRcbiAgICovXG4gIG9uQ2xvc2VDbGljaygpIHtcbiAgICB0aGlzLnVzZXJDb2RlID0gJyc7XG4gICAgdGhpcy5lTWFpbCA9ICcnO1xuICAgIHRoaXMuaGlkZUZvcmdvdC5lbWl0KCk7XG4gIH1cbn1cbiIsIjxwLWRpYWxvZ1xuICBjbGFzcz1cInByb2ZpbGVcIlxuICBbKHZpc2libGUpXT1cImlzVmlzaWJsZUZvcmdvdFwiXG4gIFttb2RhbF09XCJ0cnVlXCJcbiAgc2hvd0VmZmVjdD1cImZhZGVcIlxuICBbYnJlYWtwb2ludHNdPVwieyAnOTYwcHgnOiAnNzV2dycgfVwiXG4+XG48bmctdGVtcGxhdGUgcFRlbXBsYXRlPVwiaGVhZGVyXCI+XG4gIDxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgPHNwYW4+e3sn5b+Y6KiY5a+G56K8J3x0cmFuc2xhdGV9fTwvc3Bhbj5cbiAgICA8YnV0dG9uIHBCdXR0b24gcFJpcHBsZSB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cIm9uQ2xvc2VDbGljaygpXCIgaWNvbj1cInBpIHBpLXRpbWVzXCIgY2xhc3M9XCJwLWJ1dHRvbi1yb3VuZGVkXCI+IDwvYnV0dG9uPlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJwcm9maWxlQ29udGVudCBsZzpjb2wtMTIgbWItMiBwLTAgZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImZyb21MaXN0IGZsZXggZmxleC13cmFwIGp1c3RpZnktY29udGVudC1jZW50ZXIgdy1mdWxsXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZnJvbUNvbHVtbiBmbGV4XCI+XG4gICAgICAgIDxoNj57eyfluLPomZ8nfHRyYW5zbGF0ZX19PC9oNj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcElucHV0VGV4dCBbKG5nTW9kZWwpXT1cInVzZXJDb2RlXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImZyb21Db2x1bW4gZmxleFwiPlxuICAgICAgICA8aDY+e3sn6Zu75a2Q5L+h566xJ3x0cmFuc2xhdGV9fTwvaDY+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBJbnB1dFRleHQgWyhuZ01vZGVsKV09XCJlTWFpbFwiLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdj7igLsge3sn6Ly45YWl6amX6K2J6LOH5paZ5bCH5pyD5pS25Yiw5L+u5pS55a+G56K856K66KqN5L+hJ3x0cmFuc2xhdGV9fTwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImZvb3RlclwiPlxuICAgIDxidXR0b25cbiAgICAgIHBCdXR0b25cbiAgICAgIHBSaXBwbGVcbiAgICAgIChjbGljayk9XCJvbkNsb3NlQ2xpY2soKVwiXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIFtsYWJlbF09XCIn5Y+W5raIJ3x0cmFuc2xhdGVcIlxuICAgICAgY2xhc3M9XCJwLWJ1dHRvbi1zZWNvbmRhcnlcIlxuICAgID4gPC9idXR0b24+XG4gICAgPGJ1dHRvblxuICAgICAgcEJ1dHRvblxuICAgICAgcFJpcHBsZVxuICAgICAgKGNsaWNrKT1cIm9uU3VibWl0Q2xpY2soKVwiXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIFtsYWJlbF09XCIn56K65a6a6YCB5Ye6J3x0cmFuc2xhdGVcIlxuICAgID4gPC9idXR0b24+XG4gIDwvbmctdGVtcGxhdGU+XG48L3AtZGlhbG9nPlxuIl19