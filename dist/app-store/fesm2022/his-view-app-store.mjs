import * as i0 from '@angular/core';
import { inject, Injectable, signal, Component } from '@angular/core';
import { Router } from '@angular/router';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { SharedService } from '@his-base/shared';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i6 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import * as i5 from 'primeng/selectbutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import * as i2 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import * as i7 from 'primeng/inputtext';
import { InputTextModule } from 'primeng/inputtext';
import * as i4 from 'primeng/divider';
import { DividerModule } from 'primeng/divider';
import * as i8 from 'primeng/avatar';
import { AvatarModule } from 'primeng/avatar';
import { CardListComponent } from '@his-directive/card-list/dist/card-list';
import * as i9 from '@ngx-translate/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { UserAccountService } from 'dist/service';
import * as i3 from 'primeng/api';

const environment = {
    wsUrl: 'ws://localhost:8080'
};

class WsNatsService {
    #natsUrl = environment.wsUrl;
    #jetStreamWsService = inject(JetstreamWsService);
    async connect() {
        console.log('connected');
        await this.#jetStreamWsService.connect(this.#natsUrl);
    }
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

class AppStoreService {
    constructor() {
        /** 目前使用者應用程式原始內容
         * @type {ExtendedMyAppStore}
         * @memberof AppStoreService
        */
        this.myAppStores = signal([]);
        /** 所有使用者的應用程式
         * @type {UserAppStore}
         * @memberof AppStoreService
         */
        this.userAppStores = signal([]);
        this.appOpenedIndex = [];
        this.#router = inject(Router);
        this.#jetStreamWsService = inject(JetstreamWsService);
        this.#sharedService = inject(SharedService);
        this.#wsNatsService = inject(WsNatsService);
    }
    #router;
    #jetStreamWsService;
    #sharedService;
    #wsNatsService;
    /** 擴展MyAppStore到ExtendedMyAppStore
     * @param {MyAppStore[]} appStores
     * @memberof AppStoreService
     */
    convertToExtended(appStores) {
        return appStores.map(appStore => ({ ...appStore, isOpen: false }));
    }
    /** 取得全部應用程式清單
     * @param {string} payload
     * @memberof AppStoreService
     */
    async getAppStoreList(payload) {
        // @ts-ignore
        // 需帶入指定的主題跟要傳遞的資料
        this.#jetStreamWsService.request('UserAppStore.myAppStore', payload).subscribe((result) => {
            this.myAppStores.set(this.convertToExtended(result));
        });
    }
    /** 取得全部使用者應用程式清單
      * @param {string} payload
      * @memberof AppStoreService
      */
    async getUserStoreList(payload) {
        // @ts-ignore
        // 需帶入指定的主題跟要傳遞的資料
        this.#jetStreamWsService.request('UserAppStore.list', payload).subscribe((result) => {
            this.userAppStores.set(result);
        });
    }
    /** 取得全部應用程式清單
     * @param {string} keyword
     * @memberof AppStoreService
     */
    getAppStoresByKeyword(keyword) {
        if (keyword) {
            return this.myAppStores().filter((myAppStore) => myAppStore.title.includes(keyword));
        }
        else {
            return this.myAppStores();
        }
    }
    /** 取得目前應用程式資料
     * @param {string} appUrl
     * @memberof AppStoreService
     */
    getAppStore(appUrl) {
        const myAppStore = this.myAppStores().filter((myAppStore) => myAppStore.url === appUrl)[0];
        return myAppStore;
    }
    /** publish 更新後使用者最愛應用程式到NATS
     * @param {UserAppStore} payload
     * @memberof AppStoreService
     */
    async pubUserAppStoreFavorite(payload) {
        // 需帶入指定發布主題以及要傳送的訊息
        await this.#jetStreamWsService.publish('UserAppStore.update.isFavorite', payload);
    }
    /** 初始化MyAppStore
     * @param {UserAccount} userAccount
     * @memberof AppStoreService
     */
    async initAppStore() {
        const userAccount = await this.#sharedService.getValue(history.state.token);
        console.log("get token", userAccount);
        await this.getAppStoreList(userAccount.userCode.code);
        await this.getUserStoreList(userAccount.userCode.code);
    }
    /** 應用程式點擊我的最愛icon
     * @param {string} appId
     * @memberof AppStoreService
     */
    onFavoriteClick(appId) {
        this.myAppStores.update(myAppStoreArray => {
            console.log("userAppStores", this.userAppStores());
            return myAppStoreArray.map(myAppStore => {
                if (myAppStore.appId === appId) {
                    // 切换 isFavorite 值
                    myAppStore.isFavorite = !myAppStore.isFavorite;
                    // 在 userAppStores 中找到相應的項目更新它的 isFavorite
                    const userAppStore = this.userAppStores().find(userAppStore => userAppStore.appId === appId);
                    console.log('appId', appId);
                    console.log('userAppStoreID', userAppStore?.appId);
                    if (userAppStore) {
                        userAppStore.isFavorite = myAppStore.isFavorite;
                        this.pubUserAppStoreFavorite(userAppStore);
                    }
                }
                return myAppStore;
            });
        });
    }
    /** 跳轉到module federation page
     * @param {string} appUrl
     * @memberof AppStoreService
     */
    onNavAppClick(appUrl) {
        this.#router.navigate([appUrl]);
    }
    /** 設定應用程式關閉
     * @param {string} appId
     * @memberof AppStoreService
    */
    setAppClose(appId) {
        this.myAppStores.update(apps => apps.map(app => { app.appId === appId ? app.isOpen = false : app; return app; }));
        console.log(this.appOpenedIndex);
        if (this.appOpenedIndex.length > 1) {
            const index = this.appOpenedIndex.findIndex(app => app.appId === appId);
            this.appOpenedIndex.splice(index, 1);
            console.log(index);
            console.log(this.appOpenedIndex[this.appOpenedIndex.length - 1]);
            // window.open(this.appOpenedIndex[this.appOpenedIndex.length-1].appUrl,"_top")
            this.#router.navigate([this.appOpenedIndex[this.appOpenedIndex.length - 1].url]);
        }
        else {
            this.appOpenedIndex.splice(1, 1);
            this.#router.navigateByUrl('/home');
        }
    }
    /** 設定應用程式開啟
     * @param {string} appId
     * @memberof AppStoreService
    */
    setAppOpen(appId) {
        const findApp = this.myAppStores().filter(x => x.appId === appId)[0];
        const objectsAreEqual = (x, y) => {
            return x.url === y.url;
        };
        if (findApp) {
            this.myAppStores.update(x => x.map(y => { y.appId === appId ? y.isOpen = true : y; return y; }));
            if (!this.appOpenedIndex.find(x => objectsAreEqual(x, findApp))) {
                this.appOpenedIndex.push(findApp);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

var _SelectButtonOption = [
	{
		icon: "material-symbols-outlined",
		label: "grid_view",
		value: "grid"
	},
	{
		icon: "material-symbols-outlined",
		label: "view_agenda",
		value: "list"
	}
];

var SelectButtonOption = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: _SelectButtonOption
});

class AppStoreComponent {
    constructor() {
        this.isGridView = signal(true);
        this.Options = [];
        this.value = 'grid';
        this.appStoreService = inject(AppStoreService);
        this.userAccountService = inject(UserAccountService);
        this.#sharedService = inject(SharedService);
        this.#translate = inject(TranslateService);
    }
    #sharedService;
    #translate;
    async ngOnInit() {
        this.#translate.setDefaultLang(`zh-Hant`);
        this.Options = Object.values(SelectButtonOption)[0];
    }
    /** 返回上一頁
      * @memberof AppStoreComponent
    */
    onBackClick() {
        window.history.back();
    }
    /** 選擇應用程式列表顯示方式
      * @memberof AppStoreComponent
    */
    onSelectedChange() {
        if (this.value === 'grid') {
            this.isGridView.set(true);
        }
        else {
            this.isGridView.set(false);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: AppStoreComponent, isStandalone: true, selector: "his-app-store", ngImport: i0, template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n    image=\"{{ userAccountService.userImage().image }}\"\n    styleClass=\"mr-2\"\n    size=\"xlarge\"\n    shape=\"circle\"\n  ></p-avatar>\n  <div class=\"title\">\n    {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n  </div>\n  </div>\n  <div class=\"toolbar-container\">\n    <div class=\"icon-container title-box\">\n      <button\n        pButton\n        pRipple\n        type=\"button\"\n        icon=\"pi pi-angle-left\"\n        class=\"p-button-rounded p-button-secondary p-button-outlined\"\n        (click)=\"onBackClick()\"\n      ></button>\n      <div><h3>\u7A0B\u5F0F\u96C6</h3></div>\n    </div>\n    <div class=\"icon-container\">\n        <span class=\"p-input-icon-left\">\n          <i class=\"pi pi-search\"></i>\n          <input type=\"text\"  pInputText placeholder=\"\u67E5\u8A62\" />\n        </span>\n      <p-selectButton\n        [options]=\"Options\"\n        [(ngModel)]=\"value\"\n        optionLabel=\"name\"\n        optionValue=\"value\"\n        (onOptionClick)=\"onSelectedChange()\"\n      >\n      <ng-template let-item pTemplate>\n        <span [class]=\"item.icon\"> {{ item.label }} </span>\n      </ng-template>\n      </p-selectButton>\n    </div>\n  </div>\n  <ng-container *ngIf=\"isGridView(); else listView\">\n    <div class=\"appstore-container\">\n      <p-divider class=\"first-class\"></p-divider>\n      <div class=\"flex flex-wrap card-content\">\n        <ng-container\n          *ngFor=\"let myAppStore of appStoreService.myAppStores()\"\n        >\n          <his-card-list\n            class=\"grid-style\"\n            [myAppStore]=\"myAppStore\"\n            (setChange)=\"appStoreService.onFavoriteClick($event)\"\n            (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n          </his-card-list>\n        </ng-container>\n      </div>\n    </div>\n  </ng-container>\n  <ng-template #listView>\n    <div class=\"appstore-container listView\">\n      <p-divider class=\"first-class\"></p-divider>\n      <div class=\"flex flex-wrap list-content\">\n        <ng-container\n          *ngFor=\"let myAppStore of appStoreService.myAppStores()\"\n        >\n          <his-card-list\n            class=\"list-style\"\n            [myAppStore]=\"myAppStore\"\n            [isListView]=\"true\"\n            (setChange)=\"appStoreService.onFavoriteClick($event)\"\n            (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n          </his-card-list>\n        </ng-container>\n      </div>\n      </div>\n  </ng-template>\n</div>\n\n\n\n\n\n", styles: [":host ::ng-deep .grid-style{margin:6px;width:calc(20% - 12px);max-width:320px}:host ::ng-deep .grid-style.second-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--tertiary-main)}:host ::ng-deep .grid-style.third-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--indigo-500)}:host ::ng-deep .grid-style.fourth-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--orange-500)}:host ::ng-deep .list-style .p-image.p-component{width:56px;height:56px}:host ::ng-deep .p-selectbutton .p-button{border-radius:0}:host ::ng-deep .p-selectbutton .p-button:first-child{border-radius:6px 0 0 6px}:host ::ng-deep .p-selectbutton .p-button:last-child{border-radius:0 6px 6px 0}.content-container{padding:32px;height:100%;display:flex;flex-direction:column;background-color:var(--surface-ground);overflow:auto}.appstore-container{padding:var(--spacing-xs) var(--spacing-lg)}.appstore-container.listView{width:100%;margin:0 auto}.appstore-container .card-content{width:95%;margin:0 auto;transform:translate(-6px);padding-bottom:var(--spacing-md)}.appstore-container .list-content{gap:12px}.top-bar-container{display:flex;flex-direction:row;align-items:center}.icon-container{display:flex;justify-content:space-between;align-items:center;gap:8px}.icon-container h3{font-size:1.5rem;font-style:normal;font-weight:700;line-height:2rem;letter-spacing:.03rem;color:var(--surface-on-surface)}.list-style{cursor:pointer;width:100%}:host ::ng-deep .p-buttonset .p-button-icon-only{justify-content:center;width:2rem;height:2rem}:host ::ng-deep .p-buttonset .p-button-icon-only .p-button-icon{font-size:1rem;padding-left:3px}:host ::ng-deep .p-divider.p-divider-horizontal{margin:12px 0}:host ::ng-deep .first-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--primary-main);border-width:4px}:host ::ng-deep .second-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--tertiary-main);border-width:4px}:host ::ng-deep .third-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--indigo-500);border-width:4px}:host ::ng-deep .fourth-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--orange-500);border-width:4px}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.toolbar-container{padding:var(--spacing-xs) var(--spacing-lg);display:flex;justify-content:space-between;width:100%;margin:var(--spacing-lg) 0 var(--spacing-sm)}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i2.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "directive", type: i3.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: DividerModule }, { kind: "component", type: i4.Divider, selector: "p-divider", inputs: ["style", "styleClass", "layout", "type", "align"] }, { kind: "ngmodule", type: SelectButtonModule }, { kind: "component", type: i5.SelectButton, selector: "p-selectButton", inputs: ["options", "optionLabel", "optionValue", "optionDisabled", "tabindex", "multiple", "style", "styleClass", "ariaLabelledBy", "disabled", "dataKey"], outputs: ["onOptionClick", "onChange"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: InputTextModule }, { kind: "directive", type: i7.InputText, selector: "[pInputText]" }, { kind: "ngmodule", type: AvatarModule }, { kind: "component", type: i8.Avatar, selector: "p-avatar", inputs: ["label", "icon", "image", "size", "shape", "style", "styleClass", "ariaLabel", "ariaLabelledBy"], outputs: ["onImageError"] }, { kind: "component", type: CardListComponent, selector: "his-card-list", inputs: ["myAppStore", "isListView", "headerTemplate", "bodyTemplate", "footerTemplate"], outputs: ["setChange", "clickCard"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i9.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-app-store', standalone: true, imports: [
                        CommonModule,
                        ButtonModule,
                        DividerModule,
                        SelectButtonModule,
                        FormsModule,
                        InputTextModule,
                        AvatarModule,
                        CardListComponent,
                        TranslateModule
                    ], template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n    image=\"{{ userAccountService.userImage().image }}\"\n    styleClass=\"mr-2\"\n    size=\"xlarge\"\n    shape=\"circle\"\n  ></p-avatar>\n  <div class=\"title\">\n    {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n  </div>\n  </div>\n  <div class=\"toolbar-container\">\n    <div class=\"icon-container title-box\">\n      <button\n        pButton\n        pRipple\n        type=\"button\"\n        icon=\"pi pi-angle-left\"\n        class=\"p-button-rounded p-button-secondary p-button-outlined\"\n        (click)=\"onBackClick()\"\n      ></button>\n      <div><h3>\u7A0B\u5F0F\u96C6</h3></div>\n    </div>\n    <div class=\"icon-container\">\n        <span class=\"p-input-icon-left\">\n          <i class=\"pi pi-search\"></i>\n          <input type=\"text\"  pInputText placeholder=\"\u67E5\u8A62\" />\n        </span>\n      <p-selectButton\n        [options]=\"Options\"\n        [(ngModel)]=\"value\"\n        optionLabel=\"name\"\n        optionValue=\"value\"\n        (onOptionClick)=\"onSelectedChange()\"\n      >\n      <ng-template let-item pTemplate>\n        <span [class]=\"item.icon\"> {{ item.label }} </span>\n      </ng-template>\n      </p-selectButton>\n    </div>\n  </div>\n  <ng-container *ngIf=\"isGridView(); else listView\">\n    <div class=\"appstore-container\">\n      <p-divider class=\"first-class\"></p-divider>\n      <div class=\"flex flex-wrap card-content\">\n        <ng-container\n          *ngFor=\"let myAppStore of appStoreService.myAppStores()\"\n        >\n          <his-card-list\n            class=\"grid-style\"\n            [myAppStore]=\"myAppStore\"\n            (setChange)=\"appStoreService.onFavoriteClick($event)\"\n            (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n          </his-card-list>\n        </ng-container>\n      </div>\n    </div>\n  </ng-container>\n  <ng-template #listView>\n    <div class=\"appstore-container listView\">\n      <p-divider class=\"first-class\"></p-divider>\n      <div class=\"flex flex-wrap list-content\">\n        <ng-container\n          *ngFor=\"let myAppStore of appStoreService.myAppStores()\"\n        >\n          <his-card-list\n            class=\"list-style\"\n            [myAppStore]=\"myAppStore\"\n            [isListView]=\"true\"\n            (setChange)=\"appStoreService.onFavoriteClick($event)\"\n            (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n          </his-card-list>\n        </ng-container>\n      </div>\n      </div>\n  </ng-template>\n</div>\n\n\n\n\n\n", styles: [":host ::ng-deep .grid-style{margin:6px;width:calc(20% - 12px);max-width:320px}:host ::ng-deep .grid-style.second-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--tertiary-main)}:host ::ng-deep .grid-style.third-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--indigo-500)}:host ::ng-deep .grid-style.fourth-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--orange-500)}:host ::ng-deep .list-style .p-image.p-component{width:56px;height:56px}:host ::ng-deep .p-selectbutton .p-button{border-radius:0}:host ::ng-deep .p-selectbutton .p-button:first-child{border-radius:6px 0 0 6px}:host ::ng-deep .p-selectbutton .p-button:last-child{border-radius:0 6px 6px 0}.content-container{padding:32px;height:100%;display:flex;flex-direction:column;background-color:var(--surface-ground);overflow:auto}.appstore-container{padding:var(--spacing-xs) var(--spacing-lg)}.appstore-container.listView{width:100%;margin:0 auto}.appstore-container .card-content{width:95%;margin:0 auto;transform:translate(-6px);padding-bottom:var(--spacing-md)}.appstore-container .list-content{gap:12px}.top-bar-container{display:flex;flex-direction:row;align-items:center}.icon-container{display:flex;justify-content:space-between;align-items:center;gap:8px}.icon-container h3{font-size:1.5rem;font-style:normal;font-weight:700;line-height:2rem;letter-spacing:.03rem;color:var(--surface-on-surface)}.list-style{cursor:pointer;width:100%}:host ::ng-deep .p-buttonset .p-button-icon-only{justify-content:center;width:2rem;height:2rem}:host ::ng-deep .p-buttonset .p-button-icon-only .p-button-icon{font-size:1rem;padding-left:3px}:host ::ng-deep .p-divider.p-divider-horizontal{margin:12px 0}:host ::ng-deep .first-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--primary-main);border-width:4px}:host ::ng-deep .second-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--tertiary-main);border-width:4px}:host ::ng-deep .third-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--indigo-500);border-width:4px}:host ::ng-deep .fourth-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--orange-500);border-width:4px}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.toolbar-container{padding:var(--spacing-xs) var(--spacing-lg);display:flex;justify-content:space-between;width:100%;margin:var(--spacing-lg) 0 var(--spacing-sm)}\n"] }]
        }] });

/*
 * Public API Surface of app-store
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppStoreComponent, AppStoreService };
//# sourceMappingURL=his-view-app-store.mjs.map
