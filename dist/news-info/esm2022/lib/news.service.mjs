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
    /** 首次進入頁面時，自資料庫初始化最新消息
     *  @memberof NewsService
     */
    getInitNews(userCode) {
        return this.#jetStreamWsService.request('news.appPortal.newsList', userCode);
    }
    /** 發送`最新消息狀態改為已讀/已完成`到nats
     *  @memberof NewsService
     */
    changeStatus(news) {
        const date = new Date();
        this.originalNews.mutate(newsList => {
            const index = newsList.findIndex(newsElement => newsElement._id == news._id);
            newsList.splice(index, 1);
        });
        news.execStatus = { code: "60", display: "已讀/已完成" };
        news.execTime = date;
        this.#jetStreamWsService.publish("news.appPortal.setNews", news);
    }
    /** 依‘一般消息’、’待辦工作’分類最新消息
     *  @memberof NewsService
     */
    filterType(newsList, code) {
        if (code) {
            return newsList.filter(newsElement => newsElement.type['code'] == code);
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
            return newsList.filter(newsElement => newsElement.execStatus['code'] == code);
        }
        else {
            return newsList;
        }
    }
    /** 僅顯示未超過24小時已讀/已完成的一般消息/待辦工作
     *  @memberof NewsService
     */
    filterOverdue(newsList) {
        const date = new Date;
        const aDay = 24 * 60 * 60 * 1000;
        return newsList.filter(newsElement => date.valueOf() - newsElement.execTime.valueOf() < aDay);
    }
    /** 搜尋含subject字串的最新消息
     *  @memberof NewsService
     */
    filterSubject(subject) {
        const newsList = this.originalNews();
        this.upsertNews(newsList.filter(newsElement => newsElement.subject.match(subject)));
    }
    /** 以originalNews重置所有最新消息
     *  @memberof NewsService
     */
    filterReset() {
        this.upsertNews(this.originalNews());
    }
    /** 設定除了原始最新消息originalNews以外的最新消息
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
    /** 設定/更新所有最新消息
     *  @memberof NewsService
     */
    upsertAllNews(newsList) {
        this.originalNews.set(newsList);
        this.upsertNews(newsList);
    }
    /** 規格化從nats取得的最新消息
     *  @memberof NewsService
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbmV3cy1pbmZvL3NyYy9saWIvbmV3cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDtBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFjLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFvQixTQUFTLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBT3hHLE1BQU0sT0FBTyxXQUFXO0lBSHhCO1FBS0U7O1dBRUc7UUFDSCxpQkFBWSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM1QyxrQkFBYSxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUM3QyxnQkFBVyxHQUFHLE1BQU0sQ0FBUyxFQUFZLENBQUMsQ0FBQztRQUMzQyxlQUFVLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQzFDLGFBQVEsR0FBRyxNQUFNLENBQVMsRUFBWSxDQUFDLENBQUM7UUFDeEMsc0JBQWlCLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBQ2pELG9CQUFlLEdBQUcsTUFBTSxDQUFTLEVBQVksQ0FBQyxDQUFDO1FBRS9DOztXQUVHO1FBQ0gsU0FBSSxHQUFHLHFCQUFxQixDQUFDO1FBRTdCOztXQUVHO1FBQ0gsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFPeEIsd0JBQW1CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FvS2xEO0lBbkxDOztPQUVHO0lBQ0gsSUFBSSxDQUF5QjtJQUU3Qjs7T0FFRztJQUNILE9BQU8sQ0FBaUI7SUFFeEI7O09BRUc7SUFDSCxnQkFBZ0IsQ0FBZ0M7SUFFaEQsbUJBQW1CLENBQThC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O1FBRUYsSUFBSSxDQUFDLGdCQUFnQjthQUNsQixJQUFJLENBQ0gsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRTtZQUMxQixJQUFJLEtBQUssRUFBRSxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUNmO1FBQ0gsQ0FBQyxDQUFDLENBQ0g7YUFDQSxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFlLEVBQUUsRUFBRTtZQUN6QyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUEsRUFBRTtnQkFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7Z0JBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDM0IsQ0FBQyxDQUFDLENBQUE7WUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFBO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs4R0E5TFUsV0FBVztrSEFBWCxXQUFXLGNBRlYsTUFBTTs7MkZBRVAsV0FBVztrQkFIdkIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cbmltcG9ydCB7IEluamVjdGFibGUsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBtZXJnZU1hcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29uc3VtZXJNZXNzYWdlcywgSlNPTkNvZGVjLCBKZXRzdHJlYW1Xc1NlcnZpY2UsIFN1YnNjcmliZVR5cGUgfSBmcm9tICdAaGlzLWJhc2UvamV0c3RyZWFtLXdzJztcbmltcG9ydCB7IE5ld3MgfSBmcm9tICdAaGlzLXZpZXdtb2RlbC9hcHAtcG9ydGFsL2Rpc3QnO1xuaW1wb3J0IHsgQ29kaW5nIH0gZnJvbSAnQGhpcy1iYXNlL2RhdGF0eXBlcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5ld3NTZXJ2aWNlIHtcblxuICAvKiog5L2/55SoU2lnbmFs6K6K5pW45YSy5a2Y5ZCE6aGe5Z6L5pyA5paw5raI5oGv55qE6LOH6KiKXG4gICAqICBAbWVtYmVyb2YgTmV3c1NlcnZpY2VcbiAgICovXG4gIG9yaWdpbmFsTmV3cyA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGFsbE5vcm1hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICBhbGxUb2RvTGlzdCA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIG5vcm1hbE5ld3MgPSBzaWduYWw8TmV3c1tdPih7fSBhcyBOZXdzW10pO1xuICB0b0RvTGlzdCA9IHNpZ25hbDxOZXdzW10+KHt9IGFzIE5ld3NbXSk7XG4gIGNoZWNrZWROb3JtYWxOZXdzID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcbiAgY2hlY2tlZFRvRG9MaXN0ID0gc2lnbmFsPE5ld3NbXT4oe30gYXMgTmV3c1tdKTtcblxuICAvKiogbmF0c+mAo+e3muS9jeWdgFxuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICAjdXJsID0gJ3dzOi8vbG9jYWxob3N0OjgwODAnO1xuXG4gIC8qKiDkvb/nlKhTdWJqZWN06K6K5pW46IeqbmF0c+aLv+WPluacgOaWsOa2iOaBr1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICAjbXlOZXdzID0gbmV3IFN1YmplY3QoKTtcblxuICAvKiog5L2/55SoQ29uc3VtZXJNZXNzYWdlc+iogumWseacgOaWsOa2iOaBr1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICAjbXlOZXdzQ29uc3VtZXIkITogT2JzZXJ2YWJsZTxDb25zdW1lck1lc3NhZ2VzPjtcblxuICAjamV0U3RyZWFtV3NTZXJ2aWNlID0gaW5qZWN0KEpldHN0cmVhbVdzU2VydmljZSk7XG5cbiAgLyoqIOW7uueri25hdHPpgKPnt5pcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgYXN5bmMgY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UuY29ubmVjdCh0aGlzLiN1cmwpO1xuICB9XG5cbiAgLyoqIOS4reaWt25hdHPpgKPnt5pcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgYXN5bmMgZGlzY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UuZHJhaW4oKTtcbiAgfVxuXG4gIC8qKiDpppbmrKHpgLLlhaXpoIHpnaLmmYLvvIzoh6ros4fmlpnluqvliJ3lp4vljJbmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZ2V0SW5pdE5ld3ModXNlckNvZGU6Q29kaW5nKTogT2JzZXJ2YWJsZTxOZXdzW10+e1xuICAgIHJldHVybiB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2UucmVxdWVzdCgnbmV3cy5hcHBQb3J0YWwubmV3c0xpc3QnLCB1c2VyQ29kZSk7XG4gIH1cblxuICAvKiog55m86YCBYOacgOaWsOa2iOaBr+eLgOaFi+aUueeCuuW3suiugC/lt7LlrozmiJBg5YiwbmF0c1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBjaGFuZ2VTdGF0dXMobmV3czpOZXdzKXtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLm9yaWdpbmFsTmV3cy5tdXRhdGUobmV3c0xpc3Q9PntcbiAgICAgIGNvbnN0IGluZGV4ID0gbmV3c0xpc3QuZmluZEluZGV4KG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC5faWQ9PW5ld3MuX2lkKVxuICAgICAgbmV3c0xpc3Quc3BsaWNlKGluZGV4LDEpXG4gICAgfSlcbiAgICBuZXdzLmV4ZWNTdGF0dXMgPSB7Y29kZTpcIjYwXCIsZGlzcGxheTpcIuW3suiugC/lt7LlrozmiJBcIn1cbiAgICBuZXdzLmV4ZWNUaW1lID0gZGF0ZVxuICAgIHRoaXMuI2pldFN0cmVhbVdzU2VydmljZS5wdWJsaXNoKFwibmV3cy5hcHBQb3J0YWwuc2V0TmV3c1wiLCBuZXdzKTtcbiAgfVxuXG4gIC8qKiDkvp3igJjkuIDoiKzmtojmga/igJnjgIHigJnlvoXovqblt6XkvZzigJnliIbpoZ7mnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyVHlwZShuZXdzTGlzdDpOZXdzW10sIGNvZGU6Q29kaW5nWydjb2RlJ10pOiBOZXdzW117XG4gICAgaWYoY29kZSl7XG4gICAgICByZXR1cm4gbmV3c0xpc3QuZmlsdGVyKG5ld3NFbGVtZW50PT5uZXdzRWxlbWVudC50eXBlWydjb2RlJ109PWNvZGUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ld3NMaXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiDkvp1g5bey6K6AL+W3suWujOaIkGDjgIFg5pyq6K6AL+acquWujOaIkGDliIbpoZ7mnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyU3RhdHVzKG5ld3NMaXN0Ok5ld3NbXSwgY29kZTpDb2RpbmdbJ2NvZGUnXSk6IE5ld3NbXXtcbiAgICBpZihjb2RlKXtcbiAgICAgIHJldHVybiBuZXdzTGlzdC5maWx0ZXIobmV3c0VsZW1lbnQ9Pm5ld3NFbGVtZW50LmV4ZWNTdGF0dXNbJ2NvZGUnXT09Y29kZSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3c0xpc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqIOWDhemhr+ekuuacqui2hemBjjI05bCP5pmC5bey6K6AL+W3suWujOaIkOeahOS4gOiIrOa2iOaBry/lvoXovqblt6XkvZxcbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyT3ZlcmR1ZShuZXdzTGlzdDpOZXdzW10pOiBOZXdzW117XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlO1xuICAgIGNvbnN0IGFEYXkgPSAyNCo2MCo2MCoxMDAwO1xuICAgIHJldHVybiBuZXdzTGlzdC5maWx0ZXIobmV3c0VsZW1lbnQ9PmRhdGUudmFsdWVPZigpIC0gbmV3c0VsZW1lbnQuZXhlY1RpbWUudmFsdWVPZigpIDwgYURheSk7XG4gIH1cblxuICAvKiog5pCc5bCL5ZCrc3ViamVjdOWtl+S4sueahOacgOaWsOa2iOaBr1xuICAgKiAgQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBmaWx0ZXJTdWJqZWN0KHN1YmplY3Q6c3RyaW5nKXtcbiAgICBjb25zdCBuZXdzTGlzdD10aGlzLm9yaWdpbmFsTmV3cygpO1xuICAgIHRoaXMudXBzZXJ0TmV3cyhuZXdzTGlzdC5maWx0ZXIobmV3c0VsZW1lbnQ9Pm5ld3NFbGVtZW50LnN1YmplY3QubWF0Y2goc3ViamVjdCkpKTtcbiAgfVxuXG4gIC8qKiDku6VvcmlnaW5hbE5ld3Pph43nva7miYDmnInmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZmlsdGVyUmVzZXQoKXtcbiAgICB0aGlzLnVwc2VydE5ld3ModGhpcy5vcmlnaW5hbE5ld3MoKSlcbiAgfVxuXG4gIC8qKiDoqK3lrprpmaTkuobljp/lp4vmnIDmlrDmtojmga9vcmlnaW5hbE5ld3Pku6XlpJbnmoTmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgdXBzZXJ0TmV3cyhuZXdzOk5ld3NbXSk6IHZvaWR7XG4gICAgdGhpcy5hbGxOb3JtYWxOZXdzLnNldCh0aGlzLmZpbHRlclR5cGUobmV3cywgXCIxMFwiKSk7XG4gICAgdGhpcy5hbGxUb2RvTGlzdC5zZXQodGhpcy5maWx0ZXJUeXBlKG5ld3MsIFwiNjBcIikpO1xuICAgIHRoaXMubm9ybWFsTmV3cy5zZXQodGhpcy5maWx0ZXJTdGF0dXModGhpcy5hbGxOb3JtYWxOZXdzKCksIFwiMTBcIikpO1xuICAgIHRoaXMudG9Eb0xpc3Quc2V0KHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsVG9kb0xpc3QoKSxcIjEwXCIpKTtcbiAgICB0aGlzLmNoZWNrZWROb3JtYWxOZXdzLnNldCh0aGlzLmZpbHRlck92ZXJkdWUodGhpcy5maWx0ZXJTdGF0dXModGhpcy5hbGxOb3JtYWxOZXdzKCksIFwiNjBcIikpKTtcbiAgICB0aGlzLmNoZWNrZWRUb0RvTGlzdC5zZXQodGhpcy5maWx0ZXJPdmVyZHVlKHRoaXMuZmlsdGVyU3RhdHVzKHRoaXMuYWxsVG9kb0xpc3QoKSwgXCI2MFwiKSkpO1xuICB9XG5cbiAgLyoqIOioreWumi/mm7TmlrDmiYDmnInmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgdXBzZXJ0QWxsTmV3cyhuZXdzTGlzdDpOZXdzW10pOnZvaWR7XG4gICAgdGhpcy5vcmlnaW5hbE5ld3Muc2V0KG5ld3NMaXN0KTtcbiAgICB0aGlzLnVwc2VydE5ld3MobmV3c0xpc3QpO1xuICB9XG5cbiAgLyoqIOimj+agvOWMluW+nm5hdHPlj5blvpfnmoTmnIDmlrDmtojmga9cbiAgICogIEBtZW1iZXJvZiBOZXdzU2VydmljZVxuICAgKi9cbiAgZm9ybWF0TmV3cyhuZXdzTGlzdDogTmV3c1tdKTogTmV3c1tde1xuICAgIGNvbnN0IGZvcm1hdE5ld3NMaXN0OiBOZXdzW10gPSBbXTtcbiAgICAgIG5ld3NMaXN0LmZvckVhY2goKG5ld3M6IE5ld3MpID0+IHtcbiAgICAgICAgY29uc3QgZm9ybWF0TmV3c0VsZW1lbnQ6TmV3cyA9IHtcbiAgICAgICAgICBcIl9pZFwiOiBuZXdzLl9pZCxcbiAgICAgICAgICBcImFwcElkXCI6IG5ld3MuYXBwSWQsXG4gICAgICAgICAgXCJ1c2VyQ29kZVwiOiBuZXdzLnVzZXJDb2RlLFxuICAgICAgICAgIFwic3ViamVjdFwiOiBuZXdzLnN1YmplY3QsXG4gICAgICAgICAgXCJ1cmxcIjogbmV3cy51cmwsXG4gICAgICAgICAgXCJzaGFyZWREYXRhXCI6IG5ld3Muc2hhcmVkRGF0YSxcbiAgICAgICAgICBcInBlcmlvZFwiOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCI6IG5ldyBEYXRlKG5ld3MucGVyaW9kLnN0YXJ0KSxcbiAgICAgICAgICAgIFwiZW5kXCI6IG5ldyBEYXRlKG5ld3MucGVyaW9kLmVuZClcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidHlwZVwiOiBuZXdzLnR5cGUsXG4gICAgICAgICAgXCJleGVjVGltZVwiOiBuZXcgRGF0ZShuZXdzLmV4ZWNUaW1lKSxcbiAgICAgICAgICBcImV4ZWNTdGF0dXNcIjogbmV3cy5leGVjU3RhdHVzLFxuICAgICAgICAgIFwidXBkYXRlZEJ5XCI6IG5ld3MudXBkYXRlZEJ5LFxuICAgICAgICAgIFwidXBkYXRlZEF0XCI6IG5ldyBEYXRlKG5ld3MudXBkYXRlZEF0KVxuICAgICAgICB9O1xuICAgICAgICBmb3JtYXROZXdzTGlzdC5wdXNoKGZvcm1hdE5ld3NFbGVtZW50KTtcbiAgICAgIH0pO1xuICAgIHJldHVybiBmb3JtYXROZXdzTGlzdDtcbiAgfVxuXG4gIC8qKiDoqILplrHmnIDmlrDmtojmga9cbiAgICogQG1lbWJlcm9mIE5ld3NTZXJ2aWNlXG4gICAqL1xuICBhc3luYyBzdWJNeU5ld3ModXNlckNvZGU6Q29kaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy4jbXlOZXdzID0gbmV3IFN1YmplY3QoKTtcbiAgICBjb25zdCBqc29uQ29kZWMgPSBKU09OQ29kZWMoKTtcbiAgICB0aGlzLiNteU5ld3NDb25zdW1lciQgPSB0aGlzLiNqZXRTdHJlYW1Xc1NlcnZpY2Uuc3Vic2NyaWJlKFxuICAgICAgU3Vic2NyaWJlVHlwZS5QdXNoLFxuICAgICAgYG5ld3MuYXBwUG9ydGFsLiR7dXNlckNvZGUuY29kZX1gXG4gICAgKTtcblxuICAgIHRoaXMuI215TmV3c0NvbnN1bWVyJFxuICAgICAgLnBpcGUoXG4gICAgICAgIG1lcmdlTWFwKGFzeW5jIChtZXNzYWdlcykgPT4ge1xuICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgICAgICAgdGhpcy4jbXlOZXdzLm5leHQoanNvbkNvZGVjLmRlY29kZShtZXNzYWdlLmRhdGEpKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7fSk7XG5cbiAgICB0aGlzLiNteU5ld3Muc3Vic2NyaWJlKChuZXdzRWxlbWVudDphbnkpID0+IHtcbiAgICAgIHRoaXMub3JpZ2luYWxOZXdzLm11dGF0ZShuZXdzTGlzdD0+e1xuICAgICAgICBjb25zdCB0bXBOZXdzID0gdGhpcy5mb3JtYXROZXdzKFtuZXdzRWxlbWVudF0pXG4gICAgICAgIG5ld3NMaXN0LnB1c2godG1wTmV3c1swXSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnVwc2VydE5ld3ModGhpcy5vcmlnaW5hbE5ld3MoKSlcbiAgICB9KTtcbiAgfVxuXG59XG5cbiJdfQ==