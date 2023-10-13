import { OnDestroy } from '@angular/core';
import { NewsService } from './news.service';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '@his-base/shared';
import { UserAccountService } from 'dist/service';
import { News } from '@his-viewmodel/app-portal/dist';
import * as i0 from "@angular/core";
export declare class NewsInfoComponent implements OnDestroy {
    #private;
    /** 使用computed變數儲存各最新消息的資訊
     *  @memberof NewsInfoComponent
     */
    news: import("@angular/core").Signal<News[]>;
    normalNews: import("@angular/core").Signal<News[]>;
    toDoList: import("@angular/core").Signal<News[]>;
    checkedNormalNews: import("@angular/core").Signal<News[]>;
    checkedToDoList: import("@angular/core").Signal<News[]>;
    /** 使用者進行查詢所需的查詢式
     *  @memberof NewsInfoComponent
     */
    query: string;
    /** userCode測試資料
     *  @memberof NewsInfoComponent
     */
    userCode: string;
    newsService: NewsService;
    sharedService: SharedService<any>;
    httpClient: HttpClient;
    userAccountService: UserAccountService;
    /** 跳轉到上一頁
     *  @memberof NewsInfoComponent
     */
    onBackClick(): void;
    /** 跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
     *  @memberof NewsInfoComponent
     */
    onNavNewsClick(appUrl: string, sharedData: object): void;
    /** 發送`最新消息狀態改為已讀/已完成`到nats
     *  @memberof NewsInfoComponent
     */
    /** 搜尋標題包含query的最新消息
     *  @memberof NewsInfoComponent
     */
    filterSubject(): void;
    /** 清空搜尋列時回復到上一次取得最新消息的狀態
     *  @memberof NewsInfoComponent
     */
    filterReset(): void;
    /** 清除連線
     *  @memberof NewsInfoCoponent
     */
    ngOnDestroy(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NewsInfoComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NewsInfoComponent, "his-news-info", never, {}, {}, never, never, true, never>;
}
