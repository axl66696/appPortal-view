import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from './navigation/navigation.service';
import { NavigationViewService } from './navigation-view.service';
import { SharedService } from '@his-base/shared';
import { NewsService } from 'news-info';
import { WsNatsService } from '../ws-nats.service';
import { UserAccountService,UserProfileService } from 'dist/service';
import { DockComponent } from './dock/dock.component';
import { News, UserProfile } from '@his-viewmodel/app-portal/dist';
import { AppPortalProfile } from '../types/appPortalProfile.d';

@Component({
  selector: 'app-navigation-view',
  standalone: true,
  imports: [CommonModule,NavigationComponent,RouterOutlet,DockComponent],
  templateUrl: './navigation-view.component.html',
  styleUrls: ['./navigation-view.component.scss'],
  providers: [NavigationViewService]
})
export class NavigationViewComponent {
  navigationService = inject(NavigationService);
  navigationViewService = inject(NavigationViewService);
  newsService = inject(NewsService);
  userAccountService = inject(UserAccountService);
  userProfileService = inject(UserProfileService);
  #shareService = inject(SharedService);
  #wsNatsService = inject(WsNatsService);

  async ngOnInit() {
    await this.#wsNatsService.connect();
    this.userAccountService.userAccount.set(this.#shareService.getValue(window.history.state.token));
    this.userAccountService.getUserImage(this.userAccountService.userAccount().userCode.code);
    await this.newsService.subMyNews(this.userAccountService.userAccount().userCode);
    this.newsService.getInitNews(this.userAccountService.userAccount().userCode).subscribe(newsList=>{
      this.newsService.upsertAllNews(this.newsService.formatNews(newsList as News[]))
    });



  }
}
