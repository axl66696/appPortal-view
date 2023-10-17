/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { ListboxModule } from 'primeng/listbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PasswordModule } from 'primeng/password';
import { NavigationService } from '../navigation.service';
import { NavigationViewService } from '../../navigation-view.service';
import { AppStoreService } from 'dist/app-store';
import { UserAccountService,UserProfileService } from 'dist/service';
import { AuthService } from '../../auth.service'
import { UserAccount } from '@his-viewmodel/app-portal/dist';
import { NewsService } from 'dist/news-info';
import { AppPortalProfile } from 'app-portal/src/app/types/appPortalProfile';
import { FooterService } from './footer.service';
import * as ThemeOptions from '../../../../assets/option/themeOptions.json'
import * as userDialogList from '../../../../assets/option/userDialogList.json'
@Component({
  selector: 'his-footer',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    DividerModule,
    RouterModule,
    ButtonModule,
    DialogModule,
    BadgeModule,
    ImageModule,
    ListboxModule,
    InputTextModule,
    InputSwitchModule,
    FormsModule,
    SelectButtonModule,
    PasswordModule,
    FileUploadModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit{


  /**User Dialog開關
   * @memberof FooterComponent
   */
  isUserDialogVisible: boolean = false;

  /**App List Dialog開關
   * @memberof FooterComponent
   */
  isAppListDialogVisible: boolean = false;

  /**User Dialog List清單
   * @memberof FooterComponent
   */
  userDialogList!: object[];

  navigationService = inject(NavigationService);
  navigationViewService = inject(NavigationViewService);
  userAccountService = inject(UserAccountService);
  userProfileService = inject(UserProfileService);
  newsService = inject(NewsService);
  appStoreService = inject(AppStoreService);
  #footerService = inject(FooterService);
  #router = inject(Router);
  #authService = inject(AuthService);


  ngOnInit(): void{
    this.userDialogList = Object.values(userDialogList)[Object.values(userDialogList).length-1] as unknown as object[];
  }
  /**點擊 Navigation Footer首頁Icon，導向首頁
   * @memberof FooterComponent
   */
  onHomeIconClick(): void {
    this.navigationService.isCollapsed.set(true);
    this.#router.navigate(['/home']);
  }

  /**點擊 Navigation Footer 使用者頭像，導向顯示Dialog
   * @memberof FooterComponent
   */
  onUserIconClick(): void {
    this.isUserDialogVisible = !this.isUserDialogVisible;
  }

  /**點擊 User Dialog 清單
   * @param {any} $event 點擊事件
   * @memberof FooterComponent
  */
  onUserDialogListClick($event: any) {
    this.isUserDialogVisible = !this.isUserDialogVisible;
    if ($event.option.code === 'PROFILE') {
      this.navigationViewService.isUserProfileVisible.set(true);
    }
  }

  /**點擊 News Icon導向News頁面
   * @memberof FooterComponent
  */
  onNewsIconClick(): void {
    this.#router.navigate(['/news']);
  }

  /**點擊 AppList Icon顯示或關閉AppList
   * @memberof FooterComponent
  */
  onAppListIconClick(): void {
    this.isAppListDialogVisible = !this.isAppListDialogVisible;
  }

  /**點擊查看全部按鈕導向Appstore頁面
   * @memberof FooterComponent
  */
  onAppStoreClick() {
    this.#router.navigate(['/appStore']);
  }

  /**點擊導向App頁面
   * @param {string} appUrl 應用程式網址路徑
   * @memberof FooterComponent
  */
  onNavAppClick(appUrl: string) {
    this.#router.navigate([appUrl]);
  }

  /**關閉開啟App
   * @param {string} appId 應用程式ID
   * @memberof FooterComponent
  */
  onCloseApp(appId: string) {
    this.appStoreService.setAppClose(appId);
  }

  /**點擊導向登出頁面
   * @memberof FooterComponent
   */
  onLogoutIconClick() {
    this.#router.navigate(['/login']);
  }


}
