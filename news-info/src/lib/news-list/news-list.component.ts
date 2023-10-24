import { NewsService } from './../news.service';
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News } from '@his-viewmodel/app-portal/dist'
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SharedService } from '@his-base/shared';
import '@his-base/date-extension'

@Component({
  selector: 'his-news-list',
  standalone: true,
  imports: [CommonModule,TableModule,ButtonModule,TranslateModule],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent {

  /** 宣告news變數
   *  以Input接收自父component收到的最新消息
   */
  @Input() news?:any;

  /** 宣告news變數
   *  以Input接收自父component收到的最新消息
   */
  table?:any;

  newsService = inject(NewsService)
  sharedService = inject(SharedService);
  #router = inject(Router);

  /** 跳轉頁面
   *  跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
   */
  onNavNewsClick(url:string, sharedData?:object):void{
    if(!url){
      return;
    }
    else if(!sharedData){
      this.#router.navigate([url]);
    }
    else{
      const key = this.sharedService.setValue(sharedData)
      this.#router.navigate([url],{state:{token:key}});
    }
  }

  /** 更改最新消息狀態
   *  發送`最新消息狀態改為已讀/已完成`到nats
   */
  async onChangeStatus(news:News):Promise<void>{
    this.newsService.changeStatus(news);
  }

  /** 更改最新消息狀態
   *  發送`最新消息狀態改為已讀/已完成`到nats
   */
  async onChangeNormalNewsStatus(id:string):Promise<void>{
    this.newsService.changeNormalNewsStatus(id);
  }

}
