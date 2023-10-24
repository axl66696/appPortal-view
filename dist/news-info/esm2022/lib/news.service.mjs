/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { Subject, mergeMap } from 'rxjs';
import { JSONCodec, JetstreamWsService, SubscribeType } from '@his-base/jetstream-ws';
import * as i0 from "@angular/core";
export class NewsService {
    constructor() {
        /** 宣告Signal變數
         *  使用Signal變數儲存各類型最新消息的資訊
         */
        this.originalNews = signal({});
        this.allNormalNews = signal({});
        this.allTodoList = signal({});
        this.normalNews = signal({});
        this.toDoList = signal({});
        this.checkedNormalNews = signal({});
        this.checkedToDoList = signal({});
        this.appNews = signal({});
        this.userNews = signal({});
        /** 宣告Subject變數
         *  使用Subject變數自nats拿取最新消息
         */
        this.#myNews = new Subject();
        this.#jetStreamWsService = inject(JetstreamWsService);
    }
    /** 宣告Subject變數
     *  使用Subject變數自nats拿取最新消息
     */
    #myNews;
    /** 宣告ConsumerMessages變數
     *  使用ConsumerMessages訂閱最新消息
     */
    #myNewsConsumer$;
    #jetStreamWsService;
    /** 初始化最新消息
     *  首次進入頁面時，自資料庫初始化最新消息
     */
    getInitNews(userCode) {
        return this.#jetStreamWsService.request('news.news.find', userCode);
    }
    /** 初始化最新消息
     *  首次進入頁面時，自資料庫初始化最新消息
     */
    reqAppNewsList(userCode) {
        return this.#jetStreamWsService.request('news.news.userNews', userCode);
    }
    /** 更改待辦事項狀態
     *  發送`最新消息狀態改為已讀/已完成`到nats
     */
    changeStatus(news) {
        const date = new Date();
        this.originalNews.mutate(newsList => {
            const index = newsList.findIndex(newsElement => newsElement._id == news._id);
            newsList.splice(index, 1);
        });
        news.execStatus = { code: "60", display: "已讀/已完成" };
        news.execTime = date;
        this.#jetStreamWsService.publish(`news.news.setNews.${news.userCode.code}`, news);
    }
    /** 更改最新消息狀態
     *  發送`最新消息狀態改為已讀/已完成`到nats
     */
    changeNormalNewsStatus(id) {
        const date = new Date();
        const index = this.userNews().findIndex(newsElement => newsElement.appNews_id === id);
        const updatedNews = this.userNews()[index];
        this.userNews.mutate(newsList => {
            // const index = newsList.findIndex(newsElement=>newsElement.appNews_id===id)
            //要不要直接在newsList改狀態？
            newsList.splice(index, 1);
        });
        updatedNews.readTime = date;
        this.#jetStreamWsService.publish(`news.news.userNews.${updatedNews.user}`, updatedNews);
    }
    /** 分類‘一般消息’、’待辦工作’
     *  依‘一般消息’、’待辦工作’分類最新消息
     */
    filterType(newsList, code) {
        if (code) {
            return newsList.filter(newsElement => newsElement.type['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 分類`已讀/已完成`、`未讀/未完成`
     *  依`已讀/已完成`、`未讀/未完成`分類最新消息
     */
    filterStatus(newsList, code) {
        if (code) {
            return newsList.filter(newsElement => newsElement.execStatus['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 不顯示逾期的最新消息
     *  僅顯示未超過24小時已讀/已完成的一般消息/待辦工作
     */
    filterOverdue(newsList) {
        const date = new Date;
        const aDay = 24 * 60 * 60 * 1000;
        return newsList.filter(newsElement => date.valueOf() - newsElement.execTime.valueOf() < aDay);
    }
    /** 搜尋最新消息
     *  搜尋含subject字串的最新消息
     */
    filterSubject(subject) {
        const newsList = this.originalNews();
        this.upsertNews(newsList.filter(newsElement => newsElement.subject.match(subject)));
    }
    /** 重置最新消息
     *  以originalNews重置所有最新消息
     */
    filterReset() {
        this.upsertNews(this.originalNews());
    }
    /** 設定最新消息
     *  設定除了原始最新消息originalNews以外的最新消息
     */
    upsertNews(news) {
        // this.allNormalNews.set(this.filterType(news, "10"));
        this.allTodoList.set(this.filterType(news, "60"));
        // this.normalNews.set(this.filterStatus(this.allNormalNews(), "10"));
        this.toDoList.set(this.filterStatus(this.allTodoList(), "10"));
        // this.checkedNormalNews.set(this.filterOverdue(this.filterStatus(this.allNormalNews(), "60")));
        this.checkedToDoList.set(this.filterOverdue(this.filterStatus(this.allTodoList(), "60")));
    }
    /** 設定/更新所有最新消息
     *  設定/更新所有最新消息Signal變數
     */
    upsertAllNews(newsList) {
        this.originalNews.set(newsList);
        this.upsertNews(newsList);
    }
    /** 規格化最新消息
     *  規格化從nats取得的最新消息
     */
    formatNews(newsList) {
        const formatNewsList = [];
        newsList.forEach((news) => {
            const formatNewsElement = {
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
    formatAppNews(newsList) {
        const formatNewsList = [];
        newsList.forEach((news) => {
            const formatNewsElement = {
                "_id": news._id,
                "appStore_id": news.appStore_id,
                "level": news.level,
                "title": news.title,
                "url": news.url,
                "sendUser": news.sendUser,
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
    formatUserNews(newsList) {
        const formatNewsList = [];
        newsList.forEach((news) => {
            const formatNewsElement = {
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
    async subMyNews(userCode) {
        this.#myNews = new Subject();
        const jsonCodec = JSONCodec();
        this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, `news.news.setNews.${userCode.code}`);
        this.#myNewsConsumer$
            .pipe(mergeMap(async (messages) => {
            for await (const message of messages) {
                this.#myNews.next(jsonCodec.decode(message.data));
                message.ack();
            }
        }))
            .subscribe(() => { });
        this.#myNews.subscribe((newsElement) => {
            this.originalNews.mutate(newsList => {
                const tmpNews = this.formatNews([newsElement.data]);
                newsList.push(tmpNews[0]);
            });
            this.upsertNews(this.originalNews());
        });
    }
    /** 訂閱最新消息
     *  從nats訂閱最新消息
     */
    async upserNewsProperty(userCode) {
        this.#myNews = new Subject();
        const jsonCodec = JSONCodec();
        this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, `news.news.userNews.${userCode.code}`);
        this.#myNewsConsumer$
            .pipe(mergeMap(async (messages) => {
            for await (const message of messages) {
                this.#myNews.next(jsonCodec.decode(message.data));
                message.ack();
            }
        }))
            .subscribe(() => { });
        this.#myNews.subscribe((newsElement) => {
            const index = this.userNews().findIndex(news => newsElement.appNews_id === news.appNews_id);
            if (index) {
                this.userNews.mutate(newsList => {
                    newsList[index].readTime = new Date(newsElement.data.readTIme);
                });
            }
            else {
                this.userNews.mutate(newsList => {
                    const tmpNews = this.formatUserNews([newsElement.data]);
                    newsList.push(tmpNews[0]);
                });
            }
            // this.upsertNews(this.originalNews())
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: NewsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: NewsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.9", ngImport: i0, type: NewsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmV3cy1pbmZvL3NyYy9saWIvbmV3cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFjLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFvQixTQUFTLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBU3hHLE1BQU0sT0FBTyxXQUFXO0lBSHhCO1FBS0U7O1dBRUc7UUFDSCxpQkFBWSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM1QyxrQkFBYSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM3QyxnQkFBVyxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUMzQyxlQUFVLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQzFDLGFBQVEsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFDeEMsc0JBQWlCLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQ2pELG9CQUFlLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQy9DLFlBQU8sR0FBRyxNQUFNLENBQVksRUFBZSxDQUFDLENBQUM7UUFDN0MsYUFBUSxHQUFHLE1BQU0sQ0FBYSxFQUFnQixDQUFDLENBQUM7UUFFaEQ7O1dBRUc7UUFDSCxZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQU14Qix3QkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQStQbEQ7SUF4UUM7O09BRUc7SUFDSCxPQUFPLENBQWlCO0lBRXhCOztPQUVHO0lBQ0gsZ0JBQWdCLENBQWdDO0lB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QUMsUUFBUSxDQUFBLEVBQUU7b0JBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtnQkFDaEUsQ0FBQyxDQUFDLENBQUE7YUFDSDtpQkFDRztnQkFDRixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUEsRUFBRTtvQkFDN0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO29CQUN2RCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUMzQixDQUFDLENBQUMsQ0FBQTthQUNIO1lBRUQsdUNBQXVDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs4R0FyUlUsV0FBVztrSEFBWCxXQUFXLGNBRlYsTUFBTTs7MkZBRVAsV0FBVztrQkFIdkIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBtZXJnZU1hcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29uc3VtZXJNZXNzYWdlcywgSlNPTkNvZGVjLCBKZXRzdHJlYW1Xc1NlcnZpY2UsIFN1YnNjcmliZVR5cGUgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzJztcbmltcG9ydCB7IE5ld3MgfSBmcm9tICdAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3QnO1xuaW1wb3J0IHsgQ29kaW5nIH0gZnJvbSAnQGhpcy1iYXNlL2RhdGF0eXBlcyc7XG5pbXBvcnQgeyBBcHBOZXdzIH0gZnJvbSAnQGhpcy12aWV3bW9kZWwvYXBwLXBvcnRhbC1maXhJbmRleC9kaXN0L2FwcC9hcHAtbmV3cyc7XG5pbXBvcnQgeyBVc2VyTmV3cyB9IGZyb20gJ0BoaXMtdmlld21vZGVsL2FwcC1wb3J0YWwtZml4SW5kZXgvZGlzdC9hcHAvdXNlci1uZXdzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmV3c1NlcnZpY2Uge1xuXG4gIC8qKiDlrqPlkYpTaWduYWzorormlbhcbiAgICogIOS9v+eUqFNpZ25hbOiuiuaVuOWEsuWtmOWQhOmhnuWei+acgOaWsOa2iOaBr+eahOizh+ioilxuICAgKi9cbiAgb3JpZ2luYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgYWxsTm9ybWFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGFsbFRvZG9MaXN0ID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgbm9ybWFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIHRvRG9MaXN0ID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgY2hlY2tlZE5vcm1hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBjaGVja2VkVG9Eb0xpc3QgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBhcHBOZXdzID0gc2lnbmFsPEFwcE5ld3NbXT4oe30gYXMgQXBwTmV3c1tdKTtcbiAgdXNlck5ld3MgPSBzaWduYWw8VXNlck5ld3NbXT4oe30gYXMgVXNlck5ld3NbXSk7XG5cbiAgLyoqIOWuo+WRilN1YmplY3TorormlbhcbiAgICogIOS9v+eUqFN1YmplY3Torormlbjoh6puYXRz5ou/5Y+W5pyA5paw5raI5oGvXG4gICAqL1xuICAjbXlOZXdzID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiog5a6j5ZGKQ29uc3VtZXJNZXNzYWdlc+iuiuaVuFxuICAgKiAg5L2/55SoQ29uc3VtZXJNZXNzYWdlc+iogumWseacgOaWsOa2iOaBr1xuICAgKi9cbiAgI215TmV3c0NvbnN1bWVyJCE6IE9ic2VydmFibGU8Q29uc3VtZXJNZXNzYWdlcz47XG4gICNqZXRTdHJlYW1Xc1NlcnZpY2UgPSBpbmplY3QoSmV0c3RyZWFtV3NTZXJ2aWNlKTtcblxuXG4gIC8qKiDliJ3lp4vljJbmnIDmlrDmtojmga9cbiAgICogIOmmluasoemAsuWFpemggemdouaZgu+8jOiHquizh+aWmeW6q+WIneWni+WMluacgOaWsOa2iOaBr1xuICAgKi9cbiAgZ2V0SW5pdE5ld3ModXNlckNvZGU6Q29kaW5nKTogT2JzZXJ2YWJsZTxOZXdzW10+e1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnbmV3cy5uZXdzLmZpbmQnLCB1c2VyQ29kZSk7XG4gIH1cblxuICAvKiog5Yid5aeL5YyW5pyA5paw5raI5oGvXG4gICAqICDpppbmrKHpgLLlhaXpoIHpnaLmmYLvvIzoh6ros4fmlpnluqvliJ3lp4vljJbmnIDmlrDmtojmga9cbiAgICovXG4gIHJlcUFwcE5ld3NMaXN0KHVzZXJDb2RlOkNvZGluZyk6IE9ic2VydmFibGU8TmV3c1tdPntcbiAgICByZXR1cm4gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnJlcXVlc3QoJ25ld3MubmV3cy51c2VyTmV3cycsIHVzZXJDb2RlKTtcbiAgfVxuXG4gIC8qKiDmm7TmlLnlvoXovqbkuovpoIXni4DmhYtcbiAgICogIOeZvOmAgWDmnIDmlrDmtojmga/ni4DmhYvmlLnngrrlt7LoroAv5bey5a6M5oiQYOWIsG5hdHNcbiAgICovXG4gIGNoYW5nZVN0YXR1cyhuZXdzOk5ld3Mpe1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMub3JpZ2luYWxOZXdzLm11dGF0ZShuZXdzTGlzdD0+e1xuICAgICAgY29uc3QgaW5kZXggPSBuZXdzTGlzdC5maW5kSW5kZXgobmV3c0VsZW1lbnQ9Pm5ld3NFbGVtZW50Ll9pZD09bmV3cy5faWQpXG4gICAgICBuZXdzTGlzdC5zcGxpY2UoaW5kZXgsMSlcbiAgICB9KVxuICAgIG5ld3MuZXhlY1N0YXR1cyA9IHtjb2RlOlwiNjBcIixkaXNwbGF5Olwi5bey6K6AL+W3suWujOaIkFwifVxuICAgIG5ld3MuZXhlY1RpbWUgPSBkYXRlXG4gICAgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnB1Ymxpc2goYG5ld3MubmV3cy5zZXROZXdzLiR7bmV3cy51c2VyQ29kZS5jb2RlfWAsIG5ld3MpO1xuICB9XG5cbiAgLyoqIOabtOaUueacgOaWsOa2iOaBr+eLgOaFi1xuICAgKiAg55m86YCBYOacgOaWsOa2iOaBr+eLgOaFi+aUueeCuuW3suiugC/lt7LlrozmiJBg5YiwbmF0c1xuICAgKi9cbiAgY2hhbmdlTm9ybWFsTmV3c1N0YXR1cyhpZDpzdHJpbmcpe1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy51c2VyTmV3cygpLmZpbmRJbmRleChuZXdzRWxlbWVudD0+bmV3c0VsZW1lbnQuYXBwTmV3c19pZD09PWlkKVxuICAgIGNvbnN0IHVwZGF0ZWROZXdzID0gdGhpcy51c2VyTmV3cygpW2luZGV4XVxuICAgIHRoaXMudXNlck5ld3MubXV0YXRlKG5ld3NMaXN0PT57XG4gICAgICAvLyBjb25zdCBpbmRleCA9IG5ld3NMaXN0LmZpbmRJbmRleChuZXdzRWxlbWVudD0+bmV3c0VsZW1lbnQuYXBwTmV3c19pZD09PWlkKVxuICAgICAgLy/opoHkuI3opoHnm7TmjqXlnKhuZXdzTGlzdOaUueeLgOaFi++8n1xuICAgICAgbmV3c0xpc3Quc3BsaWNlKGluZGV4LDEpXG4gICAgfSlcbiAgICB1cGRhdGVkTmV3cy5yZWFkVGltZSA9IGRhdGVcbiAgICB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucHVibGlzaChgbmV3cy5uZXdzLnVzZXJOZXdzLiR7dXBkYXRlZE5ld3MudXNlcn1gLCB1cGRhdGVkTmV3cyk7XG4gIH1cblxuICAvKiog5YiG6aGe4oCY5LiA6Iis5raI5oGv4oCZ44CB4oCZ5b6F6L6m5bel5L2c4oCZXG4gICAqICDkvp3igJjkuIDoiKzmtojmga/igJnjgIHigJnlvoXovqblt6XkvZzigJnliIbpoZ7mnIDmlrDmtojmga9cbiAgICovXG4gIGZpbHRlclR5cGUobmV3c0xpc3Q6TmV3c1tdLCBjb2RlOkNvZGluZ1snY29kZSddKTogTmV3c1tde1xuICAgIGlmKGNvZGUpe1xuICAgICAgcmV0dXJuIG5ld3NMaXN0LmZpbHRlcihuZXdzRWxlbWVudD0+bmV3c0VsZW1lbnQudHlwZVsnY29kZSddPT1jb2RlKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXdzTGlzdDtcbiAgICB9XG4gIH1cblxuICAvKiog5YiG6aGeYOW3suiugC/lt7LlrozmiJBg44CBYOacquiugC/mnKrlrozmiJBgXG4gICAqICDkvp1g5bey6K6AL+W3suWujOaIkGDjgIFg5pyq6K6AL+acquWujOaIkGDliIbpoZ7mnIDmlrDmtojmga9cbiAgICovXG4gIGZpbHRlclN0YXR1cyhuZXdzTGlzdDpOZXdzW10sIGNvZGU6Q29kaW5nWydjb2RlJ10pOiBOZXdzW117XG4gICAgaWYoY29kZSl7XG4gICAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC5leGVjU3RhdHVzWydjb2RlJ109PWNvZGUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ld3NMaXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiDkuI3poa/npLrpgL7mnJ/nmoTmnIDmlrDmtojmga9cbiAgICogIOWDhemhr+ekuuacqui2hemBjjI05bCP5pmC5bey6K6AL+W3suWujOaIkOeahOS4gOiIrOa2iOaBry/lvoXovqblt6XkvZxcbiAgICovXG4gIGZpbHRlck92ZXJkdWUobmV3c0xpc3Q6TmV3c1tdKTogTmV3c1tde1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZTtcbiAgICBjb25zdCBhRGF5ID0gMjQqNjAqNjAqMTAwMDtcbiAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5kYXRlLnZhbHVlT2YoKSAtIG5ld3NFbGVtZW50LmV4ZWNUaW1lLnZhbHVlT2YoKSA8IGFEYXkpO1xuICB9XG5cbiAgLyoqIOaQnOWwi+acgOaWsOa2iOaBr1xuICAgKiAg5pCc5bCL5ZCrc3ViamVjdOWtl+S4sueahOacgOaWsOa2iOaBr1xuICAgKi9cbiAgZmlsdGVyU3ViamVjdChzdWJqZWN0OnN0cmluZyl7XG4gICAgY29uc3QgbmV3c0xpc3Q9dGhpcy5vcmlnaW5hbE5ld3MoKTtcbiAgICB0aGlzLnVwc2VydE5ld3MobmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC5zdWJqZWN0Lm1hdGNoKHN1YmplY3QpKSk7XG4gIH1cblxuICAvKiog6YeN572u5pyA5paw5raI5oGvXG4gICAqICDku6VvcmlnaW5hbE5ld3Pph43nva7miYDmnInmnIDmlrDmtojmga9cbiAgICovXG4gIGZpbHRlclJlc2V0KCl7XG4gICAgdGhpcy51cHNlcnROZXdzKHRoaXMub3JpZ2luYWxOZXdzKCkpXG4gIH1cblxuICAvKiog6Kit5a6a5pyA5paw5raI5oGvXG4gICAqICDoqK3lrprpmaTkuobljp/lp4vmnIDmlrDmtojmga9vcmlnaW5hbE5ld3Pku6XlpJbnmoTmnIDmlrDmtojmga9cbiAgICovXG4gIHVwc2VydE5ld3MobmV3czpOZXdzW10pOiB2b2lke1xuICAgIC8vIHRoaXMuYWxsTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJUeXBlKG5ld3MsIFwiMTBcIikpO1xuICAgIHRoaXMuYWxsVG9kb0xpc3Quc2V0KHRoaXMuZmlsdGVyVHlwZShuZXdzLCBcIjYwXCIpKTtcbiAgICAvLyB0aGlzLm5vcm1hbE5ld3Muc2V0KHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjEwXCIpKTtcbiAgICB0aGlzLnRvRG9MaXN0LnNldCh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksXCIxMFwiKSk7XG4gICAgLy8gdGhpcy5jaGVja2VkTm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJPdmVyZHVlKHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsTm9ybWFsTmV3cygpLCBcIjYwXCIpKSk7XG4gICAgdGhpcy5jaGVja2VkVG9Eb0xpc3Quc2V0KHRoaXMuZmlsdGVyT3ZlcmR1ZSh0aGlzLmZpbHRlclN0YXR1cyh0aGlzLmFsbFRvZG9MaXN0KCksIFwiNjBcIikpKTtcbiAgfVxuXG4gIC8qKiDoqK3lrpov5pu05paw5omA5pyJ5pyA5paw5raI5oGvXG4gICAqICDoqK3lrpov5pu05paw5omA5pyJ5pyA5paw5raI5oGvU2lnbmFs6K6K5pW4XG4gICAqL1xuICB1cHNlcnRBbGxOZXdzKG5ld3NMaXN0Ok5ld3NbXSk6dm9pZHtcbiAgICB0aGlzLm9yaWdpbmFsTmV3cy5zZXQobmV3c0xpc3QpO1xuICAgIHRoaXMudXBzZXJ0TmV3cyhuZXdzTGlzdCk7XG4gIH1cblxuICAvKiog6KaP5qC85YyW5pyA5paw5raI5oGvXG4gICAqICDopo/moLzljJblvp5uYXRz5Y+W5b6X55qE5pyA5paw5raI5oGvXG4gICAqL1xuICBmb3JtYXROZXdzKG5ld3NMaXN0OiBOZXdzW10pOiBOZXdzW117XG4gICAgY29uc3QgZm9ybWF0TmV3c0xpc3Q6IE5ld3NbXSA9IFtdO1xuICAgICAgbmV3c0xpc3QuZm9yRWFjaCgobmV3czogTmV3cykgPT4ge1xuICAgICAgICBjb25zdCBmb3JtYXROZXdzRWxlbWVudDpOZXdzID0ge1xuICAgICAgICAgIFwiX2lkXCI6IG5ld3MuX2lkLFxuICAgICAgICAgIFwiYXBwSWRcIjogbmV3cy5hcHBJZCxcbiAgICAgICAgICBcInVzZXJDb2RlXCI6IG5ld3MudXNlckNvZGUsXG4gICAgICAgICAgXCJzdWJqZWN0XCI6IG5ld3Muc3ViamVjdCxcbiAgICAgICAgICBcInVybFwiOiBuZXdzLnVybCxcbiAgICAgICAgICBcInNoYXJlZERhdGFcIjogbmV3cy5zaGFyZWREYXRhLFxuICAgICAgICAgIFwicGVyaW9kXCI6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIjogbmV3IERhdGUobmV3cy5wZXJpb2Quc3RhcnQpLFxuICAgICAgICAgICAgXCJlbmRcIjogbmV3IERhdGUobmV3cy5wZXJpb2QuZW5kKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ0eXBlXCI6IG5ld3MudHlwZSxcbiAgICAgICAgICBcImV4ZWNUaW1lXCI6IG5ldyBEYXRlKG5ld3MuZXhlY1RpbWUpLFxuICAgICAgICAgIFwiZXhlY1N0YXR1c1wiOiBuZXdzLmV4ZWNTdGF0dXMsXG4gICAgICAgICAgXCJ1cGRhdGVkQnlcIjogbmV3cy51cGRhdGVkQnksXG4gICAgICAgICAgXCJ1cGRhdGVkQXRcIjogbmV3IERhdGUobmV3cy51cGRhdGVkQXQpXG4gICAgICAgIH07XG4gICAgICAgIGZvcm1hdE5ld3NMaXN0LnB1c2goZm9ybWF0TmV3c0VsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgcmV0dXJuIGZvcm1hdE5ld3NMaXN0O1xuICB9XG5cbiAgLyoqIOimj+agvOWMluacgOaWsOa2iOaBr1xuICAgKiAg6KaP5qC85YyW5b6ebmF0c+WPluW+l+eahOacgOaWsOa2iOaBr1xuICAgKi9cbiAgZm9ybWF0QXBwTmV3cyhuZXdzTGlzdDphbnkpe1xuICAgIGNvbnN0IGZvcm1hdE5ld3NMaXN0OmFueSA9IFtdO1xuICAgICAgbmV3c0xpc3QuZm9yRWFjaCgobmV3czphbnkpID0+IHtcbiAgICAgICAgY29uc3QgZm9ybWF0TmV3c0VsZW1lbnQ6YW55ID0ge1xuICAgICAgICAgIFwiX2lkXCI6IG5ld3MuX2lkLFxuICAgICAgICAgIFwiYXBwU3RvcmVfaWRcIjogbmV3cy5hcHBTdG9yZV9pZCxcbiAgICAgICAgICBcImxldmVsXCI6bmV3cy5sZXZlbCxcbiAgICAgICAgICBcInRpdGxlXCI6bmV3cy50aXRsZSxcbiAgICAgICAgICBcInVybFwiOiBuZXdzLnVybCxcbiAgICAgICAgICBcInNlbmRVc2VyXCI6bmV3cy5zZW5kVXNlcixcbiAgICAgICAgICBcInNlbmRUaW1lXCI6IG5ldyBEYXRlKG5ld3Muc2VuZFRpbWUpLFxuICAgICAgICAgIFwiZXhwaXJlZFRpbWVcIjogbmV3IERhdGUobmV3cy5leHBpcmVkVGltZSksXG4gICAgICAgICAgXCJ1cGRhdGVkQnlcIjogbmV3cy51cGRhdGVkQnksXG4gICAgICAgICAgXCJ1cGRhdGVkQXRcIjogbmV3IERhdGUobmV3cy51cGRhdGVkQXQpXG4gICAgICAgIH07XG4gICAgICAgIGZvcm1hdE5ld3NMaXN0LnB1c2goZm9ybWF0TmV3c0VsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgcmV0dXJuIGZvcm1hdE5ld3NMaXN0O1xuICB9XG5cbiAgLyoqIOimj+agvOWMluacgOaWsOa2iOaBr1xuICAgKiAg6KaP5qC85YyW5b6ebmF0c+WPluW+l+eahOacgOaWsOa2iOaBr1xuICAgKi9cbiAgZm9ybWF0VXNlck5ld3MobmV3c0xpc3Q6YW55KXtcbiAgICBjb25zdCBmb3JtYXROZXdzTGlzdDphbnkgPSBbXTtcbiAgICAgIG5ld3NMaXN0LmZvckVhY2goKG5ld3M6YW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGZvcm1hdE5ld3NFbGVtZW50OmFueSA9IHtcbiAgICAgICAgICAnX2lkJzogbmV3cy5faWQsXG4gICAgICAgICAgJ3VzZXInOiBuZXdzLnVzZXIsXG4gICAgICAgICAgJ3JlYWRUaW1lJzogbmV3IERhdGUobmV3cy5yZWFkVGltZSksXG4gICAgICAgICAgJ3VwZGF0ZWRCeSc6IG5ld3MudXBkYXRlZEJ5LFxuICAgICAgICAgICd1cGRhdGVkQXQnOiBuZXcgRGF0ZShuZXdzLnVwZGF0ZWRBdClcbiAgICAgICAgfTtcbiAgICAgICAgZm9ybWF0TmV3c0xpc3QucHVzaChmb3JtYXROZXdzRWxlbWVudCk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gZm9ybWF0TmV3c0xpc3Q7XG4gIH1cblxuICAvKiog6KiC6Zax5pyA5paw5raI5oGvXG4gICAqICDlvp5uYXRz6KiC6Zax5pyA5paw5raI5oGvXG4gICAqL1xuICBhc3luYyBzdWJNeU5ld3ModXNlckNvZGU6Q29kaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy4jbXlOZXdzID0gbmV3IFN1YmplY3QoKTtcbiAgICBjb25zdCBqc29uQ29kZWMgPSBKU09OQ29kZWMoKTtcbiAgICB0aGlzLiNteU5ld3NDb25zdW1lciQgPSB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2Uuc3Vic2NyaWJlKFxuICAgICAgU3Vic2NyaWJlVHlwZS5QdXNoLFxuICAgICAgYG5ld3MubmV3cy5zZXROZXdzLiR7dXNlckNvZGUuY29kZX1gXG4gICAgKTtcblxuICAgIHRoaXMuI215TmV3c0NvbnN1bWVyJFxuICAgICAgLnBpcGUoXG4gICAgICAgIG1lcmdlTWFwKGFzeW5jIChtZXNzYWdlcykgPT4ge1xuICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgICAgICAgdGhpcy4jbXlOZXdzLm5leHQoanNvbkNvZGVjLmRlY29kZShtZXNzYWdlLmRhdGEpKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7fSk7XG5cbiAgICB0aGlzLiNteU5ld3Muc3Vic2NyaWJlKChuZXdzRWxlbWVudDphbnkpID0+IHtcbiAgICAgIHRoaXMub3JpZ2luYWxOZXdzLm11dGF0ZShuZXdzTGlzdD0+e1xuICAgICAgICBjb25zdCB0bXBOZXdzID0gdGhpcy5mb3JtYXROZXdzKFtuZXdzRWxlbWVudC5kYXRhXSlcbiAgICAgICAgbmV3c0xpc3QucHVzaCh0bXBOZXdzWzBdKVxuICAgICAgfSlcbiAgICAgIHRoaXMudXBzZXJ0TmV3cyh0aGlzLm9yaWdpbmFsTmV3cygpKVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIOiogumWseacgOaWsOa2iOaBr1xuICAgKiAg5b6ebmF0c+iogumWseacgOaWsOa2iOaBr1xuICAgKi9cbiAgYXN5bmMgdXBzZXJOZXdzUHJvcGVydHkodXNlckNvZGU6Q29kaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy4jbXlOZXdzID0gbmV3IFN1YmplY3QoKTtcbiAgICBjb25zdCBqc29uQ29kZWMgPSBKU09OQ29kZWMoKTtcbiAgICB0aGlzLiNteU5ld3NDb25zdW1lciQgPSB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2Uuc3Vic2NyaWJlKFxuICAgICAgU3Vic2NyaWJlVHlwZS5QdXNoLFxuICAgICAgYG5ld3MubmV3cy51c2VyTmV3cy4ke3VzZXJDb2RlLmNvZGV9YFxuICAgICk7XG5cbiAgICB0aGlzLiNteU5ld3NDb25zdW1lciRcbiAgICAgIC5waXBlKFxuICAgICAgICBtZXJnZU1hcChhc3luYyAobWVzc2FnZXMpID0+IHtcbiAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuI215TmV3cy5uZXh0KGpzb25Db2RlYy5kZWNvZGUobWVzc2FnZS5kYXRhKSk7XG4gICAgICAgICAgICBtZXNzYWdlLmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge30pO1xuXG4gICAgdGhpcy4jbXlOZXdzLnN1YnNjcmliZSgobmV3c0VsZW1lbnQ6YW55KSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMudXNlck5ld3MoKS5maW5kSW5kZXgobmV3cz0+bmV3c0VsZW1lbnQuYXBwTmV3c19pZD09PW5ld3MuYXBwTmV3c19pZClcbiAgICAgIGlmKGluZGV4KXtcbiAgICAgICAgdGhpcy51c2VyTmV3cy5tdXRhdGUobmV3c0xpc3Q9PntcbiAgICAgICAgICBuZXdzTGlzdFtpbmRleF0ucmVhZFRpbWUgPSBuZXcgRGF0ZShuZXdzRWxlbWVudC5kYXRhLnJlYWRUSW1lKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgdGhpcy51c2VyTmV3cy5tdXRhdGUobmV3c0xpc3Q9PntcbiAgICAgICAgICBjb25zdCB0bXBOZXdzID0gdGhpcy5mb3JtYXRVc2VyTmV3cyhbbmV3c0VsZW1lbnQuZGF0YV0pXG4gICAgICAgICAgbmV3c0xpc3QucHVzaCh0bXBOZXdzWzBdKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyB0aGlzLnVwc2VydE5ld3ModGhpcy5vcmlnaW5hbE5ld3MoKSlcbiAgICB9KTtcbiAgfVxuXG59XG5cbiJdfQ==