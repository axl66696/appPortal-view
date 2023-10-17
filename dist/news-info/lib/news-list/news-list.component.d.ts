import { NewsService } from './../news.service';
import { TemplateRef } from '@angular/core';
import { News } from '@his-viewmodel/app-portal/dist';
import { SharedService } from '@his-base/shared';
import '@his-base/date-extension';
import * as i0 from "@angular/core";
export declare class NewsListComponent {
    #private;
    /** 接收自父component收到的最新消息
     *  @memberof NewsListComponent
     */
    news?: News[];
    /** ng-template模板
     *  @memberof NewsListComponent
     */
    customTemplate?: TemplateRef<any>;
    defaultTable1?: TemplateRef<any>;
    noUrlNews?: TemplateRef<any>;
    newsService: NewsService;
    sharedService: SharedService<any>;
    /** 跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
     *  @memberof NewsInfoComponent
     */
    onNavNewsClick(url: string, sharedData: object): void;
    /** 發送`最新消息狀態改為已讀/已完成`到nats
     *  @memberof NewsInfoComponent
     */
    onChangeStatus(news: News): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NewsListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NewsListComponent, "his-news-list", never, { "news": { "alias": "news"; "required": false; }; "customTemplate": { "alias": "customTemplate"; "required": false; }; "defaultTable1": { "alias": "defaultTable1"; "required": false; }; "noUrlNews": { "alias": "noUrlNews"; "required": false; }; }, {}, never, never, true, never>;
}
