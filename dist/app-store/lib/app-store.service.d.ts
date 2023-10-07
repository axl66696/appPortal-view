import { UserAppStore } from "@his-viewmodel/app-portal/dist";
import { MyAppStore } from "@his-viewmodel/app-portal/dist";
import { AppStore } from "@his-viewmodel/app-portal/dist";
import * as i0 from "@angular/core";
export declare class AppStoreService {
    #private;
    appStores: import("@angular/core").WritableSignal<AppStore[]>;
    myAppStores: import("@angular/core").WritableSignal<MyAppStore[]>;
    appOpenedIndex: AppStore[];
    userAppStores: import("@angular/core").WritableSignal<UserAppStore[]>;
    /** 取得全部應用程式清單
     * @param {string} payload
     * @memberof AppStoreService
     */
    getAppStoreList(payload: string): void;
    /** 取得全部使用者應用程式清單
     * @param {string} payload
     * @memberof AppStoreService
    */
    getUserStoreList(payload: string): Promise<void>;
    /** 取得全部應用程式清單
     * @param {string} keyword
     * @memberof AppStoreService
    */
    getAppStoresByKeyword(keyword?: string): MyAppStore[];
    /** 取得目前應用程式資料
     * @param {string} appUrl
     * @memberof AppStoreService
    */
    getAppStore(appUrl: string): MyAppStore;
    /** publish 更新後使用者最愛應用程式到NATS
     * @param {UserAppStore} payload
     * @memberof AppStoreService
    */
    pubUserAppStoreFavorite(payload: UserAppStore): Promise<void>;
    /** 取得使用者資訊
     * @memberof AppStoreService
    */
    initAppStore(): Promise<void>;
    /** 應用程式點擊我的最愛icon
      * @param {string} appId
      * @memberof AppStoreService
    */
    onFavoriteClick(appId: string): void;
    /** 跳轉到module federation page
     * @param {string} appUrl
     * @memberof AppStoreService
    */
    onNavAppClick(appUrl: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppStoreService>;
}
