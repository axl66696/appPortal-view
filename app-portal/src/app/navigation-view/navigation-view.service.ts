import { Injectable, Signal, computed, inject,signal } from '@angular/core';
import { UserAccount } from '@his-viewmodel/app-portal/dist/app/user-account';
import { SharedService } from '@his-base/shared';
@Injectable({
  providedIn: 'root'
})
export class NavigationViewService {

  /** 使用Signal變數儲存UserAccount型別的使用者資訊
   * @memberof NavigationViewService
  */
  userAccount = signal<UserAccount>({} as UserAccount)
  #sharedService = inject(SharedService);

  /** 從首頁傳過來的
   * @memberof NavigationViewService
  */
  async getUserAccount() {
    const userAccount:UserAccount =  await this.#sharedService.getValue(history.state.token);
    this.userAccount.set(userAccount);
    console.log('userAccount',userAccount);
  }
}
