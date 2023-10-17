import * as i0 from '@angular/core';
import { signal, inject, Injectable, Component, Input, computed } from '@angular/core';
import { Subject, mergeMap } from 'rxjs';
import { JetstreamWsService, JSONCodec, SubscribeType } from '@his-base/jetstream-ws';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2 from 'primeng/table';
import { TableModule } from 'primeng/table';
import * as i4 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import * as i5 from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterOutlet } from '@angular/router';
import { SharedService } from '@his-base/shared';
import '@his-base/date-extension';
import * as i3 from 'primeng/api';
import * as i2$1 from 'primeng/fieldset';
import { FieldsetModule } from 'primeng/fieldset';
import * as i4$1 from 'primeng/avatar';
import { AvatarModule } from 'primeng/avatar';
import { HttpClient } from '@angular/common/http';
import * as i6 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UserAccountService } from 'dist/service';

/* eslint-disable @typescript-eslint/no-empty-function */
class NewsService {
    constructor() {
        /** 使用Signal變數儲存各類型最新消息的資訊
         *  @memberof NewsService
         */
        this.originalNews = signal({});
        this.allNormalNews = signal({});
        this.allTodoList = signal({});
        this.normalNews = signal({});
        this.toDoList = signal({});
        this.checkedNormalNews = signal({});
        this.checkedToDoList = signal({});
        /** nats連線位址
         *  @memberof NewsService
         */
        this.#url = 'ws://localhost:8080';
        /** 使用Subject變數自nats拿取最新消息
         *  @memberof NewsService
         */
        this.#myNews = new Subject();
        this.#jetStreamWsService = inject(JetstreamWsService);
    }
    /** nats連線位址
     *  @memberof NewsService
     */
    #url;
    /** 使用Subject變數自nats拿取最新消息
     *  @memberof NewsService
     */
    #myNews;
    /** 使用ConsumerMessages訂閱最新消息
     *  @memberof NewsService
     */
    #myNewsConsumer$;
    #jetStreamWsService;
    /** 建立nats連線
     *  @memberof NewsService
     */
    async connect() {
        await this.#jetStreamWsService.connect(this.#url);
    }
    /** 中斷nats連線
     *  @memberof NewsService
     */
    async disconnect() {
        await this.#jetStreamWsService.drain();
    }
    /** 首次進入頁面時，自資料庫初始化最新消息
     *  @memberof NewsService
     */
    getInitNews(userCode) {
        return this.#jetStreamWsService.request('news.find', userCode);
    }
    /** 發送`最新消息狀態改為已讀/已完成`到nats
     *  @memberof NewsService
     */
    changeStatus(news) {
        const date = new Date();
        this.originalNews.mutate(newsList => {
            const index = newsList.findIndex(newsElement => newsElement._id == news._id);
            newsList.splice(index, 1);
        });
        news.execStatus = { code: "60", display: "已讀/已完成" };
        news.execTime = date;
        this.#jetStreamWsService.publish(`news.${news.userCode.code}`, news);
        this.#jetStreamWsService.publish("news.setNews", news);
    }
    /** 依‘一般消息’、’待辦工作’分類最新消息
     *  @memberof NewsService
     */
    filterType(newsList, code) {
        if (code) {
            return newsList.filter(newsElement => newsElement.type['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 依`已讀/已完成`、`未讀/未完成`分類最新消息
     *  @memberof NewsService
     */
    filterStatus(newsList, code) {
        if (code) {
            return newsList.filter(newsElement => newsElement.execStatus['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 僅顯示未超過24小時已讀/已完成的一般消息/待辦工作
     *  @memberof NewsService
     */
    filterOverdue(newsList) {
        const date = new Date;
        const aDay = 24 * 60 * 60 * 1000;
        return newsList.filter(newsElement => date.valueOf() - newsElement.execTime.valueOf() < aDay);
    }
    /** 搜尋含subject字串的最新消息
     *  @memberof NewsService
     */
    filterSubject(subject) {
        const newsList = this.originalNews();
        this.upsertNews(newsList.filter(newsElement => newsElement.subject.match(subject)));
    }
    /** 以originalNews重置所有最新消息
     *  @memberof NewsService
     */
    filterReset() {
        this.upsertNews(this.originalNews());
    }
    /** 設定除了原始最新消息originalNews以外的最新消息
     *  @memberof NewsService
     */
    upsertNews(news) {
        this.allNormalNews.set(this.filterType(news, "10"));
        this.allTodoList.set(this.filterType(news, "60"));
        this.normalNews.set(this.filterStatus(this.allNormalNews(), "10"));
        this.toDoList.set(this.filterStatus(this.allTodoList(), "10"));
        this.checkedNormalNews.set(this.filterOverdue(this.filterStatus(this.allNormalNews(), "60")));
        this.checkedToDoList.set(this.filterOverdue(this.filterStatus(this.allTodoList(), "60")));
    }
    /** 設定/更新所有最新消息
     *  @memberof NewsService
     */
    upsertAllNews(newsList) {
        this.originalNews.set(newsList);
        this.upsertNews(newsList);
    }
    /** 規格化從nats取得的最新消息
     *  @memberof NewsService
     */
    formatNews(newsList) {
        const formatNewsList = [];
        newsList.forEach((news) => {
            console.log("news", news);
            console.log("start", typeof news.period.start);
            const formatNewsElement = {
                "_id": news._id,
                "appId": news.appId,
                "userCode": news.userCode,
                "subject": news.subject,
                "url": news.url,
                "sharedData": news.sharedData,
                "period": {
                    "start": new Date(news.period.start),
                    "end": new Date(news.period.end)
                },
                "type": news.type,
                "execTime": new Date(news.execTime),
                "execStatus": news.execStatus,
                "updatedBy": news.updatedBy,
                "updatedAt": new Date(news.updatedAt)
            };
            formatNewsList.push(formatNewsElement);
        });
        return formatNewsList;
    }
    /** 訂閱最新消息
     * @memberof NewsService
     */
    async subMyNews(userCode) {
        this.#myNews = new Subject();
        const jsonCodec = JSONCodec();
        this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, `news.${userCode.code}`);
        this.#myNewsConsumer$
            .pipe(mergeMap(async (messages) => {
            for await (const message of messages) {
                this.#myNews.next(jsonCodec.decode(message.data));
                message.ack();
            }
        }))
            .subscribe(() => { });
        this.#myNews.subscribe((newsElement) => {
            console.log("newsElement", newsElement);
            this.originalNews.mutate(newsList => {
                const tmpNews = this.formatNews([newsElement.data]);
                console.log("tmpNews", tmpNews);
                newsList.push(tmpNews[0]);
            });
            this.upsertNews(this.originalNews());
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class NewsListComponent {
    constructor() {
        this.newsService = inject(NewsService);
        this.sharedService = inject(SharedService);
        this.#router = inject(Router);
    }
    #router;
    /** 跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
     *  @memberof NewsInfoComponent
     */
    onNavNewsClick(url, sharedData) {
        if (!url) {
            return;
        }
        else {
            const key = this.sharedService.setValue(sharedData);
            this.#router.navigate([url], { state: { token: key } });
        }
    }
    /** 發送`最新消息狀態改為已讀/已完成`到nats
     *  @memberof NewsInfoComponent
     */
    async onChangeStatus(news) {
        this.newsService.changeStatus(news);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: NewsListComponent, isStandalone: true, selector: "his-news-list", inputs: { news: "news", customTemplate: "customTemplate" }, ngImport: i0, template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<ng-container *ngIf=\"news && news.length < 1; else ShowNews\">\n  <h1 class=\"p-datatable\" [innerText]=\"'\u6C92\u6709\u6700\u65B0\u6D88\u606F'|translate\"></h1>\n</ng-container>\n\n<ng-template #ShowNews>\n  <ng-container [ngTemplateOutlet]=\"defaultTable || customTemplate\"></ng-container>\n\n</ng-template>\n\n<ng-template #defaultTable>\n  <p-table [value]=\"news!\" [tableStyle]=\"{ width: '100%' }\">\n    <ng-template pTemplate=\"body\" let-news>\n      <tr>\n        <td>\n          <span *ngIf=\"news.execStatus['code'] === '10'\">\n            <button\n              pButton\n              pRipple\n              type=\"button\"\n              [label]=\"'\u5B8C\u6210'|translate\"\n              class=\"p-button-outlined check-button\"\n              (click)=\"onChangeStatus(news)\"\n            ></button>\n          </span>\n        </td>\n        <td><span class=\"label-m\">{{ news.period.start.toLocaleString([],{hour12:false}) }}</span>\n        <td><span class=\"label-m\">{{ news.subject }}</span></td>\n        <td>\n          <span *ngIf=\"news.url\">\n            <p-button #navButton [label]=\"'clickToEnter'|translate\" styleClass=\"p-button-link\" (click)=\"onNavNewsClick(news.url,news.sharedData)\"></p-button>\n          </span>\n        </td>\n      </tr>\n    </ng-template>\n  </p-table>\n</ng-template>\n\n<ng-template #customtemplate>\n  <p-table\n    [value]=\"news!\"\n    [tableStyle]=\"{ width: '100%' }\">\n    <ng-template pTemplate=\"body\" let-news>\n      <tr>\n        <td>\n          <span *ngIf=\"news.execStatus['code'] === '10'\">\n            <button\n              pButton\n              pRipple\n              type=\"button\"\n              [label]=\"'\u5B8C\u6210' |translate\"\n              class=\"p-button-outlined\"\n              (click)=\"onChangeStatus(news)\"\n            ></button>\n          </span>\n        </td>\n        <td>\n          <span class=\"label-m\">{{ news.period.start.toLocaleString({hour12:false}) }}</span>\n        </td>\n        <td>\n          <span class=\"label-m\">{{ news.subject }}</span>\n        </td>\n        <td>\n          <span *ngIf=\"news.url\">\n            <p-button #navButton [label]=\"'\u8ACB\u9EDE\u9078\u9032\u5165'|translate\" styleClass=\"p-button-link\" (click)=\"onNavNewsClick(news.url,news.sharedData)\"></p-button>\n          </span>\n        </td>\n      </tr>\n    </ng-template>\n  </p-table>\n</ng-template>\n", styles: [".check-button{width:88px;height:32px;padding:4px,12px,4px,12px;border-radius:20px;border:1px;gap:4px}:host ::ng-deep .p-datatable{height:100%;background:#fff;font-style:normal;font-weight:400;line-height:20px;letter-spacing:.16px;color:var(--surface-on-surface)}:host ::ng-deep .p-datatable .p-datatable-tbody>tr{width:100%}:host ::ng-deep .p-datatable .p-datatable-tbody>tr:last-child>td{border-bottom:none}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td{padding:8px 0}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:first-child{width:5%;min-width:45px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:first-child .p-button{min-width:60px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:nth-child(2){width:13%}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:last-child{width:13%}:host ::ng-deep .p-fieldset{border-radius:12px}:host ::ng-deep .p-fieldset .p-fieldset-content{padding:8px 12px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: TableModule }, { kind: "component", type: i2.Table, selector: "p-table", inputs: ["frozenColumns", "frozenValue", "style", "styleClass", "tableStyle", "tableStyleClass", "paginator", "pageLinks", "rowsPerPageOptions", "alwaysShowPaginator", "paginatorPosition", "paginatorStyleClass", "paginatorDropdownAppendTo", "paginatorDropdownScrollHeight", "currentPageReportTemplate", "showCurrentPageReport", "showJumpToPageDropdown", "showJumpToPageInput", "showFirstLastIcon", "showPageLinks", "defaultSortOrder", "sortMode", "resetPageOnSort", "selectionMode", "selectionPageOnly", "contextMenuSelection", "contextMenuSelectionMode", "dataKey", "metaKeySelection", "rowSelectable", "rowTrackBy", "lazy", "lazyLoadOnInit", "compareSelectionBy", "csvSeparator", "exportFilename", "filters", "globalFilterFields", "filterDelay", "filterLocale", "expandedRowKeys", "editingRowKeys", "rowExpandMode", "scrollable", "scrollDirection", "rowGroupMode", "scrollHeight", "virtualScroll", "virtualScrollItemSize", "virtualScrollOptions", "virtualScrollDelay", "frozenWidth", "responsive", "contextMenu", "resizableColumns", "columnResizeMode", "reorderableColumns", "loading", "loadingIcon", "showLoader", "rowHover", "customSort", "showInitialSortBadge", "autoLayout", "exportFunction", "exportHeader", "stateKey", "stateStorage", "editMode", "groupRowsBy", "groupRowsByOrder", "responsiveLayout", "breakpoint", "paginatorLocale", "value", "columns", "first", "rows", "totalRecords", "sortField", "sortOrder", "multiSortMeta", "selection", "selectAll", "virtualRowHeight"], outputs: ["contextMenuSelectionChange", "selectAllChange", "selectionChange", "onRowSelect", "onRowUnselect", "onPage", "onSort", "onFilter", "onLazyLoad", "onRowExpand", "onRowCollapse", "onContextMenuSelect", "onColResize", "onColReorder", "onRowReorder", "onEditInit", "onEditComplete", "onEditCancel", "onHeaderCheckboxToggle", "sortFunction", "firstChange", "rowsChange", "onStateSave", "onStateRestore"] }, { kind: "directive", type: i3.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i4.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "component", type: i4.Button, selector: "p-button", inputs: ["type", "iconPos", "icon", "badge", "label", "disabled", "loading", "loadingIcon", "style", "styleClass", "badgeClass", "ariaLabel"], outputs: ["onClick", "onFocus", "onBlur"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-news-list', standalone: true, imports: [CommonModule, TableModule, ButtonModule, TranslateModule], template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<ng-container *ngIf=\"news && news.length < 1; else ShowNews\">\n  <h1 class=\"p-datatable\" [innerText]=\"'\u6C92\u6709\u6700\u65B0\u6D88\u606F'|translate\"></h1>\n</ng-container>\n\n<ng-template #ShowNews>\n  <!-- <ng-container [ngTemplateOutlet]=\"defaultTable || customTemplate\"></ng-container> -->\n  <ng-container *ngIf=\"news && news[0].execStatus.code==='10';else completedTable\">\n    <p-table [value]=\"news!\" [tableStyle]=\"{ width: '100%' }\">\n      <ng-template pTemplate=\"body\" let-news>\n        <tr (click)=\"onNavNewsClick(news.url,news.sharedData)\">\n          <td>\n            <span *ngIf=\"news.execStatus['code'] === '10'\">\n              <button\n                pButton\n                pRipple\n                type=\"button\"\n                [label]=\"'\u5B8C\u6210'|translate\"\n                class=\"p-button-outlined check-button\"\n                (click)=\"onChangeStatus(news)\"\n              ></button>\n            </span>\n          </td>\n          <td><span class=\"label-m\">{{ news.period.start.formatString('YYYY-MM-DD HH:mm') }}</span>\n          <td><span class=\"label-m\">{{ news.subject }}</span></td>\n        </tr>\n      </ng-template>\n    </p-table>\n  </ng-container>\n\n</ng-template>\n\n<ng-template #defaultTable>\n  <p-table [value]=\"news!\" [tableStyle]=\"{ width: '100%' }\">\n    <ng-template pTemplate=\"body\" let-news>\n      <tr (click)=\"onNavNewsClick(news.url,news.sharedData)\">\n        <td class=\"first-child\">\n          <span *ngIf=\"news.execStatus['code'] === '10'\">\n            <button\n              pButton\n              pRipple\n              type=\"button\"\n              [label]=\"'\u5B8C\u6210'|translate\"\n              class=\"p-button-outlined check-button\"\n              (click)=\"onChangeStatus(news)\"\n            ></button>\n          </span>\n        </td>\n        <td class=\"nth-child\"><span class=\"label-m\">{{ news.period.start.formatString('YYYY-MM-DD HH:mm') }}</span>\n        <td class=\"last-child\"><span class=\"label-m\">{{ news.subject }}</span></td>\n      </tr>\n    </ng-template>\n  </p-table>\n</ng-template>\n\n<ng-template #completedTable>\n  <p-table\n    [value]=\"news!\"\n    [tableStyle]=\"{ width: '100%' }\">\n    <ng-template pTemplate=\"body\" let-news>\n      <tr>\n        <td class=\"complete-first\">\n          <span class=\"label-m\">{{ news.period.start.toLocaleString({hour12:false}) }}</span>\n        </td>\n        <td class=\"complete-last\">\n          <span class=\"label-m\">{{ news.subject }}</span>\n        </td>\n      </tr>\n    </ng-template>\n  </p-table>\n</ng-template>\n\n<ng-template #customtemplate>\n  <p-table\n    [value]=\"news!\"\n    [tableStyle]=\"{ width: '100%' }\">\n    <ng-template pTemplate=\"body\" let-news>\n      <tr>\n        <td>\n          <span *ngIf=\"news.execStatus['code'] === '10'\">\n            <button\n              pButton\n              pRipple\n              type=\"button\"\n              [label]=\"'\u5B8C\u6210' |translate\"\n              class=\"p-button-outlined\"\n              (click)=\"onChangeStatus(news)\"\n            ></button>\n          </span>\n        </td>\n        <td>\n          <span class=\"label-m\">{{ news.period.start.toLocaleString({hour12:false}) }}</span>\n        </td>\n        <td>\n          <span class=\"label-m\">{{ news.subject }}</span>\n        </td>\n        <td>\n          <span *ngIf=\"news.url\">\n            <p-button #navButton [label]=\"'\u8ACB\u9EDE\u9078\u9032\u5165'|translate\" styleClass=\"p-button-link\" (click)=\"onNavNewsClick(news.url,news.sharedData)\"></p-button>\n          </span>\n        </td>\n      </tr>\n    </ng-template>\n  </p-table>\n</ng-template>\n", styles: [".check-button{width:88px;height:32px;padding:4px,12px,4px,12px;border-radius:20px;border:1px;gap:4px}:host ::ng-deep .p-datatable{height:100%;background:#fff;font-style:normal;font-weight:400;line-height:20px;letter-spacing:.16px;color:var(--surface-on-surface)}:host ::ng-deep .p-datatable .p-datatable-tbody>tr{width:100%}:host ::ng-deep .p-datatable .p-datatable-tbody>tr:last-child>td{border-bottom:none}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td{padding:8px 0 8px 5px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td .first-child{width:0%;padding-left:0;min-width:45px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td .first-child .p-button{min-width:60px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td .nth-child{width:.1%;padding-left:14px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td .last-child{width:1%;text-align:left}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td .completed-first{width:.1%;padding-left:14px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td .complete-last{width:1%;text-align:left}:host ::ng-deep .p-fieldset{border-radius:12px}:host ::ng-deep .p-fieldset .p-fieldset-content{padding:8px 0}\n"] }]
        }], propDecorators: { news: [{
                type: Input
            }], customTemplate: [{
                type: Input
            }], defaultTable1: [{
                type: Input
            }], noUrlNews: [{
                type: Input
            }] } });

/* eslint-disable @angular-eslint/component-selector */
class NewsInfoComponent {
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: NewsInfoComponent, isStandalone: true, selector: "his-news-info", ngImport: i0, template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n    image=\"{{ userAccountService.userImage().image }}\"\n        styleClass=\"mr-2\"\n        size=\"xlarge\"\n        shape=\"circle\"\n      ></p-avatar>\n      <div class=\"title\">\n        {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n      </div>\n  </div>\n  <div class=\"toolbar-container\">\n      <div class=\"icon-container\">\n        <button\n          pButton\n          pRipple\n          type=\"button\"\n          icon=\"pi pi-angle-left\"\n          class=\"p-button-rounded p-button-secondary p-button-outlined\"\n          (click)=\"onBackClick()\"\n        ></button>\n        <div><h3 [innerText]=\"'\u6700\u65B0\u6D88\u606F'|translate\"></h3></div>\n      </div>\n      <div>\n        <span class=\"p-input-icon-left\" >\n          <i class=\"pi pi-search\"></i>\n          <input type=\"text\" pinputtext=\"\" [placeholder]=\"'\u641C\u5C0B'|translate\" class=\"p-inputtext p-component p-element\" [(ngModel)]=\"query\" (keyup)=\"filterSubject()\" (keyup.excape)=\"filterReset()\">\n        </span>\n      </div>\n  </div>\n  <div class=\"flex flex-column\">\n    <p-fieldset [legend]=\"'\u4EE3\u8FA6\u5DE5\u4F5C'|translate\" [toggleable]=\"true\" class=\"first\">\n      <ng-template pTemplate=\"expandicon\">\n        <div >\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"toDoList()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u516C\u544A\u8A0A\u606F'|translate\" [toggleable]=\"true\" class=\"second\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"normalNews()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u5B8C\u6210\u5DE5\u4F5C'|translate\" [toggleable]=\"true\" class=\"third\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"checkedToDoList()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u5DF2\u8B80\u8A0A\u606F'|translate\" [toggleable]=\"true\" class=\"fourth\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"checkedNormalNews()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n  </div>\n</div>\n\n\n", styles: [".top-bar-container{display:flex;flex-direction:row;align-items:center}.icon-container{display:flex;justify-content:space-between;align-items:center;gap:12px}.icon-container h3{font-size:1.5rem;font-style:normal;font-weight:700;line-height:2rem;letter-spacing:.03rem;color:var(--surface-on-surface)}.content-container{padding:32px;height:100%;gap:16px;display:flex;flex-direction:column;background-color:var(--surface-ground)}.flex-column{gap:26px}:host ::ng-deep p-fieldset .p-fieldset-toggleable .p-fieldset-legend{padding:0;margin-left:-1px;width:129px;transition:background-color .2s,color .2s,box-shadow .2s}:host ::ng-deep p-fieldset .p-fieldset-toggleable .p-fieldset-legend a{min-height:34px;padding:var(--spacing-xs) var(--spacing-md)}:host ::ng-deep p-fieldset .p-fieldset-legend-text{font-weight:700}:host ::ng-deep p-fieldset .p-fieldset .p-fieldset-content{padding:8px 0}:host ::ng-deep p-fieldset .p-fieldset-legend>a{flex-direction:row-reverse}:host ::ng-deep p-fieldset .p-fieldset.p-fieldset-toggleable .p-fieldset-legend a .p-fieldset-toggler{margin-right:0;margin-left:18px}:host ::ng-deep p-fieldset.first .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--tertiary-main)}:host ::ng-deep p-fieldset.first .p-fieldset-toggleable .p-fieldset-legend a{color:var(--white)}:host ::ng-deep p-fieldset.second .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--primary-main)}:host ::ng-deep p-fieldset.second .p-fieldset-toggleable .p-fieldset-legend a{color:#f6f6f6}:host ::ng-deep p-fieldset.third .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--surface-section)}:host ::ng-deep p-fieldset.third .p-fieldset-toggleable .p-fieldset-legend a{color:var(--surface-on-surface)}:host ::ng-deep .p-datatable{height:100%;background:#fff;font-style:normal;font-weight:400;line-height:20px;letter-spacing:.16px;color:var(--surface-on-surface)}:host ::ng-deep .p-datatable .p-datatable-tbody>tr{width:100%}:host ::ng-deep .p-datatable .p-datatable-tbody>tr:last-child>td{border-bottom:none}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td{padding:8px 0 8px 5px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:first-child{width:5%;padding-left:0;min-width:45px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:first-child .p-button{min-width:60px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:nth-child(2){width:10%;padding-left:14px}:host ::ng-deep .p-datatable .p-datatable-tbody>tr>td:last-child{width:10%;text-align:end}:host ::ng-deep .p-fieldset{border-radius:12px}:host ::ng-deep .p-fieldset .p-fieldset-content{padding:8px 0}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.toolbar-container{display:flex;flex-direction:row;width:100%;justify-content:space-between}.p-button{color:#fff;background:var(--primary-main);border:0 none;padding:4px 12px;font-size:1rem;transition:background-color .2s,border-color .2s,color .2s,box-shadow .2s,background-size .2s cubic-bezier(.64,.09,.08,1);border-radius:6px}.check-button{width:88px;height:32px;padding:4px,12px,4px,12px;border-radius:20px;border:1px;gap:4px}.p-input-icon-left{padding:0 3px 0 0;width:320px}.p-inputtext{width:100%}.pi{width:17.51px;height:17.51px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "component", type: NewsListComponent, selector: "his-news-list", inputs: ["news", "customTemplate"] }, { kind: "ngmodule", type: TableModule }, { kind: "directive", type: i3.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: FieldsetModule }, { kind: "component", type: i2$1.Fieldset, selector: "p-fieldset", inputs: ["legend", "toggleable", "collapsed", "style", "styleClass", "transitionOptions"], outputs: ["collapsedChange", "onBeforeToggle", "onAfterToggle"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i4.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "ngmodule", type: AvatarModule }, { kind: "component", type: i4$1.Avatar, selector: "p-avatar", inputs: ["label", "icon", "image", "size", "shape", "style", "styleClass", "ariaLabel", "ariaLabelledBy"], outputs: ["onImageError"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: NewsInfoComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-news-info', standalone: true, imports: [CommonModule, NewsListComponent, TableModule, FieldsetModule, ButtonModule, AvatarModule, RouterOutlet, TranslateModule, FormsModule], template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n    image=\"{{ userAccountService.userImage().image }}\"\n        styleClass=\"mr-2\"\n        size=\"xlarge\"\n        shape=\"circle\"\n      ></p-avatar>\n      <div class=\"title\">\n        {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n      </div>\n  </div>\n  <div class=\"toolbar-container\">\n      <div class=\"icon-container\">\n        <button\n          pButton\n          pRipple\n          type=\"button\"\n          icon=\"pi pi-angle-left\"\n          class=\"p-button-rounded p-button-secondary p-button-outlined\"\n          (click)=\"onBackClick()\"\n        ></button>\n        <div><h3 [innerText]=\"'\u6700\u65B0\u6D88\u606F'|translate\"></h3></div>\n      </div>\n      <div>\n        <span class=\"p-input-icon-left\" >\n          <i class=\"pi pi-search\"></i>\n          <input type=\"text\" pinputtext=\"\" [placeholder]=\"'\u641C\u5C0B'|translate\" class=\"p-inputtext p-component p-element\" [(ngModel)]=\"query\" (keyup)=\"filterSubject()\" (keyup.excape)=\"filterReset()\">\n        </span>\n      </div>\n  </div>\n  <div class=\"flex flex-column\">\n    <p-fieldset [legend]=\"'\u5F85\u8FA6\u5DE5\u4F5C'|translate\" [toggleable]=\"true\" class=\"first\">\n      <ng-template pTemplate=\"expandicon\">\n        <div >\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"toDoList()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u516C\u544A\u8A0A\u606F'|translate\" [toggleable]=\"true\" class=\"second\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"normalNews()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u5B8C\u6210\u5DE5\u4F5C'|translate\" [toggleable]=\"true\" class=\"third\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"checkedToDoList()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n\n    <p-fieldset [legend]=\"'\u5DF2\u8B80\u8A0A\u606F'|translate\" [toggleable]=\"true\" class=\"fourth\">\n      <ng-template pTemplate=\"expandicon\">\n        <div>\n          <span class=\"pi pi-chevron-down\"></span>\n        </div>\n      </ng-template>\n      <ng-template pTemplate=\"collapseicon\">\n        <div>\n          <span class=\"pi pi-chevron-up\"></span>\n        </div>\n      </ng-template>\n      <his-news-list\n        [news]=\"checkedNormalNews()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </p-fieldset>\n  </div>\n</div>\n\n\n", styles: [".top-bar-container{display:flex;flex-direction:row;align-items:center}.icon-container{display:flex;justify-content:space-between;align-items:center;gap:12px}.icon-container h3{font-size:1.5rem;font-style:normal;font-weight:700;line-height:2rem;letter-spacing:.03rem;color:var(--surface-on-surface)}.content-container{padding:32px;height:100%;gap:16px;display:flex;flex-direction:column;background-color:var(--surface-ground)}.flex-column{gap:26px}:host ::ng-deep p-fieldset .p-fieldset-toggleable .p-fieldset-legend{padding:0;margin-left:-1px;width:129px;transition:background-color .2s,color .2s,box-shadow .2s}:host ::ng-deep p-fieldset .p-fieldset-toggleable .p-fieldset-legend a{min-height:34px;padding:var(--spacing-xs) var(--spacing-md)}:host ::ng-deep p-fieldset .p-fieldset-legend-text{font-weight:700}:host ::ng-deep p-fieldset .p-fieldset .p-fieldset-content{padding:8px 0}:host ::ng-deep p-fieldset .p-fieldset-legend>a{flex-direction:row-reverse}:host ::ng-deep p-fieldset .p-fieldset.p-fieldset-toggleable .p-fieldset-legend a .p-fieldset-toggler{margin-right:0;margin-left:18px}:host ::ng-deep p-fieldset.first .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--tertiary-main)}:host ::ng-deep p-fieldset.first .p-fieldset-toggleable .p-fieldset-legend a{color:var(--white)}:host ::ng-deep p-fieldset.second .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--primary-main)}:host ::ng-deep p-fieldset.second .p-fieldset-toggleable .p-fieldset-legend a{color:#f6f6f6}:host ::ng-deep p-fieldset.third .p-fieldset-toggleable .p-fieldset-legend{background-color:var(--surface-section)}:host ::ng-deep p-fieldset.third .p-fieldset-toggleable .p-fieldset-legend a{color:var(--surface-on-surface)}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.toolbar-container{display:flex;flex-direction:row;width:100%;justify-content:space-between}.p-button{color:#fff;background:var(--primary-main);border:0 none;padding:4px 12px;font-size:1rem;transition:background-color .2s,border-color .2s,color .2s,box-shadow .2s,background-size .2s cubic-bezier(.64,.09,.08,1);border-radius:6px}.check-button{width:88px;height:32px;padding:4px,12px,4px,12px;border-radius:20px;border:1px;gap:4px}.p-input-icon-left{padding:0 3px 0 0;width:320px}.p-inputtext{width:100%}.pi{width:17.51px;height:17.51px}\n"] }]
        }] });

/*
 * Public API Surface of news-info
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NewsInfoComponent, NewsListComponent, NewsService };
//# sourceMappingURL=his-view-news-info.mjs.map
