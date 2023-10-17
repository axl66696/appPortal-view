import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { RouterModule } from '@angular/router';
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
import { NavigationViewService } from '../navigation-view.service';
import { UserAccountService,UserProfileService } from 'dist/service';
import { AuthService } from '../auth.service'
import { UserAccount } from '@his-viewmodel/app-portal/dist';
import { AppPortalProfile } from 'app-portal/src/app/types/appPortalProfile';
import * as ThemeOptions from '../../../assets/option/themeOptions.json'
import { UserProfileDialogService } from './user-profile-dialog.service';

@Component({
  selector: 'his-user-profile-dialog',
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
  templateUrl: './user-profile-dialog.component.html',
  styleUrls: ['./user-profile-dialog.component.scss']
})
export class UserProfileDialogComponent {

  /**User Dialog開關
   * @memberof FooterComponent
   */
  @Input() isUserProfileVisible!: boolean;

  /**Dock開關
   * @memberof UserProfileDialogComponent
   */
  isDockVisible: boolean = true;
  /**確認是否重置密碼
   * @memberof UserProfileDialogComponent
   */
  isRestDisabled: boolean = true;

  /**確認密碼
   * @memberof UserProfileDialogComponent
   */
  enteredPassword: string = '';

  /**輸入要更改密碼
   * @memberof UserProfileDialogComponent
   */
  resetPassword: string = '';

  /**確認更改密碼
   * @memberof UserProfileDialogComponent
   */
  resetPasswordVerify: string = '';

  /**深淺顏色主題清單
   * @memberof UserProfileDialogComponent
   */
  themeOptions: object[] = [];

  /**暫存User Account資訊
   * @type {UserAccount}
   * @memberof UserProfileDialogComponent
   */
  editableUserAccount!: UserAccount;

  /**暫存User Profile資訊
   * @type {UserProfile}
   * @memberof UserProfileDialogComponent
   */
  editableAppPortalProfile!: AppPortalProfile;


  /**暫存使用者頭像
   * @type {string}
   * @memberof UserProfileDialogComponent
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
  selectedTheme: string = '';

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

  userAccountService = inject(UserAccountService);
  userProfileService = inject(UserProfileService);
  navigationViewService = inject(NavigationViewService);
  userProfileDialogService = inject(UserProfileDialogService);
  #authService = inject(AuthService);


  ngOnInit(): void{
    this.themeOptions = Object.values(ThemeOptions)[Object.values(ThemeOptions).length-1] as unknown as object[];
    this.editableUserAccount = Object.assign({}, this.userAccountService.userAccount());
    this.editableUserImage.set(this.userAccountService.userImage().image)
    this.editableAppPortalProfile = Object.assign({}, this.userProfileService.userProfile().profile as AppPortalProfile);
    this.selectedScale = this.editableAppPortalProfile.fontSize
    this.activeScaleButton = this.editableAppPortalProfile.fontSize
    this.selectedTheme = this.editableAppPortalProfile.selectedTheme
    this.isDockVisible = this.editableAppPortalProfile.isDockVisible
  }

  ngOnChanges() {
    this.editableUserImage.set(this.userAccountService.userImage().image)
  }

  /**上傳個人圖片
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
        }}}}

  /**驗證密碼
   * @memberof FooterComponent
   */
  verityPassword() {
    const passwordHash = this.userAccountService.userAccount().passwordHash;
    const enteredPasswordHash = this.#authService.getHashPassword(this.enteredPassword);
    if (enteredPasswordHash === passwordHash) {
      this.isRestDisabled = false;
    } else {
      alert("密碼不正確");
    }}

  /**驗證修改密碼兩次輸入是否相同
   * @memberof FooterComponent
   */
  verityResetPassword() {
    const resetPassword = this.#authService.getHashPassword(this.resetPassword);
    const resetPasswordVerify = this.#authService.getHashPassword(this.resetPasswordVerify);
    if(this.enteredPassword !== '' && resetPassword === resetPasswordVerify && this.resetPassword !== '') {
      this.editableUserAccount.passwordHash = resetPassword;
      alert("密碼修改成功")
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
    this.navigationViewService.isUserProfileVisible.set(!this.navigationViewService.isUserProfileVisible())
    this.editableUserAccount = Object.assign({}, this.userAccountService.userAccount());
    this.editableUserImage.set(this.userAccountService.userImage().image)
    this.verityResetPassword();
    const userProfile = this.userProfileService.userProfile().profile as AppPortalProfile ;
    this.selectedScale = userProfile.fontSize
    this.selectedTheme = userProfile.selectedTheme
    this.isDockVisible = userProfile.isDockVisible
    this.onThemeChange();
    this.onScaleChange(this.selectedScale);
    this.onDockVisible();
  }

  /**保存變更
   * @memberof FooterComponent
  */
  onProfileSaveClick(){
    this.verityResetPassword();
    this.navigationViewService.isUserProfileVisible.set(!this.navigationViewService.isUserProfileVisible())
    this.userAccountService.userAccount.set(this.editableUserAccount);
    this.userAccountService.userImage.set({
      _id:this.userAccountService.userImage()._id,
      userCode:this.userAccountService.userImage().userCode,
      image:this.editableUserImage()})
      this.editableUserAccount = Object.assign({},this.userAccountService.userAccount());
      this.editableAppPortalProfile = Object.assign({},
        {
          selectedTheme:this.selectedTheme,
          isDockVisible:this.isDockVisible,
          fontSize:this.selectedScale
        })
      this.userProfileService.userProfile.set(
        {
          "_id":this.userProfileService.userProfile()._id,
          "userCode":this.userProfileService.userProfile().userCode,
          "appId":this.userProfileService.userProfile().appId,
          "profile":this.editableAppPortalProfile,
          updatedAt:new Date(),
          updatedBy:this.userAccountService.userAccount().userCode})
      this.userProfileDialogService.pubUserAccount(this.userProfileService.userProfile())
    }

  /**修改主題樣式
   * @memberof FooterComponent
  */
  onThemeChange() {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');

    if (this.selectedTheme === 'light') {
      themeLink.href = 'app/styles/theme-light.css'; // 切換到 light 主題的樣式表
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
