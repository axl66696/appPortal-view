import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ForgotPasswordService } from './forgot-password.service';
import '@angular/localize/init';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'his-forgot-password',
  standalone: true,
  imports: [
            CommonModule,
            DialogModule,
            FormsModule,
            ButtonModule,
            InputTextModule,
            TranslateModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {

  /** 忘記密碼畫面顯示與否
   * @type {boolean}
   * @memberof ForgotPasswordComponent
   */
  @Input() isVisibleForgot!: boolean;

  /** 發射關閉忘記密碼畫面事件
   * @memberof ForgotPasswordComponent
   */
  @Output() hideForgot = new EventEmitter();

  /** 帳號
   * @type {string}
   * @memberof ForgotPasswordComponent
   */
  userCode: string = '';

  /** 電子信箱
   * @type {string}
   * @memberof ForgotPasswordComponent
   */
  eMail: string = '';

  /** 後端回傳的使用者信箱
   * @type {string}
   * @memberof ForgotPasswordComponent
   */
  userMail: string = '';

  messageService = inject(MessageService);
  #forgotPasswordService = inject(ForgotPasswordService);
  #translateService = inject(TranslateService);

  /** 點擊確定送出按鈕
   * @memberof ForgotPasswordComponent
   */
  onSubmitClick() {
    this.#forgotPasswordService.getUserMail(this.userCode, this.eMail).subscribe(x => {
      this.userMail = x
      if(this.userMail !== this.eMail) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.#translateService.instant('帳號或信箱不正確')});
      }
      else {
        this.#forgotPasswordService.pubSendMail(this.userCode,this.userMail)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.#translateService.instant('重置連結已發送到信箱')});
        this.hideForgot.emit();
      }
      this.userCode = '';
      this.eMail = '';
    })
    }

  /** 關閉忘記密碼視窗
   * @memberof ForgotPasswordComponent
   */
  onCloseClick() {
    this.userCode = '';
    this.eMail = '';
    this.hideForgot.emit();
  }
}
