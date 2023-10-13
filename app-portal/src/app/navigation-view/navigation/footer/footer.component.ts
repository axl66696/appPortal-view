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

  /**User Dialog中個人設定顯示 User Profile Dialog開關
   * @memberof FooterComponent
   */
  isUserProfileVisible: boolean = false;

  /**App List Dialog開關
   * @memberof FooterComponent
   */
  isAppListDialogVisible: boolean = false;

  /**Dock開關
   * @memberof FooterComponent
   */
  isDockVisible: boolean = true;

  /**確認是否重置密碼
   * @memberof FooterComponent
   */
  isRestDisabled: boolean = true;

  /**確認密碼
   * @memberof FooterComponent
   */
  enteredPassword: string = '';

  /**輸入要更改密碼
   * @memberof FooterComponent
   */
  resetPassword: string = '';

  /**確認更改密碼
   * @memberof FooterComponent
   */
  resetPasswordVerify: string = '';

  /**User Dialog List清單
   * @memberof FooterComponent
   */
  userDialogList!: object[];

  /**深淺顏色主題清單
   * @memberof FooterComponent
   */
  themeOptions: object[] = [];

  /**暫存使用者資訊
   * @type {UserAccount}
   * @memberof FooterComponent
   */
  editableUserInfo!: UserAccount;

  /**暫存使用者頭像
   * @type {string}
   * @memberof FooterComponent
   */
  editableUserImage = signal<string>("")

  /**所選的圖片檔案陣列
   * @type {FileList}
   * @memberof FooterComponent
   */
  selectedFiles?: FileList;

  /**上傳圖片的Base64DataURL
   * @type {string}
   * @memberof FooterComponent
   */
  preview:string = "";

  /**當前選取上傳的檔案
    * @memberof FooterComponent
    */
  currentFile!:any

  /** 主題樣式
   * @type {string}
   * @memberof NavigationFooterComponent
   */
  selectedTheme: string = 'light';

  /** 字體大小
   * @type {number}
   * @memberof NavigationFooterComponent
   */
  selectedScale:number = 16;

  /** 按鈕大小
   * @type {number}
   * @memberof NavigationFooterComponent
   */
  activeScaleButton: number = 16;

  navigationService = inject(NavigationService);
  navigationViewService = inject(NavigationViewService);
  userAccountService = inject(UserAccountService);
  userProfileService = inject(UserProfileService);
  appStoreService = inject(AppStoreService);
  #router = inject(Router);
  #authService = inject(AuthService);


  ngOnInit(): void{

    this.userDialogList = [
      { label: $localize`個人設定`, code: 'PROFILE' },
      { label: $localize`幫助中心`, code: 'HELP' },
    ];
    this.themeOptions = [
      { name: $localize`淺色模式`, value: 'light' },
      { name: $localize`深色模式`, value: 'dark' },
    ];
    this.editableUserInfo = Object.assign({}, this.userAccountService.userAccount());
    this.editableUserImage.set(this.userAccountService.userImage().image)
    this.isDockVisible = true;
    this.selectedTheme = "dark"
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

  /**
   * 上傳個人圖片
   * @param {any} uploadFile 上傳的圖片
   */
  onSelectFile(uploadFile:any){
    this.selectedFiles = uploadFile.files
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.readAsDataURL(this.currentFile);

        reader.onload = (x: any) => {
          this.preview = x.target.result;
          this.editableUserImage.set(this.preview)
        };

      }
    }
  }

  /**驗證密碼
   * @memberof FooterComponent
   */
  verityPassword() {
    const passwordHash = this.userAccountService.userAccount().passwordHash;
    const enteredPasswordHash = this.#authService.getHashPassword(this.enteredPassword);
    if (enteredPasswordHash === passwordHash) {
      this.isRestDisabled = false;
    } else {
      alert($localize`密碼不正確`);
    }
  }

  /**驗證修改密碼兩次輸入是否相同
   * @memberof FooterComponent
   */

  verityResetPassword() {
    const resetPassword = this.#authService.getHashPassword(this.resetPassword);
    const resetPasswordVerify = this.#authService.getHashPassword(this.resetPasswordVerify);

    if(this.enteredPassword !== '' && resetPassword === resetPasswordVerify && this.resetPassword !== '') {
      this.editableUserInfo.passwordHash = resetPassword;
      alert($localize`密碼修改成功`)
    }
    this.enteredPassword = '';
    this.resetPassword = '';
    this.resetPasswordVerify = '';
    this.isRestDisabled = true;
  }

  /**取消不保存變更
   * @memberof FooterComponent
  */
  onCancelSaveClick() {
    this.isUserProfileVisible = !this.isUserProfileVisible;
    this.editableUserInfo = Object.assign({}, this.userAccountService.userAccount());
    this.editableUserImage.set(this.userAccountService.userImage().image)
    this.verityResetPassword();
    this.isDockVisible = true
    this.selectedScale = 16;
    this.activeScaleButton = 16;
    this.selectedTheme = "dark"
    // this.onThemeChange();
    this.onScaleChange(this.selectedScale);
    // this.onDockVisible();

  }

  /**保存變更
   * @memberof FooterComponent
  */
  onProfileSaveClick(){
    this.verityResetPassword();
    this.isUserProfileVisible = !this.isUserProfileVisible;
    this.userAccountService.userAccount.set(this.editableUserInfo);
    this.userAccountService.userImage.set({
      _id:this.userAccountService.userImage()._id,
      userCode:this.userAccountService.userImage().userCode,
      image:this.editableUserImage()})
    this.editableUserInfo = Object.assign({},this.userAccountService.userAccount());
    // this.editableUserInfo.typeSetting = Object.assign({},{theme:this.selectedTheme,isDockVisible:this.dockSwitch,scale:this.selectedScale})
    // this.#navigationFooterService.pubUserAccount(this.userInfoService.userInfo())
  }

  /**修改主題樣式
   * @memberof FooterComponent
  */
  onThemeChange() {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');

    if (this.selectedTheme === 'light') {
      themeLink.href = 'app/styles/theme.css'; // 切換到 light 主題的樣式表
    }
    else {
      themeLink.href = 'app/styles/theme-dark.css'; // 切換到 dark 主題的樣式表
    }
  }

  /**修改字體大小
   * @param {number} scale
   * @memberof FooterComponent
   */
  onScaleChange(scale:number) {
    document.documentElement.style.fontSize = scale + 'px';
    this.selectedScale = scale;
    this.activeScaleButton = scale;
  }

  /**判斷active button
   * @param {number} scale
   * @memberof FooterComponent
   */
  isScaleActive(buttonId: number): boolean {
    return this.activeScaleButton === buttonId;
  }

  /**修改Dock顯示
   * @memberof FooterComponent
   */
  onDockVisible(){
      this.navigationViewService.setDockVisible(this.isDockVisible)
    }


}
