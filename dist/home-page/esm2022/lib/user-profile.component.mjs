import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsListComponent } from 'dist/news-info';
import { NewsService } from 'dist/news-info';
import { Router } from '@angular/router';
import { SharedService } from '@his-base/shared';
import { CardListComponent } from '@his-directive/card-list/dist/card-list';
import { AppStoreService } from 'dist/app-store';
import { WsNatsService } from './ws-nats.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserAccountService } from 'dist/service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/avatar";
import * as i3 from "primeng/button";
import * as i4 from "@ngx-translate/core";
export class UserProfileComponent {
    constructor() {
        this.appStoreService = inject(AppStoreService);
        this.newsService = inject(NewsService);
        this.userAccountService = inject(UserAccountService);
        this.#router = inject(Router);
        this.#sharedService = inject(SharedService);
        this.#wsNatsService = inject(WsNatsService);
        this.#translate = inject(TranslateService);
    }
    #router;
    #sharedService;
    #wsNatsService;
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.8", type: UserProfileComponent, isStandalone: true, selector: "his-user-profile", ngImport: i0, template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n      image=\"{{ userAccountService.userImage().image }}\"\n      styleClass=\"mr-2\"\n      size=\"xlarge\"\n      shape=\"circle\"\n    ></p-avatar>\n    <div class=\"title\">\n      {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n    </div>\n  </div>\n  <div class=\"flex flex-container\">\n    <div class=\"newsArea card flex justify-content-center card-container\">\n      <div class=\"see-more-container\">\n        <h3>{{'\u6700\u65B0\u6D88\u606F' | translate}}</h3>\n        <button\n          pButton\n          pRipple\n          label=\"{{'\u67E5\u770B\u66F4\u591A' | translate}}\"\n          (click)=\"onMoreNewsClick()\"\n        ></button>\n      </div>\n      <his-news-list\n        [news]=\"newsService.news()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </div>\n\n    <div class=\"favoriteArea card flex justify-content-center card-container\">\n      <div class=\"see-more-container\">\n        <h3>{{'\u6211\u7684\u6700\u611B'| translate }}</h3>\n        <button\n          pButton\n          pRipple\n          label=\"{{'\u67E5\u770B\u66F4\u591A' | translate}}\"\n          (click)=\"onMoreAppListClick()\"\n        ></button>\n      </div>\n      <div class=\"flex grid-container\">\n        <ng-container *ngFor=\"let myAppStore of appStoreService.myAppStores()\">\n          <ng-container *ngIf=\"myAppStore.isFavorite === true\">\n            <his-card-list\n              class=\"grid-style\"\n              [myAppStore]=\"myAppStore\"\n              (setChange)=\"appStoreService.onFavoriteClick($event)\"\n              (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n            </his-card-list>\n          </ng-container>\n        </ng-container>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [":host ::ng-deep .p-datatable .p-datatable-tbody>tr:last-child td{border-bottom:0}:host ::ng-deep .p-datatable .p-datatable-tbody>tr td{padding:7.5px 0}:host ::ng-deep td .p-button .p-button-label{line-height:1.5rem}his-card-list{padding:4px}.content-container{padding:32px;height:100%;gap:16px;display:flex;flex-direction:column;background-color:var(--surface-ground)}.top-bar-container{display:flex;flex-direction:row;align-items:center}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.flex-container{display:flex;gap:16px;flex:1;width:100%}.grid-container{margin:-4px;flex:1;width:100%;align-content:flex-start;flex-wrap:wrap}.newsArea{width:40.63%}.favoriteArea{flex:1}.favoriteArea his-card-list{height:-moz-fit-content;height:fit-content}.card-container{height:100%;border-radius:12px;background:var(--surface-section);padding:8px;display:flex;flex-direction:column;gap:8px}.see-more-container{width:100%;display:flex;justify-content:space-between;align-items:center}.news-container{background-color:var(--white);padding:var(--spacing-sm);border-radius:12px;overflow:hidden;width:100%;height:100%;box-shadow:0 2px 1px -1px #00000005,0 1px 1px #00000024,0 1px 3px #0000001f}.grid-style{cursor:pointer;width:33.3333333333%}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: AvatarModule }, { kind: "component", type: i2.Avatar, selector: "p-avatar", inputs: ["label", "icon", "image", "size", "shape", "style", "styleClass", "ariaLabel", "ariaLabelledBy"], outputs: ["onImageError"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i3.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "component", type: CardListComponent, selector: "his-card-list", inputs: ["myAppStore", "isListView", "headerTemplate", "bodyTemplate", "footerTemplate"], outputs: ["setChange", "clickCard"] }, { kind: "component", type: NewsListComponent, selector: "his-news-list", inputs: ["news", "customTemplate"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
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
                    ], template: "<!-- eslint-disable @angular-eslint/template/elements-content -->\n<div class=\"content-container\">\n  <div class=\"top-bar-container\">\n    <p-avatar\n      image=\"{{ userAccountService.userImage().image }}\"\n      styleClass=\"mr-2\"\n      size=\"xlarge\"\n      shape=\"circle\"\n    ></p-avatar>\n    <div class=\"title\">\n      {{ userAccountService.userAccount().userCode.display }},{{'\u6B61\u8FCE\u56DE\u4F86'| translate}}\n    </div>\n  </div>\n  <div class=\"flex flex-container\">\n    <div class=\"newsArea card flex justify-content-center card-container\">\n      <div class=\"see-more-container\">\n        <h3>{{'\u6700\u65B0\u6D88\u606F' | translate}}</h3>\n        <button\n          pButton\n          pRipple\n          label=\"{{'\u67E5\u770B\u66F4\u591A' | translate}}\"\n          (click)=\"onMoreNewsClick()\"\n        ></button>\n      </div>\n      <his-news-list\n        [news]=\"newsService.news()\"\n        class=\"news-container\"\n      ></his-news-list>\n    </div>\n\n    <div class=\"favoriteArea card flex justify-content-center card-container\">\n      <div class=\"see-more-container\">\n        <h3>{{'\u6211\u7684\u6700\u611B'| translate }}</h3>\n        <button\n          pButton\n          pRipple\n          label=\"{{'\u67E5\u770B\u66F4\u591A' | translate}}\"\n          (click)=\"onMoreAppListClick()\"\n        ></button>\n      </div>\n      <div class=\"flex grid-container\">\n        <ng-container *ngFor=\"let myAppStore of appStoreService.myAppStores()\">\n          <ng-container *ngIf=\"myAppStore.isFavorite === true\">\n            <his-card-list\n              class=\"grid-style\"\n              [myAppStore]=\"myAppStore\"\n              (setChange)=\"appStoreService.onFavoriteClick($event)\"\n              (clickCard)=\"appStoreService.onNavAppClick($event)\"\n            >\n            </his-card-list>\n          </ng-container>\n        </ng-container>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [":host ::ng-deep .p-datatable .p-datatable-tbody>tr:last-child td{border-bottom:0}:host ::ng-deep .p-datatable .p-datatable-tbody>tr td{padding:7.5px 0}:host ::ng-deep td .p-button .p-button-label{line-height:1.5rem}his-card-list{padding:4px}.content-container{padding:32px;height:100%;gap:16px;display:flex;flex-direction:column;background-color:var(--surface-ground)}.top-bar-container{display:flex;flex-direction:row;align-items:center}.title{padding-left:24px;font-size:28px;font-weight:700;line-height:40px;letter-spacing:1.12px;color:var(--primary-main)}.flex-container{display:flex;gap:16px;flex:1;width:100%}.grid-container{margin:-4px;flex:1;width:100%;align-content:flex-start;flex-wrap:wrap}.newsArea{width:40.63%}.favoriteArea{flex:1}.favoriteArea his-card-list{height:-moz-fit-content;height:fit-content}.card-container{height:100%;border-radius:12px;background:var(--surface-section);padding:8px;display:flex;flex-direction:column;gap:8px}.see-more-container{width:100%;display:flex;justify-content:space-between;align-items:center}.news-container{background-color:var(--white);padding:var(--spacing-sm);border-radius:12px;overflow:hidden;width:100%;height:100%;box-shadow:0 2px 1px -1px #00000005,0 1px 1px #00000024,0 1px 3px #0000001f}.grid-style{cursor:pointer;width:33.3333333333%}\n"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcm9maWxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2hvbWUtcGFnZS9zcmMvbGliL3VzZXItcHJvZmlsZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9ob21lLXBhZ2Uvc3JjL2xpYi91c2VyLXByb2ZpbGUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDNUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVsRCxPQUFPLEVBQUUsZUFBZSxFQUFDLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sY0FBYyxDQUFDOzs7Ozs7QUFpQmxELE1BQU0sT0FBTyxvQkFBb0I7SUFmakM7UUFpQkUsb0JBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDMUMsZ0JBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEMsdUJBQWtCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEQsWUFBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixtQkFBYyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2QyxtQkFBYyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2QyxlQUFVLEdBQXFCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBbUN6RDtJQXRDQyxPQUFPLENBQWtCO0lBQ3pCLGNBQWMsQ0FBeUI7SUFDdkMsY0FBYyxDQUF5QjtJQUN2QyxVQUFVLENBQThDO0lBS3hEOztPQUVHO0lBQ0gsZUFBZTtRQUNiLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN2QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FDdEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxDQUN0QyxDQUFDO1FBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxrQkFBa0IsQ0FBQyxNQUFjLEVBQUUsVUFBa0I7UUFDbkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsa0JBQWtCO1FBQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUN0QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQ3RDLENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsRSxDQUFDOzhHQTFDVSxvQkFBb0I7a0dBQXBCLG9CQUFvQiw0RUM5QmpDLHE3REF3REEsODBDRG5DSSxZQUFZLCtQQUNaLFlBQVksa09BQ1osWUFBWSx1S0FDWixpQkFBaUIseUxBQ2pCLGlCQUFpQiw2RkFFakIsZUFBZTs7MkZBR04sb0JBQW9CO2tCQWZoQyxTQUFTOytCQUNFLGtCQUFrQixjQUNoQixJQUFJLFdBR1A7d0JBQ1AsWUFBWTt3QkFDWixZQUFZO3dCQUNaLFlBQVk7d0JBQ1osaUJBQWlCO3dCQUNqQixpQkFBaUI7d0JBQ2pCLGlCQUFpQjt3QkFDakIsZUFBZTtxQkFDaEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdmF0YXJNb2R1bGUgfSBmcm9tICdwcmltZW5nL2F2YXRhcic7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUgfSBmcm9tICdwcmltZW5nL2J1dHRvbic7XG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmV3c0xpc3RDb21wb25lbnQgfSBmcm9tICdkaXN0L25ld3MtaW5mbyc7XG5pbXBvcnQgeyBOZXdzU2VydmljZSB9IGZyb20gJ2Rpc3QvbmV3cy1pbmZvJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTaGFyZWRTZXJ2aWNlIH0gZnJvbSAnQGhpcy1iYXNlL3NoYXJlZCc7XG5pbXBvcnQgeyBDYXJkTGlzdENvbXBvbmVudCB9IGZyb20gJ0BoaXMtZGlyZWN0aXZlL2NhcmQtbGlzdC9kaXN0L2NhcmQtbGlzdCc7XG5pbXBvcnQgeyBBcHBTdG9yZVNlcnZpY2UgfSBmcm9tICdkaXN0L2FwcC1zdG9yZSc7XG5pbXBvcnQgeyBXc05hdHNTZXJ2aWNlIH0gZnJvbSAnLi93cy1uYXRzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29kaW5nIH0gZnJvbSAnQGhpcy1iYXNlL2RhdGF0eXBlcyc7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2R1bGUsVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHsgVXNlckFjY291bnRTZXJ2aWNlIH0gZnJvbSAnZGlzdC9zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnaGlzLXVzZXItcHJvZmlsZScsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIHRlbXBsYXRlVXJsOiAnLi91c2VyLXByb2ZpbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi91c2VyLXByb2ZpbGUuY29tcG9uZW50LnNjc3MnXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBBdmF0YXJNb2R1bGUsXG4gICAgQnV0dG9uTW9kdWxlLFxuICAgIENhcmRMaXN0Q29tcG9uZW50LFxuICAgIE5ld3NMaXN0Q29tcG9uZW50LFxuICAgIE5ld3NMaXN0Q29tcG9uZW50LFxuICAgIFRyYW5zbGF0ZU1vZHVsZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgVXNlclByb2ZpbGVDb21wb25lbnQge1xuXG4gIGFwcFN0b3JlU2VydmljZSA9IGluamVjdChBcHBTdG9yZVNlcnZpY2UpO1xuICBuZXdzU2VydmljZSA9IGluamVjdChOZXdzU2VydmljZSk7XG4gIHVzZXJBY2NvdW50U2VydmljZSA9IGluamVjdChVc2VyQWNjb3VudFNlcnZpY2UpO1xuICAjcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gICNzaGFyZWRTZXJ2aWNlID0gaW5qZWN0KFNoYXJlZFNlcnZpY2UpO1xuICAjd3NOYXRzU2VydmljZSA9IGluamVjdChXc05hdHNTZXJ2aWNlKTtcbiAgI3RyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSA9IGluamVjdChUcmFuc2xhdGVTZXJ2aWNlKTtcblxuXG5cblxuICAvKirot7PovYnliLDmn6XnnIvmm7TlpJrmtojmga/nmoTot6/lvpFcbiAgICogQG1lbWJlcm9mIFVzZXJQcm9maWxlQ29tcG9uZW50XG4gICAqL1xuICBvbk1vcmVOZXdzQ2xpY2soKTogdm9pZCB7XG4gICAgdGhpcy4jc2hhcmVkU2VydmljZS5zaGFyZWRWYWx1ZSA9IG51bGw7XG4gICAgY29uc3Qga2V5ID0gdGhpcy4jc2hhcmVkU2VydmljZS5zZXRWYWx1ZShcbiAgICAgIHRoaXMudXNlckFjY291bnRTZXJ2aWNlLnVzZXJBY2NvdW50KClcbiAgICApO1xuICAgIHRoaXMuI3JvdXRlci5uYXZpZ2F0ZShbJy9uZXdzJ10sIHsgc3RhdGU6IHsgdG9rZW46IGtleSB9IH0pO1xuICB9XG5cbiAgLyoq6Lez6L2J5Yiw5pyA5paw5raI5oGv5LitYXBwVXJs55qE6Lev5b6RXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcHBVcmxcbiAgICogQHBhcmFtIHtvYmplY3R9IHNoYXJlZERhdGFcbiAgICogQG1lbWJlcm9mIFVzZXJQcm9maWxlQ29tcG9uZW50XG4gICAqL1xuICBvbk5hdk5ld3NMaW5rQ2xpY2soYXBwVXJsOiBzdHJpbmcsIHNoYXJlZERhdGE6IG9iamVjdCkge1xuICAgIGNvbnN0IGtleSA9IHRoaXMuI3NoYXJlZFNlcnZpY2Uuc2V0VmFsdWUoc2hhcmVkRGF0YSk7XG4gICAgdGhpcy4jcm91dGVyLm5hdmlnYXRlKFthcHBVcmxdLCB7IHN0YXRlOiB7IHRva2VuOiBrZXkgfSB9KTtcbiAgfVxuXG4gIC8qKiDot7PovYnliLDmh4nnlKjnqIvlvI9wYWdlXG4gICAqIEBtZW1iZXJvZiBVc2VyUHJvZmlsZUNvbXBvbmVudFxuICAgKi9cbiAgb25Nb3JlQXBwTGlzdENsaWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMuI3NoYXJlZFNlcnZpY2Uuc2V0VmFsdWUoXG4gICAgICB0aGlzLnVzZXJBY2NvdW50U2VydmljZS51c2VyQWNjb3VudCgpXG4gICAgKTtcbiAgICB0aGlzLiNyb3V0ZXIubmF2aWdhdGUoWycvYXBwU3RvcmUnXSwgeyBzdGF0ZTogeyB0b2tlbjoga2V5IH0gfSk7XG4gIH1cbn1cbiIsIjwhLS0gZXNsaW50LWRpc2FibGUgQGFuZ3VsYXItZXNsaW50L3RlbXBsYXRlL2VsZW1lbnRzLWNvbnRlbnQgLS0+XG48ZGl2IGNsYXNzPVwiY29udGVudC1jb250YWluZXJcIj5cbiAgPGRpdiBjbGFzcz1cInRvcC1iYXItY29udGFpbmVyXCI+XG4gICAgPHAtYXZhdGFyXG4gICAgICBpbWFnZT1cInt7IHVzZXJBY2NvdW50U2VydmljZS51c2VySW1hZ2UoKS5pbWFnZSB9fVwiXG4gICAgICBzdHlsZUNsYXNzPVwibXItMlwiXG4gICAgICBzaXplPVwieGxhcmdlXCJcbiAgICAgIHNoYXBlPVwiY2lyY2xlXCJcbiAgICA+PC9wLWF2YXRhcj5cbiAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5cbiAgICAgIHt7IHVzZXJBY2NvdW50U2VydmljZS51c2VyQWNjb3VudCgpLnVzZXJDb2RlLmRpc3BsYXkgfX0se3sn5q2h6L+O5Zue5L6GJ3wgdHJhbnNsYXRlfX1cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmbGV4IGZsZXgtY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm5ld3NBcmVhIGNhcmQgZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGNhcmQtY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VlLW1vcmUtY29udGFpbmVyXCI+XG4gICAgICAgIDxoMz57eyfmnIDmlrDmtojmga8nIHwgdHJhbnNsYXRlfX08L2gzPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgcEJ1dHRvblxuICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICBsYWJlbD1cInt7J+afpeeci+abtOWkmicgfCB0cmFuc2xhdGV9fVwiXG4gICAgICAgICAgKGNsaWNrKT1cIm9uTW9yZU5ld3NDbGljaygpXCJcbiAgICAgICAgPjwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8aGlzLW5ld3MtbGlzdFxuICAgICAgICBbbmV3c109XCJuZXdzU2VydmljZS5uZXdzKClcIlxuICAgICAgICBjbGFzcz1cIm5ld3MtY29udGFpbmVyXCJcbiAgICAgID48L2hpcy1uZXdzLWxpc3Q+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZmF2b3JpdGVBcmVhIGNhcmQgZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGNhcmQtY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VlLW1vcmUtY29udGFpbmVyXCI+XG4gICAgICAgIDxoMz57eyfmiJHnmoTmnIDmhJsnfCB0cmFuc2xhdGUgfX08L2gzPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgcEJ1dHRvblxuICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICBsYWJlbD1cInt7J+afpeeci+abtOWkmicgfCB0cmFuc2xhdGV9fVwiXG4gICAgICAgICAgKGNsaWNrKT1cIm9uTW9yZUFwcExpc3RDbGljaygpXCJcbiAgICAgICAgPjwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZmxleCBncmlkLWNvbnRhaW5lclwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBteUFwcFN0b3JlIG9mIGFwcFN0b3JlU2VydmljZS5teUFwcFN0b3JlcygpXCI+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm15QXBwU3RvcmUuaXNGYXZvcml0ZSA9PT0gdHJ1ZVwiPlxuICAgICAgICAgICAgPGhpcy1jYXJkLWxpc3RcbiAgICAgICAgICAgICAgY2xhc3M9XCJncmlkLXN0eWxlXCJcbiAgICAgICAgICAgICAgW215QXBwU3RvcmVdPVwibXlBcHBTdG9yZVwiXG4gICAgICAgICAgICAgIChzZXRDaGFuZ2UpPVwiYXBwU3RvcmVTZXJ2aWNlLm9uRmF2b3JpdGVDbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgKGNsaWNrQ2FyZCk9XCJhcHBTdG9yZVNlcnZpY2Uub25OYXZBcHBDbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvaGlzLWNhcmQtbGlzdD5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==