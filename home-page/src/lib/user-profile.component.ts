import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsListComponent } from 'dist/news-info';
import { NewsService } from 'dist/news-info';
import { Router } from '@angular/router';
import { SharedService } from '@his-base/shared';
import { CardListComponent } from '@his-directive/card-list/dist/card-list';
import { AppStoreService } from 'dist/app-store';
import { WsNatsService } from './ws-nats.service';
import { Coding } from '@his-base/datatypes';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { UserAccountService } from 'dist/service';

@Component({
  selector: 'his-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    CardListComponent,
    NewsListComponent,
    NewsListComponent,
    TranslateModule,
  ],
})
export class UserProfileComponent {

  appStoreService = inject(AppStoreService);
  newsService = inject(NewsService);
  userAccountService = inject(UserAccountService);
  #router = inject(Router);
  #sharedService = inject(SharedService);
  #wsNatsService = inject(WsNatsService);
  #translate: TranslateService = inject(TranslateService);




  /**跳轉到查看更多消息的路徑
   * @memberof UserProfileComponent
   */
  onMoreNewsClick(): void {
    this.#sharedService.sharedValue = null;
    const key = this.#sharedService.setValue(
      this.userAccountService.userAccount()
    );
    this.#router.navigate(['/news'], { state: { token: key } });
  }

  /**跳轉到最新消息中appUrl的路徑
   * @param {string} appUrl
   * @param {object} sharedData
   * @memberof UserProfileComponent
   */
  onNavNewsLinkClick(appUrl: string, sharedData: object) {
    const key = this.#sharedService.setValue(sharedData);
    this.#router.navigate([appUrl], { state: { token: key } });
  }

  /** 跳轉到應用程式page
   * @memberof UserProfileComponent
   */
  onMoreAppListClick(): void {
    const key = this.#sharedService.setValue(
      this.userAccountService.userAccount()
    );
    this.#router.navigate(['/appStore'], { state: { token: key } });
  }
}
