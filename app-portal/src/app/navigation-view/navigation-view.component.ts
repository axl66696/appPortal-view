import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from './navigation/navigation.service';
import { NavigationViewService } from './navigation-view.service';
import { UserProfileService } from 'dist/home-page';
import { SharedService } from '@his-base/shared';
import { NewsService } from 'news-info';
import { WsNatsService } from '../ws-nats.service';
import { UserAccountService } from 'dist/service';
@Component({
  selector: 'app-navigation-view',
  standalone: true,
  imports: [CommonModule,NavigationComponent,RouterOutlet],
  templateUrl: './navigation-view.component.html',
  styleUrls: ['./navigation-view.component.scss'],
  providers: [NavigationViewService]
})
export class NavigationViewComponent {
  navigationService = inject(NavigationService);
  navigationViewService = inject(NavigationViewService);
  userProfileService = inject(UserProfileService);
  newsService = inject(NewsService);
  userAccountService = inject(UserAccountService);
  #shareService = inject(SharedService);
  #wsNatsService = inject(WsNatsService);

  async ngOnInit() {
    await this.#wsNatsService.connect();
    this.userAccountService.userAccount.set(this.#shareService.getValue(window.history.state.token));
    this.userAccountService.getUserImage(this.userAccountService.userAccount().userCode.code);
    await this.newsService.connect();
    await this.newsService.subNews();
    this.newsService.publishUserCode(this.userAccountService.userAccount().userCode as unknown as string);
  }
}
