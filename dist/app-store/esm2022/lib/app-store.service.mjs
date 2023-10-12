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
        return appStores.map(appStore => ({ ...appStore, isOpen: true }));
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
            const index = this.appOpenedIndex.findIndex(app => app._id === appId);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAtc3RvcmUvc3JjL2xpYi9hcHAtc3RvcmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSXpDLE9BQU8sRUFBYSxrQkFBa0IsRUFBZ0IsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG1CQUFtQixDQUFDOztBQVdsRCxNQUFNLE9BQU8sZUFBZTtJQUg1QjtRQUtFOzs7VUFHRTtRQUNGLGdCQUFXLEdBQUcsTUFBTSxDQUF1QixFQUFFLENBQUMsQ0FBQTtRQUc5Qzs7O1dBR0c7UUFDSCxrQkFBYSxHQUFHLE1BQU0sQ0FBaUIsRUFBRSxDQUFDLENBQUE7UUFFMUMsbUJBQWMsR0FBRyxFQUFnQixDQUFBO1FBRWpDLFlBQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDakQsbUJBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkMsbUJBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7S0FrSXhDO0lBcklDLE9BQU8sQ0FBa0I7SUFDekIsbUJBQW1CLENBQThCO0lBQ2pELGNBQWMsQ0FBeUI7SUFDdkMsY0FBYyxDQUF5QjtJQUV2Qzs7O09BR0c7SUFDSCxpQkFBaUIsQ0FBQyxTQUF1QjtRQUNyQyxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsR0FBRyxRQUFR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LGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFBO1lBQ3JFLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2hFLCtFQUErRTtZQUMvRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNqRjthQUNJO1lBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3BDO0lBQ0gsQ0FBQzs4R0FySlEsZUFBZTtrSEFBZixlQUFlLGNBRmQsTUFBTTs7MkZBRVAsZUFBZTtrQkFIM0IsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVc2VyQWNjb3VudCB9IGZyb20gJ0BoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdC9hcHAvdXNlci1hY2NvdW50JztcbmltcG9ydCB7IGxhc3RWYWx1ZUZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgVXNlckFwcFN0b3JlIH0gZnJvbSBcIkBoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdFwiO1xuaW1wb3J0IHsgTXlBcHBTdG9yZSB9IGZyb20gXCJAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3RcIjtcbmltcG9ydCB7IEFwcFN0b3JlIH0gZnJvbSBcIkBoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdFwiO1xuaW1wb3J0IHsgSlNPTkNvZGVjLCBKZXRzdHJlYW1Xc1NlcnZpY2UsIFRyYW5zZmVySW5mbyB9IGZyb20gJ0BoaXMtYmFzZS9qZXRzdHJlYW0td3MvZGlzdCc7XG5pbXBvcnQgeyBTaGFyZWRTZXJ2aWNlIH0gZnJvbSAnQGhpcy1iYXNlL3NoYXJlZCc7XG5pbXBvcnQgeyBXc05hdHNTZXJ2aWNlIH0gZnJvbSAnLi93cy1uYXRzLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbnR5cGUgRXh0ZW5kZWRNeUFwcFN0b3JlID0gTXlBcHBTdG9yZSAmIHtcbiAgaXNPcGVuOiBib29sZWFuO1xufTtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQXBwU3RvcmVTZXJ2aWNlIHtcblxuICAvKiog55uu5YmN5L2/55So6ICF5oeJ55So56iL5byP5Y6f5aeL5YWn5a65XG4gICAqIEB0eXBlIHtFeHRlbmRlZE15QXBwU3RvcmV9XG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgKi9cbiAgbXlBcHBTdG9yZXMgPSBzaWduYWw8RXh0ZW5kZWRNeUFwcFN0b3JlW10+KFtdKVxuXG5cbiAgLyoqIOaJgOacieS9v+eUqOiAheeahOaHieeUqOeoi+W8j1xuICAgKiBAdHlwZSB7VXNlckFwcFN0b3JlfVxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICB1c2VyQXBwU3RvcmVzID0gc2lnbmFsPFVzZXJBcHBTdG9yZVtdPihbXSlcblxuICBhcHBPcGVuZWRJbmRleCA9IFtdIGFzIEFwcFN0b3JlW11cblxuICAjcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcbiAgI3NoYXJlZFNlcnZpY2UgPSBpbmplY3QoU2hhcmVkU2VydmljZSk7XG4gICN3c05hdHNTZXJ2aWNlID0gaW5qZWN0KFdzTmF0c1NlcnZpY2UpO1xuXG4gIC8qKiDmk7TlsZVNeUFwcFN0b3Jl5YiwRXh0ZW5kZWRNeUFwcFN0b3JlXG4gICAqIEBwYXJhbSB7TXlBcHBTdG9yZVtdfSBhcHBTdG9yZXNcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgY29udmVydFRvRXh0ZW5kZWQoYXBwU3RvcmVzOiBNeUFwcFN0b3JlW10pOiBFeHRlbmRlZE15QXBwU3RvcmVbXSB7XG4gICAgICByZXR1cm4gYXBwU3RvcmVzLm1hcChhcHBTdG9yZSA9PiAoey4uLmFwcFN0b3JlLGlzT3BlbjogdHJ1ZX0pKTtcbiAgfVxuXG4gIC8qKiDlj5blvpflhajpg6jmh4nnlKjnqIvlvI/muIXllq5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgYXN5bmMgZ2V0QXBwU3RvcmVMaXN0KHBheWxvYWQ6IHN0cmluZykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAvLyDpnIDluLblhaXmjIflrprnmoTkuLvpoYzot5/opoHlgrPpgZ7nmoTos4fmlplcbiAgICB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnVXNlckFwcFN0b3JlLm15QXBwU3RvcmUnLCBwYXlsb2FkKS5zdWJzY3JpYmUoKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICB0aGlzLm15QXBwU3RvcmVzLnNldCh0aGlzLmNvbnZlcnRUb0V4dGVuZGVkKHJlc3VsdCBhcyB1bmtub3duIGFzIE15QXBwU3RvcmVbXSkpXG4gICAgfSk7XG4gIH1cblxuICAvKiog5Y+W5b6X5YWo6YOo5L2/55So6ICF5oeJ55So56iL5byP5riF5ZauXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZFxuICAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgICovXG4gIGFzeW5jIGdldFVzZXJTdG9yZUxpc3QocGF5bG9hZDogc3RyaW5nKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIC8vIOmcgOW4tuWFpeaMh+WumueahOS4u+mhjOi3n+imgeWCs+mBnueahOizh+aWmVxuICAgIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5yZXF1ZXN0KCdVc2VyQXBwU3RvcmUubGlzdCcsIHBheWxvYWQpLnN1YnNjcmliZSgocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgIHRoaXMudXNlckFwcFN0b3Jlcy5zZXQocmVzdWx0IGFzIHVua25vd24gYXMgVXNlckFwcFN0b3JlW10pXG4gICAgfSlcbiAgfVxuXG4gIC8qKiDlj5blvpflhajpg6jmh4nnlKjnqIvlvI/muIXllq5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgZ2V0QXBwU3RvcmVzQnlLZXl3b3JkKGtleXdvcmQ/OiBzdHJpbmcpOiBNeUFwcFN0b3JlW10ge1xuICAgIGlmIChrZXl3b3JkKSB7XG4gICAgICByZXR1cm4gdGhpcy5teUFwcFN0b3JlcygpLmZpbHRlcigobXlBcHBTdG9yZSkgPT4gbXlBcHBTdG9yZS50aXRsZS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5teUFwcFN0b3JlcygpXG4gICAgfVxuICB9XG5cbiAgLyoqIOWPluW+l+ebruWJjeaHieeUqOeoi+W8j+izh+aWmVxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwVXJsXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGdldEFwcFN0b3JlKGFwcFVybDogc3RyaW5nKTogTXlBcHBTdG9yZSB7XG4gICAgY29uc3QgbXlBcHBTdG9yZSA9IHRoaXMubXlBcHBTdG9yZXMoKS5maWx0ZXIoKG15QXBwU3RvcmUpID0+IG15QXBwU3RvcmUudXJsID09PSBhcHBVcmwpWzBdXG4gICAgcmV0dXJuIG15QXBwU3RvcmU7XG4gIH1cblxuICAvKiogcHVibGlzaCDmm7TmlrDlvozkvb/nlKjogIXmnIDmhJvmh4nnlKjnqIvlvI/liLBOQVRTXG4gICAqIEBwYXJhbSB7VXNlckFwcFN0b3JlfSBwYXlsb2FkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGFzeW5jIHB1YlVzZXJBcHBTdG9yZUZhdm9yaXRlKHBheWxvYWQ6IFVzZXJBcHBTdG9yZSkge1xuICAgIC8vIOmcgOW4tuWFpeaMh+WumueZvOW4g+S4u+mhjOS7peWPiuimgeWCs+mAgeeahOioiuaBr1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5wdWJsaXNoKCdVc2VyQXBwU3RvcmUudXBkYXRlLmlzRmF2b3JpdGUnLCBwYXlsb2FkKTtcbiAgfVxuXG4gIC8qKiDliJ3lp4vljJZNeUFwcFN0b3JlXG4gICAqIEBwYXJhbSB7VXNlckFjY291bnR9IHVzZXJBY2NvdW50XG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGFzeW5jIGluaXRBcHBTdG9yZSgpIHtcbiAgICBjb25zdCB1c2VyQWNjb3VudDpVc2VyQWNjb3VudCA9ICBhd2FpdCB0aGlzLiNzaGFyZWRTZXJ2aWNlLmdldFZhbHVlKGhpc3Rvcnkuc3RhdGUudG9rZW4pO1xuICAgIGNvbnNvbGUubG9nKFwiZ2V0IHRva2VuXCIsIHVzZXJBY2NvdW50KVxuICAgIGF3YWl0IHRoaXMuZ2V0QXBwU3RvcmVMaXN0KHVzZXJBY2NvdW50LnVzZXJDb2RlLmNvZGUpXG4gICAgYXdhaXQgdGhpcy5nZXRVc2VyU3RvcmVMaXN0KHVzZXJBY2NvdW50LnVzZXJDb2RlLmNvZGUpXG4gIH1cblxuICAvKiog5oeJ55So56iL5byP6bue5pOK5oiR55qE5pyA5oSbaWNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwSWRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgb25GYXZvcml0ZUNsaWNrKGFwcElkOiBzdHJpbmcpOnZvaWQge1xuICAgIHRoaXMubXlBcHBTdG9yZXMudXBkYXRlKG15QXBwU3RvcmVBcnJheSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcInVzZXJBcHBTdG9yZXNcIiwgdGhpcy51c2VyQXBwU3RvcmVzKCkpXG4gICAgICByZXR1cm4gbXlBcHBTdG9yZUFycmF5Lm1hcChteUFwcFN0b3JlID0+IHtcbiAgICAgICAgaWYgKG15QXBwU3RvcmUuYXBwSWQgPT09IGFwcElkKSB7XG4gICAgICAgICAgLy8g5YiH5o2iIGlzRmF2b3JpdGUg5YC8XG4gICAgICAgICAgbXlBcHBTdG9yZS5pc0Zhdm9yaXRlID0gIW15QXBwU3RvcmUuaXNGYXZvcml0ZTtcbiAgICAgICAgICAvLyDlnKggdXNlckFwcFN0b3JlcyDkuK3mib7liLDnm7jmh4nnmoTpoIXnm67mm7TmlrDlroPnmoQgaXNGYXZvcml0ZVxuICAgICAgICAgIGNvbnN0IHVzZXJBcHBTdG9yZSA9IHRoaXMudXNlckFwcFN0b3JlcygpLmZpbmQodXNlckFwcFN0b3JlID0+IHVzZXJBcHBTdG9yZS5hcHBJZCA9PT0gYXBwSWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdhcHBJZCcsIGFwcElkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndXNlckFwcFN0b3JlSUQnLCB1c2VyQXBwU3RvcmU/LmFwcElkKTtcbiAgICAgICAgICBpZiAodXNlckFwcFN0b3JlKSB7XG4gICAgICAgICAgICAgIHVzZXJBcHBTdG9yZS5pc0Zhdm9yaXRlID0gbXlBcHBTdG9yZS5pc0Zhdm9yaXRlO1xuICAgICAgICAgICAgICB0aGlzLnB1YlVzZXJBcHBTdG9yZUZhdm9yaXRlKHVzZXJBcHBTdG9yZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbXlBcHBTdG9yZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIOi3s+i9ieWIsG1vZHVsZSBmZWRlcmF0aW9uIHBhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcFVybFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBvbk5hdkFwcENsaWNrKGFwcFVybDogbnVtYmVyKTp2b2lke1xuICAgIHRoaXMuI3JvdXRlci5uYXZpZ2F0ZShbYXBwVXJsXSlcbiAgfVxuXG4gICAgLyoqIOioreWumuaHieeUqOeoi+W8j+mXnOmWiVxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwSWRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAqL1xuICAgIHNldEFwcENsb3NlKGFwcElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIHRoaXMubXlBcHBTdG9yZXMudXBkYXRlKGFwcHMgPT4gYXBwcy5tYXAoYXBwID0+IHsgYXBwLmFwcElkID09PSBhcHBJZCA/IGFwcC5pc09wZW4gPSBmYWxzZSA6IGFwcDsgcmV0dXJuIGFwcCB9KSlcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYXBwT3BlbmVkSW5kZXgpXG5cbiAgICAgIGlmICh0aGlzLmFwcE9wZW5lZEluZGV4Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmFwcE9wZW5lZEluZGV4LmZpbmRJbmRleChhcHAgPT4gYXBwLl9pZCA9PT0gYXBwSWQpXG4gICAgICAgIHRoaXMuYXBwT3BlbmVkSW5kZXguc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgY29uc29sZS5sb2coaW5kZXgpXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYXBwT3BlbmVkSW5kZXhbdGhpcy5hcHBPcGVuZWRJbmRleC5sZW5ndGggLSAxXSlcbiAgICAgICAgLy8gd2luZG93Lm9wZW4odGhpcy5hcHBPcGVuZWRJbmRleFt0aGlzLmFwcE9wZW5lZEluZGV4Lmxlbmd0aC0xXS5hcHBVcmwsXCJfdG9wXCIpXG4gICAgICAgIHRoaXMuI3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5hcHBPcGVuZWRJbmRleFt0aGlzLmFwcE9wZW5lZEluZGV4Lmxlbmd0aCAtIDFdLnVybF0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5hcHBPcGVuZWRJbmRleC5zcGxpY2UoMSwgMSk7XG4gICAgICAgIHRoaXMuI3JvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvaG9tZScpXG4gICAgICB9XG4gICAgfVxufVxuXG5cblxuXG4iXX0=