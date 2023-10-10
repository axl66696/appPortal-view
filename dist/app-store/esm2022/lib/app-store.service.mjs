import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { SharedService } from '@his-base/shared';
import * as i0 from "@angular/core";
export class AppStoreService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAtc3RvcmUvc3JjL2xpYi9hcHAtc3RvcmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSXpDLE9BQU8sRUFBYSxrQkFBa0IsRUFBZ0IsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7O0FBT2pELE1BQU0sT0FBTyxlQUFlO0lBSDVCO1FBS0UsY0FBUyxHQUFHLE1BQU0sQ0FBYSxFQUFFLENBQUMsQ0FBQTtRQUNsQyxnQkFBVyxHQUFHLE1BQU0sQ0FBZSxFQUFFLENBQUMsQ0FBQTtRQUN0QyxtQkFBYyxHQUFHLEVBQWdCLENBQUE7UUFDakMsa0JBQWEsR0FBRyxNQUFNLENBQWlCLEVBQUUsQ0FBQyxDQUFBO1FBRTFDLFlBQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDakQsbUJBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7S0FtSHhDO0lBckhDLE9BQU8sQ0FBa0I7SUFDekIsbUJBQW1CLENBQThCO0lBQ2pELGNBQWMsQ0FBeUI7SUFHdkM7OztPQUdHO0lBQ0gsZUFBZSxDQUFDLE9BQWU7UUFDN0IsYUFBYTtRQUNiLGtCQUFrQjtRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDbEMsZ0hBQWdIO1FBQ2hILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMs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LENBQUMsWUFBWSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQztvQkFDN0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNuRCxJQUFJLFlBQVksRUFBRTt3QkFDZCxZQUFZLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7d0JBQ2hELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsQ0FBQTtxQkFDM0M7aUJBQ0o7Z0JBQ0QsT0FBTyxVQUFVLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7O01BR0U7SUFDRixhQUFhLENBQUMsTUFBYztRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDakMsQ0FBQzs4R0EzSFUsZUFBZTtrSEFBZixlQUFlLGNBRmQsTUFBTTs7MkZBRVAsZUFBZTtrQkFIM0IsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVc2VyQWNjb3VudCB9IGZyb20gJ0BoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdC9hcHAvdXNlci1hY2NvdW50JztcbmltcG9ydCB7IGxhc3RWYWx1ZUZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgVXNlckFwcFN0b3JlIH0gZnJvbSBcIkBoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdFwiO1xuaW1wb3J0IHsgTXlBcHBTdG9yZSB9IGZyb20gXCJAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3RcIjtcbmltcG9ydCB7IEFwcFN0b3JlIH0gZnJvbSBcIkBoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwvZGlzdFwiO1xuaW1wb3J0IHsgSlNPTkNvZGVjLCBKZXRzdHJlYW1Xc1NlcnZpY2UsIFRyYW5zZmVySW5mbyB9IGZyb20gJ0BoaXMtYmFzZS9qZXRzdHJlYW0td3MvZGlzdCc7XG5pbXBvcnQgeyBTaGFyZWRTZXJ2aWNlIH0gZnJvbSAnQGhpcy1iYXNlL3NoYXJlZCc7XG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQXBwU3RvcmVTZXJ2aWNlIHtcblxuICBhcHBTdG9yZXMgPSBzaWduYWw8QXBwU3RvcmVbXT4oW10pXG4gIG15QXBwU3RvcmVzID0gc2lnbmFsPE15QXBwU3RvcmVbXT4oW10pXG4gIGFwcE9wZW5lZEluZGV4ID0gW10gYXMgQXBwU3RvcmVbXVxuICB1c2VyQXBwU3RvcmVzID0gc2lnbmFsPFVzZXJBcHBTdG9yZVtdPihbXSlcblxuICAjcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcbiAgI3NoYXJlZFNlcnZpY2UgPSBpbmplY3QoU2hhcmVkU2VydmljZSk7XG5cblxuICAvKiog5Y+W5b6X5YWo6YOo5oeJ55So56iL5byP5riF5ZauXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXlsb2FkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGdldEFwcFN0b3JlTGlzdChwYXlsb2FkOiBzdHJpbmcpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgLy8g6ZyA5bi25YWl5oyH5a6a55qE5Li76aGM6Lef6KaB5YKz6YGe55qE6LOH5paZXG4gICAgY29uc29sZS5sb2coJ2luIGdldEFwcFN0b3JlTGlzdCcpO1xuICAgIC8vIGNvbnN0IG15QXBwU3RvcmUgPSBhd2FpdCBsYXN0VmFsdWVGcm9tKHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5yZXF1ZXN0KCdVc2VyQXBwU3RvcmUubXlBcHBTdG9yZScsIHBheWxvYWQpKTtcbiAgICB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnVXNlckFwcFN0b3JlLm15QXBwU3RvcmUnLCBwYXlsb2FkKS5zdWJzY3JpYmUoKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAvLyDomZXnkIbos4fmlpnpgo/ovK/nmoTlnLDmlrnvvIzlj5blvpdyZXBseeWbnuWCs+eahOizh+aWmVxuICAgICAgY29uc29sZS5sb2coJ2dldEFwcFN0b3JlTGlzdCByZXN1bHQnLCByZXN1bHQpO1xuICAgICAgdGhpcy5teUFwcFN0b3Jlcy5zZXQocmVzdWx0IGFzIHVua25vd24gYXMgTXlBcHBTdG9yZVtdKVxuICAgIH1cbik7XG4gIH1cblxuICAgIC8qKiDlj5blvpflhajpg6jkvb/nlKjogIXmh4nnlKjnqIvlvI/muIXllq5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZFxuICAgICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICAqL1xuICAgIGFzeW5jIGdldFVzZXJTdG9yZUxpc3QocGF5bG9hZDogc3RyaW5nKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAvLyDpnIDluLblhaXmjIflrprnmoTkuLvpoYzot5/opoHlgrPpgZ7nmoTos4fmlplcbiAgICAgIGNvbnNvbGUubG9nKCdpbiBnZXRVc2VyU3RvcmVMaXN0Jyk7XG4gICAgICB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnVXNlckFwcFN0b3JlLmxpc3QnLCBwYXlsb2FkKS5zdWJzY3JpYmUoKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXRVc2VyU3RvcmVMaXN0IHJlc3VsdCcsIHJlc3VsdCk7XG4gICAgICAgIHRoaXMudXNlckFwcFN0b3Jlcy5zZXQocmVzdWx0IGFzIHVua25vd24gYXMgVXNlckFwcFN0b3JlW10pXG4gICAgICB9KVxuICAgICAgLy8gY29uc3QgdXNlckFwcFN0b3JlID0gYXdhaXQgbGFzdFZhbHVlRnJvbSh0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnVXNlckFwcFN0b3JlLmxpc3QnLCBwYXlsb2FkKSk7XG4gICAgICAvLyBjb25zdCBqc29uQ29kZWMgPSBKU09OQ29kZWMoKVxuICAgICAgLy8gY29uc3QgcmV0dXJuVmFsdWUgPSBqc29uQ29kZWMuZGVjb2RlKHVzZXJBcHBTdG9yZS5kYXRhKSBhcyBVc2VyQXBwU3RvcmVbXVxuICAgICAgLy8gcmV0dXJuIHJldHVyblZhbHVlIGFzIHVua25vd24gYXMgVXNlckFwcFN0b3JlW10gO1xuICAgIH1cblxuICAvKiog5Y+W5b6X5YWo6YOo5oeJ55So56iL5byP5riF5ZauXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgKi9cbiAgZ2V0QXBwU3RvcmVzQnlLZXl3b3JkKGtleXdvcmQ/OiBzdHJpbmcpOiBNeUFwcFN0b3JlW10ge1xuICAgIGlmIChrZXl3b3JkKSB7XG4gICAgICByZXR1cm4gdGhpcy5teUFwcFN0b3JlcygpLmZpbHRlcigobXlBcHBTdG9yZSkgPT4gbXlBcHBTdG9yZS50aXRsZS5pbmNsdWRlcyhrZXl3b3JkKSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5teUFwcFN0b3JlcygpXG4gICAgfVxuICB9XG5cbiAgLyoqIOWPluW+l+ebruWJjeaHieeUqOeoi+W8j+izh+aWmVxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwVXJsXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgKi9cbiAgZ2V0QXBwU3RvcmUoYXBwVXJsOiBzdHJpbmcpOiBNeUFwcFN0b3JlIHtcbiAgICBjb25zdCBteUFwcFN0b3JlID0gdGhpcy5teUFwcFN0b3JlcygpLmZpbHRlcigobXlBcHBTdG9yZSkgPT4gbXlBcHBTdG9yZS51cmwgPT09IGFwcFVybClbMF1cbiAgICByZXR1cm4gbXlBcHBTdG9yZTtcbiAgfVxuXG4gIC8qKiBwdWJsaXNoIOabtOaWsOW+jOS9v+eUqOiAheacgOaEm+aHieeUqOeoi+W8j+WIsE5BVFNcbiAgICogQHBhcmFtIHtVc2VyQXBwU3RvcmV9IHBheWxvYWRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAqL1xuICBhc3luYyBwdWJVc2VyQXBwU3RvcmVGYXZvcml0ZShwYXlsb2FkOiBVc2VyQXBwU3RvcmUpIHtcbiAgICAvLyBjb25zdCBpbmZvOiBUcmFuc2ZlckluZm88VXNlckFwcFN0b3JlPiA9IHtcbiAgICAvLyAgIGRhdGE6IHBheWxvYWQsXG4gICAgLy8gfTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgLy8g6ZyA5bi25YWl5oyH5a6a55m85biD5Li76aGM5Lul5Y+K6KaB5YKz6YCB55qE6KiK5oGvXG4gICAgYXdhaXQgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnB1Ymxpc2goJ1VzZXJBcHBTdG9yZS51cGRhdGUuaXNGYXZvcml0ZScsIHBheWxvYWQpO1xuICB9XG5cbiAgLyoqIOWPluW+l+S9v+eUqOiAheizh+ioilxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICovXG4gIGFzeW5jIGluaXRBcHBTdG9yZSgpIHtcbiAgICBjb25zdCB1c2VyQ29kZSA9ICBhd2FpdCB0aGlzLiNzaGFyZWRTZXJ2aWNlLmdldFZhbHVlKGhpc3Rvcnkuc3RhdGUudG9rZW4udXNlckNvZGUpO1xuICAgIGF3YWl0IHRoaXMuZ2V0QXBwU3RvcmVMaXN0KHVzZXJDb2RlKVxuICAgIGF3YWl0IHRoaXMuZ2V0VXNlclN0b3JlTGlzdCh1c2VyQ29kZSlcbiAgfVxuXG4gIC8qKiDmh4nnlKjnqIvlvI/pu57mk4rmiJHnmoTmnIDmhJtpY29uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwSWRcbiAgICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgKi9cbiAgb25GYXZvcml0ZUNsaWNrKGFwcElkOiBzdHJpbmcpOnZvaWQge1xuXG4gICAgdGhpcy5teUFwcFN0b3Jlcy51cGRhdGUobXlBcHBTdG9yZUFycmF5ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwidXNlckFwcFN0b3Jlc1wiLCB0aGlzLnVzZXJBcHBTdG9yZXMoKSlcbiAgICAgIHJldHVybiBteUFwcFN0b3JlQXJyYXkubWFwKG15QXBwU3RvcmUgPT4ge1xuICAgICAgICBpZiAobXlBcHBTdG9yZS5hcHBJZCA9PT0gYXBwSWQpIHtcbiAgICAgICAgICAvLyDliIfmjaIgaXNGYXZvcml0ZSDlgLxcbiAgICAgICAgICBteUFwcFN0b3JlLmlzRmF2b3JpdGUgPSAhbXlBcHBTdG9yZS5pc0Zhdm9yaXRlO1xuICAgICAgICAgIC8vIOWcqCB1c2VyQXBwU3RvcmVzIOS4reaJvuWIsOebuOaHieeahOmgheebruabtOaWsOWug+eahCBpc0Zhdm9yaXRlXG4gICAgICAgICAgY29uc3QgdXNlckFwcFN0b3JlID0gdGhpcy51c2VyQXBwU3RvcmVzKCkuZmluZCh1c2VyQXBwU3RvcmUgPT4gdXNlckFwcFN0b3JlLmFwcElkID09PSBhcHBJZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2FwcElkJywgYXBwSWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd1c2VyQXBwU3RvcmVJRCcsIHVzZXJBcHBTdG9yZT8uYXBwSWQpO1xuICAgICAgICAgIGlmICh1c2VyQXBwU3RvcmUpIHtcbiAgICAgICAgICAgICAgdXNlckFwcFN0b3JlLmlzRmF2b3JpdGUgPSBteUFwcFN0b3JlLmlzRmF2b3JpdGU7XG4gICAgICAgICAgICAgIHRoaXMucHViVXNlckFwcFN0b3JlRmF2b3JpdGUodXNlckFwcFN0b3JlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBteUFwcFN0b3JlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiog6Lez6L2J5YiwbW9kdWxlIGZlZGVyYXRpb24gcGFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwVXJsXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgKi9cbiAgb25OYXZBcHBDbGljayhhcHBVcmw6IG51bWJlcik6dm9pZHtcbiAgICB0aGlzLiNyb3V0ZXIubmF2aWdhdGUoW2FwcFVybF0pXG4gIH1cbn1cblxuXG5cblxuIl19