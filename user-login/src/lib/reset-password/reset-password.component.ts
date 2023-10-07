/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../login.service';
import { PasswordModule } from 'primeng/password';
import { ResetPasswordService } from './reset-password.service';
import { Router } from '@angular/router';
import '@angular/localize/init';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'his-reset-password',
  standalone: true,
  imports: [
            CommonModule,
            DialogModule,
            FormsModule,
            ButtonModule,
            InputTextModule,
            PasswordModule,
            TranslateModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy{

  /** 重設密碼畫面是否可視
   * @type {boolean}
   * @memberof ResetPasswordComponent
   */
  @Input() isVisibleReset!: boolean;

  /** 識別token
   * @type {string}
   * @memberof ResetPasswordComponent
   */
  @Input() token!: string;

  /** 發射關閉重置密碼視窗事件
   * @memberof ResetPasswordComponent
   */
  @Output() hide = new EventEmitter();

  /** 發射重置密碼失敗事件
   * @memberof ResetPasswordComponent
   */
  @Output() authError = new EventEmitter();

  /** 新密碼
   * @type {string}
   * @memberof ResetPasswordComponent
   */
  password: string = '';

  /** 再確認新密碼
   * @type {string}
   * @memberof ResetPasswordComponent
   */
  passwordConfirm: string = '';

  /** 從後端拿到的使用者代碼
   * @type {string}
   * @memberof ResetPasswordComponent
   */
  userCode: string = '';

  /** 加密後的新密碼
   * @type {string}
   * @memberof ResetPasswordComponent
   */
  passwordHash: string = ''

  router = inject(Router);
  messageService = inject(MessageService);
  loginService = inject(LoginService);
  #resetPasswordService = inject(ResetPasswordService);

  /** 初始化,與Nats連線，如果網址傳入之token無誤則可以進入重置密碼頁面
   * @memberof ResetPasswordComponent
   */
  async ngOnInit() {
    if(this.token){
      this.isVisibleReset = true;
      await this.#resetPasswordService.connect();
      this.catchAuthError();
    }
  }

  /** 斷開Nats的連線
   * @memberof ResetPasswordComponent
   */
  async ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    await this.#resetPasswordService.disconnect();
  }

  /** 點擊關閉重置密碼dialog
   * @memberof ResetPasswordComponent
   */
  onCloseClick() {
    this.hide.emit();
    this.router.navigate(['login']);
  }

  /** 驗證密碼與再輸入密碼兩個欄位的值是否相同
   * @return {*}  {boolean}
   * @memberof ResetPasswordComponent
   */
  checkPassword(): boolean {
    const passwordHash = this.loginService.getHashPassword(this.password);
    const passwordConfirmHash = this.loginService.getHashPassword(this.passwordConfirm);
    if(passwordHash === passwordConfirmHash && this.password !== '') {
      this.passwordHash = passwordHash;
      return true;
    }
    else
      return false;
  }

  /** 點擊取消按鈕
   * @memberof ResetPasswordComponent
   */
  onCancelClick() {
    this.password = '';
    this.passwordConfirm = '';
    this.hide.emit();
    this.router.navigate(['login']);
  }

  /** 點擊確定按鈕送出新密碼
   * @memberof ResetPasswordComponent
   */
  async onSubmitClick() {
    if(this.checkPassword()) {
      this.hide.emit();
      await this.#resetPasswordService.pubPassword(this.userCode, this.passwordHash);
      this.router.navigate(['login']);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: '密碼更改成功'});
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '請輸入相同密碼'});
    }
    this.password = '';
    this.passwordConfirm = '';
  }

  /** 取得重置密碼授權 如果得到的userCode是空值則不能進入重置密碼頁面
   * @memberof ResetPasswordComponent
   */
  catchAuthError() {
    this.#resetPasswordService.getUserCode(this.token).subscribe(x=>{
      this.userCode = x
      if(this.userCode === '') {
        this.router.navigate(['login']);
        this.authError.emit();
      }
    })
  }
}
