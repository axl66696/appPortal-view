import * as i0 from '@angular/core';
import { signal, inject, Injectable, Component } from '@angular/core';
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
import { AvatarModule } from 'primeng/avatar';
import { CardListComponent } from '@his-directive/card-list/dist/card-list';
import * as i3 from 'primeng/api';

class AppStoreService {
    constructor() {
        this.appStores = signal([]);
        this.myAppStores = signal([]);
        this.appOpenedIndex = [];
        this.userAppStores = signal([]);
        this.#router = inject(Router);
        this.#jetStreamWsService = inject(JetstreamWsService);
        this.#sharedService = inject(SharedService);
    }
    #router;
    #jetStreamWsService;
    #sharedService;
    /** 取得全部應用程式清單
     * @param {string} payload
     * @memberof AppStoreService
     */
    getAppStoreList(payload) {
        // @ts-ignore
        // 需帶入指定的主題跟要傳遞的資料
        console.log('in getAppStoreList');
        // const myAppStore = await lastValueFrom(this.#jetStreamWsService.request('UserAppStore.myAppStore', payload));
        this.#jetStreamWsService.request('UserAppStore.myAppStore', payload).subscribe((result) => {
            // 處理資料邏輯的地方，取得reply回傳的資料
            console.log('getAppStoreList result', result);
            this.myAppStores.set(result);
        });
    }
    /** 取得全部使用者應用程式清單
     * @param {string} payload
     * @memberof AppStoreService
    */
    async getUserStoreList(payload) {
        // @ts-ignore
        // 需帶入指定的主題跟要傳遞的資料
        console.log('in getUserStoreList');
        this.#jetStreamWsService.request('UserAppStore.list', payload).subscribe((result) => {
            console.log('getUserStoreList result', result);
            this.userAppStores.set(result);
        });
        // const userAppStore = await lastValueFrom(this.#jetStreamWsService.request('UserAppStore.list', payload));
        // const jsonCodec = JSONCodec()
        // const returnValue = jsonCodec.decode(userAppStore.data) as UserAppStore[]
        // return returnValue as unknown as UserAppStore[] ;
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
        // const info: TransferInfo<UserAppStore> = {
        //   data: payload,
        // };
        // @ts-ignore
        // 需帶入指定發布主題以及要傳送的訊息
        await this.#jetStreamWsService.publish('UserAppStore.update.isFavorite', payload);
    }
    /** 取得使用者資訊
     * @memberof AppStoreService
    */
    async initAppStore() {
        const userCode = await this.#sharedService.getValue(history.state.token.userCode);
        await this.getAppStoreList(userCode);
        await this.getUserStoreList(userCode);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

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

class AppStoreComponent {
    constructor() {
        this.isGridView = signal(true);
        this.appStoreService = inject(AppStoreService);
        this.#sharedService = inject(SharedService);
        this.#wsNatsService = inject(WsNatsService);
        this.Options = [
            { icon: 'material-symbols-outlined', label: 'grid_view', value: 'grid' },
            { icon: 'material-symbols-outlined', label: 'view_agenda', value: 'list' },
        ];
        this.value = 'grid';
    }
    #sharedService;
    #wsNatsService;
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
    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    async ngOnInit() {
        await this.#wsNatsService.connect();
        await this.appStoreService.initAppStore();
        // console.log(this.#sharedService.getValue(history.state.token));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: AppStoreComponent, isStandalone: true, selector: "his-app-store", ngImport: i0, template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n      <!-- <p-avatar\n        image=\"{{ userInfoService.userImage().image }}\"\n        styleClass=\"mr-2\"\n        size=\"xlarge\"\n        shape=\"circle\"\n      ></p-avatar> -->\n      <!-- <div class=\"title\" i18n>{{ userInfoService.userInfo().userCode.display }},\u6B61\u8FCE\u56DE\u4F86</div> -->\n  </div>\n  <div class=\"toolbar-container\">\n    <div class=\"icon-container title-box\">\n      <button\n        pButton\n        pRipple\n        type=\"button\"\n        icon=\"pi pi-angle-left\"\n        class=\"p-button-rounded p-button-secondary p-button-outlined\"\n        (click)=\"onBackClick()\"\n      ></button>\n      <div><h3>\u7A0B\u5F0F\u96C6</h3></div>\n    </div>\n    <div class=\"icon-container\">\n        <span class=\"p-input-icon-left\">\n          <i class=\"pi pi-search\"></i>\n          <input type=\"text\"  pInputText placeholder=\"\u67E5\u8A62\" />\n        </span>\n      <p-selectButton\n        [options]=\"Options\"\n        [(ngModel)]=\"value\"\n        optionLabel=\"name\"\n        optionValue=\"value\"\n        (onOptionClick)=\"onSelectedChange()\"\n      >\n      <ng-template let-item pTemplate>\n        <span [class]=\"item.icon\"> {{ item.label }} </span>\n      </ng-template>\n      </p-selectButton>\n    </div>\n  </div>\n  <ng-container *ngIf=\"isGridView(); else listView\">\n    <div class=\"appstore-container\">\n      <p-divider class=\"first-class\"></p-divider>\n      <div class=\"flex flex-wrap card-content\">\n        <ng-container\n          *ngFor=\"let myAppStore of appStoreService.myAppStores()\"\n        >\n          <his-card-list\n            class=\"grid-style\"\n            [myAppStore]=\"myAppStore\"\n            (setChange)=\"appStoreService.onFavoriteClick($event)\"\n            (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n          </his-card-list>\n        </ng-container>\n      </div>\n    </div>\n  </ng-container>\n  <ng-template #listView>\n    <div class=\"appstore-container listView\">\n      <p-divider class=\"first-class\"></p-divider>\n      <div class=\"flex flex-wrap list-content\">\n        <ng-container\n          *ngFor=\"let myAppStore of appStoreService.myAppStores()\"\n        >\n          <his-card-list\n            class=\"list-style\"\n            [myAppStore]=\"myAppStore\"\n            [isListView]=\"true\"\n            (setChange)=\"appStoreService.onFavoriteClick($event)\"\n            (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n          </his-card-list>\n        </ng-container>\n      </div>\n      </div>\n  </ng-template>\n</div>\n\n\n\n\n\n", styles: [":host ::ng-deep .grid-style{margin:6px;width:calc(20% - 12px);max-width:320px}:host ::ng-deep .grid-style.second-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--tertiary-main)}:host ::ng-deep .grid-style.third-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--indigo-500)}:host ::ng-deep .grid-style.fourth-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--orange-500)}:host ::ng-deep .list-style .p-image.p-component{width:56px;height:56px}:host ::ng-deep .p-selectbutton .p-button{border-radius:0}:host ::ng-deep .p-selectbutton .p-button:first-child{border-radius:6px 0 0 6px}:host ::ng-deep .p-selectbutton .p-button:last-child{border-radius:0 6px 6px 0}.content-container{padding:32px;height:100%;display:flex;flex-direction:column;background-color:var(--surface-ground);overflow:auto}.appstore-container{padding:var(--spacing-xs) var(--spacing-lg)}.appstore-container.listView{width:100%;margin:0 auto}.appstore-container .card-content{width:95%;margin:0 auto;transform:translate(-6px);padding-bottom:var(--spacing-md)}.appstore-container .list-content{gap:12px}.top-bar-container{display:flex;flex-direction:row;align-items:center}.icon-container{display:flex;justify-content:space-between;align-items:center;gap:8px}.icon-container h3{font-size:1.5rem;font-style:normal;font-weight:700;line-height:2rem;letter-spacing:.03rem;color:var(--surface-on-surface)}.list-style{cursor:pointer;width:100%}:host ::ng-deep .p-buttonset .p-button-icon-only{justify-content:center;width:2rem;height:2rem}:host ::ng-deep .p-buttonset .p-button-icon-only .p-button-icon{font-size:1rem;padding-left:3px}:host ::ng-deep .p-divider.p-divider-horizontal{margin:12px 0}:host ::ng-deep .first-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--primary-main);border-width:4px}:host ::ng-deep .second-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--tertiary-main);border-width:4px}:host ::ng-deep .third-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--indigo-500);border-width:4px}:host ::ng-deep .fourth-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--orange-500);border-width:4px}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.toolbar-container{padding:var(--spacing-xs) var(--spacing-lg);display:flex;justify-content:space-between;width:100%;margin:var(--spacing-lg) 0 var(--spacing-sm)}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i2.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "directive", type: i3.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: DividerModule }, { kind: "component", type: i4.Divider, selector: "p-divider", inputs: ["style", "styleClass", "layout", "type", "align"] }, { kind: "ngmodule", type: SelectButtonModule }, { kind: "component", type: i5.SelectButton, selector: "p-selectButton", inputs: ["options", "optionLabel", "optionValue", "optionDisabled", "tabindex", "multiple", "style", "styleClass", "ariaLabelledBy", "disabled", "dataKey"], outputs: ["onOptionClick", "onChange"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: InputTextModule }, { kind: "directive", type: i7.InputText, selector: "[pInputText]" }, { kind: "ngmodule", type: AvatarModule }, { kind: "component", type: CardListComponent, selector: "his-card-list", inputs: ["myAppStore", "isListView", "headerTemplate", "bodyTemplate", "footerTemplate"], outputs: ["setChange", "clickCard"] }] }); }
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
                        CardListComponent
                    ], template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n      <!-- <p-avatar\n        image=\"{{ userInfoService.userImage().image }}\"\n        styleClass=\"mr-2\"\n        size=\"xlarge\"\n        shape=\"circle\"\n      ></p-avatar> -->\n      <!-- <div class=\"title\" i18n>{{ userInfoService.userInfo().userCode.display }},\u6B61\u8FCE\u56DE\u4F86</div> -->\n  </div>\n  <div class=\"toolbar-container\">\n    <div class=\"icon-container title-box\">\n      <button\n        pButton\n        pRipple\n        type=\"button\"\n        icon=\"pi pi-angle-left\"\n        class=\"p-button-rounded p-button-secondary p-button-outlined\"\n        (click)=\"onBackClick()\"\n      ></button>\n      <div><h3>\u7A0B\u5F0F\u96C6</h3></div>\n    </div>\n    <div class=\"icon-container\">\n        <span class=\"p-input-icon-left\">\n          <i class=\"pi pi-search\"></i>\n          <input type=\"text\"  pInputText placeholder=\"\u67E5\u8A62\" />\n        </span>\n      <p-selectButton\n        [options]=\"Options\"\n        [(ngModel)]=\"value\"\n        optionLabel=\"name\"\n        optionValue=\"value\"\n        (onOptionClick)=\"onSelectedChange()\"\n      >\n      <ng-template let-item pTemplate>\n        <span [class]=\"item.icon\"> {{ item.label }} </span>\n      </ng-template>\n      </p-selectButton>\n    </div>\n  </div>\n  <ng-container *ngIf=\"isGridView(); else listView\">\n    <div class=\"appstore-container\">\n      <p-divider class=\"first-class\"></p-divider>\n      <div class=\"flex flex-wrap card-content\">\n        <ng-container\n          *ngFor=\"let myAppStore of appStoreService.myAppStores()\"\n        >\n          <his-card-list\n            class=\"grid-style\"\n            [myAppStore]=\"myAppStore\"\n            (setChange)=\"appStoreService.onFavoriteClick($event)\"\n            (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n          </his-card-list>\n        </ng-container>\n      </div>\n    </div>\n  </ng-container>\n  <ng-template #listView>\n    <div class=\"appstore-container listView\">\n      <p-divider class=\"first-class\"></p-divider>\n      <div class=\"flex flex-wrap list-content\">\n        <ng-container\n          *ngFor=\"let myAppStore of appStoreService.myAppStores()\"\n        >\n          <his-card-list\n            class=\"list-style\"\n            [myAppStore]=\"myAppStore\"\n            [isListView]=\"true\"\n            (setChange)=\"appStoreService.onFavoriteClick($event)\"\n            (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n          </his-card-list>\n        </ng-container>\n      </div>\n      </div>\n  </ng-template>\n</div>\n\n\n\n\n\n", styles: [":host ::ng-deep .grid-style{margin:6px;width:calc(20% - 12px);max-width:320px}:host ::ng-deep .grid-style.second-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--tertiary-main)}:host ::ng-deep .grid-style.third-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--indigo-500)}:host ::ng-deep .grid-style.fourth-class .p-image.p-component{background:linear-gradient(0deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 100%),var(--orange-500)}:host ::ng-deep .list-style .p-image.p-component{width:56px;height:56px}:host ::ng-deep .p-selectbutton .p-button{border-radius:0}:host ::ng-deep .p-selectbutton .p-button:first-child{border-radius:6px 0 0 6px}:host ::ng-deep .p-selectbutton .p-button:last-child{border-radius:0 6px 6px 0}.content-container{padding:32px;height:100%;display:flex;flex-direction:column;background-color:var(--surface-ground);overflow:auto}.appstore-container{padding:var(--spacing-xs) var(--spacing-lg)}.appstore-container.listView{width:100%;margin:0 auto}.appstore-container .card-content{width:95%;margin:0 auto;transform:translate(-6px);padding-bottom:var(--spacing-md)}.appstore-container .list-content{gap:12px}.top-bar-container{display:flex;flex-direction:row;align-items:center}.icon-container{display:flex;justify-content:space-between;align-items:center;gap:8px}.icon-container h3{font-size:1.5rem;font-style:normal;font-weight:700;line-height:2rem;letter-spacing:.03rem;color:var(--surface-on-surface)}.list-style{cursor:pointer;width:100%}:host ::ng-deep .p-buttonset .p-button-icon-only{justify-content:center;width:2rem;height:2rem}:host ::ng-deep .p-buttonset .p-button-icon-only .p-button-icon{font-size:1rem;padding-left:3px}:host ::ng-deep .p-divider.p-divider-horizontal{margin:12px 0}:host ::ng-deep .first-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--primary-main);border-width:4px}:host ::ng-deep .second-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--tertiary-main);border-width:4px}:host ::ng-deep .third-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--indigo-500);border-width:4px}:host ::ng-deep .fourth-class .p-divider-solid.p-divider-horizontal:before{border-color:var(--orange-500);border-width:4px}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.toolbar-container{padding:var(--spacing-xs) var(--spacing-lg);display:flex;justify-content:space-between;width:100%;margin:var(--spacing-lg) 0 var(--spacing-sm)}\n"] }]
        }] });

/*
 * Public API Surface of app-store
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppStoreComponent, AppStoreService };
//# sourceMappingURL=his-view-app-store.mjs.map
