/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject, mergeMap } from 'rxjs';
import { ConsumerMessages, JSONCodec, JetstreamWsService, SubscribeType } from '@his-base/jetstream-ws';
import { News } from '@his-viewmodel/app-portal/dist';
import { Coding } from '@his-base/datatypes';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  /** 使用Signal變數儲存各類型最新消息的資訊
   *  @memberof NewsService
   */
  news = signal<News[]>({} as News[]);
  allNormalNews = signal<News[]>({} as News[]);
  allTodoList = signal<News[]>({} as News[]);
  normalNews = signal<News[]>({} as News[]);
  toDoList = signal<News[]>({} as News[]);
  checkedNormalNews = signal<News[]>({} as News[]);
  checkedToDoList = signal<News[]>({} as News[]);

  /** nats連線位址
   *  @memberof NewsService
   */
  #url = 'ws://localhost:8080';

  /** 使用Subject變數自nats拿取最新消息
   *  @memberof NewsService
   */
  #userNews = new Subject();

  /** 使用ConsumerMessages訂閱最新消息
   *  @memberof NewsService
   */
  #consumerMessages$!: Observable<ConsumerMessages>;

  #jetStreamWsService = inject(JetstreamWsService);

  /** 建立nats連線
   *  @memberof NewsService
   */
  async connect(): Promise<void> {
    await this.#jetStreamWsService.connect(this.#url);
  }

  /** 中斷nats連線
   *  @memberof NewsService
   */
  async disconnect(): Promise<void> {
    await this.#jetStreamWsService.drain();
  }

  /** publish userCode到nats
   *  @memberof NewsService
   */
  publishUserCode(userCode:string): void {
    this.#jetStreamWsService.publish("news.wantNews", userCode);
  }

  /** 發送`最新消息狀態改為已讀/已完成`到nats
   *  @memberof NewsService
   */
  changeStatus(userCode:Coding, newsId:string){
    const date = new Date();
    this.#jetStreamWsService.publish("news.updateStatus", {userCode, newsId, date});
  }

  /** 依‘一般消息’、’待辦工作’分類最新消息
   *  @memberof NewsService
   */
  filterType(newsList:News[], code:Coding['code']): News[]{
    if(code){
      return newsList.filter(newsData=>newsData.type['code']==code);
    }
    else{
      return newsList;
    }
  }

  /** 依`已讀/已完成`、`未讀/未完成`分類最新消息
   *  @memberof NewsService
   */
  filterStatus(newsList:News[], code:Coding['code']): News[]{
    if(code){
      return newsList.filter(newsData=>newsData.execStatus['code']==code);
    }
    else{
      return newsList;
    }
  }

  /** 僅顯示未超過24小時的已讀一般消息/待辦工作
   *  @memberof NewsService
   */
  filterOverdue(newsList:News[]): News[]{
    const date = new Date;
    const aDay = 24*60*60*1000;
    return newsList.filter(newsData=>date.valueOf() - newsData.execTime.valueOf() < aDay);
  }

  /** 搜尋含subject字串的最新消息
   *  @memberof NewsService
   */
  filterSubject(subject:string){
    const newsList=this.news();
    this.setNews(newsList.filter(newsData=>newsData.subject.match(subject)));
  }

  /** 回復到上一次取得最新消息的狀態
   *  @memberof NewsService
   */
  filterReset(){
    this.setNews(this.news())
  }

  /** 設定除了原始最新消息news以外的Signal
   *  @memberof NewsService
   */
  setNews(news:News[]): void{
    this.allNormalNews.set(this.filterType(news, "10"));
    this.allTodoList.set(this.filterType(news, "60"));
    this.normalNews.set(this.filterStatus(this.allNormalNews(), "10"));
    this.toDoList.set(this.filterStatus(this.allTodoList(),"10"));
    this.checkedNormalNews.set(this.filterOverdue(this.filterStatus(this.allNormalNews(), "60")));
    this.checkedToDoList.set(this.filterOverdue(this.filterStatus(this.allTodoList(), "60")));
  }

  /** 規格化從nats取得的最新消息
   *  @memberof NewsService
   */
  formatNews(newsList: News[]): News[]{
    const formatNewsList: News[] = [];
      newsList.forEach((news: News) => {
        const formatNewsData:News = {
          "_id": news._id,
          "appId": news.appId,
          "userCode": news.userCode,
          "subject": news.subject,
          "url": news.url,
          "sharedData": news.sharedData,
          "period": {
            "start": new Date(news.period.start),
            "end": new Date(news.period.end)
          },
          "type": news.type,
          "execTime": new Date(news.execTime),
          "execStatus": news.execStatus,
          "updatedBy": news.updatedBy,
          "updatedAt": new Date(news.updatedAt)
        };
        formatNewsList.push(formatNewsData);
      });
    return formatNewsList;
  }

  /** 訂閱最新消息
   * @memberof NewsService
   */
  async subNews(): Promise<void> {
    this.#userNews = new Subject();
    const jsonCodec = JSONCodec();
    this.#consumerMessages$ = this.#jetStreamWsService.subscribe(
      SubscribeType.Push,
      'news.getNews.dashboard'
    );

    this.#consumerMessages$
      .pipe(
        mergeMap(async (messages) => {
          for await (const message of messages) {
            this.#userNews.next(jsonCodec.decode(message.data));
            message.ack();
          }
        })
      )
      .subscribe(() => {});

    this.#userNews.subscribe((newsList:any) => {
      this.news.set(this.formatNews(newsList as News[]));
      this.setNews(this.formatNews(newsList));
    });
  }

}

