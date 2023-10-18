import { Observable } from 'rxjs';
import { News } from '@his-viewmodel/app-portal/dist';
import { Coding } from '@his-base/datatypes';
import * as i0 from "@angular/core";
export declare class NewsService {
    #private;
    /** 宣告Signal變數
     *  使用Signal變數儲存各類型最新消息的資訊
     */
    originalNews: import("@angular/core").WritableSignal<News[]>;
    allNormalNews: import("@angular/core").WritableSignal<News[]>;
    allTodoList: import("@angular/core").WritableSignal<News[]>;
    normalNews: import("@angular/core").WritableSignal<News[]>;
    toDoList: import("@angular/core").WritableSignal<News[]>;
    checkedNormalNews: import("@angular/core").WritableSignal<News[]>;
    checkedToDoList: import("@angular/core").WritableSignal<News[]>;
    /** 初始化最新消息
     *  首次進入頁面時，自資料庫初始化最新消息
     */
    getInitNews(userCode: Coding): Observable<News[]>;
    /** 更改最新消息狀態
     *  發送`最新消息狀態改為已讀/已完成`到nats
     */
    changeStatus(news: News): void;
    /** 分類‘一般消息’、’待辦工作’
     *  依‘一般消息’、’待辦工作’分類最新消息
     */
    filterType(newsList: News[], code: Coding['code']): News[];
    /** 分類`已讀/已完成`、`未讀/未完成`
     *  依`已讀/已完成`、`未讀/未完成`分類最新消息
     */
    filterStatus(newsList: News[], code: Coding['code']): News[];
    /** 不顯示逾期的最新消息
     *  僅顯示未超過24小時已讀/已完成的一般消息/待辦工作
     */
    filterOverdue(newsList: News[]): News[];
    /** 搜尋最新消息
     *  搜尋含subject字串的最新消息
     */
    filterSubject(subject: string): void;
    /** 重置最新消息
     *  以originalNews重置所有最新消息
     */
    filterReset(): void;
    /** 設定最新消息
     *  設定除了原始最新消息originalNews以外的最新消息
     */
    upsertNews(news: News[]): void;
    /** 設定/更新所有最新消息
     *  設定/更新所有最新消息Signal變數
     */
    upsertAllNews(newsList: News[]): void;
    /** 規格化最新消息
     *  規格化從nats取得的最新消息
     */
    formatNews(newsList: News[]): News[];
    /** 訂閱最新消息
     *  從nats訂閱最新消息
     */
    subMyNews(userCode: Coding): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NewsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NewsService>;
}
