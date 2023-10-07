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
        // const userCode =  await this.#sharedService.getValue(history.state.token.userCode);
        const userCode = 'Neo';
        console.log('before getAppStoreList');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAtc3RvcmUvc3JjL2xpYi9hcHAtc3RvcmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSXpDLE9BQU8sRUFBYSxrQkFBa0IsRUFBZ0IsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7O0FBT2pELE1BQU0sT0FBTyxlQUFlO0lBSDVCO1FBS0UsY0FBUyxHQUFHLE1BQU0sQ0FBYSxFQUFFLENBQUMsQ0FBQTtRQUNsQyxnQkFBVyxHQUFHLE1BQU0sQ0FBZSxFQUFFLENBQUMsQ0FBQTtRQUN0QyxtQkFBYyxHQUFHLEVBQWdCLENBQUE7UUFDakMsa0JBQWEsR0FBRyxNQUFNLENBQWlCLEVBQUUsQ0FBQyxDQUFBO1FBRTFDLFlBQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDakQsbUJBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7S0FxSHhDO0lBdkhDLE9BQU8sQ0FBa0I7SUFDekIsbUJBQW1CLENBQThCO0lBQ2pELGNBQWMsQ0FBeUI7SUFHdkM7OztPQUdHO0lBQ0gsZUFBZSxDQUFDLE9BQWU7UUFDN0IsYUFBYTtRQUNiLGtCQUFrQjtRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDbEMsZ0hBQWdIO1FBQ2hILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMs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QyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUM7b0JBQzdGLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDbkQsSUFBSSxZQUFZLEVBQUU7d0JBQ2QsWUFBWSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDO3dCQUNoRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsWUFBWSxDQUFDLENBQUE7cUJBQzNDO2lCQUNKO2dCQUNELE9BQU8sVUFBVSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztNQUdFO0lBQ0YsYUFBYSxDQUFDLE1BQWM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQ2pDLENBQUM7OEdBN0hVLGVBQWU7a0hBQWYsZUFBZSxjQUZkLE1BQU07OzJGQUVQLGVBQWU7a0JBSDNCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXNlckFjY291bnQgfSBmcm9tICdAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3QvYXBwL3VzZXItYWNjb3VudCc7XG5pbXBvcnQgeyBsYXN0VmFsdWVGcm9tIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFVzZXJBcHBTdG9yZSB9IGZyb20gXCJAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3RcIjtcbmltcG9ydCB7IE15QXBwU3RvcmUgfSBmcm9tIFwiQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0XCI7XG5pbXBvcnQgeyBBcHBTdG9yZSB9IGZyb20gXCJAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3RcIjtcbmltcG9ydCB7IEpTT05Db2RlYywgSmV0c3RyZWFtV3NTZXJ2aWNlLCBUcmFuc2ZlckluZm8gfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzL2Rpc3QnO1xuaW1wb3J0IHsgU2hhcmVkU2VydmljZSB9IGZyb20gJ0BoaXMtYmFzZS9zaGFyZWQnO1xuXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEFwcFN0b3JlU2VydmljZSB7XG5cbiAgYXBwU3RvcmVzID0gc2lnbmFsPEFwcFN0b3JlW10+KFtdKVxuICBteUFwcFN0b3JlcyA9IHNpZ25hbDxNeUFwcFN0b3JlW10+KFtdKVxuICBhcHBPcGVuZWRJbmRleCA9IFtdIGFzIEFwcFN0b3JlW11cbiAgdXNlckFwcFN0b3JlcyA9IHNpZ25hbDxVc2VyQXBwU3RvcmVbXT4oW10pXG5cbiAgI3JvdXRlciA9IGluamVjdChSb3V0ZXIpO1xuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSk7XG4gICNzaGFyZWRTZXJ2aWNlID0gaW5qZWN0KFNoYXJlZFNlcnZpY2UpO1xuXG5cbiAgLyoqIOWPluW+l+WFqOmDqOaHieeUqOeoi+W8j+a4heWWrlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBnZXRBcHBTdG9yZUxpc3QocGF5bG9hZDogc3RyaW5nKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIC8vIOmcgOW4tuWFpeaMh+WumueahOS4u+mhjOi3n+imgeWCs+mBnueahOizh+aWmVxuICAgIGNvbnNvbGUubG9nKCdpbiBnZXRBcHBTdG9yZUxpc3QnKTtcbiAgICAvLyBjb25zdCBteUFwcFN0b3JlID0gYXdhaXQgbGFzdFZhbHVlRnJvbSh0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnVXNlckFwcFN0b3JlLm15QXBwU3RvcmUnLCBwYXlsb2FkKSk7XG4gICAgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ1VzZXJBcHBTdG9yZS5teUFwcFN0b3JlJywgcGF5bG9hZCkuc3Vic2NyaWJlKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgLy8g6JmV55CG6LOH5paZ6YKP6Lyv55qE5Zyw5pa577yM5Y+W5b6XcmVwbHnlm57lgrPnmoTos4fmlplcbiAgICAgIGNvbnNvbGUubG9nKCdnZXRBcHBTdG9yZUxpc3QgcmVzdWx0JywgcmVzdWx0KTtcbiAgICAgIHRoaXMubXlBcHBTdG9yZXMuc2V0KHJlc3VsdCBhcyB1bmtub3duIGFzIE15QXBwU3RvcmVbXSlcbiAgICB9XG4pO1xuICB9XG5cbiAgICAvKiog5Y+W5b6X5YWo6YOo5L2/55So6ICF5oeJ55So56iL5byP5riF5ZauXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWRcbiAgICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAgKi9cbiAgICBhc3luYyBnZXRVc2VyU3RvcmVMaXN0KHBheWxvYWQ6IHN0cmluZykge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgLy8g6ZyA5bi25YWl5oyH5a6a55qE5Li76aGM6Lef6KaB5YKz6YGe55qE6LOH5paZXG4gICAgICBjb25zb2xlLmxvZygnaW4gZ2V0VXNlclN0b3JlTGlzdCcpO1xuICAgICAgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ1VzZXJBcHBTdG9yZS5saXN0JywgcGF5bG9hZCkuc3Vic2NyaWJlKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2V0VXNlclN0b3JlTGlzdCByZXN1bHQnLCByZXN1bHQpO1xuICAgICAgICB0aGlzLnVzZXJBcHBTdG9yZXMuc2V0KHJlc3VsdCBhcyB1bmtub3duIGFzIFVzZXJBcHBTdG9yZVtdKVxuICAgICAgfSlcbiAgICAgIC8vIGNvbnN0IHVzZXJBcHBTdG9yZSA9IGF3YWl0IGxhc3RWYWx1ZUZyb20odGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ1VzZXJBcHBTdG9yZS5saXN0JywgcGF5bG9hZCkpO1xuICAgICAgLy8gY29uc3QganNvbkNvZGVjID0gSlNPTkNvZGVjKClcbiAgICAgIC8vIGNvbnN0IHJldHVyblZhbHVlID0ganNvbkNvZGVjLmRlY29kZSh1c2VyQXBwU3RvcmUuZGF0YSkgYXMgVXNlckFwcFN0b3JlW11cbiAgICAgIC8vIHJldHVybiByZXR1cm5WYWx1ZSBhcyB1bmtub3duIGFzIFVzZXJBcHBTdG9yZVtdIDtcbiAgICB9XG5cbiAgLyoqIOWPluW+l+WFqOmDqOaHieeUqOeoi+W8j+a4heWWrlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICovXG4gIGdldEFwcFN0b3Jlc0J5S2V5d29yZChrZXl3b3JkPzogc3RyaW5nKTogTXlBcHBTdG9yZVtdIHtcbiAgICBpZiAoa2V5d29yZCkge1xuICAgICAgcmV0dXJuIHRoaXMubXlBcHBTdG9yZXMoKS5maWx0ZXIoKG15QXBwU3RvcmUpID0+IG15QXBwU3RvcmUudGl0bGUuaW5jbHVkZXMoa2V5d29yZCkpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMubXlBcHBTdG9yZXMoKVxuICAgIH1cbiAgfVxuXG4gIC8qKiDlj5blvpfnm67liY3mh4nnlKjnqIvlvI/os4fmlplcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcFVybFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICovXG4gIGdldEFwcFN0b3JlKGFwcFVybDogc3RyaW5nKTogTXlBcHBTdG9yZSB7XG4gICAgY29uc3QgbXlBcHBTdG9yZSA9IHRoaXMubXlBcHBTdG9yZXMoKS5maWx0ZXIoKG15QXBwU3RvcmUpID0+IG15QXBwU3RvcmUudXJsID09PSBhcHBVcmwpWzBdXG4gICAgcmV0dXJuIG15QXBwU3RvcmU7XG4gIH1cblxuICAvKiogcHVibGlzaCDmm7TmlrDlvozkvb/nlKjogIXmnIDmhJvmh4nnlKjnqIvlvI/liLBOQVRTXG4gICAqIEBwYXJhbSB7VXNlckFwcFN0b3JlfSBwYXlsb2FkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgKi9cbiAgYXN5bmMgcHViVXNlckFwcFN0b3JlRmF2b3JpdGUocGF5bG9hZDogVXNlckFwcFN0b3JlKSB7XG4gICAgLy8gY29uc3QgaW5mbzogVHJhbnNmZXJJbmZvPFVzZXJBcHBTdG9yZT4gPSB7XG4gICAgLy8gICBkYXRhOiBwYXlsb2FkLFxuICAgIC8vIH07XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIC8vIOmcgOW4tuWFpeaMh+WumueZvOW4g+S4u+mhjOS7peWPiuimgeWCs+mAgeeahOioiuaBr1xuICAgIGF3YWl0IHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5wdWJsaXNoKCdVc2VyQXBwU3RvcmUudXBkYXRlLmlzRmF2b3JpdGUnLCBwYXlsb2FkKTtcbiAgfVxuXG4gIC8qKiDlj5blvpfkvb/nlKjogIXos4foqIpcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAqL1xuICBhc3luYyBpbml0QXBwU3RvcmUoKSB7XG4gICAgLy8gY29uc3QgdXNlckNvZGUgPSAgYXdhaXQgdGhpcy4jc2hhcmVkU2VydmljZS5nZXRWYWx1ZShoaXN0b3J5LnN0YXRlLnRva2VuLnVzZXJDb2RlKTtcbiAgICBjb25zdCB1c2VyQ29kZSA9ICdOZW8nO1xuICAgIGNvbnNvbGUubG9nKCdiZWZvcmUgZ2V0QXBwU3RvcmVMaXN0Jyk7XG4gICAgYXdhaXQgdGhpcy5nZXRBcHBTdG9yZUxpc3QodXNlckNvZGUpXG4gICAgYXdhaXQgdGhpcy5nZXRVc2VyU3RvcmVMaXN0KHVzZXJDb2RlKVxuICB9XG5cbiAgLyoqIOaHieeUqOeoi+W8j+m7nuaTiuaIkeeahOacgOaEm2ljb25cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBhcHBJZFxuICAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAqL1xuICBvbkZhdm9yaXRlQ2xpY2soYXBwSWQ6IHN0cmluZyk6dm9pZCB7XG5cbiAgICB0aGlzLm15QXBwU3RvcmVzLnVwZGF0ZShteUFwcFN0b3JlQXJyYXkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJ1c2VyQXBwU3RvcmVzXCIsIHRoaXMudXNlckFwcFN0b3JlcygpKVxuICAgICAgcmV0dXJuIG15QXBwU3RvcmVBcnJheS5tYXAobXlBcHBTdG9yZSA9PiB7XG4gICAgICAgIGlmIChteUFwcFN0b3JlLmFwcElkID09PSBhcHBJZCkge1xuICAgICAgICAgIC8vIOWIh+aNoiBpc0Zhdm9yaXRlIOWAvFxuICAgICAgICAgIG15QXBwU3RvcmUuaXNGYXZvcml0ZSA9ICFteUFwcFN0b3JlLmlzRmF2b3JpdGU7XG4gICAgICAgICAgLy8g5ZyoIHVzZXJBcHBTdG9yZXMg5Lit5om+5Yiw55u45oeJ55qE6aCF55uu5pu05paw5a6D55qEIGlzRmF2b3JpdGVcbiAgICAgICAgICBjb25zdCB1c2VyQXBwU3RvcmUgPSB0aGlzLnVzZXJBcHBTdG9yZXMoKS5maW5kKHVzZXJBcHBTdG9yZSA9PiB1c2VyQXBwU3RvcmUuYXBwSWQgPT09IGFwcElkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnYXBwSWQnLCBhcHBJZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VzZXJBcHBTdG9yZUlEJywgdXNlckFwcFN0b3JlPy5hcHBJZCk7XG4gICAgICAgICAgaWYgKHVzZXJBcHBTdG9yZSkge1xuICAgICAgICAgICAgICB1c2VyQXBwU3RvcmUuaXNGYXZvcml0ZSA9IG15QXBwU3RvcmUuaXNGYXZvcml0ZTtcbiAgICAgICAgICAgICAgdGhpcy5wdWJVc2VyQXBwU3RvcmVGYXZvcml0ZSh1c2VyQXBwU3RvcmUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG15QXBwU3RvcmU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiDot7PovYnliLBtb2R1bGUgZmVkZXJhdGlvbiBwYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcHBVcmxcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAqL1xuICBvbk5hdkFwcENsaWNrKGFwcFVybDogbnVtYmVyKTp2b2lke1xuICAgIHRoaXMuI3JvdXRlci5uYXZpZ2F0ZShbYXBwVXJsXSlcbiAgfVxufVxuXG5cblxuXG4iXX0=