import { NewsService } from './../news.service';
import { News } from '@his-viewmodel/app-portal/dist';
import { SharedService } from '@his-base/shared';
import '@his-base/date-extension';
import * as i0 from "@angular/core";
export declare class NewsListComponent {
    #private;
    /** 宣告news變數
     *  以Input接收自父component收到的最新消息
     */
    news?: News[];
    newsService: NewsService;
    sharedService: SharedService<any>;
    /** 跳轉頁面
     *  跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
     */
    onNavNewsClick(url: string, sharedData: object): void;
    /** 更改最新消息狀態
     *  發送`最新消息狀態改為已讀/已完成`到nats
     */
    onChangeStatus(news: News): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NewsListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NewsListComponent, "his-news-list", never, { "news": { "alias": "news"; "required": false; }; }, {}, never, never, true, never>;
}
