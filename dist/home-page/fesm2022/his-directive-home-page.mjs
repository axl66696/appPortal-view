import * as i2 from 'primeng/avatar';
import { AvatarModule } from 'primeng/avatar';
import * as i3 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import * as i0 from '@angular/core';
import { inject, Component } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { NewsService, NewsListComponent } from 'dist/news-info';
import { Router } from '@angular/router';
import { SharedService } from '@his-base/shared';
import { CardListComponent } from '@his-directive/card-list/dist/card-list';
import { AppStoreService } from 'dist/app-store';
import * as i4 from '@ngx-translate/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { UserAccountService } from 'dist/service';

class UserProfileComponent {
    constructor() {
        this.appStoreService = inject(AppStoreService);
        this.newsService = inject(NewsService);
        this.userAccountService = inject(UserAccountService);
        this.#router = inject(Router);
        this.#sharedService = inject(SharedService);
        this.#translate = inject(TranslateService);
    }
    #router;
    #sharedService;
    #translate;
    /**跳轉到查看更多消息的路徑
     * @memberof UserProfileComponent
     */
    onMoreNewsClick() {
        this.#sharedService.sharedValue = null;
        const key = this.#sharedService.setValue(this.userAccountService.userAccount());
        this.#router.navigate(['/news'], { state: { token: key } });
    }
    /**跳轉到最新消息中appUrl的路徑
     * @param {string} appUrl
     * @param {object} sharedData
     * @memberof UserProfileComponent
     */
    onNavNewsLinkClick(appUrl, sharedData) {
        const key = this.#sharedService.setValue(sharedData);
        this.#router.navigate([appUrl], { state: { token: key } });
    }
    /** 跳轉到應用程式page
     * @memberof UserProfileComponent
     */
    onMoreAppListClick() {
        const key = this.#sharedService.setValue(this.userAccountService.userAccount());
        this.#router.navigate(['/appStore'], { state: { token: key } });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: UserProfileComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: UserProfileComponent, isStandalone: true, selector: "his-user-profile", ngImport: i0, template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n      image=\"{{ userAccountService.userImage().image }}\"\n      styleClass=\"mr-2\"\n      size=\"xlarge\"\n      shape=\"circle\"\n    ></p-avatar>\n    <div class=\"title\">\n      {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n    </div>\n  </div>\n  <div class=\"flex flex-container\">\n    <div class=\"newsArea card flex justify-content-center card-container\">\n      <div class=\"see-more-container\">\n        <h3>{{'\u6700\u65B0\u6D88\u606F' | translate}}</h3>\n        <button\n          pButton\n          pRipple\n          label=\"{{'\u67E5\u770B\u66F4\u591A' | translate}}\"\n          (click)=\"onMoreNewsClick()\"\n        ></button>\n      </div>\n      <his-news-list\n        [news]=\"newsService.toDoList().concat(newsService.normalNews())\"\n        class=\"news-container\"\n      ></his-news-list>\n    </div>\n\n    <div class=\"favoriteArea card flex justify-content-center card-container\">\n      <div class=\"see-more-container\">\n        <h3>{{'\u6211\u7684\u6700\u611B'| translate }}</h3>\n        <button\n          pButton\n          pRipple\n          label=\"{{'\u67E5\u770B\u66F4\u591A' | translate}}\"\n          (click)=\"onMoreAppListClick()\"\n        ></button>\n      </div>\n      <div class=\"flex grid-container\">\n        <ng-container *ngFor=\"let myAppStore of appStoreService.myAppStores()\">\n          <ng-container *ngIf=\"myAppStore.isFavorite === true\">\n            <his-card-list\n              class=\"grid-style\"\n              [myAppStore]=\"myAppStore\"\n              (setChange)=\"appStoreService.onFavoriteClick($event)\"\n              (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n            </his-card-list>\n          </ng-container>\n        </ng-container>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [":host ::ng-deep .p-datatable .p-datatable-tbody>tr:last-child td{border-bottom:0}:host ::ng-deep .p-datatable .p-datatable-tbody>tr td{padding:7.5px 0}:host ::ng-deep td .p-button .p-button-label{line-height:1.5rem}his-card-list{padding:4px}.content-container{padding:32px;height:100%;gap:16px;display:flex;flex-direction:column;background-color:var(--surface-ground)}.top-bar-container{display:flex;flex-direction:row;align-items:center}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.flex-container{display:flex;gap:16px;flex:1;width:100%}.grid-container{margin:-4px;flex:1;width:100%;align-content:flex-start;flex-wrap:wrap}.newsArea{width:40.63%}.favoriteArea{flex:1}.favoriteArea his-card-list{height:-moz-fit-content;height:fit-content}.card-container{height:100%;border-radius:12px;background:var(--surface-section);padding:8px;display:flex;flex-direction:column;gap:8px}.see-more-container{width:100%;display:flex;justify-content:space-between;align-items:center}.news-container{background-color:var(--white);padding:var(--spacing-sm);border-radius:12px;overflow:hidden;width:100%;height:100%;box-shadow:0 2px 1px -1px #00000005,0 1px 1px #00000024,0 1px 3px #0000001f}.grid-style{cursor:pointer;width:33.3333333333%}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: AvatarModule }, { kind: "component", type: i2.Avatar, selector: "p-avatar", inputs: ["label", "icon", "image", "size", "shape", "style", "styleClass", "ariaLabel", "ariaLabelledBy"], outputs: ["onImageError"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i3.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "component", type: CardListComponent, selector: "his-card-list", inputs: ["myAppStore", "isListView", "headerTemplate", "bodyTemplate", "footerTemplate"], outputs: ["setChange", "clickCard"] }, { kind: "component", type: NewsListComponent, selector: "his-news-list", inputs: ["news", "customTemplate"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: UserProfileComponent, decorators: [{
            type: Component,
            args: [{ selector: 'his-user-profile', standalone: true, imports: [
                        CommonModule,
                        AvatarModule,
                        ButtonModule,
                        CardListComponent,
                        NewsListComponent,
                        NewsListComponent,
                        TranslateModule,
                    ], template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n      image=\"{{ userAccountService.userImage().image }}\"\n      styleClass=\"mr-2\"\n      size=\"xlarge\"\n      shape=\"circle\"\n    ></p-avatar>\n    <div class=\"title\">\n      {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n    </div>\n  </div>\n  <div class=\"flex flex-container\">\n    <div class=\"newsArea card flex justify-content-center card-container\">\n      <div class=\"see-more-container\">\n        <h3>{{'\u6700\u65B0\u6D88\u606F' | translate}}</h3>\n        <button\n          pButton\n          pRipple\n          label=\"{{'\u67E5\u770B\u66F4\u591A' | translate}}\"\n          (click)=\"onMoreNewsClick()\"\n        ></button>\n      </div>\n      <his-news-list\n        [news]=\"newsService.toDoList().concat(newsService.normalNews())\"\n        class=\"news-container\"\n      ></his-news-list>\n    </div>\n\n    <div class=\"favoriteArea card flex justify-content-center card-container\">\n      <div class=\"see-more-container\">\n        <h3>{{'\u6211\u7684\u6700\u611B'| translate }}</h3>\n        <button\n          pButton\n          pRipple\n          label=\"{{'\u67E5\u770B\u66F4\u591A' | translate}}\"\n          (click)=\"onMoreAppListClick()\"\n        ></button>\n      </div>\n      <div class=\"flex grid-container\">\n        <ng-container *ngFor=\"let myAppStore of appStoreService.myAppStores()\">\n          <ng-container *ngIf=\"myAppStore.isFavorite === true\">\n            <his-card-list\n              class=\"grid-style\"\n              [myAppStore]=\"myAppStore\"\n              (setChange)=\"appStoreService.onFavoriteClick($event)\"\n              (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n            </his-card-list>\n          </ng-container>\n        </ng-container>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [":host ::ng-deep .p-datatable .p-datatable-tbody>tr:last-child td{border-bottom:0}:host ::ng-deep .p-datatable .p-datatable-tbody>tr td{padding:7.5px 0}:host ::ng-deep td .p-button .p-button-label{line-height:1.5rem}his-card-list{padding:4px}.content-container{padding:32px;height:100%;gap:16px;display:flex;flex-direction:column;background-color:var(--surface-ground)}.top-bar-container{display:flex;flex-direction:row;align-items:center}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.flex-container{display:flex;gap:16px;flex:1;width:100%}.grid-container{margin:-4px;flex:1;width:100%;align-content:flex-start;flex-wrap:wrap}.newsArea{width:40.63%}.favoriteArea{flex:1}.favoriteArea his-card-list{height:-moz-fit-content;height:fit-content}.card-container{height:100%;border-radius:12px;background:var(--surface-section);padding:8px;display:flex;flex-direction:column;gap:8px}.see-more-container{width:100%;display:flex;justify-content:space-between;align-items:center}.news-container{background-color:var(--white);padding:var(--spacing-sm);border-radius:12px;overflow:hidden;width:100%;height:100%;box-shadow:0 2px 1px -1px #00000005,0 1px 1px #00000024,0 1px 3px #0000001f}.grid-style{cursor:pointer;width:33.3333333333%}\n"] }]
        }] });

/*
 * Public API Surface of home-page
 */

/**
 * Generated bundle index. Do not edit.
 */

export { UserProfileComponent };
//# sourceMappingURL=his-directive-home-page.mjs.map
