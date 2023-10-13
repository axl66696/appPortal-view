/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject, signal } from '@angular/core';
import { Subject, mergeMap } from 'rxjs';
import { JSONCodec, JetstreamWsService, SubscribeType } from '@his-base/jetstream-ws';
import * as i0 from "@angular/core";
export class NewsService {
    constructor() {
        /** 使用Signal變數儲存各類型最新消息的資訊
         *  @memberof NewsService
         */
        this.originalNews = signal({});
        this.allNormalNews = signal({});
        this.allTodoList = signal({});
        this.normalNews = signal({});
        this.toDoList = signal({});
        this.checkedNormalNews = signal({});
        this.checkedToDoList = signal({});
        /** nats連線位址
         *  @memberof NewsService
         */
        this.#url = 'ws://localhost:8080';
        /** 使用Subject變數自nats拿取最新消息
         *  @memberof NewsService
         */
        this.#myNews = new Subject();
        this.#jetStreamWsService = inject(JetstreamWsService);
    }
    /** nats連線位址
     *  @memberof NewsService
     */
    #url;
    /** 使用Subject變數自nats拿取最新消息
     *  @memberof NewsService
     */
    #myNews;
    /** 使用ConsumerMessages訂閱最新消息
     *  @memberof NewsService
     */
    #myNewsConsumer$;
    #jetStreamWsService;
    /** 建立nats連線
     *  @memberof NewsService
     */
    async connect() {
        await this.#jetStreamWsService.connect(this.#url);
    }
    /** 中斷nats連線
     *  @memberof NewsService
     */
    async disconnect() {
        await this.#jetStreamWsService.drain();
    }
    /** publish userCode到nats
     *  @memberof NewsService
     */
    publishUserCode(userCode) {
        this.#jetStreamWsService.publish("news.wantNews", userCode);
    }
    /** 發送`最新消息狀態改為已讀/已完成`到nats
     *  @memberof NewsService
     */
    changeStatus(news) {
        const date = new Date();
        this.originalNews.mutate(newsList => {
            // _.remove(newsList, news);
            // newsList.filter(newsData=>!(newsData._id==news._id))
            const index = newsList.findIndex(newsData => newsData._id == news._id);
            console.log("index", index);
            newsList.splice(index, 1);
        });
        news.execStatus = { code: "60", display: "已讀/已完成" };
        news.execTime = date;
        console.log("after remove news", this.originalNews());
        this.#jetStreamWsService.publish("news.appPortal.setNews", news);
    }
    /** 依‘一般消息’、’待辦工作’分類最新消息
     *  @memberof NewsService
     */
    filterType(newsList, code) {
        if (code) {
            return newsList.filter(newsData => newsData.type['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 依`已讀/已完成`、`未讀/未完成`分類最新消息
     *  @memberof NewsService
     */
    filterStatus(newsList, code) {
        if (code) {
            return newsList.filter(newsData => newsData.execStatus['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 僅顯示未超過24小時的已讀一般消息/待辦工作
     *  @memberof NewsService
     */
    filterOverdue(newsList) {
        const date = new Date;
        const aDay = 24 * 60 * 60 * 1000;
        return newsList.filter(newsData => date.valueOf() - newsData.execTime.valueOf() < aDay);
    }
    /** 搜尋含subject字串的最新消息
     *  @memberof NewsService
     */
    filterSubject(subject) {
        const newsList = this.originalNews();
        this.upsertNews(newsList.filter(newsData => newsData.subject.match(subject)));
    }
    /** 回復到上一次取得最新消息的狀態
     *  @memberof NewsService
     */
    filterReset() {
        this.upsertNews(this.originalNews());
    }
    /** 設定除了原始最新消息news以外的Signal
     *  @memberof NewsService
     */
    upsertNews(news) {
        this.allNormalNews.set(this.filterType(news, "10"));
        this.allTodoList.set(this.filterType(news, "60"));
        this.normalNews.set(this.filterStatus(this.allNormalNews(), "10"));
        this.toDoList.set(this.filterStatus(this.allTodoList(), "10"));
        this.checkedNormalNews.set(this.filterOverdue(this.filterStatus(this.allNormalNews(), "60")));
        this.checkedToDoList.set(this.filterOverdue(this.filterStatus(this.allTodoList(), "60")));
    }
    /** 規格化從nats取得的最新消息
     *  @memberof NewsService
     */
    formatNews(newsList) {
        const formatNewsList = [];
        newsList.forEach((news) => {
            const formatNewsData = {
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
    async subNews() {
        this.#myNews = new Subject();
        const jsonCodec = JSONCodec();
        this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, 'news.getNews.dashboard');
        this.#myNewsConsumer$
            .pipe(mergeMap(async (messages) => {
            for await (const message of messages) {
                this.#myNews.next(jsonCodec.decode(message.data));
                message.ack();
            }
        }))
            .subscribe(() => { });
        this.#myNews.subscribe((newsList) => {
            this.originalNews.set(this.formatNews(newsList));
            this.upsertNews(this.formatNews(newsList));
        });
    }
    getInitNews(userCode) {
        return this.#jetStreamWsService.request('news.appPortal.newsList', userCode);
    }
    upsertAllNews(newsList) {
        this.originalNews.set(newsList);
        this.upsertNews(newsList);
        console.log("upsertAllNews", this.originalNews());
    }
    /** 訂閱最新消息
     * @memberof NewsService
     */
    async subMyNews(userCode) {
        this.#myNews = new Subject();
        const jsonCodec = JSONCodec();
        this.#myNewsConsumer$ = this.#jetStreamWsService.subscribe(SubscribeType.Push, `news.appPortal.${userCode.code}`);
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
                const tmpNews = this.formatNews([newsElement]);
                newsList.push(tmpNews[0]);
                console.log("newsList", newsList);
            });
            this.upsertNews(this.originalNews());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmV3cy1pbmZvL3NyYy9saWIvbmV3cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFjLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFvQixTQUFTLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBT3hHLE1BQU0sT0FBTyxXQUFXO0lBSHhCO1FBS0U7O1dBRUc7UUFDSCxpQkFBWSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM1QyxrQkFBYSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM3QyxnQkFBVyxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUMzQyxlQUFVLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQzFDLGFBQVEsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFDeEMsc0JBQWlCLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQ2pELG9CQUFlLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBRS9DOztXQUVHO1FBQ0gsU0FBSSxHQUFHLHFCQUFxQixDQUFDO1FBRTdCOztXQUVHO1FBQ0gsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFTeEIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0F3TWxEO0lBek5DOztPQUVHO0lBQ0gsSUFBSSxDQUF5QjtJQUU3Qjs7T0FFRztJQUNILE9BQU8sQ0FBaUI7SUFHeEI7O09BRUc7SUFDSCxnQkFBZ0IsQ0FBZ0M7SUFHaEQsbUJBQW1CLENBQThC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QztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBtZXJnZU1hcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29uc3VtZXJNZXNzYWdlcywgSlNPTkNvZGVjLCBKZXRzdHJlYW1Xc1NlcnZpY2UsIFN1YnNjcmliZVR5cGUgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzJztcbmltcG9ydCB7IE5ld3MgfSBmcm9tICdAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3QnO1xuaW1wb3J0IHsgQ29kaW5nIH0gZnJvbSAnQGhpcy1iYXNlL2RhdGF0eXBlcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5ld3NTZXJ2aWNlIHtcblxuICAvKiog5L2/55SoU2lnbmFs6K6K5pW45YSy5a2Y5ZCE6aGe5Z6L5pyA5paw5raI5oGv55qE6LOH6KiKXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIG9yaWdpbmFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGFsbE5vcm1hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBhbGxUb2RvTGlzdCA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIG5vcm1hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICB0b0RvTGlzdCA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGNoZWNrZWROb3JtYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgY2hlY2tlZFRvRG9MaXN0ID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcblxuICAvKiogbmF0c+mAo+e3muS9jeWdgFxuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICAjdXJsID0gJ3dzOi8vbG9jYWxob3N0OjgwODAnO1xuXG4gIC8qKiDkvb/nlKhTdWJqZWN06K6K5pW46IeqbmF0c+aLv+WPluacgOaWsOa2iOaBr1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICAjbXlOZXdzID0gbmV3IFN1YmplY3QoKTtcblxuXG4gIC8qKiDkvb/nlKhDb25zdW1lck1lc3NhZ2Vz6KiC6Zax5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gICNteU5ld3NDb25zdW1lciQhOiBPYnNlcnZhYmxlPENvbnN1bWVyTWVzc2FnZXM+O1xuXG5cbiAgI2pldFN0cmVhbVdzU2VydmljZSA9IGluamVjdChKZXRzdHJlYW1Xc1NlcnZpY2UpO1xuXG4gIC8qKiDlu7rnq4tuYXRz6YCj57eaXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLmNvbm5lY3QodGhpcy4jdXJsKTtcbiAgfVxuXG4gIC8qKiDkuK3mlrduYXRz6YCj57eaXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGFzeW5jIGRpc2Nvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLmRyYWluKCk7XG4gIH1cblxuICAvKiogcHVibGlzaCB1c2VyQ29kZeWIsG5hdHNcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgcHVibGlzaFVzZXJDb2RlKHVzZXJDb2RlOnN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5wdWJsaXNoKFwibmV3cy53YW50TmV3c1wiLCB1c2VyQ29kZSk7XG4gIH1cblxuICAvKiog55m86YCBYOacgOaWsOa2iOaBr+eLgOaFi+aUueeCuuW3suiugC/lt7LlrozmiJBg5YiwbmF0c1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBjaGFuZ2VTdGF0dXMobmV3czpOZXdzKXtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLm9yaWdpbmFsTmV3cy5tdXRhdGUobmV3c0xpc3Q9PntcbiAgICAgIC8vIF8ucmVtb3ZlKG5ld3NMaXN0LCBuZXdzKTtcbiAgICAgIC8vIG5ld3NMaXN0LmZpbHRlcihuZXdzRGF0YT0+IShuZXdzRGF0YS5faWQ9PW5ld3MuX2lkKSlcbiAgICAgIGNvbnN0IGluZGV4ID0gbmV3c0xpc3QuZmluZEluZGV4KG5ld3NEYXRhPT5uZXdzRGF0YS5faWQ9PW5ld3MuX2lkKVxuICAgICAgY29uc29sZS5sb2coXCJpbmRleFwiLGluZGV4KVxuICAgICAgbmV3c0xpc3Quc3BsaWNlKGluZGV4LDEpXG4gICAgfSlcbiAgICBuZXdzLmV4ZWNTdGF0dXMgPSB7Y29kZTpcIjYwXCIsZGlzcGxheTpcIuW3suiugC/lt7LlrozmiJBcIn1cbiAgICBuZXdzLmV4ZWNUaW1lID0gZGF0ZVxuICAgIGNvbnNvbGUubG9nKFwiYWZ0ZXIgcmVtb3ZlIG5ld3NcIix0aGlzLm9yaWdpbmFsTmV3cygpKVxuICAgIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5wdWJsaXNoKFwibmV3cy5hcHBQb3J0YWwuc2V0TmV3c1wiLCBuZXdzKTtcbiAgfVxuXG4gIC8qKiDkvp3igJjkuIDoiKzmtojmga/igJnjgIHigJnlvoXovqblt6XkvZzigJnliIbpoZ7mnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyVHlwZShuZXdzTGlzdDpOZXdzW10sIGNvZGU6Q29kaW5nWydjb2RlJ10pOiBOZXdzW117XG4gICAgaWYoY29kZSl7XG4gICAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NEYXRhPT5uZXdzRGF0YS50eXBlWydjb2RlJ109PWNvZGUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ld3NMaXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiDkvp1g5bey6K6AL+W3suWujOaIkGDjgIFg5pyq6K6AL+acquWujOaIkGDliIbpoZ7mnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyU3RhdHVzKG5ld3NMaXN0Ok5ld3NbXSwgY29kZTpDb2RpbmdbJ2NvZGUnXSk6IE5ld3NbXXtcbiAgICBpZihjb2RlKXtcbiAgICAgIHJldHVybiBuZXdzTGlzdC5maWx0ZXIobmV3c0RhdGE9Pm5ld3NEYXRhLmV4ZWNTdGF0dXNbJ2NvZGUnXT09Y29kZSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3c0xpc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqIOWDhemhr+ekuuacqui2hemBjjI05bCP5pmC55qE5bey6K6A5LiA6Iis5raI5oGvL+W+hei+puW3peS9nFxuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBmaWx0ZXJPdmVyZHVlKG5ld3NMaXN0Ok5ld3NbXSk6IE5ld3NbXXtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGU7XG4gICAgY29uc3QgYURheSA9IDI0KjYwKjYwKjEwMDA7XG4gICAgcmV0dXJuIG5ld3NMaXN0LmZpbHRlcihuZXdzRGF0YT0+ZGF0ZS52YWx1ZU9mKCkgLSBuZXdzRGF0YS5leGVjVGltZS52YWx1ZU9mKCkgPCBhRGF5KTtcbiAgfVxuXG4gIC8qKiDmkJzlsIvlkKtzdWJqZWN05a2X5Liy55qE5pyA5paw5raI5oGvXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIGZpbHRlclN1YmplY3Qoc3ViamVjdDpzdHJpbmcpe1xuICAgIGNvbnN0IG5ld3NMaXN0PXRoaXMub3JpZ2luYWxOZXdzKCk7XG4gICAgdGhpcy51cHNlcnROZXdzKG5ld3NMaXN0LmZpbHRlcihuZXdzRGF0YT0+bmV3c0RhdGEuc3ViamVjdC5tYXRjaChzdWJqZWN0KSkpO1xuICB9XG5cbiAgLyoqIOWbnuW+qeWIsOS4iuS4gOasoeWPluW+l+acgOaWsOa2iOaBr+eahOeLgOaFi1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBmaWx0ZXJSZXNldCgpe1xuICAgIHRoaXMudXBzZXJ0TmV3cyh0aGlzLm9yaWdpbmFsTmV3cygpKVxuICB9XG5cbiAgLyoqIOioreWumumZpOS6huWOn+Wni+acgOaWsOa2iOaBr25ld3Pku6XlpJbnmoRTaWduYWxcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgdXBzZXJ0TmV3cyhuZXdzOk5ld3NbXSk6IHZvaWR7XG4gICAgdGhpcy5hbGxOb3JtYWxOZXdzLnNldCh0aGlzLmZpbHRlclR5cGUobmV3cywgXCIxMFwiKSk7XG4gICAgdGhpcy5hbGxUb2RvTGlzdC5zZXQodGhpcy5maWx0ZXJUeXBlKG5ld3MsIFwiNjBcIikpO1xuICAgIHRoaXMubm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJTdGF0dXModGhpcy5hbGxOb3JtYWxOZXdzKCksIFwiMTBcIikpO1xuICAgIHRoaXMudG9Eb0xpc3Quc2V0KHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsVG9kb0xpc3QoKSxcIjEwXCIpKTtcbiAgICB0aGlzLmNoZWNrZWROb3JtYWxOZXdzLnNldCh0aGlzLmZpbHRlck92ZXJkdWUodGhpcy5maWx0ZXJTdGF0dXModGhpcy5hbGxOb3JtYWxOZXdzKCksIFwiNjBcIikpKTtcbiAgICB0aGlzLmNoZWNrZWRUb0RvTGlzdC5zZXQodGhpcy5maWx0ZXJPdmVyZHVlKHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsVG9kb0xpc3QoKSwgXCI2MFwiKSkpO1xuICB9XG5cbiAgLyoqIOimj+agvOWMluW+nm5hdHPlj5blvpfnmoTmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZm9ybWF0TmV3cyhuZXdzTGlzdDogTmV3c1tdKTogTmV3c1tde1xuICAgIGNvbnN0IGZvcm1hdE5ld3NMaXN0OiBOZXdzW10gPSBbXTtcbiAgICAgIG5ld3NMaXN0LmZvckVhY2goKG5ld3M6IE5ld3MpID0+IHtcbiAgICAgICAgY29uc3QgZm9ybWF0TmV3c0RhdGE6TmV3cyA9IHtcbiAgICAgICAgICBcIl9pZFwiOiBuZXdzLl9pZCxcbiAgICAgICAgICBcImFwcElkXCI6IG5ld3MuYXBwSWQsXG4gICAgICAgICAgXCJ1c2VyQ29kZVwiOiBuZXdzLnVzZXJDb2RlLFxuICAgICAgICAgIFwic3ViamVjdFwiOiBuZXdzLnN1YmplY3QsXG4gICAgICAgICAgXCJ1cmxcIjogbmV3cy51cmwsXG4gICAgICAgICAgXCJzaGFyZWREYXRhXCI6IG5ld3Muc2hhcmVkRGF0YSxcbiAgICAgICAgICBcInBlcmlvZFwiOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCI6IG5ldyBEYXRlKG5ld3MucGVyaW9kLnN0YXJ0KSxcbiAgICAgICAgICAgIFwiZW5kXCI6IG5ldyBEYXRlKG5ld3MucGVyaW9kLmVuZClcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidHlwZVwiOiBuZXdzLnR5cGUsXG4gICAgICAgICAgXCJleGVjVGltZVwiOiBuZXcgRGF0ZShuZXdzLmV4ZWNUaW1lKSxcbiAgICAgICAgICBcImV4ZWNTdGF0dXNcIjogbmV3cy5leGVjU3RhdHVzLFxuICAgICAgICAgIFwidXBkYXRlZEJ5XCI6IG5ld3MudXBkYXRlZEJ5LFxuICAgICAgICAgIFwidXBkYXRlZEF0XCI6IG5ldyBEYXRlKG5ld3MudXBkYXRlZEF0KVxuICAgICAgICB9O1xuICAgICAgICBmb3JtYXROZXdzTGlzdC5wdXNoKGZvcm1hdE5ld3NEYXRhKTtcbiAgICAgIH0pO1xuICAgIHJldHVybiBmb3JtYXROZXdzTGlzdDtcbiAgfVxuXG4gIC8qKiDoqILplrHmnIDmlrDmtojmga9cbiAgICogQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBzdWJOZXdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuI215TmV3cyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgY29uc3QganNvbkNvZGVjID0gSlNPTkNvZGVjKCk7XG4gICAgdGhpcy4jbXlOZXdzQ29uc3VtZXIkID0gdGhpcy4jamV0U3RyZWFtV3NTZXJ2aWNlLnN1YnNjcmliZShcbiAgICAgIFN1YnNjcmliZVR5cGUuUHVzaCxcbiAgICAgICduZXdzLmdldE5ld3MuZGFzaGJvYXJkJ1xuICAgICk7XG5cbiAgICB0aGlzLiNteU5ld3NDb25zdW1lciRcbiAgICAgIC5waXBlKFxuICAgICAgICBtZXJnZU1hcChhc3luYyAobWVzc2FnZXMpID0+IHtcbiAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG1lc3NhZ2Ugb2YgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuI215TmV3cy5uZXh0KGpzb25Db2RlYy5kZWNvZGUobWVzc2FnZS5kYXRhKSk7XG4gICAgICAgICAgICBtZXNzYWdlLmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge30pO1xuXG4gICAgdGhpcy4jbXlOZXdzLnN1YnNjcmliZSgobmV3c0xpc3Q6YW55KSA9PiB7XG4gICAgICB0aGlzLm9yaWdpbmFsTmV3cy5zZXQodGhpcy5mb3JtYXROZXdzKG5ld3NMaXN0IGFzIE5ld3NbXSkpO1xuICAgICAgdGhpcy51cHNlcnROZXdzKHRoaXMuZm9ybWF0TmV3cyhuZXdzTGlzdCkpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SW5pdE5ld3ModXNlckNvZGU6Q29kaW5nKTogT2JzZXJ2YWJsZTxOZXdzW10+e1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnbmV3cy5hcHBQb3J0YWwubmV3c0xpc3QnLCB1c2VyQ29kZSk7XG4gIH1cblxuICB1cHNlcnRBbGxOZXdzKG5ld3NMaXN0Ok5ld3NbXSk6dm9pZHtcbiAgICB0aGlzLm9yaWdpbmFsTmV3cy5zZXQobmV3c0xpc3QpO1xuICAgIHRoaXMudXBzZXJ0TmV3cyhuZXdzTGlzdCk7XG4gICAgY29uc29sZS5sb2coXCJ1cHNlcnRBbGxOZXdzXCIsdGhpcy5vcmlnaW5hbE5ld3MoKSlcbiAgfVxuXG4gIC8qKiDoqILplrHmnIDmlrDmtojmga9cbiAgICogQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBzdWJNeU5ld3ModXNlckNvZGU6Q29kaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy4jbXlOZXdzID0gbmV3IFN1YmplY3QoKTtcbiAgICBjb25zdCBqc29uQ29kZWMgPSBKU09OQ29kZWMoKTtcbiAgICB0aGlzLiNteU5ld3NDb25zdW1lciQgPSB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2Uuc3Vic2NyaWJlKFxuICAgICAgU3Vic2NyaWJlVHlwZS5QdXNoLFxuICAgICAgYG5ld3MuYXBwUG9ydGFsLiR7dXNlckNvZGUuY29kZX1gXG4gICAgKTtcblxuICAgIHRoaXMuI215TmV3c0NvbnN1bWVyJFxuICAgICAgLnBpcGUoXG4gICAgICAgIG1lcmdlTWFwKGFzeW5jIChtZXNzYWdlcykgPT4ge1xuICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgICAgICAgdGhpcy4jbXlOZXdzLm5leHQoanNvbkNvZGVjLmRlY29kZShtZXNzYWdlLmRhdGEpKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7fSk7XG5cbiAgICB0aGlzLiNteU5ld3Muc3Vic2NyaWJlKChuZXdzRWxlbWVudDphbnkpID0+IHtcbiAgICAgIHRoaXMub3JpZ2luYWxOZXdzLm11dGF0ZShuZXdzTGlzdD0+e1xuICAgICAgICBjb25zdCB0bXBOZXdzID0gdGhpcy5mb3JtYXROZXdzKFtuZXdzRWxlbWVudF0pXG4gICAgICAgIG5ld3NMaXN0LnB1c2godG1wTmV3c1swXSlcbiAgICAgICAgY29uc29sZS5sb2coXCJuZXdzTGlzdFwiLG5ld3NMaXN0KVxuICAgICAgfSlcbiAgICAgIHRoaXMudXBzZXJ0TmV3cyh0aGlzLm9yaWdpbmFsTmV3cygpKVxuICAgIH0pO1xuICB9XG5cblxufVxuXG4iXX0=