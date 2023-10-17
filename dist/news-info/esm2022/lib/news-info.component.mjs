/* eslint-disable @angular-eslint/component-selector */
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from './news.service';
import { NewsListComponent } from './news-list/news-list.component';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { Router, RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '@his-base/shared';
import { FormsModule } from '@angular/forms';
import { UserAccountService } from 'dist/service';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "primeng/fieldset";
import * as i3 from "primeng/button";
import * as i4 from "primeng/avatar";
import * as i5 from "@ngx-translate/core";
import * as i6 from "@angular/forms";
export class NewsInfoComponent {
    constructor() {
        /** 使用computed變數儲存各最新消息的資訊
         *  @memberof NewsInfoComponent
         */
        this.news = computed(() => this.newsService.originalNews());
        this.normalNews = computed(() => this.newsService.normalNews());
        this.toDoList = computed(() => this.newsService.toDoList());
        this.checkedNormalNews = computed(() => this.newsService.checkedNormalNews());
        this.checkedToDoList = computed(() => this.newsService.checkedToDoList());
        /** 使用者進行查詢所需的查詢式
         *  @memberof NewsInfoComponent
         */
        this.query = '';
        this.newsService = inject(NewsService);
        this.sharedService = inject(SharedService);
        this.httpClient = inject(HttpClient);
        this.userAccountService = inject(UserAccountService);
        this.#router = inject(Router);
    }
    #router;
    /** 跳轉到上一頁
     *  @memberof NewsInfoComponent
     */
    onBackClick() {
        window.history.back();
    }
    /** 跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
     *  @memberof NewsInfoComponent
     */
    onNavNewsClick(appUrl, sharedData) {
        const key = this.sharedService.setValue(sharedData);
        this.#router.navigate([appUrl], { state: { token: key } });
    }
    /** 搜尋標題包含query的最新消息
     *  @memberof NewsInfoComponent
     */
    filterSubject() {
        this.newsService.filterSubject(this.query);
    }
    /** 清空搜尋列時回復到上一次取得最新消息的狀態
     *  @memberof NewsInfoComponent
     */
    filterReset() {
        this.newsService.filterReset();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsInfoComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: NewsInfoComponent, isStandalone: true, selector: "his-news-info", ngImport: i0, template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n    image=\"{{ userAccountService.userImage().image }}\"\n        styleClass=\"mr-2\"\n        size=\"xlarge\"\n        shape=\"circle\"\n      ></p-avatar>\n      <div class=\"title\">\n        {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n      </div>\n  </div>\n  <div class=\"toolbar-container\">\n      <div class=\"icon-container\">\n        <button\n          pButton\n          pRipple\n          type=\"button\"\n          icon=\"pi pi-angle-left\"\n          class=\"p-button-rounded p-button-secondary p-button-outlined\"\n          (click)=\"onBackClick()\"\n        ></button>\n        <div><h3 [innerText]=\"'\u6700\u65B0\u6D88\u606F'|translate\"></h3></div>\n      </div>\n      <div>\n        <span class=\"p-input-icon-left\" >\n          <i class=\"pi pi-search\"></i>\n          <input type=\"text\" pinputtext=\"\" [placeholder]=\"'\u641C\u5C0B'|translate\" class=\"p-inputtext p-component p-element\" [(ngModel)]=\"query\" (keyup)=\"filterSubject()\" (keyup.excape)=\"filterReset()\">\n        </span>\n      </div>\n  </div>\n  <div class=\"flex flex-column\">\n    <p-fieldset [legend]=\"'\u4EE3\u8FA6\u5DE5\u4F5C'|translate\" [toggleable]=\"true\" class=\"first\">\n      <ng-template pTemplate=\"expandicon\">\n        <div >\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"toDoList()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u516C\u544A\u8A0A\u606F'|translate\" [toggleable]=\"true\" class=\"second\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"normalNews()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u5B8C\u6210\u5DE5\u4F5C'|translate\" [toggleable]=\"true\" class=\"third\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"checkedToDoList()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u5DF2\u8B80\u8A0A\u606F'|translate\" [toggleable]=\"true\" class=\"fourth\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"checkedNormalNews()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n  </div>\n</div>\n\n\n", styles: [".top-bar-container{display:flex;flex-direction:row;align-items:center}.icon-container{display:flex;justify-content:space-between;align-items:center;gap:12px}.icon-container h3{font-size:1.5rem;font-style:normal;font-weight:700;line-height:2rem;letter-spacing:.03rem;color:var(--surface-on-surface)}.content-container{padding:32px;height:100%;gap:16px;display:flex;flex-direction:column;background-color:var(--surface-ground)}.flex-column{gap:26px}:host ::ng-deep p-fieldset .p-fieldset-toggleable .p-fieldset-legend{padding:0;margin-left:-1px;width:129px;transition:background-color .2s,color .2s,box-shadow .2s}:host ::ng-deep p-fieldset .p-fieldset-toggleable .p-fieldset-legend a{min-height:34px;padding:var(--spacing-xs) var(--spacing-md)}:host ::ng-deep p-fieldset .p-fieldset-legend-text{font-weight:700}:host ::ng-deep p-fieldset .p-fieldset .p-fieldset-content{padding:8px 0}:host ::ng-deep p-fieldset .p-fieldset-legend>a{flex-direction:row-reverse}:host ::ng-deep p-fieldset .p-fieldset.p-fieldset-toggleable .p-fieldset-legend a .p-fieldset-toggler{margin-right:0;margin-left:18px}:host ::ng-deep p-fieldset.first .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--tertiary-main)}:host ::ng-deep p-fieldset.first .p-fieldset-toggleable .p-fieldset-legend a{color:var(--white)}:host ::ng-deep p-fieldset.second .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--primary-main)}:host ::ng-deep p-fieldset.second .p-fieldset-toggleable .p-fieldset-legend a{color:#f6f6f6}:host ::ng-deep p-fieldset.third .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--surface-section)}:host ::ng-deep p-fieldset.third .p-fieldset-toggleable .p-fieldset-legend a{color:var(--surface-on-surface)}:host ::ng-deep .p-datatable{height:100%;background:#fff;font-style:normal;font-weight:400;line-height:20px;letter-spacing:.16px;color:var(--surface-on-surface)}:host ::ng-deep .p-datatable .p-datatable-tbody>tr{width:100%}:host ::ng-deep .p-datatable .p-datatable-tbody>tr:last-child>td{border-bottom:none}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td{padding:8px 0 8px 5px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:first-child{width:5%;padding-left:0;min-width:45px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:first-child .p-button{min-width:60px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:nth-child(2){width:10%;padding-left:14px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:last-child{width:10%;text-align:end}:host ::ng-deep .p-fieldset{border-radius:12px}:host ::ng-deep .p-fieldset .p-fieldset-content{padding:8px 0}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.toolbar-container{display:flex;flex-direction:row;width:100%;justify-content:space-between}.p-button{color:#fff;background:var(--primary-main);border:0 none;padding:4px 12px;font-size:1rem;transition:background-color .2s,border-color .2s,color .2s,box-shadow .2s,background-size .2s cubic-bezier(.64,.09,.08,1);border-radius:6px}.check-button{width:88px;height:32px;padding:4px,12px,4px,12px;border-radius:20px;border:1px;gap:4px}.p-input-icon-left{padding:0 3px 0 0;width:320px}.p-inputtext{width:100%}.pi{width:17.51px;height:17.51px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "component", type: NewsListComponent, selector: "his-news-list", inputs: ["news", "customTemplate"] }, { kind: "ngmodule", type: TableModule }, { kind: "directive", type: i1.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: FieldsetModule }, { kind: "component", type: i2.Fieldset, selector: "p-fieldset", inputs: ["legend", "toggleable", "collapsed", "style", "styleClass", "transitionOptions"], outputs: ["collapsedChange", "onBeforeToggle", "onAfterToggle"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i3.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "ngmodule", type: AvatarModule }, { kind: "component", type: i4.Avatar, selector: "p-avatar", inputs: ["label", "icon", "image", "size", "shape", "style", "styleClass", "ariaLabel", "ariaLabelledBy"], outputs: ["onImageError"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsInfoComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-news-info', standalone: true, imports: [CommonModule, NewsListComponent, TableModule, FieldsetModule, ButtonModule, AvatarModule, RouterOutlet, TranslateModule, FormsModule], template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n    image=\"{{ userAccountService.userImage().image }}\"\n        styleClass=\"mr-2\"\n        size=\"xlarge\"\n        shape=\"circle\"\n      ></p-avatar>\n      <div class=\"title\">\n        {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n      </div>\n  </div>\n  <div class=\"toolbar-container\">\n      <div class=\"icon-container\">\n        <button\n          pButton\n          pRipple\n          type=\"button\"\n          icon=\"pi pi-angle-left\"\n          class=\"p-button-rounded p-button-secondary p-button-outlined\"\n          (click)=\"onBackClick()\"\n        ></button>\n        <div><h3 [innerText]=\"'\u6700\u65B0\u6D88\u606F'|translate\"></h3></div>\n      </div>\n      <div>\n        <span class=\"p-input-icon-left\" >\n          <i class=\"pi pi-search\"></i>\n          <input type=\"text\" pinputtext=\"\" [placeholder]=\"'\u641C\u5C0B'|translate\" class=\"p-inputtext p-component p-element\" [(ngModel)]=\"query\" (keyup)=\"filterSubject()\" (keyup.excape)=\"filterReset()\">\n        </span>\n      </div>\n  </div>\n  <div class=\"flex flex-column\">\n    <p-fieldset [legend]=\"'\u5F85\u8FA6\u5DE5\u4F5C'|translate\" [toggleable]=\"true\" class=\"first\">\n      <ng-template pTemplate=\"expandicon\">\n        <div >\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"toDoList()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u516C\u544A\u8A0A\u606F'|translate\" [toggleable]=\"true\" class=\"second\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"normalNews()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u5B8C\u6210\u5DE5\u4F5C'|translate\" [toggleable]=\"true\" class=\"third\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"checkedToDoList()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u5DF2\u8B80\u8A0A\u606F'|translate\" [toggleable]=\"true\" class=\"fourth\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"checkedNormalNews()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n  </div>\n</div>\n\n\n", styles: [".top-bar-container{display:flex;flex-direction:row;align-items:center}.icon-container{display:flex;justify-content:space-between;align-items:center;gap:12px}.icon-container h3{font-size:1.5rem;font-style:normal;font-weight:700;line-height:2rem;letter-spacing:.03rem;color:var(--surface-on-surface)}.content-container{padding:32px;height:100%;gap:16px;display:flex;flex-direction:column;background-color:var(--surface-ground)}.flex-column{gap:26px}:host ::ng-deep p-fieldset .p-fieldset-toggleable .p-fieldset-legend{padding:0;margin-left:-1px;width:129px;transition:background-color .2s,color .2s,box-shadow .2s}:host ::ng-deep p-fieldset .p-fieldset-toggleable .p-fieldset-legend a{min-height:34px;padding:var(--spacing-xs) var(--spacing-md)}:host ::ng-deep p-fieldset .p-fieldset-legend-text{font-weight:700}:host ::ng-deep p-fieldset .p-fieldset .p-fieldset-content{padding:8px 0}:host ::ng-deep p-fieldset .p-fieldset-legend>a{flex-direction:row-reverse}:host ::ng-deep p-fieldset .p-fieldset.p-fieldset-toggleable .p-fieldset-legend a .p-fieldset-toggler{margin-right:0;margin-left:18px}:host ::ng-deep p-fieldset.first .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--tertiary-main)}:host ::ng-deep p-fieldset.first .p-fieldset-toggleable .p-fieldset-legend a{color:var(--white)}:host ::ng-deep p-fieldset.second .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--primary-main)}:host ::ng-deep p-fieldset.second .p-fieldset-toggleable .p-fieldset-legend a{color:#f6f6f6}:host ::ng-deep p-fieldset.third .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--surface-section)}:host ::ng-deep p-fieldset.third .p-fieldset-toggleable .p-fieldset-legend a{color:var(--surface-on-surface)}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.toolbar-container{display:flex;flex-direction:row;width:100%;justify-content:space-between}.p-button{color:#fff;background:var(--primary-main);border:0 none;padding:4px 12px;font-size:1rem;transition:background-color .2s,border-color .2s,color .2s,box-shadow .2s,background-size .2s cubic-bezier(.64,.09,.08,1);border-radius:6px}.check-button{width:88px;height:32px;padding:4px,12px,4px,12px;border-radius:20px;border:1px;gap:4px}.p-input-icon-left{padding:0 3px 0 0;width:320px}.p-inputtext{width:100%}.pi{width:17.51px;height:17.51px}\n"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy1pbmZvLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25ld3MtaW5mby9zcmMvbGliL25ld3MtaW5mby5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9uZXdzLWluZm8vc3JjL2xpYi9uZXdzLWluZm8uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsdURBQXVEO0FBQ3ZELE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxFQUFFLFFBQVEsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUMvRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFBO0FBQ25FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sY0FBYyxDQUFDOzs7Ozs7OztBQVNsRCxNQUFNLE9BQU8saUJBQWlCO0lBUDlCO1FBU0U7O1dBRUc7UUFDSCxTQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUN2RCxlQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUMzRCxhQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2RCxzQkFBaUIsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7UUFDekUsb0JBQWUsR0FBRyxRQUFRLENBQUMsR0FBRSxFQUFFLENBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBRW5FOztXQUVHO1FBQ0gsVUFBSyxHQUFHLEVBQUUsQ0FBQTtRQUVWLGdCQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLGtCQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RDLGVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDL0IsdUJBQWtCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEQsWUFBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQThCMUI7SUE5QkMsT0FBTyxDQUFrQjtJQUV6Qjs7T0FFRztJQUNILFdBQVc7UUFDVCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7T0FFRztJQUNILGNBQWMsQ0FBQyxNQUFhLEVBQUUsVUFBaUI7UUFDN0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxFQUFDLEtBQUssRUFBQyxFQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsYUFBYTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNqQyxDQUFDOzhHQWpEVSxpQkFBaUI7a0dBQWpCLGlCQUFpQix5RUN2QjlCLDA3R0F3R0EsKzRFRHJGWSxZQUFZLCtCQUFFLGlCQUFpQiwySEFBRSxXQUFXLHFJQUFFLGNBQWMsNFBBQUUsWUFBWSxzS0FBRSxZQUFZLGtPQUFlLGVBQWUsMkZBQUMsV0FBVzs7MkZBSWpJLGlCQUFpQjtrQkFQN0IsU0FBUzsrQkFDRSxlQUFlLGNBQ2IsSUFBSSxXQUNQLENBQUMsWUFBWSxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUMsZUFBZSxFQUFDLFdBQVcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEBhbmd1bGFyLWVzbGludC9jb21wb25lbnQtc2VsZWN0b3IgKi9cbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBpbmplY3QsIGNvbXB1dGVkLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZXdzU2VydmljZSB9IGZyb20gJy4vbmV3cy5zZXJ2aWNlJztcbmltcG9ydCB7IE5ld3NMaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9uZXdzLWxpc3QvbmV3cy1saXN0LmNvbXBvbmVudCdcbmltcG9ydCB7IFRhYmxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy90YWJsZSc7XG5pbXBvcnQgeyBGaWVsZHNldE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvZmllbGRzZXQnO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZXJPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQXZhdGFyTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hdmF0YXInO1xuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgU2hhcmVkU2VydmljZSB9IGZyb20gJ0BoaXMtYmFzZS9zaGFyZWQnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBVc2VyQWNjb3VudFNlcnZpY2UgfSBmcm9tICdkaXN0L3NlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdoaXMtbmV3cy1pbmZvJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTmV3c0xpc3RDb21wb25lbnQsIFRhYmxlTW9kdWxlLCBGaWVsZHNldE1vZHVsZSwgQnV0dG9uTW9kdWxlLCBBdmF0YXJNb2R1bGUsIFJvdXRlck91dGxldCxUcmFuc2xhdGVNb2R1bGUsRm9ybXNNb2R1bGVdLFxuICB0ZW1wbGF0ZVVybDogJy4vbmV3cy1pbmZvLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmV3cy1pbmZvLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmV3c0luZm9Db21wb25lbnR7XG5cbiAgLyoqIOS9v+eUqGNvbXB1dGVk6K6K5pW45YSy5a2Y5ZCE5pyA5paw5raI5oGv55qE6LOH6KiKXG4gICAqICBAbWVtYmVyb2YgTmV3c0luZm9Db21wb25lbnRcbiAgICovXG4gIG5ld3MgPSBjb21wdXRlZCgoKSA9PiB0aGlzLm5ld3NTZXJ2aWNlLm9yaWdpbmFsTmV3cygpKTtcbiAgbm9ybWFsTmV3cyA9IGNvbXB1dGVkKCgpID0+IHRoaXMubmV3c1NlcnZpY2Uubm9ybWFsTmV3cygpKTtcbiAgdG9Eb0xpc3QgPSBjb21wdXRlZCgoKSA9PiB0aGlzLm5ld3NTZXJ2aWNlLnRvRG9MaXN0KCkpO1xuICBjaGVja2VkTm9ybWFsTmV3cyA9IGNvbXB1dGVkKCgpID0+IHRoaXMubmV3c1NlcnZpY2UuY2hlY2tlZE5vcm1hbE5ld3MoKSk7XG4gIGNoZWNrZWRUb0RvTGlzdCA9IGNvbXB1dGVkKCgpPT50aGlzLm5ld3NTZXJ2aWNlLmNoZWNrZWRUb0RvTGlzdCgpKTtcblxuICAvKiog5L2/55So6ICF6YCy6KGM5p+l6Kmi5omA6ZyA55qE5p+l6Kmi5byPXG4gICAqICBAbWVtYmVyb2YgTmV3c0luZm9Db21wb25lbnRcbiAgICovXG4gIHF1ZXJ5ID0gJydcblxuICBuZXdzU2VydmljZSA9IGluamVjdChOZXdzU2VydmljZSk7XG4gIHNoYXJlZFNlcnZpY2UgPSBpbmplY3QoU2hhcmVkU2VydmljZSk7XG4gIGh0dHBDbGllbnQgPSBpbmplY3QoSHR0cENsaWVudClcbiAgdXNlckFjY291bnRTZXJ2aWNlID0gaW5qZWN0KFVzZXJBY2NvdW50U2VydmljZSk7XG4gICNyb3V0ZXIgPSBpbmplY3QoUm91dGVyKTtcblxuICAvKiog6Lez6L2J5Yiw5LiK5LiA6aCBXG4gICAqICBAbWVtYmVyb2YgTmV3c0luZm9Db21wb25lbnRcbiAgICovXG4gIG9uQmFja0NsaWNrKCk6dm9pZCB7XG4gICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuICB9XG5cbiAgLyoqIOi3s+i9ieWIsGFwcFVybOi3r+W+keeahOS9jee9ru+8jOS4puS9v+eUqHNoYXJlZFNlcnZpY2XlgrPpgIHos4foqIpcbiAgICogIEBtZW1iZXJvZiBOZXdzSW5mb0NvbXBvbmVudFxuICAgKi9cbiAgb25OYXZOZXdzQ2xpY2soYXBwVXJsOnN0cmluZywgc2hhcmVkRGF0YTpvYmplY3QpOnZvaWR7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5zaGFyZWRTZXJ2aWNlLnNldFZhbHVlKHNoYXJlZERhdGEpXG4gICAgdGhpcy4jcm91dGVyLm5hdmlnYXRlKFthcHBVcmxdLHtzdGF0ZTp7dG9rZW46a2V5fX0pO1xuICB9XG5cbiAgLyoqIOaQnOWwi+aomemhjOWMheWQq3F1ZXJ555qE5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c0luZm9Db21wb25lbnRcbiAgICovXG4gIGZpbHRlclN1YmplY3QoKXtcbiAgICB0aGlzLm5ld3NTZXJ2aWNlLmZpbHRlclN1YmplY3QodGhpcy5xdWVyeSk7XG4gIH1cblxuICAvKiog5riF56m65pCc5bCL5YiX5pmC5Zue5b6p5Yiw5LiK5LiA5qyh5Y+W5b6X5pyA5paw5raI5oGv55qE54uA5oWLXG4gICAqICBAbWVtYmVyb2YgTmV3c0luZm9Db21wb25lbnRcbiAgICovXG4gIGZpbHRlclJlc2V0KCl7XG4gICAgdGhpcy5uZXdzU2VydmljZS5maWx0ZXJSZXNldCgpO1xuICB9XG59XG4iLCI8IS0tIGVzbGludC1kaXNhYmxlIEBhbmd1bGFyLWVzbGludC90ZW1wbGF0ZS9lbGVtZW50cy1jb250ZW50IC0tPlxuPGRpdiBjbGFzcz1cImNvbnRlbnQtY29udGFpbmVyXCI+XG4gIDxkaXYgY2xhc3M9XCJ0b3AtYmFyLWNvbnRhaW5lclwiPlxuICAgIDxwLWF2YXRhclxuICAgIGltYWdlPVwie3sgdXNlckFjY291bnRTZXJ2aWNlLnVzZXJJbWFnZSgpLmltYWdlIH19XCJcbiAgICAgICAgc3R5bGVDbGFzcz1cIm1yLTJcIlxuICAgICAgICBzaXplPVwieGxhcmdlXCJcbiAgICAgICAgc2hhcGU9XCJjaXJjbGVcIlxuICAgICAgPjwvcC1hdmF0YXI+XG4gICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5cbiAgICAgICAge3sgdXNlckFjY291bnRTZXJ2aWNlLnVzZXJBY2NvdW50KCkudXNlckNvZGUuZGlzcGxheSB9fSx7eyfmraHov47lm57kvoYnfCB0cmFuc2xhdGV9fVxuICAgICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwidG9vbGJhci1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpY29uLWNvbnRhaW5lclwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgcEJ1dHRvblxuICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBpY29uPVwicGkgcGktYW5nbGUtbGVmdFwiXG4gICAgICAgICAgY2xhc3M9XCJwLWJ1dHRvbi1yb3VuZGVkIHAtYnV0dG9uLXNlY29uZGFyeSBwLWJ1dHRvbi1vdXRsaW5lZFwiXG4gICAgICAgICAgKGNsaWNrKT1cIm9uQmFja0NsaWNrKClcIlxuICAgICAgICA+PC9idXR0b24+XG4gICAgICAgIDxkaXY+PGgzIFtpbm5lclRleHRdPVwiJ+acgOaWsOa2iOaBryd8dHJhbnNsYXRlXCI+PC9oMz48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWlucHV0LWljb24tbGVmdFwiID5cbiAgICAgICAgICA8aSBjbGFzcz1cInBpIHBpLXNlYXJjaFwiPjwvaT5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwaW5wdXR0ZXh0PVwiXCIgW3BsYWNlaG9sZGVyXT1cIifmkJzlsIsnfHRyYW5zbGF0ZVwiIGNsYXNzPVwicC1pbnB1dHRleHQgcC1jb21wb25lbnQgcC1lbGVtZW50XCIgWyhuZ01vZGVsKV09XCJxdWVyeVwiIChrZXl1cCk9XCJmaWx0ZXJTdWJqZWN0KClcIiAoa2V5dXAuZXhjYXBlKT1cImZpbHRlclJlc2V0KClcIj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZmxleCBmbGV4LWNvbHVtblwiPlxuICAgIDxwLWZpZWxkc2V0IFtsZWdlbmRdPVwiJ+W+hei+puW3peS9nCd8dHJhbnNsYXRlXCIgW3RvZ2dsZWFibGVdPVwidHJ1ZVwiIGNsYXNzPVwiZmlyc3RcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJleHBhbmRpY29uXCI+XG4gICAgICAgIDxkaXYgPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGkgcGktY2hldnJvbi1kb3duXCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8bmctdGVtcGxhdGUgcFRlbXBsYXRlPVwiY29sbGFwc2VpY29uXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaSBwaS1jaGV2cm9uLXVwXCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8aGlzLW5ld3MtbGlzdFxuICAgICAgICBbbmV3c109XCJ0b0RvTGlzdCgpXCJcbiAgICAgICAgY2xhc3M9XCJuZXdzLWNvbnRhaW5lclwiXG4gICAgICA+PC9oaXMtbmV3cy1saXN0PlxuICAgIDwvcC1maWVsZHNldD5cblxuICAgIDxwLWZpZWxkc2V0IFtsZWdlbmRdPVwiJ+WFrOWRiuioiuaBryd8dHJhbnNsYXRlXCIgW3RvZ2dsZWFibGVdPVwidHJ1ZVwiIGNsYXNzPVwic2Vjb25kXCI+XG4gICAgICA8bmctdGVtcGxhdGUgcFRlbXBsYXRlPVwiZXhwYW5kaWNvblwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGkgcGktY2hldnJvbi1kb3duXCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8bmctdGVtcGxhdGUgcFRlbXBsYXRlPVwiY29sbGFwc2VpY29uXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaSBwaS1jaGV2cm9uLXVwXCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8aGlzLW5ld3MtbGlzdFxuICAgICAgICBbbmV3c109XCJub3JtYWxOZXdzKClcIlxuICAgICAgICBjbGFzcz1cIm5ld3MtY29udGFpbmVyXCJcbiAgICAgID48L2hpcy1uZXdzLWxpc3Q+XG4gICAgPC9wLWZpZWxkc2V0PlxuXG4gICAgPHAtZmllbGRzZXQgW2xlZ2VuZF09XCIn5a6M5oiQ5bel5L2cJ3x0cmFuc2xhdGVcIiBbdG9nZ2xlYWJsZV09XCJ0cnVlXCIgY2xhc3M9XCJ0aGlyZFwiPlxuICAgICAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImV4cGFuZGljb25cIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpIHBpLWNoZXZyb24tZG93blwiPjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImNvbGxhcHNlaWNvblwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGkgcGktY2hldnJvbi11cFwiPjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPGhpcy1uZXdzLWxpc3RcbiAgICAgICAgW25ld3NdPVwiY2hlY2tlZFRvRG9MaXN0KClcIlxuICAgICAgICBjbGFzcz1cIm5ld3MtY29udGFpbmVyXCJcbiAgICAgID48L2hpcy1uZXdzLWxpc3Q+XG4gICAgPC9wLWZpZWxkc2V0PlxuXG4gICAgPHAtZmllbGRzZXQgW2xlZ2VuZF09XCIn5bey6K6A6KiK5oGvJ3x0cmFuc2xhdGVcIiBbdG9nZ2xlYWJsZV09XCJ0cnVlXCIgY2xhc3M9XCJmb3VydGhcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJleHBhbmRpY29uXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaSBwaS1jaGV2cm9uLWRvd25cIj48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJjb2xsYXBzZWljb25cIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpIHBpLWNoZXZyb24tdXBcIj48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgIDxoaXMtbmV3cy1saXN0XG4gICAgICAgIFtuZXdzXT1cImNoZWNrZWROb3JtYWxOZXdzKClcIlxuICAgICAgICBjbGFzcz1cIm5ld3MtY29udGFpbmVyXCJcbiAgICAgID48L2hpcy1uZXdzLWxpc3Q+XG4gICAgPC9wLWZpZWxkc2V0PlxuICA8L2Rpdj5cbjwvZGl2PlxuXG5cbiJdfQ==
