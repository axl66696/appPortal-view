import { UserAccount } from '@his-viewmodel/app-portal/dist/app/user-account';
import { lastValueFrom } from 'rxjs';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserAppStore } from "@his-viewmodel/app-portal/dist";
import { MyAppStore } from "@his-viewmodel/app-portal/dist";
import { AppStore } from "@his-viewmodel/app-portal/dist";
import { JSONCodec, JetstreamWsService, TransferInfo } from '@his-base/jetstream-ws/dist';
import { SharedService } from '@his-base/shared';
import { WsNatsService } from './ws-nats.service';
import * as _ from 'lodash';


type ExtendedMyAppStore = MyAppStore & {
  isOpen: boolean;
};

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

  appOpenedIndex = [] as ExtendedMyAppStore[]

  #router = inject(Router);
  #jetStreamWsService = inject(JetstreamWsService);
  #sharedService = inject(SharedService);
  #wsNatsService = inject(WsNatsService);

  /** 擴展MyAppStore到ExtendedMyAppStore
   * @param {MyAppStore[]} appStores
   * @memberof AppStoreService
   */
  convertToExtended(appStores: MyAppStore[]): ExtendedMyAppStore[] {
      return appStores.map(appStore => ({...appStore,isOpen: false}));
  }

  /** 取得全部應用程式清單
   * @param {string} payload
   * @memberof AppStoreService
   */
  async getAppStoreList(payload: string) {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    this.#jetStreamWsService.request('UserAppStore.myAppStore', payload).subscribe((result: any) => {
      this.myAppStores.set(this.convertToExtended(result as unknown as MyAppStore[]))
    });
  }

  /** 取得全部使用者應用程式清單
    * @param {string} payload
    * @memberof AppStoreService
    */
  async getUserStoreList(payload: string) {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    this.#jetStreamWsService.request('UserAppStore.list', payload).subscribe((result: any) => {
      this.userAppStores.set(result as unknown as UserAppStore[])
    })
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
    // 需帶入指定發布主題以及要傳送的訊息
    await this.#jetStreamWsService.publish('UserAppStore.update.isFavorite', payload);
  }

  /** 初始化MyAppStore
   * @param {UserAccount} userAccount
   * @memberof AppStoreService
   */
  async initAppStore() {
    const userAccount:UserAccount =  await this.#sharedService.getValue(history.state.token);
    console.log("get token", userAccount)
    await this.getAppStoreList(userAccount.userCode.code)
    await this.getUserStoreList(userAccount.userCode.code)
  }

  /** 應用程式點擊我的最愛icon
   * @param {string} appId
   * @memberof AppStoreService
   */
  onFavoriteClick(appId: string):void {
    this.myAppStores.update(myAppStoreArray => {
      console.log("userAppStores", this.userAppStores())
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
      console.log(this.appOpenedIndex)

      if (this.appOpenedIndex.length > 1) {
        const index = this.appOpenedIndex.findIndex(app => app.appId === appId)
        this.appOpenedIndex.splice(index, 1);
        console.log(index)
        console.log(this.appOpenedIndex[this.appOpenedIndex.length - 1])
        // window.open(this.appOpenedIndex[this.appOpenedIndex.length-1].appUrl,"_top")
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




