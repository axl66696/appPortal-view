/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from '@his-base/shared';
import { LoginService } from './login.service';
import { WsNatsService } from './ws-nats.service';
import { UserAccount, UserProfile, UserToken } from '@his-viewmodel/app-portal/dist';
import { LoginReq } from '@his-viewmodel/app-portal/dist'
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { InputTextModule } from 'primeng/inputtext';
import * as branchData from '../assets/data/branchesName.json'
import '@angular/localize/init';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserProfileService } from 'service';
import { AppPortalProfile } from './types/appPortalProfile.d';
@Component({
  selector: 'his-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
  imports: [CommonModule,
    ButtonModule,
    PasswordModule,
    FormsModule,
    RouterLink,
    ImageModule,
    DropdownModule,
    ToastModule,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    InputTextModule,
    TranslateModule
  ]
})
export class LoginComponent implements OnInit {

  /** 加密識別token
   * @type {string}
   * @memberof LoginComponent
   */
  @Input() token!: string;

  /** 院區選項
   * @type {string[]}
   * @memberof LoginComponent
   */
  branchesOption: string[] = [];

  /** 輸入的密碼
   * @type {string}
   * @memberof LoginComponent
   */
  password: string = '';

  /** 登入資訊
   * @type {LoginReq}
   * @memberof LoginComponent
   */
  loginReq: LoginReq = new LoginReq();

  /** 使用者權杖
   * @type {UserToken}
   * @memberof LoginComponent
   */
  userToken: UserToken = new UserToken();

  /** 忘記密碼頁面顯示與否
   * @type {boolean}
   * @memberof LoginComponent
   */
  isVisibleForgot: boolean = false;

  /** 重置密碼頁面顯示與否
   * @type {boolean}
   * @memberof LoginComponent
   */
  isVisibleReset: boolean = false;

  /** 使用者帳號資訊
   * @type {UserAccount}
   * @memberof LoginComponent
   */
  userAccount: UserAccount = new UserAccount();

  messageService = inject(MessageService);
  router = inject(Router);
  userProfileService = inject(UserProfileService);
  #loginService = inject(LoginService);
  #wsNatsService = inject(WsNatsService);
  #sharedService = inject(SharedService);
  #translateService = inject(TranslateService)

  /** 初始化登入畫面為淺色模式 以及與Nats連線
   * @memberof LoginComponent
   */
  async ngOnInit() {
    this.branchesOption = Object.values(branchData)[0] as unknown as string[]
    await this.#wsNatsService.connect();
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css')
    themeLink.href = 'app/styles/theme.css'
  }

  /** 點擊登入按鈕
   * @memberof LoginComponent
   */
  onLoginClick() {
    try {
      this.loginReq.passwordHash = this.#loginService.getHashPassword(this.password);
      this.#loginService.getUserToken(this.loginReq).subscribe(x => {
        this.userToken = x
        this.checkUserToken(this.userToken);
      })
    }
    catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.#translateService.instant('登入失敗') });
    }
  }

  /** 檢查有無登入授權
   * @param {UserToken} userToken
   * @memberof LoginComponent
   */
  checkUserToken(userToken: UserToken) {
    if (userToken.token !== '') {
      this.#sharedService.sharedValue = null;
      this.#loginService.getUserAccount(userToken.userCode.code).subscribe(x => {
        this.userAccount = x
        this.userProfileService.getUserProfile(x.userCode.code, "app-portal")
          .subscribe((x: UserProfile) => {
            this.userProfileService.userProfile.set(x);
            const appPortalProfile = x.profile as AppPortalProfile;
            const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
            if (appPortalProfile.selectedTheme === 'dark') {
              themeLink.href = 'app/styles/theme-dark.css'; // 切換到 dark 主題的樣式表
            }
            document.documentElement.style.fontSize = appPortalProfile.fontSize + 'px';//套用使用者字型大小設定
          })
        const key = this.#sharedService.setValue(this.userAccount)
        this.router.navigate(['/home'], { state: { token: key } });
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.#translateService.instant('帳號或密碼錯誤') });
    }
  }

  /** 點擊忘記密碼
   * @memberof LoginComponent
   */
  onForgotClick() {
    this.isVisibleForgot = true;
  }

  /** 關閉忘記密碼視窗
   * @memberof LoginComponent
   */
  onHideForgot() {
    this.isVisibleForgot = false;
  }

  /** 關閉重置密碼視窗
   * @memberof LoginComponent
   */
  onHideReset() {
    this.isVisibleReset = false;
  }
}
