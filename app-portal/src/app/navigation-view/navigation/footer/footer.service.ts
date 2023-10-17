import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws';
import { UserProfile } from '@his-viewmodel/app-portal/dist';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  #jetStreamWsService = inject(JetstreamWsService)

  /** 更新userProfile
   * @type {UserProfile}
   * @memberof FooterService
  */

  async pubUserAccount(payload: UserProfile) {
    // @ts-ignore
    // 需帶入指定發布主題以及要傳送的訊息
    await this.#jetStreamWsService.publish('appPortal.userProfile.modify', payload);
  }

}
