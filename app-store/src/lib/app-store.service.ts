import { UserAccount } from '@his-viewmodel/app-portal/dist/app/user-account';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserAppStore } from "@his-viewmodel/app-portal/dist";
import { MyAppStore } from "@his-viewmodel/app-portal/dist";
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { ExtendedMyAppStore } from '../types/extended-my-app-store';
import * as _ from 'lodash';
import { UserAccountService } from 'service';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  /** 目前使用者應用程式原始內容
   * @type {ExtendedMyAppStore}
   * @memberof AppStoreService
  */
  myAppStores = signal<ExtendedMyAppStore[]>([])


  /** 所有使用者的應用程式
   * @type {UserAppStore}
   * @memberof AppStoreService
   */
  userAppStores = signal<UserAppStore[]>([])

  /** 使用者打開應用程式順序
   * @type {ExtendedMyAppStore}
   * @memberof AppStoreService
   */
  appOpenedIndex = [] as ExtendedMyAppStore[]

  #router = inject(Router);
  #jetStreamWsService = inject(JetstreamWsService);
  #userAccountService = inject(UserAccountService);


  /** 擴展MyAppStore到ExtendedMyAppStore
   * @param {MyAppStore[]} appStores
   * @memberof AppStoreService
   */
  convertToExtendedAppStores(appStores: MyAppStore[]): ExtendedMyAppStore[] {
      return appStores.map(appStore => ({...appStore,isOpen: false}));
  }

  /** 取得全部應用程式清單
   * @param {string} payload
   * @memberof AppStoreService
   */
  getAppStoreList(payload: string) {
    return this.#jetStreamWsService.request('appPortal.appStore.myAppStores', payload)
  }

  /** 取得全部使用者應用程式清單
    * @param {string} payload
    * @memberof AppStoreService
    */
  getUserStoreList(payload: string) {
    return this.#jetStreamWsService.request('appPortal.appStore.userAppStores', payload)
  }

  /** 取得全部應用程式清單
   * @param {string} keyword
   * @memberof AppStoreService
   */
  getAppStoresByKeyword(keyword?: string): MyAppStore[] {
    if (keyword) {
      return this.myAppStores().filter((myAppStore) => myAppStore.title.includes(keyword))
    }
    else {
      return this.myAppStores()
    }
  }

  /** 取得目前應用程式資料
   * @param {string} appUrl
   * @memberof AppStoreService
   */
  getAppStore(appUrl: string): MyAppStore {
    const myAppStore = this.myAppStores().filter((myAppStore) => myAppStore.url === appUrl)[0]
    return myAppStore;
  }

  /** publish 更新後使用者最愛應用程式到NATS
   * @param {UserAppStore} payload
   * @memberof AppStoreService
   */
  async pubUserAppStoreFavorite(payload: UserAppStore) {
    await this.#jetStreamWsService.publish('appPortal.appStore.userFavorite', payload);
  }



  /** 應用程式點擊我的最愛icon
   * @param {string} appId
   * @memberof AppStoreService
   */
  onFavoriteClick(appId: string):void {
    this.myAppStores.update(myAppStoreArray => {
      return myAppStoreArray.map(myAppStore => {
        if (myAppStore.appId === appId) {
          // 切换 isFavorite 值
          myAppStore.isFavorite = !myAppStore.isFavorite;
          // 在 userAppStores 中找到相應的項目更新它的 isFavorite
          const userAppStore = this.userAppStores().find(userAppStore => userAppStore.appId === appId);
          if (userAppStore) {
              userAppStore.isFavorite = myAppStore.isFavorite;
              this.pubUserAppStoreFavorite(userAppStore)
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
  onNavAppClick(appUrl: number):void{
    this.#router.navigate([appUrl])
  }

  /** 設定應用程式關閉
   * @param {string} appId
   * @memberof AppStoreService
  */
    setAppClose(appId: string): void {
      this.myAppStores.update(apps => apps.map(app => { app.appId === appId ? app.isOpen = false : app; return app }))

      if (this.appOpenedIndex.length > 1) {
        const index = this.appOpenedIndex.findIndex(app => app.appId === appId)
        this.appOpenedIndex.splice(index, 1);
        this.#router.navigate([this.appOpenedIndex[this.appOpenedIndex.length - 1].url])
      }
      else {
        this.appOpenedIndex.splice(1, 1);
        this.#router.navigateByUrl('/home')
      }
    }

  /** 設定應用程式開啟
   * @param {string} appId
   * @memberof AppStoreService
  */
  setAppOpen(appId: string): void {
    const findApp = this.myAppStores().filter(x => x.appId === appId)[0]

    const objectsAreEqual = (x: ExtendedMyAppStore, y: ExtendedMyAppStore) => {
      return x.url === y.url;
    };

    if (findApp) {
      this.myAppStores.update(x => x.map(y => { y.appId === appId ? y.isOpen = true : y; return y }))
      if (!this.appOpenedIndex.find(x => objectsAreEqual(x, findApp))) {
        this.appOpenedIndex.push(findApp)
      }
    }
  }
}




