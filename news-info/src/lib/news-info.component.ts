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
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '@his-base/shared';
import { FormsModule } from '@angular/forms';
import { UserAccountService } from 'dist/service';

@Component({
  selector: 'his-news-info',
  standalone: true,
  imports: [CommonModule, NewsListComponent, TableModule, FieldsetModule, ButtonModule, AvatarModule, RouterOutlet,TranslateModule,FormsModule],
  templateUrl: './news-info.component.html',
  styleUrls: ['./news-info.component.scss']
})
export class NewsInfoComponent{

  /** 宣告computed變數
   *  使用computed變數儲存各最新消息的資訊
   */
  news = computed(() => this.newsService.originalNews());
  normalNews = computed(() => this.newsService.normalNews());
  toDoList = computed(() => this.newsService.toDoList());
  checkedNormalNews = computed(() => this.newsService.checkedNormalNews());
  checkedToDoList = computed(()=>this.newsService.checkedToDoList());

  /** 宣告查詢式變數
   *  使用者進行查詢所需的查詢式
   */
  query = ''

  newsService = inject(NewsService);
  sharedService = inject(SharedService);
  userAccountService = inject(UserAccountService);
  #router = inject(Router);

  /** 跳轉到上一頁
   *  呼叫window.history.back()函式
   */
  onBackClick():void {
    window.history.back();
  }

  /** 跳轉頁面
   *  跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
   */
  onNavNewsClick(appUrl:string, sharedData:object):void{
    const key = this.sharedService.setValue(sharedData)
    this.#router.navigate([appUrl],{state:{token:key}});
  }

  /** 搜尋最新消息
   *  搜尋標題包含query的最新消息
   */
  filterSubject(){
    this.newsService.filterSubject(this.query);
  }

  /** 重置最新消息
   *  清空搜尋列時回復到上一次取得最新消息的狀態
   */
  filterReset(){
    this.newsService.filterReset();
  }
}
