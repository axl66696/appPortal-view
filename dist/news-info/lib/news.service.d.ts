import { Observable } from 'rxjs';
import { News } from '@his-viewmodel/app-portal/dist';
import { Coding } from '@his-base/datatypes';
import * as i0 from "@angular/core";
export declare class NewsService {
    #private;
    /** 使用Signal變數儲存各類型最新消息的資訊
     *  @memberof NewsService
     */
    originalNews: import("@angular/core").WritableSignal<News[]>;
    allNormalNews: import("@angular/core").WritableSignal<News[]>;
    allTodoList: import("@angular/core").WritableSignal<News[]>;
    normalNews: import("@angular/core").WritableSignal<News[]>;
    toDoList: import("@angular/core").WritableSignal<News[]>;
    checkedNormalNews: import("@angular/core").WritableSignal<News[]>;
    checkedToDoList: import("@angular/core").WritableSignal<News[]>;
    /** 建立nats連線
     *  @memberof NewsService
     */
    connect(): Promise<void>;
    /** 中斷nats連線
     *  @memberof NewsService
     */
    disconnect(): Promise<void>;
    /** publish userCode到nats
     *  @memberof NewsService
     */
    publishUserCode(userCode: string): void;
    /** 發送`最新消息狀態改為已讀/已完成`到nats
     *  @memberof NewsService
     */
    changeStatus(news: News): void;
    /** 依‘一般消息’、’待辦工作’分類最新消息
     *  @memberof NewsService
     */
    filterType(newsList: News[], code: Coding['code']): News[];
    /** 依`已讀/已完成`、`未讀/未完成`分類最新消息
     *  @memberof NewsService
     */
    filterStatus(newsList: News[], code: Coding['code']): News[];
    /** 僅顯示未超過24小時的已讀一般消息/待辦工作
     *  @memberof NewsService
     */
    filterOverdue(newsList: News[]): News[];
    /** 搜尋含subject字串的最新消息
     *  @memberof NewsService
     */
    filterSubject(subject: string): void;
    /** 回復到上一次取得最新消息的狀態
     *  @memberof NewsService
     */
    filterReset(): void;
    /** 設定除了原始最新消息news以外的Signal
     *  @memberof NewsService
     */
    upsertNews(news: News[]): void;
    /** 規格化從nats取得的最新消息
     *  @memberof NewsService
     */
    formatNews(newsList: News[]): News[];
    /** 訂閱最新消息
     * @memberof NewsService
     */
    subNews(): Promise<void>;
    getInitNews(userCode: Coding): Observable<News[]>;
    upsertAllNews(newsList: News[]): void;
    /** 訂閱最新消息
     * @memberof NewsService
     */
    subMyNews(userCode: Coding): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NewsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NewsService>;
}
