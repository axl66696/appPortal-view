import { Injectable, inject } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws';
import { UserProfile } from '@his-viewmodel/app-portal/dist';

@Injectable({
  providedIn: 'root'
})
export class UserProfileDialogService {

  #jetStreamWsService = inject(JetstreamWsService)

  /** 更新userProfile
   * @type {UserProfile}
   * @memberof FooterService
  */
  async pubUserAccount(payload: UserProfile) {
    await this.#jetStreamWsService.publish('appPortal.userProfile.modify', payload);
  }
}
