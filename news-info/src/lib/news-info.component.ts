/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, inject, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from './news.service';
import { NewsListComponent } from './news-list/news-list.component'
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { Router, RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { Coding } from '@his-base/datatypes';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '@his-base/shared';
import { FormsModule } from '@angular/forms';
import { UserAccountService } from 'dist/service';
import { News } from '@his-viewmodel/app-portal/dist';

@Component({
  selector: 'his-news-info',
  standalone: true,
  imports: [CommonModule, NewsListComponent, TableModule, FieldsetModule, ButtonModule, AvatarModule, RouterOutlet,TranslateModule,FormsModule],
  templateUrl: './news-info.component.html',
  styleUrls: ['./news-info.component.scss']
})
export class NewsInfoComponent implements OnDestroy{


  /** 使用computed變數儲存各最新消息的資訊
   *  @memberof NewsInfoComponent
   */
  news = computed(() => this.newsService.originalNews());
  normalNews = computed(() => this.newsService.normalNews());
  toDoList = computed(() => this.newsService.toDoList());
  checkedNormalNews = computed(() => this.newsService.checkedNormalNews());
  checkedToDoList = computed(()=>this.newsService.checkedToDoList());

  /** 使用者進行查詢所需的查詢式
   *  @memberof NewsInfoComponent
   */
  query = ''

  /** userCode測試資料
   *  @memberof NewsInfoComponent
   */
  userCode!:string

  newsService = inject(NewsService);
  sharedService = inject(SharedService);
  httpClient = inject(HttpClient)
  userAccountService = inject(UserAccountService);
  #router = inject(Router);

  // /** 建立連線、訂閱最新消息、初始化最新消息
  //  *  @memberof NewsInfoComponent
  //  */
  // async ngOnInit(): Promise<void> {
  //   this.httpClient.get('http://localhost:4320/assets/mockUserCode/mockUserCode.json')
  //                  .subscribe(userCode => {
  //                   this.userCode = userCode as unknown as string;
  //                 })
  //   await this.newsService.connect();
  //   await this.newsService.subNews();
  //   this.newsService.publishUserCode(this.userCode);
  // }

  /** 跳轉到上一頁
   *  @memberof NewsInfoComponent
   */
  onBackClick():void {
    window.history.back();
  }

  /** 跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
   *  @memberof NewsInfoComponent
   */
  onNavNewsClick(appUrl:string, sharedData:object):void{
    const key = this.sharedService.setValue(sharedData)
    this.#router.navigate([appUrl],{state:{token:key}});
  }

  /** 發送`最新消息狀態改為已讀/已完成`到nats
   *  @memberof NewsInfoComponent
   */
  // async onChangeStatus(userCode:Coding, newsId:string):Promise<void>{
  //   this.newsService.changeStatus(userCode, newsId);
  // }
  // async onChangeStatus(news:News):Promise<void>{
  //   this.newsService.changeStatus(news);
  // }

  /** 搜尋標題包含query的最新消息
   *  @memberof NewsInfoComponent
   */
  filterSubject(){
    this.newsService.filterSubject(this.query);
  }

  /** 清空搜尋列時回復到上一次取得最新消息的狀態
   *  @memberof NewsInfoComponent
   */
  filterReset(){
    this.newsService.filterReset();
  }

  /** 清除連線
   *  @memberof NewsInfoCoponent
   */
  async ngOnDestroy(): Promise<void> {
    await this.newsService.disconnect();
  }

}
