import { Component, inject } from '@angular/core';
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
import { UserProfileService } from 'dist/home-page';
import { UserAccountService } from 'dist/service';
// import { AuthService } from 'src/app/login-page/auth.service';
// import { NavigationFooterService } from './navigation-footer.service';

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
export class FooterComponent {


  isUserDialogVisible: boolean = false;
  isUserProfileVisible: boolean = false;
  isAppListDialogVisible: boolean = false;
  userDialogList!: object[];

  navigationService = inject(NavigationService);
  navigationViewService = inject(NavigationViewService);
  userAccountService = inject(UserAccountService);
  appStoreService = inject(AppStoreService);
  #router = inject(Router);


  ngOnInit(): void{
    this.userDialogList = [
      { label: $localize`個人設定`, code: 'PROFILE' },
      { label: $localize`幫助中心`, code: 'HELP' },
    ];
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
      this.isUserProfileVisible = true;
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

  /**點擊導向登出頁面
   * @memberof FooterComponent
  */
  onLogoutIconClick() {
    this.#router.navigate(['/login']);
  }
}
