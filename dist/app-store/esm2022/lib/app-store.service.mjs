import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { SharedService } from '@his-base/shared';
import { WsNatsService } from './ws-nats.service';
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: AppStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAtc3RvcmUvc3JjL2xpYi9hcHAtc3RvcmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSXpDLE9BQU8sRUFBYSxrQkFBa0IsRUFBZ0IsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG1CQUFtQixDQUFDOztBQVdsRCxNQUFNLE9BQU8sZUFBZTtJQUg1QjtRQUtFOzs7VUFHRTtRQUNGLGdCQUFXLEdBQUcsTUFBTSxDQUF1QixFQUFFLENBQUMsQ0FBQTtRQUc5Qzs7O1dBR0c7UUFDSCxrQkFBYSxHQUFHLE1BQU0sQ0FBaUIsRUFBRSxDQUFDLENBQUE7UUFFMUMsbUJBQWMsR0FBRyxFQUEwQixDQUFBO1FBRTNDLFlBQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDakQsbUJBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkMsbUJBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7S0FxSnhDO0lBeEpDLE9BQU8sQ0FBa0I7SUFDekIsbUJBQW1CLENBQThCO0lBQ2pELGNBQWMsQ0FBeUI7SUFDdkMsY0FBYyxDQUF5QjtJQUV2Qzs7O09BR0c7SUFDSCxpQkFBaUIsQ0FBQyxTQUF1QjtRQUNyQyxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsR0FBRyxRQUFRLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFlO1FBQ25DLGFBQWE7UUFDYixrQkFBa0I7UUFDbEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRTtZQUM3RixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBaUMsQ0FBQyxDQUFDLENBQUE7UUFDakYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztRQUdJO0lBQ0osS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQWU7UUFDcEMsYUFBYTtRQUNiLGtCQUFrQjtRQUNsQixJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO1lBQ3ZGLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQW1DLENBQUMsQ0FBQTtRQUM3RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSCxxQkFBcUIsQ0FBQyxPQUFnQjtRQUNwQyxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtTQUNyRjthQUNJO1lBQ0gsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7U0FDMUI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsV0FBVyxDQUFDLE1BQWM7UUFDeEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMxRixPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLHVCQUF1QixDQUFDLE9BQXFCO1FBQ2pELG9CQUFvQjtRQUNwQixNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxZQUFZO1FBQ2hCLE1BQU0sV0FBVyxHQUFnQixNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFDckMsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDckQsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN4RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZUFBZSxDQUFDLEtBQWE7UUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7WUFDbEQsT0FBTyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUN0QyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFFO29CQUM5QixrQkFBa0I7b0JBQ2xCLFVBQVUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO29CQUMvQywwQ0FBMEM7b0JBQzFDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDO29CQUM3RixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ25ELElBQUksWUFBWSxFQUFFO3dCQUNkLFlBQVksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQzt3QkFDaEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFBO3FCQUMzQztpQkFDSjtnQkFDRCxPQUFPLFVBQVUsQ0FBQztZQUNwQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILGFBQWEsQ0FBQyxNQUFjO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUNqQyxDQUFDO0lBRUQ7OztNQUdFO0lBQ0EsV0FBVyxDQUFDLEtBQWE7UUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDaEgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7UUFFaEMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFBO1lBQ3ZFLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2hFLCtFQUErRTtZQUMvRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNqRjthQUNJO1lBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3BDO0lBQ0gsQ0FBQztJQUVIOzs7TUFHRTtJQUNGLFVBQVUsQ0FBQyxLQUFhO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRXBFLE1BQU0sZUFBZSxHQUFHLENBQUMsQ0FBcUIsRUFBRSxDQUFxQixFQUFFLEVBQUU7WUFDdkUsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDekIsQ0FBQyxDQUFDO1FBRUYsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUU7Z0JBQy9ELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQ2xDO1NBQ0Y7SUFDSCxDQUFDOzhHQXhLVSxlQUFlO2tIQUFmLGVBQWUsY0FGZCxNQUFNOzsyRkFFUCxlQUFlO2tCQUgzQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVzZXJBY2NvdW50IH0gZnJvbSAnQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0L2FwcC91c2VyLWFjY291bnQnO1xuaW1wb3J0IHsgbGFzdFZhbHVlRnJvbSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBVc2VyQXBwU3RvcmUgfSBmcm9tIFwiQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0XCI7XG5pbXBvcnQgeyBNeUFwcFN0b3JlIH0gZnJvbSBcIkBoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdFwiO1xuaW1wb3J0IHsgQXBwU3RvcmUgfSBmcm9tIFwiQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0XCI7XG5pbXBvcnQgeyBKU09OQ29kZWMsIEpldHN0cmVhbVdzU2VydmljZSwgVHJhbnNmZXJJbmZvIH0gZnJvbSAnQGhpcy1iYXNlL2pldHN0cmVhbS13cy9kaXN0JztcbmltcG9ydCB7IFNoYXJlZFNlcnZpY2UgfSBmcm9tICdAaGlzLWJhc2Uvc2hhcmVkJztcbmltcG9ydCB7IFdzTmF0c1NlcnZpY2UgfSBmcm9tICcuL3dzLW5hdHMuc2VydmljZSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cblxudHlwZSBFeHRlbmRlZE15QXBwU3RvcmUgPSBNeUFwcFN0b3JlICYge1xuICBpc09wZW46IGJvb2xlYW47XG59O1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBBcHBTdG9yZVNlcnZpY2Uge1xuXG4gIC8qKiDnm67liY3kvb/nlKjogIXmh4nnlKjnqIvlvI/ljp/lp4vlhaflrrlcbiAgICogQHR5cGUge0V4dGVuZGVkTXlBcHBTdG9yZX1cbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAqL1xuICBteUFwcFN0b3JlcyA9IHNpZ25hbDxFeHRlbmRlZE15QXBwU3RvcmVbXT4oW10pXG5cblxuICAvKiog5omA5pyJ5L2/55So6ICF55qE5oeJ55So56iL5byPXG4gICAqIEB0eXBlIHtVc2VyQXBwU3RvcmV9XG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIHVzZXJBcHBTdG9yZXMgPSBzaWduYWw8VXNlckFwcFN0b3JlW10+KFtdKVxuXG4gIGFwcE9wZW5lZEluZGV4ID0gW10gYXMgRXh0ZW5kZWRNeUFwcFN0b3JlW11cblxuICAjcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcbiAgI3NoYXJlZFNlcnZpY2UgPSBpbmplY3QoU2hhcmVkU2VydmljZSk7XG4gICN3c05hdHNTZXJ2aWNlID0gaW5qZWN0KFdzTmF0c1NlcnZpY2UpO1xuXG4gIC8qKiDmk7TlsZVNeUFwcFN0b3Jl5YiwRXh0ZW5kZWRNeUFwcFN0b3JlXG4gICAqIEBwYXJhbSB7TXlBcHBTdG9yZVtdfSBhcHBTdG9yZXNcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgY29udmVydFRvRXh0ZW5kZWQoYXBwU3RvcmVzOiBNeUFwcFN0b3JlW10pOiBFeHRlbmRlZE15QXBwU3RvcmVbXSB7XG4gICAgICByZXR1cm4gYXBwU3RvcmVzLm1hcChhcHBTdG9yZSA9PiAoey4uLmFwcFN0b3JlLGlzT3BlbjogZmFsc2V9KSk7XG4gIH1cblxuICAvKiog5Y+W5b6X5YWo6YOo5oeJ55So56iL5byP5riF5ZauXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGFzeW5jIGdldEFwcFN0b3JlTGlzdChwYXlsb2FkOiBzdHJpbmcpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgLy8g6ZyA5bi25YWl5oyH5a6a55qE5Li76aGM6Lef6KaB5YKz6YGe55qE6LOH5paZXG4gICAgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ1VzZXJBcHBTdG9yZS5teUFwcFN0b3JlJywgcGF5bG9hZCkuc3Vic2NyaWJlKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgdGhpcy5teUFwcFN0b3Jlcy5zZXQodGhpcy5jb252ZXJ0VG9FeHRlbmRlZChyZXN1bHQgYXMgdW5rbm93biBhcyBNeUFwcFN0b3JlW10pKVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIOWPluW+l+WFqOmDqOS9v+eUqOiAheaHieeUqOeoi+W8j+a4heWWrlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWRcbiAgICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICAqL1xuICBhc3luYyBnZXRVc2VyU3RvcmVMaXN0KHBheWxvYWQ6IHN0cmluZykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAvLyDpnIDluLblhaXmjIflrprnmoTkuLvpoYzot5/opoHlgrPpgZ7nmoTos4fmlplcbiAgICB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnVXNlckFwcFN0b3JlLmxpc3QnLCBwYXlsb2FkKS5zdWJzY3JpYmUoKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICB0aGlzLnVzZXJBcHBTdG9yZXMuc2V0KHJlc3VsdCBhcyB1bmtub3duIGFzIFVzZXJBcHBTdG9yZVtdKVxuICAgIH0pXG4gIH1cblxuICAvKiog5Y+W5b6X5YWo6YOo5oeJ55So56iL5byP5riF5ZauXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGdldEFwcFN0b3Jlc0J5S2V5d29yZChrZXl3b3JkPzogc3RyaW5nKTogTXlBcHBTdG9yZVtdIHtcbiAgICBpZiAoa2V5d29yZCkge1xuICAgICAgcmV0dXJuIHRoaXMubXlBcHBTdG9yZXMoKS5maWx0ZXIoKG15QXBwU3RvcmUpID0+IG15QXBwU3RvcmUudGl0bGUuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMubXlBcHBTdG9yZXMoKVxuICAgIH1cbiAgfVxuXG4gIC8qKiDlj5blvpfnm67liY3mh4nnlKjnqIvlvI/os4fmlplcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcFVybFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBnZXRBcHBTdG9yZShhcHBVcmw6IHN0cmluZyk6IE15QXBwU3RvcmUge1xuICAgIGNvbnN0IG15QXBwU3RvcmUgPSB0aGlzLm15QXBwU3RvcmVzKCkuZmlsdGVyKChteUFwcFN0b3JlKSA9PiBteUFwcFN0b3JlLnVybCA9PT0gYXBwVXJsKVswXVxuICAgIHJldHVybiBteUFwcFN0b3JlO1xuICB9XG5cbiAgLyoqIHB1Ymxpc2gg5pu05paw5b6M5L2/55So6ICF5pyA5oSb5oeJ55So56iL5byP5YiwTkFUU1xuICAgKiBAcGFyYW0ge1VzZXJBcHBTdG9yZX0gcGF5bG9hZFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBwdWJVc2VyQXBwU3RvcmVGYXZvcml0ZShwYXlsb2FkOiBVc2VyQXBwU3RvcmUpIHtcbiAgICAvLyDpnIDluLblhaXmjIflrprnmbzluIPkuLvpoYzku6Xlj4ropoHlgrPpgIHnmoToqIrmga9cbiAgICBhd2FpdCB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucHVibGlzaCgnVXNlckFwcFN0b3JlLnVwZGF0ZS5pc0Zhdm9yaXRlJywgcGF5bG9hZCk7XG4gIH1cblxuICAvKiog5Yid5aeL5YyWTXlBcHBTdG9yZVxuICAgKiBAcGFyYW0ge1VzZXJBY2NvdW50fSB1c2VyQWNjb3VudFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBpbml0QXBwU3RvcmUoKSB7XG4gICAgY29uc3QgdXNlckFjY291bnQ6VXNlckFjY291bnQgPSAgYXdhaXQgdGhpcy4jc2hhcmVkU2VydmljZS5nZXRWYWx1ZShoaXN0b3J5LnN0YXRlLnRva2VuKTtcbiAgICBjb25zb2xlLmxvZyhcImdldCB0b2tlblwiLCB1c2VyQWNjb3VudClcbiAgICBhd2FpdCB0aGlzLmdldEFwcFN0b3JlTGlzdCh1c2VyQWNjb3VudC51c2VyQ29kZS5jb2RlKVxuICAgIGF3YWl0IHRoaXMuZ2V0VXNlclN0b3JlTGlzdCh1c2VyQWNjb3VudC51c2VyQ29kZS5jb2RlKVxuICB9XG5cbiAgLyoqIOaHieeUqOeoi+W8j+m7nuaTiuaIkeeahOacgOaEm2ljb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcElkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIG9uRmF2b3JpdGVDbGljayhhcHBJZDogc3RyaW5nKTp2b2lkIHtcbiAgICB0aGlzLm15QXBwU3RvcmVzLnVwZGF0ZShteUFwcFN0b3JlQXJyYXkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJ1c2VyQXBwU3RvcmVzXCIsIHRoaXMudXNlckFwcFN0b3JlcygpKVxuICAgICAgcmV0dXJuIG15QXBwU3RvcmVBcnJheS5tYXAobXlBcHBTdG9yZSA9PiB7XG4gICAgICAgIGlmIChteUFwcFN0b3JlLmFwcElkID09PSBhcHBJZCkge1xuICAgICAgICAgIC8vIOWIh+aNoiBpc0Zhdm9yaXRlIOWAvFxuICAgICAgICAgIG15QXBwU3RvcmUuaXNGYXZvcml0ZSA9ICFteUFwcFN0b3JlLmlzRmF2b3JpdGU7XG4gICAgICAgICAgLy8g5ZyoIHVzZXJBcHBTdG9yZXMg5Lit5om+5Yiw55u45oeJ55qE6aCF55uu5pu05paw5a6D55qEIGlzRmF2b3JpdGVcbiAgICAgICAgICBjb25zdCB1c2VyQXBwU3RvcmUgPSB0aGlzLnVzZXJBcHBTdG9yZXMoKS5maW5kKHVzZXJBcHBTdG9yZSA9PiB1c2VyQXBwU3RvcmUuYXBwSWQgPT09IGFwcElkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnYXBwSWQnLCBhcHBJZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VzZXJBcHBTdG9yZUlEJywgdXNlckFwcFN0b3JlPy5hcHBJZCk7XG4gICAgICAgICAgaWYgKHVzZXJBcHBTdG9yZSkge1xuICAgICAgICAgICAgICB1c2VyQXBwU3RvcmUuaXNGYXZvcml0ZSA9IG15QXBwU3RvcmUuaXNGYXZvcml0ZTtcbiAgICAgICAgICAgICAgdGhpcy5wdWJVc2VyQXBwU3RvcmVGYXZvcml0ZSh1c2VyQXBwU3RvcmUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG15QXBwU3RvcmU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiDot7PovYnliLBtb2R1bGUgZmVkZXJhdGlvbiBwYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcHBVcmxcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgb25OYXZBcHBDbGljayhhcHBVcmw6IG51bWJlcik6dm9pZHtcbiAgICB0aGlzLiNyb3V0ZXIubmF2aWdhdGUoW2FwcFVybF0pXG4gIH1cblxuICAvKiog6Kit5a6a5oeJ55So56iL5byP6Zec6ZaJXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcHBJZFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICovXG4gICAgc2V0QXBwQ2xvc2UoYXBwSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgdGhpcy5teUFwcFN0b3Jlcy51cGRhdGUoYXBwcyA9PiBhcHBzLm1hcChhcHAgPT4geyBhcHAuYXBwSWQgPT09IGFwcElkID8gYXBwLmlzT3BlbiA9IGZhbHNlIDogYXBwOyByZXR1cm4gYXBwIH0pKVxuICAgICAgY29uc29sZS5sb2codGhpcy5hcHBPcGVuZWRJbmRleClcblxuICAgICAgaWYgKHRoaXMuYXBwT3BlbmVkSW5kZXgubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYXBwT3BlbmVkSW5kZXguZmluZEluZGV4KGFwcCA9PiBhcHAuYXBwSWQgPT09IGFwcElkKVxuICAgICAgICB0aGlzLmFwcE9wZW5lZEluZGV4LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGluZGV4KVxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmFwcE9wZW5lZEluZGV4W3RoaXMuYXBwT3BlbmVkSW5kZXgubGVuZ3RoIC0gMV0pXG4gICAgICAgIC8vIHdpbmRvdy5vcGVuKHRoaXMuYXBwT3BlbmVkSW5kZXhbdGhpcy5hcHBPcGVuZWRJbmRleC5sZW5ndGgtMV0uYXBwVXJsLFwiX3RvcFwiKVxuICAgICAgICB0aGlzLiNyb3V0ZXIubmF2aWdhdGUoW3RoaXMuYXBwT3BlbmVkSW5kZXhbdGhpcy5hcHBPcGVuZWRJbmRleC5sZW5ndGggLSAxXS51cmxdKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuYXBwT3BlbmVkSW5kZXguc3BsaWNlKDEsIDEpO1xuICAgICAgICB0aGlzLiNyb3V0ZXIubmF2aWdhdGVCeVVybCgnL2hvbWUnKVxuICAgICAgfVxuICAgIH1cblxuICAvKiog6Kit5a6a5oeJ55So56iL5byP6ZaL5ZWfXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcHBJZFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICovXG4gIHNldEFwcE9wZW4oYXBwSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGZpbmRBcHAgPSB0aGlzLm15QXBwU3RvcmVzKCkuZmlsdGVyKHggPT4geC5hcHBJZCA9PT0gYXBwSWQpWzBdXG5cbiAgICBjb25zdCBvYmplY3RzQXJlRXF1YWwgPSAoeDogRXh0ZW5kZWRNeUFwcFN0b3JlLCB5OiBFeHRlbmRlZE15QXBwU3RvcmUpID0+IHtcbiAgICAgIHJldHVybiB4LnVybCA9PT0geS51cmw7XG4gICAgfTtcblxuICAgIGlmIChmaW5kQXBwKSB7XG4gICAgICB0aGlzLm15QXBwU3RvcmVzLnVwZGF0ZSh4ID0+IHgubWFwKHkgPT4geyB5LmFwcElkID09PSBhcHBJZCA/IHkuaXNPcGVuID0gdHJ1ZSA6IHk7IHJldHVybiB5IH0pKVxuICAgICAgaWYgKCF0aGlzLmFwcE9wZW5lZEluZGV4LmZpbmQoeCA9PiBvYmplY3RzQXJlRXF1YWwoeCwgZmluZEFwcCkpKSB7XG4gICAgICAgIHRoaXMuYXBwT3BlbmVkSW5kZXgucHVzaChmaW5kQXBwKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cblxuXG4iXX0=
