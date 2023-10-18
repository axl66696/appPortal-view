import { NewsService } from './news.service';
import { SharedService } from '@his-base/shared';
import { UserAccountService } from 'dist/service';
import * as i0 from "@angular/core";
export declare class NewsInfoComponent {
    #private;
    /** 宣告computed變數
     *  使用computed變數儲存各最新消息的資訊
     */
    news: import("@angular/core").Signal<import("@his-viewmodel/app-portal/dist").News[]>;
    normalNews: import("@angular/core").Signal<import("@his-viewmodel/app-portal/dist").News[]>;
    toDoList: import("@angular/core").Signal<import("@his-viewmodel/app-portal/dist").News[]>;
    checkedNormalNews: import("@angular/core").Signal<import("@his-viewmodel/app-portal/dist").News[]>;
    checkedToDoList: import("@angular/core").Signal<import("@his-viewmodel/app-portal/dist").News[]>;
    /** 宣告查詢式變數
     *  使用者進行查詢所需的查詢式
     */
    query: string;
    newsService: NewsService;
    sharedService: SharedService<any>;
    userAccountService: UserAccountService;
    /** 跳轉到上一頁
     *  呼叫window.history.back()函式
     */
    onBackClick(): void;
    /** 跳轉頁面
     *  跳轉到appUrl路徑的位置，並使用sharedService傳送資訊
     */
    onNavNewsClick(appUrl: string, sharedData: object): void;
    /** 搜尋最新消息
     *  搜尋標題包含query的最新消息
     */
    filterSubject(): void;
    /** 重置最新消息
     *  清空搜尋列時回復到上一次取得最新消息的狀態
     */
    filterReset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NewsInfoComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NewsInfoComponent, "his-news-info", never, {}, {}, never, never, true, never>;
}
