import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { UserAccountService } from 'service';
import * as i0 from "@angular/core";
export class AppStoreService {
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
        /** 使用者打開應用程式順序
         * @type {ExtendedMyAppStore}
         * @memberof AppStoreService
         */
        this.appOpenedIndex = [];
        this.#router = inject(Router);
        this.#jetStreamWsService = inject(JetstreamWsService);
        this.#userAccountService = inject(UserAccountService);
    }
    #router;
    #jetStreamWsService;
    #userAccountService;
    /** 擴展MyAppStore到ExtendedMyAppStore
     * @param {MyAppStore[]} appStores
     * @memberof AppStoreService
     */
    convertToExtendedAppStores(appStores) {
        return appStores.map(appStore => ({ ...appStore, isOpen: false }));
    }
    /** 取得全部應用程式清單
     * @param {string} payload
     * @memberof AppStoreService
     */
    getAppStoreList(payload) {
        return this.#jetStreamWsService.request('appPortal.appStore.myAppStores', payload);
    }
    /** 取得全部使用者應用程式清單
      * @param {string} payload
      * @memberof AppStoreService
      */
    getUserStoreList(payload) {
        return this.#jetStreamWsService.request('appPortal.appStore.userAppStores', payload);
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
        await this.#jetStreamWsService.publish('appPortal.appStore.userFavorite', payload);
    }
    /** 應用程式點擊我的最愛icon
     * @param {string} appId
     * @memberof AppStoreService
     */
    onFavoriteClick(appId) {
        this.myAppStores.update(myAppStoreArray => {
            return myAppStoreArray.map(myAppStore => {
                if (myAppStore.appId === appId) {
                    // 切换 isFavorite 值
                    myAppStore.isFavorite = !myAppStore.isFavorite;
                    // 在 userAppStores 中找到相應的項目更新它的 isFavorite
                    const userAppStore = this.userAppStores().find(userAppStore => userAppStore.appId === appId);
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
        if (this.appOpenedIndex.length > 1) {
            const index = this.appOpenedIndex.findIndex(app => app.appId === appId);
            this.appOpenedIndex.splice(index, 1);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: AppStoreService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: AppStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: AppStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAtc3RvcmUvc3JjL2xpYi9hcHAtc3RvcmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3pDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBR2pFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7QUFLN0MsTUFBTSxPQUFPLGVBQWU7SUFINUI7UUFLRTs7O1VBR0U7UUFDRixnQkFBVyxHQUFHLE1BQU0sQ0FBdUIsRUFBRSxDQUFDLENBQUE7UUFHOUM7OztXQUdHO1FBQ0gsa0JBQWEsR0FBRyxNQUFNLENBQWlCLEVBQUUsQ0FBQyxDQUFBO1FBRTFDOzs7V0FHRztRQUNILG1CQUFjLEdBQUcsRUFBMEIsQ0FBQTtRQUUzQyxZQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLHdCQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2pELHdCQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBNkhsRDtJQS9IQyxPQUFPLENBQWtCO0lBQ3pCLG1CQUFtQixDQUE4QjtJQUNqRCxtQkFBbUIsQ0FBOEI7SUFHakQ7OztPQUdHO0lBQ0gsMEJBQTBCLENBQUMsU0FBdUI7UUFDOUMsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLEdBQUcsUUFBUSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVEOzs7T0FHRztJQUNILGVBQWUsQ0FBQyxPQUFlO1FB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LENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUU7Z0JBQy9ELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQ2xDO1NBQ0Y7SUFDSCxDQUFDOzhHQW5KVSxlQUFlO2tIQUFmLGVBQWUsY0FGZCxNQUFNOzsyRkFFUCxlQUFlO2tCQUgzQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVzZXJBY2NvdW50IH0gZnJvbSAnQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0L2FwcC91c2VyLWFjY291bnQnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBVc2VyQXBwU3RvcmUgfSBmcm9tIFwiQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0XCI7XG5pbXBvcnQgeyBNeUFwcFN0b3JlIH0gZnJvbSBcIkBoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdFwiO1xuaW1wb3J0IHsgSmV0c3RyZWFtV3NTZXJ2aWNlIH0gZnJvbSAnQGhpcy1iYXNlL2pldHN0cmVhbS13cy9kaXN0JztcbmltcG9ydCB7IEV4dGVuZGVkTXlBcHBTdG9yZSB9IGZyb20gJy4uL3R5cGVzL2V4dGVuZGVkLW15LWFwcC1zdG9yZSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBVc2VyQWNjb3VudFNlcnZpY2UgfSBmcm9tICdzZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQXBwU3RvcmVTZXJ2aWNlIHtcblxuICAvKiog55uu5YmN5L2/55So6ICF5oeJ55So56iL5byP5Y6f5aeL5YWn5a65XG4gICAqIEB0eXBlIHtFeHRlbmRlZE15QXBwU3RvcmV9XG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgKi9cbiAgbXlBcHBTdG9yZXMgPSBzaWduYWw8RXh0ZW5kZWRNeUFwcFN0b3JlW10+KFtdKVxuXG5cbiAgLyoqIOaJgOacieS9v+eUqOiAheeahOaHieeUqOeoi+W8j1xuICAgKiBAdHlwZSB7VXNlckFwcFN0b3JlfVxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICB1c2VyQXBwU3RvcmVzID0gc2lnbmFsPFVzZXJBcHBTdG9yZVtdPihbXSlcblxuICAvKiog5L2/55So6ICF5omT6ZaL5oeJ55So56iL5byP6aCG5bqPXG4gICAqIEB0eXBlIHtFeHRlbmRlZE15QXBwU3RvcmV9XG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGFwcE9wZW5lZEluZGV4ID0gW10gYXMgRXh0ZW5kZWRNeUFwcFN0b3JlW11cblxuICAjcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcbiAgI3VzZXJBY2NvdW50U2VydmljZSA9IGluamVjdChVc2VyQWNjb3VudFNlcnZpY2UpO1xuXG5cbiAgLyoqIOaTtOWxlU15QXBwU3RvcmXliLBFeHRlbmRlZE15QXBwU3RvcmVcbiAgICogQHBhcmFtIHtNeUFwcFN0b3JlW119IGFwcFN0b3Jlc1xuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBjb252ZXJ0VG9FeHRlbmRlZEFwcFN0b3JlcyhhcHBTdG9yZXM6IE15QXBwU3RvcmVbXSk6IEV4dGVuZGVkTXlBcHBTdG9yZVtdIHtcbiAgICAgIHJldHVybiBhcHBTdG9yZXMubWFwKGFwcFN0b3JlID0+ICh7Li4uYXBwU3RvcmUsaXNPcGVuOiBmYWxzZX0pKTtcbiAgfVxuXG4gIC8qKiDlj5blvpflhajpg6jmh4nnlKjnqIvlvI/muIXllq5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgZ2V0QXBwU3RvcmVMaXN0KHBheWxvYWQ6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnYXBwUG9ydGFsLmFwcFN0b3JlLm15QXBwU3RvcmVzJywgcGF5bG9hZClcbiAgfVxuXG4gIC8qKiDlj5blvpflhajpg6jkvb/nlKjogIXmh4nnlKjnqIvlvI/muIXllq5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkXG4gICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAgKi9cbiAgZ2V0VXNlclN0b3JlTGlzdChwYXlsb2FkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ2FwcFBvcnRhbC5hcHBTdG9yZS51c2VyQXBwU3RvcmVzJywgcGF5bG9hZClcbiAgfVxuXG4gIC8qKiDlj5blvpflhajpg6jmh4nnlKjnqIvlvI/muIXllq5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgZ2V0QXBwU3RvcmVzQnlLZXl3b3JkKGtleXdvcmQ/OiBzdHJpbmcpOiBNeUFwcFN0b3JlW10ge1xuICAgIGlmIChrZXl3b3JkKSB7XG4gICAgICByZXR1cm4gdGhpcy5teUFwcFN0b3JlcygpLmZpbHRlcigobXlBcHBTdG9yZSkgPT4gbXlBcHBTdG9yZS50aXRsZS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5teUFwcFN0b3JlcygpXG4gICAgfVxuICB9XG5cbiAgLyoqIOWPluW+l+ebruWJjeaHieeUqOeoi+W8j+izh+aWmVxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwVXJsXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGdldEFwcFN0b3JlKGFwcFVybDogc3RyaW5nKTogTXlBcHBTdG9yZSB7XG4gICAgY29uc3QgbXlBcHBTdG9yZSA9IHRoaXMubXlBcHBTdG9yZXMoKS5maWx0ZXIoKG15QXBwU3RvcmUpID0+IG15QXBwU3RvcmUudXJsID09PSBhcHBVcmwpWzBdXG4gICAgcmV0dXJuIG15QXBwU3RvcmU7XG4gIH1cblxuICAvKiogcHVibGlzaCDmm7TmlrDlvozkvb/nlKjogIXmnIDmhJvmh4nnlKjnqIvlvI/liLBOQVRTXG4gICAqIEBwYXJhbSB7VXNlckFwcFN0b3JlfSBwYXlsb2FkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGFzeW5jIHB1YlVzZXJBcHBTdG9yZUZhdm9yaXRlKHBheWxvYWQ6IFVzZXJBcHBTdG9yZSkge1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5wdWJsaXNoKCdhcHBQb3J0YWwuYXBwU3RvcmUudXNlckZhdm9yaXRlJywgcGF5bG9hZCk7XG4gIH1cblxuXG5cbiAgLyoqIOaHieeUqOeoi+W8j+m7nuaTiuaIkeeahOacgOaEm2ljb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcElkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIG9uRmF2b3JpdGVDbGljayhhcHBJZDogc3RyaW5nKTp2b2lkIHtcbiAgICB0aGlzLm15QXBwU3RvcmVzLnVwZGF0ZShteUFwcFN0b3JlQXJyYXkgPT4ge1xuICAgICAgcmV0dXJuIG15QXBwU3RvcmVBcnJheS5tYXAobXlBcHBTdG9yZSA9PiB7XG4gICAgICAgIGlmIChteUFwcFN0b3JlLmFwcElkID09PSBhcHBJZCkge1xuICAgICAgICAgIC8vIOWIh+aNoiBpc0Zhdm9yaXRlIOWAvFxuICAgICAgICAgIG15QXBwU3RvcmUuaXNGYXZvcml0ZSA9ICFteUFwcFN0b3JlLmlzRmF2b3JpdGU7XG4gICAgICAgICAgLy8g5ZyoIHVzZXJBcHBTdG9yZXMg5Lit5om+5Yiw55u45oeJ55qE6aCF55uu5pu05paw5a6D55qEIGlzRmF2b3JpdGVcbiAgICAgICAgICBjb25zdCB1c2VyQXBwU3RvcmUgPSB0aGlzLnVzZXJBcHBTdG9yZXMoKS5maW5kKHVzZXJBcHBTdG9yZSA9PiB1c2VyQXBwU3RvcmUuYXBwSWQgPT09IGFwcElkKTtcbiAgICAgICAgICBpZiAodXNlckFwcFN0b3JlKSB7XG4gICAgICAgICAgICAgIHVzZXJBcHBTdG9yZS5pc0Zhdm9yaXRlID0gbXlBcHBTdG9yZS5pc0Zhdm9yaXRlO1xuICAgICAgICAgICAgICB0aGlzLnB1YlVzZXJBcHBTdG9yZUZhdm9yaXRlKHVzZXJBcHBTdG9yZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbXlBcHBTdG9yZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIOi3s+i9ieWIsG1vZHVsZSBmZWRlcmF0aW9uIHBhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcFVybFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBvbk5hdkFwcENsaWNrKGFwcFVybDogbnVtYmVyKTp2b2lke1xuICAgIHRoaXMuI3JvdXRlci5uYXZpZ2F0ZShbYXBwVXJsXSlcbiAgfVxuXG4gIC8qKiDoqK3lrprmh4nnlKjnqIvlvI/pl5zplolcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcElkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgKi9cbiAgICBzZXRBcHBDbG9zZShhcHBJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICB0aGlzLm15QXBwU3RvcmVzLnVwZGF0ZShhcHBzID0+IGFwcHMubWFwKGFwcCA9PiB7IGFwcC5hcHBJZCA9PT0gYXBwSWQgPyBhcHAuaXNPcGVuID0gZmFsc2UgOiBhcHA7IHJldHVybiBhcHAgfSkpXG5cbiAgICAgIGlmICh0aGlzLmFwcE9wZW5lZEluZGV4Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmFwcE9wZW5lZEluZGV4LmZpbmRJbmRleChhcHAgPT4gYXBwLmFwcElkID09PSBhcHBJZClcbiAgICAgICAgdGhpcy5hcHBPcGVuZWRJbmRleC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLiNyb3V0ZXIubmF2aWdhdGUoW3RoaXMuYXBwT3BlbmVkSW5kZXhbdGhpcy5hcHBPcGVuZWRJbmRleC5sZW5ndGggLSAxXS51cmxdKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuYXBwT3BlbmVkSW5kZXguc3BsaWNlKDEsIDEpO1xuICAgICAgICB0aGlzLiNyb3V0ZXIubmF2aWdhdGVCeVVybCgnL2hvbWUnKVxuICAgICAgfVxuICAgIH1cblxuICAvKiog6Kit5a6a5oeJ55So56iL5byP6ZaL5ZWfXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcHBJZFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICovXG4gIHNldEFwcE9wZW4oYXBwSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGZpbmRBcHAgPSB0aGlzLm15QXBwU3RvcmVzKCkuZmlsdGVyKHggPT4geC5hcHBJZCA9PT0gYXBwSWQpWzBdXG5cbiAgICBjb25zdCBvYmplY3RzQXJlRXF1YWwgPSAoeDogRXh0ZW5kZWRNeUFwcFN0b3JlLCB5OiBFeHRlbmRlZE15QXBwU3RvcmUpID0+IHtcbiAgICAgIHJldHVybiB4LnVybCA9PT0geS51cmw7XG4gICAgfTtcblxuICAgIGlmIChmaW5kQXBwKSB7XG4gICAgICB0aGlzLm15QXBwU3RvcmVzLnVwZGF0ZSh4ID0+IHgubWFwKHkgPT4geyB5LmFwcElkID09PSBhcHBJZCA/IHkuaXNPcGVuID0gdHJ1ZSA6IHk7IHJldHVybiB5IH0pKVxuICAgICAgaWYgKCF0aGlzLmFwcE9wZW5lZEluZGV4LmZpbmQoeCA9PiBvYmplY3RzQXJlRXF1YWwoeCwgZmluZEFwcCkpKSB7XG4gICAgICAgIHRoaXMuYXBwT3BlbmVkSW5kZXgucHVzaChmaW5kQXBwKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cblxuXG4iXX0=