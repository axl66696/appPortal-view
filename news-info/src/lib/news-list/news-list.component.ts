import { NewsService } from './../news.service';
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News } from '@his-viewmodel/app-portal/dist'
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SharedService } from '@his-base/shared';
import { Coding } from '@his-base/datatypes/dist';
import '@his-base/date-extension'

@Component({
  selector: 'his-news-list',
  standalone: true,
  imports: [CommonModule,TableModule,ButtonModule,TranslateModule],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent {

  /** 接收自父component收到的最新消息
   *  @memberof NewsListComponent
   */
  @Input() news?: News[];

  /** ng-template模板
   *  @memberof NewsListComponent
   */
  @Input() customTemplate?: TemplateRef<any> ;
  @Input() defaultTable?: TemplateRef<any> ;
  @Input() noUrlNews?: TemplateRef<any> ;

  newsService = inject(NewsService)
  sharedService = inject(SharedService);
  #router = inject(Router);

  /** 跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
   *  @memberof NewsInfoComponent
   */
  onNavNewsClick(url:string, sharedData:object):void{
    if(!url){
      return;
    }
    else{
      const key = this.sharedService.setValue(sharedData)
      this.#router.navigate([url],{state:{token:key}});
    }
  }

  /** 發送`最新消息狀態改為已讀/已完成`到nats
   *  @memberof NewsInfoComponent
   */
  async onChangeStatus(news:News):Promise<void>{
    this.newsService.changeStatus(news);
  }

}
