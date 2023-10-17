import { Injectable,signal } from '@angular/core';
import { AppPortalProfile } from '../types/appPortalProfile.d';
@Injectable({
  providedIn: 'root'
})
export class NavigationViewService {



  isDockVisible = signal<boolean>(true)
  isUserProfileVisible = signal<boolean>(false)

  /**初始化User Profile
   * @param {boolean} isDockVisible Dock顯示
   */
  initialUserProfile(appPortalProfile:AppPortalProfile){
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    themeLink.href = `app/styles/theme-${appPortalProfile.selectedTheme}.css`
    document.documentElement.style.fontSize = appPortalProfile.fontSize + 'px';//套用使用者字型大小設定
  }

  /**設置Dock是否顯示
   * @param {boolean} isDockVisible Dock顯示
   */
  setDockVisible(isDockVisible:boolean){
    this.isDockVisible.set(isDockVisible)
  }

  /**取得Dock是否顯示
   * @returns {boolean} Dock顯示
   */
  getDockVisible():boolean{
    return this.isDockVisible()
  }

}
