import {UserProfile } from '@his-viewmodel/app-portal/dist';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { JetstreamWsService } from '@his-base/jetstream-ws/dist';
import { Coding, IndexObject } from '@his-base/datatypes';
@Injectable({
  providedIn: 'root',
})
export class UserProfileService {

  #jetStreamWsService = inject(JetstreamWsService);

  /** 使用Signal變數儲存UserAccount型別的使用者帳號
   * @memberof UserProfileService
   */
  userProfile = signal<UserProfile>({} as UserProfile);



getUserProfile(userCode: string,appId:string){
  // @ts-ignore
  // 需帶入指定的主題跟要傳遞的資料
  // this.#jetStreamWsService.request('appPortal.userProfile.find', {'userCode':userCode,'appId':appId})
  // .subscribe((result: any) => {
  //   this.userProfile.set(result);
  // });

  return this.#jetStreamWsService.request('appPortal.userProfile.find', {'userCode':userCode,'appId':appId})
}

}
