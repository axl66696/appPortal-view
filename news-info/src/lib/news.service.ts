/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject, mergeMap } from 'rxjs';
import { ConsumerMessages, JSONCodec, JetstreamWsService, SubscribeType } from '@his-base/jetstream-ws';
import { News } from '@his-viewmodel/app-portal/dist';
import { Coding } from '@his-base/datatypes';
import { AppNews } from '@his-viewmodel/app-portal-fixIndex/dist/app/app-news';
import { UserNews } from '@his-viewmodel/app-portal-fixIndex/dist/app/user-news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  /** 宣告Signal變數
   *  使用Signal變數儲存各類型最新消息的資訊
   */
  originalNews = signal<News[]>({} as News[]);
  allNormalNews = signal<News[]>({} as News[]);
  allTodoList = signal<News[]>({} as News[]);
  normalNews = signal<News[]>({} as News[]);
  toDoList = signal<News[]>({} as News[]);
  checkedNormalNews = signal<News[]>({} as News[]);
  checkedToDoList = signal<News[]>({} as News[]);
  appNews = signal<AppNews[]>({} as AppNews[]);
  userNews = signal<UserNews[]>({} as UserNews[]);

  /** 宣告Subject變數
   *  使用Subject變數自nats拿取最新消息
   */
  #myNews = new Subject();

  /** 宣告ConsumerMessages變數
   *  使用ConsumerMessages訂閱最新消息
   */
  #myNewsConsumer$!: Observable<ConsumerMessages>;
  #jetStreamWsService = inject(JetstreamWsService);


  /** 初始化最新消息
   *  首次進入頁面時，自資料庫初始化最新消息
   */
  getInitNews(userCode:Coding): Observable<News[]>{
    return this.#jetStreamWsService.request('news.news.find', userCode);
  }

  /** 初始化最新消息
   *  首次進入頁面時，自資料庫初始化最新消息
   */
  reqAppNewsList(userCode:Coding): Observable<News[]>{
    return this.#jetStreamWsService.request('news.news.userNews', userCode);
  }

  /** 更改待辦事項狀態
   *  發送`最新消息狀態改為已讀/已完成`到nats
   */
  changeStatus(news:News){
    const date = new Date();
    this.originalNews.mutate(newsList=>{
      const index = newsList.findIndex(newsElement=>newsElement._id==news._id)
      newsList.splice(index,1)
    })
    news.execStatus = {code:"60",display:"已讀/已完成"}
    news.execTime = date
    this.#jetStreamWsService.publish(`news.news.setNews.${news.userCode.code}`, news);
  }

  /** 更改最新消息狀態
   *  發送`最新消息狀態改為已讀/已完成`到nats
   */
  changeNormalNewsStatus(id:string){
    const date = new Date();
    const index = this.userNews().findIndex(newsElement=>newsElement.appNews_id===id)
    const updatedNews = this.userNews()[index]
    this.userNews.mutate(newsList=>{
      // const index = newsList.findIndex(newsElement=>newsElement.appNews_id===id)
      //要不要直接在newsList改狀態？
      newsList.splice(index,1)
    })
    updatedNews.readTime = date
    this.#jetStreamWsService.publish(`news.news.userNews.${updatedNews.user}`, updatedNews);
  }

  /** 分類‘一般消息’、’待辦工作’
   *  依‘一般消息’、’待辦工作’分類最新消息
   */
  filterType(newsList:News[], code:Coding['code']): News[]{
    if(code){
      return newsList.filter(newsElement=>newsElement.type['code']==code);
    }
    else{
      return newsList;
    }
  }

  /** 分類`已讀/已完成`、`未讀/未完成`
   *  依`已讀/已完成`、`未讀/未完成`分類最新消息
   */
  filterStatus(newsList:News[], code:Coding['code']): News[]{
    if(code){
      return newsList.filter(newsElement=>newsElement.execStatus['code']==code);
    }
    else{
      return newsList;
    }
  }

  /** 不顯示逾期的最新消息
   *  僅顯示未超過24小時已讀/已完成的一般消息/待辦工作
   */
  filterOverdue(newsList:News[]): News[]{
    const date = new Date;
    const aDay = 24*60*60*1000;
    return newsList.filter(newsElement=>date.valueOf() - newsElement.execTime.valueOf() < aDay);
  }

  /** 搜尋最新消息
   *  搜尋含subject字串的最新消息
   */
  filterSubject(subject:string){
    const newsList=this.originalNews();
    this.upsertNews(newsList.filter(newsElement=>newsElement.subject.match(subject)));
  }

  /** 重置最新消息
   *  以originalNews重置所有最新消息
   */
  filterReset(){
    this.upsertNews(this.originalNews())
  }

  /** 設定最新消息
   *  設定除了原始最新消息originalNews以外的最新消息
   */
  upsertNews(news:News[]): void{
    // this.allNormalNews.set(this.filterType(news, "10"));
    this.allTodoList.set(this.filterType(news, "60"));
    // this.normalNews.set(this.filterStatus(this.allNormalNews(), "10"));
    this.toDoList.set(this.filterStatus(this.allTodoList(),"10"));
    // this.checkedNormalNews.set(this.filterOverdue(this.filterStatus(this.allNormalNews(), "60")));
    this.checkedToDoList.set(this.filterOverdue(this.filterStatus(this.allTodoList(), "60")));
  }

  /** 設定/更新所有最新消息
   *  設定/更新所有最新消息Signal變數
   */
  upsertAllNews(newsList:News[]):void{
    this.originalNews.set(newsList);
    this.upsertNews(newsList);
  }

  /** 規格化最新消息
   *  規格化從nats取得的最新消息
   */
  formatNews(newsList: News[]): News[]{
    const formatNewsList: News[] = [];
      newsList.forEach((news: News) => {
        const formatNewsElement:News = {
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
        formatNewsList.push(formatNewsElement);
      });
    return formatNewsList;
  }

  /** 規格化最新消息
   *  規格化從nats取得的最新消息
   */
  formatAppNews(newsList:any){
    const formatNewsList:any = [];
      newsList.forEach((news:any) => {
        const formatNewsElement:any = {
          "_id": news._id,
          "appStore_id": news.appStore_id,
          "level":news.level,
          "title":news.title,
          "url": news.url,
          "sendUser":news.sendUser,
          "sendTime": new Date(news.sendTime),
          "expiredTime": new Date(news.expiredTime),
          "updatedBy": news.updatedBy,
          "updatedAt": new Date(news.updatedAt)
        };
        formatNewsList.push(formatNewsElement);
      });
    return formatNewsList;
  }

  /** 規格化最新消息
   *  規格化從nats取得的最新消息
   */
  formatUserNews(newsList:any){
    const formatNewsList:any = [];
      newsList.forEach((news:any) => {
        const formatNewsElement:any = {
          '_id': news._id,
          'user': news.user,
          'readTime': new Date(news.readTime),
          'updatedBy': news.updatedBy,
          'updatedAt': new Date(news.updatedAt)
        };
        formatNewsList.push(formatNewsElement);
      });
    return formatNewsList;
  }

  /** 訂閱最新消息
   *  從nats訂閱最新消息
   */
  async subMyNews(userCode:Coding): Promise<void> {
    this.#myNews = new Subject();
    const jsonCodec = JSONCodec();
    this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(
      SubscribeType.Push,
      `news.news.setNews.${userCode.code}`
    );

    this.#myNewsConsumer$
      .pipe(
        mergeMap(async (messages) => {
          for await (const message of messages) {
            this.#myNews.next(jsonCodec.decode(message.data));
            message.ack();
          }
        })
      )
      .subscribe(() => {});

    this.#myNews.subscribe((newsElement:any) => {
      this.originalNews.mutate(newsList=>{
        const tmpNews = this.formatNews([newsElement.data])
        newsList.push(tmpNews[0])
      })
      this.upsertNews(this.originalNews())
    });
  }

  /** 訂閱最新消息
   *  從nats訂閱最新消息
   */
  async upserNewsProperty(userCode:Coding): Promise<void> {
    this.#myNews = new Subject();
    const jsonCodec = JSONCodec();
    this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(
      SubscribeType.Push,
      `news.news.userNews.${userCode.code}`
    );

    this.#myNewsConsumer$
      .pipe(
        mergeMap(async (messages) => {
          for await (const message of messages) {
            this.#myNews.next(jsonCodec.decode(message.data));
            message.ack();
          }
        })
      )
      .subscribe(() => {});

    this.#myNews.subscribe((newsElement:any) => {
      const index = this.userNews().findIndex(news=>newsElement.appNews_id===news.appNews_id)
      if(index){
        this.userNews.mutate(newsList=>{
          newsList[index].readTime = new Date(newsElement.data.readTIme)
        })
      }
      else{
        this.userNews.mutate(newsList=>{
          const tmpNews = this.formatUserNews([newsElement.data])
          newsList.push(tmpNews[0])
        })
      }

      // this.upsertNews(this.originalNews())
    });
  }

}

