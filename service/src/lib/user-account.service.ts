import { UserAccount, UserImage } from '@his-viewmodel/app-portal/dist';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
@Injectable({
  providedIn: 'root',
})
export class UserAccountService {

  #jetStreamWsService = inject(JetstreamWsService);

  /** 使用Signal變數儲存UserAccount型別的使用者帳號
   * @memberof UserProfileService
   */
  userAccount = signal<UserAccount>({} as UserAccount);

  /** 使用Signal變數儲存UserImage型別的使用者照片
   * @memberof UserProfileService
   */
  userImage = signal<UserImage>({} as UserImage);

  /** 取得使用者帳號照片
   * @param {string} payload
   * @memberof UserProfileService
   */
  getUserImage(payload: string) {
    this.#jetStreamWsService
      .request('UserImage.GetUserImage', payload)
      .subscribe((result: any) => {
        this.userImage.set(result);
        console.log("get image",result)
      });
  }
}
