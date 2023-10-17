import { UserAppStore } from "@his-viewmodel/app-portal/dist";
import { MyAppStore } from "@his-viewmodel/app-portal/dist";
import { ExtendedMyAppStore } from '../types/extended-my-app-store';
import * as i0 from "@angular/core";
export declare class AppStoreService {
    #private;
    /** 目前使用者應用程式原始內容
     * @type {ExtendedMyAppStore}
     * @memberof AppStoreService
    */
    myAppStores: import("@angular/core").WritableSignal<ExtendedMyAppStore[]>;
    /** 所有使用者的應用程式
     * @type {UserAppStore}
     * @memberof AppStoreService
     */
    userAppStores: import("@angular/core").WritableSignal<UserAppStore[]>;
    /** 使用者打開應用程式順序
     * @type {ExtendedMyAppStore}
     * @memberof AppStoreService
     */
    appOpenedIndex: ExtendedMyAppStore[];
    /** 擴展MyAppStore到ExtendedMyAppStore
     * @param {MyAppStore[]} appStores
     * @memberof AppStoreService
     */
    convertToExtendedAppStores(appStores: MyAppStore[]): ExtendedMyAppStore[];
    /** 取得全部應用程式清單
     * @param {string} payload
     * @memberof AppStoreService
     */
    getAppStoreList(payload: string): import("rxjs").Observable<any>;
    /** 取得全部使用者應用程式清單
      * @param {string} payload
      * @memberof AppStoreService
      */
    getUserStoreList(payload: string): import("rxjs").Observable<any>;
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
    /** 設定應用程式關閉
     * @param {string} appId
     * @memberof AppStoreService
    */
    setAppClose(appId: string): void;
    /** 設定應用程式開啟
     * @param {string} appId
     * @memberof AppStoreService
    */
    setAppOpen(appId: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppStoreService>;
}
