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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.8", ngImport: i0, type: AppStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN0b3JlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAtc3RvcmUvc3JjL2xpYi9hcHAtc3RvcmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3pDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBR2pFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7QUFLN0MsTUFBTSxPQUFPLGVBQWU7SUFINUI7UUFLRTs7O1VBR0U7UUFDRixnQkFBVyxHQUFHLE1BQU0sQ0FBdUIsRUFBRSxDQUFDLENBQUE7UUFHOUM7OztXQUdHO1FBQ0gsa0JBQWEsR0FBRyxNQUFNLENBQWlCLEVBQUUsQ0FBQyxDQUFBO1FBRTFDOzs7V0FHRztRQUNILG1CQUFjLEdBQUcsRUFBMEIsQ0FBQTtRQUUzQyxZQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLHdCQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2pELHdCQUFtQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBZ0lsRDtJQWxJQyxPQUFPLENBQWtCO0lBQ3pCLG1CQUFtQixDQUE4QjtJQUNqRCxtQkFBbUIsQ0FBOEI7SUFHakQ7OztPQUdHO0lBQ0gsMEJBQTBCLENBQUMsU0FBdUI7UUFDOUMsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLEdBQUcsUUFBUSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVEOzs7T0FHRztJQUNILGVBQWUsQ0FBQyxPQUFlO1FB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QyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9GLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRTtnQkFDL0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDbEM7U0FDRjtJQUNILENBQUM7OEdBdEpVLGVBQWU7a0hBQWYsZUFBZSxjQUZkLE1BQU07OzJGQUVQLGVBQWU7a0JBSDNCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXNlckFjY291bnQgfSBmcm9tICdAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3QvYXBwL3VzZXItYWNjb3VudCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFVzZXJBcHBTdG9yZSB9IGZyb20gXCJAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3RcIjtcbmltcG9ydCB7IE15QXBwU3RvcmUgfSBmcm9tIFwiQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC9kaXN0XCI7XG5pbXBvcnQgeyBKZXRzdHJlYW1Xc1NlcnZpY2UgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzL2Rpc3QnO1xuaW1wb3J0IHsgRXh0ZW5kZWRNeUFwcFN0b3JlIH0gZnJvbSAnLi4vdHlwZXMvZXh0ZW5kZWQtbXktYXBwLXN0b3JlJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFVzZXJBY2NvdW50U2VydmljZSB9IGZyb20gJ3NlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBBcHBTdG9yZVNlcnZpY2Uge1xuXG4gIC8qKiDnm67liY3kvb/nlKjogIXmh4nnlKjnqIvlvI/ljp/lp4vlhaflrrlcbiAgICogQHR5cGUge0V4dGVuZGVkTXlBcHBTdG9yZX1cbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAqL1xuICBteUFwcFN0b3JlcyA9IHNpZ25hbDxFeHRlbmRlZE15QXBwU3RvcmVbXT4oW10pXG5cblxuICAvKiog5omA5pyJ5L2/55So6ICF55qE5oeJ55So56iL5byPXG4gICAqIEB0eXBlIHtVc2VyQXBwU3RvcmV9XG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIHVzZXJBcHBTdG9yZXMgPSBzaWduYWw8VXNlckFwcFN0b3JlW10+KFtdKVxuXG4gIC8qKiDkvb/nlKjogIXmiZPplovmh4nnlKjnqIvlvI/poIbluo9cbiAgICogQHR5cGUge0V4dGVuZGVkTXlBcHBTdG9yZX1cbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgYXBwT3BlbmVkSW5kZXggPSBbXSBhcyBFeHRlbmRlZE15QXBwU3RvcmVbXVxuXG4gICNyb3V0ZXIgPSBpbmplY3QoUm91dGVyKTtcbiAgI2pldFN0cmVhbVdzU2VydmljZSA9IGluamVjdChKZXRzdHJlYW1Xc1NlcnZpY2UpO1xuICAjdXNlckFjY291bnRTZXJ2aWNlID0gaW5qZWN0KFVzZXJBY2NvdW50U2VydmljZSk7XG5cblxuICAvKiog5pO05bGVTXlBcHBTdG9yZeWIsEV4dGVuZGVkTXlBcHBTdG9yZVxuICAgKiBAcGFyYW0ge015QXBwU3RvcmVbXX0gYXBwU3RvcmVzXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICovXG4gIGNvbnZlcnRUb0V4dGVuZGVkQXBwU3RvcmVzKGFwcFN0b3JlczogTXlBcHBTdG9yZVtdKTogRXh0ZW5kZWRNeUFwcFN0b3JlW10ge1xuICAgICAgcmV0dXJuIGFwcFN0b3Jlcy5tYXAoYXBwU3RvcmUgPT4gKHsuLi5hcHBTdG9yZSxpc09wZW46IGZhbHNlfSkpO1xuICB9XG5cbiAgLyoqIOWPluW+l+WFqOmDqOaHieeUqOeoi+W8j+a4heWWrlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF5bG9hZFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBnZXRBcHBTdG9yZUxpc3QocGF5bG9hZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5yZXF1ZXN0KCdhcHBQb3J0YWwuYXBwU3RvcmUubXlBcHBTdG9yZXMnLCBwYXlsb2FkKVxuICB9XG5cbiAgLyoqIOWPluW+l+WFqOmDqOS9v+eUqOiAheaHieeUqOeoi+W8j+a4heWWrlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBheWxvYWRcbiAgICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgICAqL1xuICBnZXRVc2VyU3RvcmVMaXN0KHBheWxvYWQ6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnYXBwUG9ydGFsLmFwcFN0b3JlLnVzZXJBcHBTdG9yZXMnLCBwYXlsb2FkKVxuICB9XG5cbiAgLyoqIOWPluW+l+WFqOmDqOaHieeUqOeoi+W8j+a4heWWrlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBnZXRBcHBTdG9yZXNCeUtleXdvcmQoa2V5d29yZD86IHN0cmluZyk6IE15QXBwU3RvcmVbXSB7XG4gICAgaWYgKGtleXdvcmQpIHtcbiAgICAgIHJldHVybiB0aGlzLm15QXBwU3RvcmVzKCkuZmlsdGVyKChteUFwcFN0b3JlKSA9PiBteUFwcFN0b3JlLnRpdGxlLmluY2x1ZGVzKGtleXdvcmQpKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm15QXBwU3RvcmVzKClcbiAgICB9XG4gIH1cblxuICAvKiog5Y+W5b6X55uu5YmN5oeJ55So56iL5byP6LOH5paZXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhcHBVcmxcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgZ2V0QXBwU3RvcmUoYXBwVXJsOiBzdHJpbmcpOiBNeUFwcFN0b3JlIHtcbiAgICBjb25zdCBteUFwcFN0b3JlID0gdGhpcy5teUFwcFN0b3JlcygpLmZpbHRlcigobXlBcHBTdG9yZSkgPT4gbXlBcHBTdG9yZS51cmwgPT09IGFwcFVybClbMF1cbiAgICByZXR1cm4gbXlBcHBTdG9yZTtcbiAgfVxuXG4gIC8qKiBwdWJsaXNoIOabtOaWsOW+jOS9v+eUqOiAheacgOaEm+aHieeUqOeoi+W8j+WIsE5BVFNcbiAgICogQHBhcmFtIHtVc2VyQXBwU3RvcmV9IHBheWxvYWRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgYXN5bmMgcHViVXNlckFwcFN0b3JlRmF2b3JpdGUocGF5bG9hZDogVXNlckFwcFN0b3JlKSB7XG4gICAgYXdhaXQgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnB1Ymxpc2goJ2FwcFBvcnRhbC5hcHBTdG9yZS51c2VyRmF2b3JpdGUnLCBwYXlsb2FkKTtcbiAgfVxuXG5cblxuICAvKiog5oeJ55So56iL5byP6bue5pOK5oiR55qE5pyA5oSbaWNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwSWRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAgKi9cbiAgb25GYXZvcml0ZUNsaWNrKGFwcElkOiBzdHJpbmcpOnZvaWQge1xuICAgIHRoaXMubXlBcHBTdG9yZXMudXBkYXRlKG15QXBwU3RvcmVBcnJheSA9PiB7XG4gICAgICByZXR1cm4gbXlBcHBTdG9yZUFycmF5Lm1hcChteUFwcFN0b3JlID0+IHtcbiAgICAgICAgaWYgKG15QXBwU3RvcmUuYXBwSWQgPT09IGFwcElkKSB7XG4gICAgICAgICAgLy8g5YiH5o2iIGlzRmF2b3JpdGUg5YC8XG4gICAgICAgICAgbXlBcHBTdG9yZS5pc0Zhdm9yaXRlID0gIW15QXBwU3RvcmUuaXNGYXZvcml0ZTtcbiAgICAgICAgICAvLyDlnKggdXNlckFwcFN0b3JlcyDkuK3mib7liLDnm7jmh4nnmoTpoIXnm67mm7TmlrDlroPnmoQgaXNGYXZvcml0ZVxuICAgICAgICAgIGNvbnN0IHVzZXJBcHBTdG9yZSA9IHRoaXMudXNlckFwcFN0b3JlcygpLmZpbmQodXNlckFwcFN0b3JlID0+IHVzZXJBcHBTdG9yZS5hcHBJZCA9PT0gYXBwSWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdhcHBJZCcsIGFwcElkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndXNlckFwcFN0b3JlSUQnLCB1c2VyQXBwU3RvcmU/LmFwcElkKTtcbiAgICAgICAgICBpZiAodXNlckFwcFN0b3JlKSB7XG4gICAgICAgICAgICAgIHVzZXJBcHBTdG9yZS5pc0Zhdm9yaXRlID0gbXlBcHBTdG9yZS5pc0Zhdm9yaXRlO1xuICAgICAgICAgICAgICB0aGlzLnB1YlVzZXJBcHBTdG9yZUZhdm9yaXRlKHVzZXJBcHBTdG9yZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbXlBcHBTdG9yZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIOi3s+i9ieWIsG1vZHVsZSBmZWRlcmF0aW9uIHBhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcFVybFxuICAgKiBAbWVtYmVyb2YgQXBwU3RvcmVTZXJ2aWNlXG4gICAqL1xuICBvbk5hdkFwcENsaWNrKGFwcFVybDogbnVtYmVyKTp2b2lke1xuICAgIHRoaXMuI3JvdXRlci5uYXZpZ2F0ZShbYXBwVXJsXSlcbiAgfVxuXG4gIC8qKiDoqK3lrprmh4nnlKjnqIvlvI/pl5zplolcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFwcElkXG4gICAqIEBtZW1iZXJvZiBBcHBTdG9yZVNlcnZpY2VcbiAgKi9cbiAgICBzZXRBcHBDbG9zZShhcHBJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICB0aGlzLm15QXBwU3RvcmVzLnVwZGF0ZShhcHBzID0+IGFwcHMubWFwKGFwcCA9PiB7IGFwcC5hcHBJZCA9PT0gYXBwSWQgPyBhcHAuaXNPcGVuID0gZmFsc2UgOiBhcHA7IHJldHVybiBhcHAgfSkpXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmFwcE9wZW5lZEluZGV4KVxuXG4gICAgICBpZiAodGhpcy5hcHBPcGVuZWRJbmRleC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5hcHBPcGVuZWRJbmRleC5maW5kSW5kZXgoYXBwID0+IGFwcC5hcHBJZCA9PT0gYXBwSWQpXG4gICAgICAgIHRoaXMuYXBwT3BlbmVkSW5kZXguc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy4jcm91dGVyLm5hdmlnYXRlKFt0aGlzLmFwcE9wZW5lZEluZGV4W3RoaXMuYXBwT3BlbmVkSW5kZXgubGVuZ3RoIC0gMV0udXJsXSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmFwcE9wZW5lZEluZGV4LnNwbGljZSgxLCAxKTtcbiAgICAgICAgdGhpcy4jcm91dGVyLm5hdmlnYXRlQnlVcmwoJy9ob21lJylcbiAgICAgIH1cbiAgICB9XG5cbiAgLyoqIOioreWumuaHieeUqOeoi+W8j+mWi+WVn1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXBwSWRcbiAgICogQG1lbWJlcm9mIEFwcFN0b3JlU2VydmljZVxuICAqL1xuICBzZXRBcHBPcGVuKGFwcElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBmaW5kQXBwID0gdGhpcy5teUFwcFN0b3JlcygpLmZpbHRlcih4ID0+IHguYXBwSWQgPT09IGFwcElkKVswXVxuXG4gICAgY29uc3Qgb2JqZWN0c0FyZUVxdWFsID0gKHg6IEV4dGVuZGVkTXlBcHBTdG9yZSwgeTogRXh0ZW5kZWRNeUFwcFN0b3JlKSA9PiB7XG4gICAgICByZXR1cm4geC51cmwgPT09IHkudXJsO1xuICAgIH07XG5cbiAgICBpZiAoZmluZEFwcCkge1xuICAgICAgdGhpcy5teUFwcFN0b3Jlcy51cGRhdGUoeCA9PiB4Lm1hcCh5ID0+IHsgeS5hcHBJZCA9PT0gYXBwSWQgPyB5LmlzT3BlbiA9IHRydWUgOiB5OyByZXR1cm4geSB9KSlcbiAgICAgIGlmICghdGhpcy5hcHBPcGVuZWRJbmRleC5maW5kKHggPT4gb2JqZWN0c0FyZUVxdWFsKHgsIGZpbmRBcHApKSkge1xuICAgICAgICB0aGlzLmFwcE9wZW5lZEluZGV4LnB1c2goZmluZEFwcClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG5cblxuIl19