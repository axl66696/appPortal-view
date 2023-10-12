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

constructor() {
  this.userProfile.set(
    {
      "_id":"jidweqjiefwi",
      "userCode": {
        "code": "Neo",
        "display": "alphaTeam-001"
      },
      "appId" : 'web-client',
      "profile":{},
      "updatedBy": new Coding(),
      "updatedAt": new Date(),
    }
  )
}

}
