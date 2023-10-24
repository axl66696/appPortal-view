/* eslint-disable no-prototype-builtins */
import { AppStoreService } from 'dist/app-store';
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from './navigation/navigation.service';
import { NavigationViewService } from './navigation-view.service';
import { SharedService } from '@his-base/shared';
import { NewsService } from 'news-info';
import { WsNatsService } from '../ws-nats.service';
import { UserAccountService, UserProfileService } from 'dist/service';
import { DockComponent } from './dock/dock.component';
import { News, MyAppStore, UserAppStore } from '@his-viewmodel/app-portal/dist';
import { AppPortalProfile } from '../types/appPortalProfile.d';
import { UserProfileDialogComponent } from './user-profile-dialog/user-profile-dialog.component';
@Component({
  selector: 'app-navigation-view',
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterOutlet, DockComponent,UserProfileDialogComponent],
  templateUrl: './navigation-view.component.html',
  styleUrls: ['./navigation-view.component.scss'],
  providers: [NavigationViewService]
})
export class NavigationViewComponent {
  navigationService = inject(NavigationService);
  navigationViewService = inject(NavigationViewService);
  newsService = inject(NewsService);
  appStoreService = inject(AppStoreService);
  userAccountService = inject(UserAccountService);
  userProfileService = inject(UserProfileService);
  #shareService = inject(SharedService);
  #wsNatsService = inject(WsNatsService);

  async ngOnInit() {

    const appPortalProfile = this.userProfileService.userProfile().profile as AppPortalProfile;
    this.navigationViewService.initialUserProfile(appPortalProfile);


    await this.#wsNatsService.connect();
    // await this.newsService.subMyNews(this.userAccountService.userAccount().userCode);

    // this.userAccountService.getUserImage(this.userAccountService.userAccount().userCode.code).subscribe(x => {
    //   this.userAccountService.userImage.set(x);
    // })


    this.appStoreService.getAppStoreList(this.userAccountService.userAccount().userCode.code).subscribe(x => {
      this.appStoreService.myAppStores.set(this.appStoreService.convertToExtendedAppStores(x as unknown as MyAppStore[]))
    })
    this.appStoreService.getUserStoreList(this.userAccountService.userAccount().userCode.code).subscribe(x => {
      this.appStoreService.userAppStores.set(x as unknown as UserAppStore[])
    })

    this.newsService.getInitNews(this.userAccountService.userAccount().userCode).subscribe(x => {
      this.newsService.upsertAllNews(this.newsService.formatNews(x as News[]))
      console.log("待辦事項",this.newsService.toDoList())
      console.log('todolist hasOwnProperty', this.newsService.toDoList()[0].hasOwnProperty('sharedData'))
    });

    console.log("一般消息before",this.newsService.normalNews())

    // appNews userNews版本
    this.newsService.reqAppNewsList(this.userAccountService.userAccount().userCode).subscribe(x => {
      // this.newsService.upsertAllNews(this.newsService.formatNews(x as News[]))
      this.newsService.normalNews.set(this.newsService.formatAppNews(x as News[]));
      console.log("一般消息after",this.newsService.normalNews())
      console.log('hasOwnProperty', this.newsService.normalNews()[0].hasOwnProperty('sharedData'))
    });






  }
}
