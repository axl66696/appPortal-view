import { UserAccount } from '@his-viewmodel/app-portal/dist/app/user-account';
import { lastValueFrom } from 'rxjs';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserAppStore } from "@his-viewmodel/app-portal/dist";
import { MyAppStore } from "@his-viewmodel/app-portal/dist";
import { AppStore } from "@his-viewmodel/app-portal/dist";
import { JSONCodec, JetstreamWsService, TransferInfo } from '@his-base/jetstream-ws/dist';
import { SharedService } from '@his-base/shared';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  appStores = signal<AppStore[]>([])
  myAppStores = signal<MyAppStore[]>([])
  appOpenedIndex = [] as AppStore[]
  userAppStores = signal<UserAppStore[]>([])

  #router = inject(Router);
  #jetStreamWsService = inject(JetstreamWsService);
  #sharedService = inject(SharedService);


  /** 取得全部應用程式清單
   * @param {string} payload
   * @memberof AppStoreService
   */
  getAppStoreList(payload: string) {
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    console.log('in getAppStoreList');
    // const myAppStore = await lastValueFrom(this.#jetStreamWsService.request('UserAppStore.myAppStore', payload));
    this.#jetStreamWsService.request('UserAppStore.myAppStore', payload).subscribe((result: any) => {
      // 處理資料邏輯的地方，取得reply回傳的資料
      console.log('getAppStoreList result', result);
      this.myAppStores.set(result as unknown as MyAppStore[])
    }
);
  }

    /** 取得全部使用者應用程式清單
     * @param {string} payload
     * @memberof AppStoreService
    */
    async getUserStoreList(payload: string) {
      // @ts-ignore
      // 需帶入指定的主題跟要傳遞的資料
      console.log('in getUserStoreList');
      this.#jetStreamWsService.request('UserAppStore.list', payload).subscribe((result: any) => {
        console.log('getUserStoreList result', result);
        this.userAppStores.set(result as unknown as UserAppStore[])
      })
      // const userAppStore = await lastValueFrom(this.#jetStreamWsService.request('UserAppStore.list', payload));
      // const jsonCodec = JSONCodec()
      // const returnValue = jsonCodec.decode(userAppStore.data) as UserAppStore[]
      // return returnValue as unknown as UserAppStore[] ;
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
    const userCode =  await this.#sharedService.getValue(history.state.token.userCode);
    await this.getAppStoreList(userCode)
    await this.getUserStoreList(userCode)
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
}




